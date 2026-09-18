package ai.sokey.workspace;

import android.content.Context;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.Comparator;

/**
 * The app's private workspace: every file an agent, tool or the terminal touches lives here.
 * Nothing outside {@code filesDir/workspace} can be read or written through this class.
 */
public final class Workspace {

    private static final Charset UTF8 = Charset.forName("UTF-8");
    private static File root;
    private static File fonts;

    private Workspace() {}

    public static synchronized void init(Context ctx) {
        if (root != null) return;
        root = new File(ctx.getFilesDir(), "workspace");
        if (!root.exists()) {
            //noinspection ResultOfMethodCallIgnored
            root.mkdirs();
        }
        fonts = new File(ctx.getFilesDir(), "fonts");
        if (!fonts.exists()) {
            //noinspection ResultOfMethodCallIgnored
            fonts.mkdirs();
        }
    }

    public static File root(Context ctx) {
        init(ctx);
        return root;
    }

    public static File fontsDir(Context ctx) {
        init(ctx);
        return fonts;
    }

    /** Resolves a user supplied relative path; throws when it tries to escape the sandbox. */
    public static File resolve(Context ctx, String path) throws IOException {
        init(ctx);
        String p = path == null ? "" : path.trim().replace('\\', '/');
        while (p.startsWith("/")) p = p.substring(1);
        File f = new File(root, p);
        String canonicalRoot = root.getCanonicalPath();
        String canonical = f.getCanonicalPath();
        if (!canonical.equals(canonicalRoot) && !canonical.startsWith(canonicalRoot + File.separator)) {
            throw new IOException("path escapes workspace: " + path);
        }
        return f;
    }

    public static String list(Context ctx, String path) {
        JSONArray out = new JSONArray();
        try {
            File dir = resolve(ctx, path);
            if (!dir.isDirectory()) return out.toString();
            File[] children = dir.listFiles();
            if (children == null) return out.toString();
            Arrays.sort(children, new Comparator<File>() {
                @Override public int compare(File a, File b) {
                    if (a.isDirectory() != b.isDirectory()) return a.isDirectory() ? -1 : 1;
                    return a.getName().compareToIgnoreCase(b.getName());
                }
            });
            for (File c : children) {
                JSONObject o = new JSONObject();
                o.put("name", c.getName());
                o.put("dir", c.isDirectory());
                o.put("size", c.isDirectory() ? 0 : c.length());
                o.put("ts", c.lastModified());
                out.put(o);
            }
        } catch (Exception ignored) {
        }
        return out.toString();
    }

    public static String read(Context ctx, String path) {
        try {
            File f = resolve(ctx, path);
            if (!f.isFile()) return null;
            long len = f.length();
            if (len > 1024 * 512) return null;   // keep the bridge payload sane
            byte[] buf = new byte[(int) len];
            FileInputStream in = new FileInputStream(f);
            int read = 0;
            while (read < buf.length) {
                int r = in.read(buf, read, buf.length - read);
                if (r < 0) break;
                read += r;
            }
            in.close();
            return new String(buf, 0, read, UTF8);
        } catch (Exception e) {
            return null;
        }
    }

    public static boolean write(Context ctx, String path, String content) {
        try {
            File f = resolve(ctx, path);
            File parent = f.getParentFile();
            if (parent != null && !parent.exists()) {
                //noinspection ResultOfMethodCallIgnored
                parent.mkdirs();
            }
            FileOutputStream out = new FileOutputStream(f, false);
            out.write((content == null ? "" : content).getBytes(UTF8));
            out.flush();
            out.close();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static boolean mkdir(Context ctx, String path) {
        try {
            File f = resolve(ctx, path);
            return f.isDirectory() || f.mkdirs();
        } catch (Exception e) {
            return false;
        }
    }

    public static boolean delete(Context ctx, String path) {
        File f;
        try {
            f = resolve(ctx, path);
        } catch (Exception e) {
            return false;
        }
        return deleteRecursive(f);
    }

    private static boolean deleteRecursive(File f) {
        if (f.isDirectory()) {
            File[] kids = f.listFiles();
            if (kids != null) for (File k : kids) deleteRecursive(k);
        }
        return f.delete();
    }

    /** Copies an incoming content stream (SAF pick) into the workspace. */
    public static String importStream(Context ctx, InputStream in, String displayName) {
        try {
            File dir = new File(root(ctx), "imports");
            if (!dir.exists()) //noinspection ResultOfMethodCallIgnored
                dir.mkdirs();
            String name = displayName == null ? "file" : displayName.replace('/', '_');
            File target = new File(dir, name);
            int n = 1;
            while (target.exists()) {
                target = new File(dir, n + "-" + name);
                n++;
            }
            FileOutputStream out = new FileOutputStream(target);
            byte[] buf = new byte[8192];
            int r;
            while ((r = in.read(buf)) > 0) out.write(buf, 0, r);
            out.flush();
            out.close();
            in.close();
            return relative(ctx, target);
        } catch (Exception e) {
            return null;
        }
    }

    public static String importFont(Context ctx, InputStream in, String displayName) {
        try {
            File dir = fontsDir(ctx);
            String name = displayName == null ? "font.ttf" : displayName.replace('/', '_');
            File target = new File(dir, name);
            int n = 1;
            while (target.exists()) {
                String base = name;
                int dot = name.lastIndexOf('.');
                if (dot > 0) base = name.substring(0, dot) + "-" + n + name.substring(dot);
                else base = name + "-" + n;
                target = new File(dir, base);
                n++;
            }
            FileOutputStream out = new FileOutputStream(target);
            byte[] buf = new byte[8192];
            int r;
            while ((r = in.read(buf)) > 0) out.write(buf, 0, r);
            out.flush();
            out.close();
            in.close();
            return target.getName();
        } catch (Exception e) {
            return null;
        }
    }

    public static String relative(Context ctx, File f) {
        try {
            String base = root(ctx).getCanonicalPath();
            String path = f.getCanonicalPath();
            if (path.startsWith(base)) return path.substring(base.length() + 1).replace(File.separatorChar, '/');
        } catch (Exception ignored) {
        }
        return f.getName();
    }
}
