package ai.sokey.workspace;

import android.content.Context;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * A deliberately restricted, workspace-scoped shell.
 *
 * It never spawns {@code /system/bin/sh} and never touches anything outside the app
 * sandbox: this is a tool surface for the agent, not a system terminal.
 */
public final class TerminalTool {

    private static String cwd = "";

    private TerminalTool() {}

    public static String exec(Context ctx, String command) {
        String cmd = command == null ? "" : command.trim();
        if (cmd.isEmpty()) return "";
        String[] parts = cmd.split("\\s+");
        String name = parts[0].toLowerCase(Locale.US);
        try {
            if ("help".equals(name)) {
                return "So-key Ai workspace shell\n"
                        + "  help                 this text\n"
                        + "  pwd                  print working directory\n"
                        + "  ls [path]            list files\n"
                        + "  cd <dir>             change directory (workspace only)\n"
                        + "  cat <file>           print a text file\n"
                        + "  echo <text>          print text\n"
                        + "  echo <text> > <file> write text to a file\n"
                        + "  mkdir <dir>          create a directory\n"
                        + "  touch <file>         create an empty file\n"
                        + "  rm <path>            delete a file or folder\n"
                        + "  tree                 workspace listing\n"
                        + "  date                 current date and time\n"
                        + "  whoami               app identity\n"
                        + "  uname                platform info\n"
                        + "  df                   workspace size\n"
                        + "  http <url>           HTTP GET, first 2000 characters\n"
                        + "  open <url>           open a URL in the browser\n"
                        + "  clear                clear the screen\n";
            }
            if ("pwd".equals(name)) return "/workspace" + (cwd.isEmpty() ? "" : "/" + cwd);
            if ("ls".equals(name)) {
                String path = parts.length > 1 ? join(parts, 1) : cwd;
                File dir = Workspace.resolve(ctx, path);
                File[] kids = dir.listFiles();
                if (kids == null) return "not a directory: " + path;
                StringBuilder sb = new StringBuilder();
                for (File f : kids) {
                    sb.append(f.isDirectory() ? "d " : "- ");
                    sb.append(String.format(Locale.US, "%8d  ", f.isDirectory() ? 0 : f.length()));
                    sb.append(f.getName()).append("\n");
                }
                return sb.length() == 0 ? "(empty)" : sb.toString();
            }
            if ("cd".equals(name)) {
                String path = parts.length > 1 ? join(parts, 1) : "";
                if (path.equals("..")) {
                    int i = cwd.lastIndexOf('/');
                    cwd = i > 0 ? cwd.substring(0, i) : "";
                    return "/workspace" + (cwd.isEmpty() ? "" : "/" + cwd);
                }
                File dir = Workspace.resolve(ctx, path.isEmpty() ? cwd : cwd + "/" + path);
                if (!dir.isDirectory()) return "no such directory: " + path;
                cwd = Workspace.relative(ctx, dir);
                return "/workspace/" + cwd;
            }
            if ("cat".equals(name)) {
                if (parts.length < 2) return "usage: cat <file>";
                String content = Workspace.read(ctx, join(parts, 1));
                return content == null ? "cannot read: " + join(parts, 1) : content;
            }
            if ("echo".equals(name)) {
                String rest = cmd.length() > 5 ? cmd.substring(5) : "";
                int gt = rest.indexOf('>');
                if (gt >= 0) {
                    String text = rest.substring(0, gt).trim();
                    String file = rest.substring(gt + 1).trim();
                    boolean ok = Workspace.write(ctx, file, text + "\n");
                    return ok ? "wrote " + text.length() + " chars to " + file : "cannot write: " + file;
                }
                return rest;
            }
            if ("mkdir".equals(name)) {
                if (parts.length < 2) return "usage: mkdir <dir>";
                return Workspace.mkdir(ctx, join(parts, 1)) ? "created" : "failed";
            }
            if ("touch".equals(name)) {
                if (parts.length < 2) return "usage: touch <file>";
                return Workspace.write(ctx, join(parts, 1), "") ? "created" : "failed";
            }
            if ("rm".equals(name)) {
                if (parts.length < 2) return "usage: rm <path>";
                return Workspace.delete(ctx, join(parts, 1)) ? "deleted" : "failed";
            }
            if ("tree".equals(name)) return tree(ctx, Workspace.root(ctx), "");
            if ("date".equals(name)) return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss Z", Locale.US).format(new Date());
            if ("whoami".equals(name)) return "sokey@" + ctx.getPackageName();
            if ("uname".equals(name)) return "Android " + android.os.Build.VERSION.RELEASE + " · " + android.os.Build.MODEL;
            if ("df".equals(name)) {
                long used = sizeOf(Workspace.root(ctx));
                return "workspace: " + (used / 1024) + " KB used";
            }
            if ("http".equals(name)) {
                if (parts.length < 2) return "usage: http <url>";
                String res = HttpTool.request(parts[1], "GET", null, null);
                return res.length() > 2000 ? res.substring(0, 2000) + "…" : res;
            }
            if ("open".equals(name)) {
                if (parts.length < 2) return "usage: open <url>";
                return "handled by the UI: " + parts[1];
            }
            return "unknown command: " + name + " (type help)";
        } catch (Exception e) {
            return "error: " + e.getMessage();
        }
    }

    private static String join(String[] parts, int from) {
        StringBuilder sb = new StringBuilder();
        for (int i = from; i < parts.length; i++) {
            if (sb.length() > 0) sb.append(' ');
            sb.append(parts[i]);
        }
        return sb.toString();
    }

    private static String tree(Context ctx, File dir, String prefix) {
        StringBuilder sb = new StringBuilder();
        File[] kids = dir.listFiles();
        if (kids == null) return sb.toString();
        for (File f : kids) {
            sb.append(prefix).append(f.isDirectory() ? "[+] " : "    ").append(f.getName()).append('\n');
            if (f.isDirectory() && prefix.length() < 12) sb.append(tree(ctx, f, prefix + "  "));
        }
        return sb.toString();
    }

    private static long sizeOf(File f) {
        if (f.isFile()) return f.length();
        long total = 0;
        File[] kids = f.listFiles();
        if (kids != null) for (File k : kids) total += sizeOf(k);
        return total;
    }
}
