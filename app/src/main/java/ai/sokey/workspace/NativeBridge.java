package ai.sokey.workspace;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.provider.Settings;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;

/**
 * The native tool surface exposed to the UI as {@code window.AndroidNative}.
 * Everything here is sandboxed: files only inside the app workspace, no shell.
 */
public class NativeBridge {

    private final MainActivity activity;
    private final WebView web;
    private final SharedPreferences prefs;

    NativeBridge(MainActivity activity, WebView web) {
        this.activity = activity;
        this.web = web;
        this.prefs = activity.getSharedPreferences("sokey", Context.MODE_PRIVATE);
    }

    /* ------------------------------------------------------------- identity */

    @JavascriptInterface
    public String appInfo() {
        try {
            JSONObject o = new JSONObject();
            o.put("version", BuildConfigCompat.VERSION_NAME);
            o.put("pkg", activity.getPackageName());
            o.put("platform", "Android " + Build.VERSION.RELEASE);
            o.put("sdk", Build.VERSION.SDK_INT);
            o.put("model", Build.MODEL);
            o.put("device", Build.MANUFACTURER + " " + Build.MODEL);
            String[] abis = Build.SUPPORTED_ABIS;
            o.put("abi", abis != null && abis.length > 0 ? abis[0] : "unknown");
            o.put("insetTop", 0);
            o.put("insetBottom", 0);
            return o.toString();
        } catch (Exception e) {
            return "{\"version\":\"1.0.0\",\"pkg\":\"ai.sokey.workspace\"}";
        }
    }

    @JavascriptInterface
    public String deviceName() {
        return Build.MANUFACTURER + " " + Build.MODEL;
    }

    @JavascriptInterface
    public String workspaceDir() {
        return "file://" + Workspace.root(activity).getAbsolutePath();
    }

    @JavascriptInterface
    public String fontDir() {
        return "file://" + Workspace.fontsDir(activity).getAbsolutePath();
    }

    /* -------------------------------------------------------------- feedback */

    @JavascriptInterface
    public void toast(final String message) {
        activity.runOnUiThread(new Runnable() {
            @Override public void run() {
                Toast.makeText(activity, message, Toast.LENGTH_SHORT).show();
            }
        });
    }

    @JavascriptInterface
    public void haptic() {
        try {
            Vibrator v = (Vibrator) activity.getSystemService(Context.VIBRATOR_SERVICE);
            if (v == null || !v.hasVibrator()) return;
            if (Build.VERSION.SDK_INT >= 26) {
                v.vibrate(VibrationEffect.createOneShot(12, VibrationEffect.DEFAULT_AMPLITUDE));
            } else {
                v.vibrate(12);
            }
        } catch (Exception ignored) {
        }
    }

    @JavascriptInterface
    public void copyToClipboard(String text) {
        try {
            ClipboardManager cm = (ClipboardManager) activity.getSystemService(Context.CLIPBOARD_SERVICE);
            if (cm != null) cm.setPrimaryClip(ClipData.newPlainText("So-key Ai", text));
        } catch (Exception ignored) {
        }
    }

    @JavascriptInterface
    public void notify(String title, String body) {
        try {
            NotificationManager nm = (NotificationManager) activity.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm == null) return;
            Intent open = new Intent(activity, MainActivity.class);
            int flags = PendingIntent.FLAG_UPDATE_CURRENT;
            if (Build.VERSION.SDK_INT >= 23) flags |= PendingIntent.FLAG_IMMUTABLE;
            PendingIntent pi = PendingIntent.getActivity(activity, 0, open, flags);
            Notification.Builder b = Build.VERSION.SDK_INT >= 26
                    ? new Notification.Builder(activity, SoKeyApp.CHANNEL_AGENTS)
                    : new Notification.Builder(activity);
            b.setSmallIcon(R.mipmap.ic_launcher)
                    .setContentTitle(title)
                    .setContentText(body)
                    .setContentIntent(pi)
                    .setAutoCancel(true);
            if (Build.VERSION.SDK_INT >= 21) b.setColor(0xFFF97316);
            nm.notify((int) (System.currentTimeMillis() % 100000), b.build());
            activity.maybeRequestNotificationPermission();
        } catch (Exception ignored) {
        }
    }

    /* --------------------------------------------------------------- system */

    @JavascriptInterface
    public void openUrl(String url) {
        activity.runOnUiThread(new Runnable() {
            @Override public void run() {
                activity.openExternally(url);
            }
        });
    }

    @JavascriptInterface
    public void openBrowser(String url) {
        openUrl(url);
    }

    @JavascriptInterface
    public void setTextScale(float scale) {
        // The web layer already scales its own type; the WebView text zoom is kept at 100
        // so Arabic shaping and line heights stay predictable.
        prefs.edit().putFloat("text_scale", scale).apply();
    }

    @JavascriptInterface
    public void setLocale(String code, boolean rtl) {
        prefs.edit().putString("locale", code).putBoolean("rtl", rtl).apply();
        try {
            if (Build.VERSION.SDK_INT >= 33) {
                android.app.LocaleManager lm = activity.getSystemService(android.app.LocaleManager.class);
                if (lm != null) {
                    lm.setApplicationLocales(android.os.LocaleList.forLanguageTags("ar".equals(code) ? "ar" : "en"));
                }
            }
        } catch (Exception ignored) {
        }
    }

    @JavascriptInterface
    public void setStatusBar(boolean dark) {
        final boolean darkBars = dark;
        activity.runOnUiThread(new Runnable() {
            @Override public void run() {
                activity.applyDarkSystemBars(darkBars);
            }
        });
    }

    @JavascriptInterface
    public void startAgentService(String label) {
        activity.startAgents(label);
    }

    @JavascriptInterface
    public void stopAgentService() {
        activity.stopAgents();
    }

    @JavascriptInterface
    public void setBootResume(boolean enabled) {
        prefs.edit().putBoolean(BootReceiver.PREF_BOOT_RESUME, enabled).apply();
    }

    @JavascriptInterface
    public boolean getBootResume() {
        return prefs.getBoolean(BootReceiver.PREF_BOOT_RESUME, false);
    }

    /* -------------------------------------------------------------- sharing */

    @JavascriptInterface
    public void shareText(String text) {
        try {
            Intent i = new Intent(Intent.ACTION_SEND);
            i.setType("text/plain");
            i.putExtra(Intent.EXTRA_TEXT, text);
            activity.startActivity(Intent.createChooser(i, activity.getString(R.string.share_chooser)));
        } catch (Exception ignored) {
        }
    }

    @JavascriptInterface
    public void shareFile(String path) {
        try {
            File f = Workspace.resolve(activity, path);
            if (!f.isFile()) return;
            Uri uri = ShareProvider.uriFor(activity, f);
            Intent i = new Intent(Intent.ACTION_SEND);
            i.setType(ShareProvider.mimeOf(f.getName()));
            i.putExtra(Intent.EXTRA_STREAM, uri);
            i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            activity.startActivity(Intent.createChooser(i, activity.getString(R.string.share_chooser)));
        } catch (Exception ignored) {
        }
    }

    /* ---------------------------------------------------------------- apks */

    @JavascriptInterface
    public boolean canInstallApk() {
        if (Build.VERSION.SDK_INT < 26) return true;
        return activity.getPackageManager().canRequestPackageInstalls();
    }

    @JavascriptInterface
    public String installApk(String path) {
        try {
            File f = Workspace.resolve(activity, path);
            if (!f.isFile()) return "file not found";
            if (!canInstallApk()) {
                Intent settings = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                        Uri.parse("package:" + activity.getPackageName()));
                settings.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                activity.startActivity(settings);
                return "permission required";
            }
            Uri uri = ShareProvider.uriFor(activity, f);
            Intent i = new Intent(Intent.ACTION_VIEW);
            i.setDataAndType(uri, "application/vnd.android.package-archive");
            i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            activity.startActivity(i);
            return "installer opened";
        } catch (Exception e) {
            return "failed: " + e.getMessage();
        }
    }

    /* --------------------------------------------------------------- fonts */

    @JavascriptInterface
    public String pickFont() {
        return activity.pickFileBlocking(true);
    }

    @JavascriptInterface
    public String fontList() {
        JSONArray arr = new JSONArray();
        try {
            File dir = Workspace.fontsDir(activity);
            File[] files = dir.listFiles();
            if (files != null) {
                for (File f : files) {
                    if (!f.isFile()) continue;
                    String n = f.getName().toLowerCase();
                    if (!(n.endsWith(".ttf") || n.endsWith(".otf") || n.endsWith(".ttc"))) continue;
                    JSONObject o = new JSONObject();
                    o.put("name", f.getName());
                    o.put("file", f.getName());
                    o.put("size", f.length());
                    arr.put(o);
                }
            }
        } catch (Exception ignored) {
        }
        return arr.toString();
    }

    @JavascriptInterface
    public void deleteFont(String file) {
        try {
            File f = new File(Workspace.fontsDir(activity), new File(file).getName());
            //noinspection ResultOfMethodCallIgnored
            f.delete();
        } catch (Exception ignored) {
        }
    }

    @JavascriptInterface
    public String pickFile() {
        return activity.pickFileBlocking(false);
    }

    /* --------------------------------------------------------------- files */

    @JavascriptInterface
    public String listFiles(String path) {
        return Workspace.list(activity, path);
    }

    @JavascriptInterface
    public String readFile(String path) {
        String content = Workspace.read(activity, path);
        if (content == null) return null;
        // binary-ish guard: keep the bridge textual
        return content;
    }

    @JavascriptInterface
    public boolean writeFile(String path, String content) {
        return Workspace.write(activity, path, content);
    }

    @JavascriptInterface
    public boolean deleteFile(String path) {
        return Workspace.delete(activity, path);
    }

    @JavascriptInterface
    public boolean mkdir(String path) {
        return Workspace.mkdir(activity, path);
    }

    /** Base64 read used by the file viewer for non-text assets. */
    @JavascriptInterface
    public String readFileBase64(String path) {
        try {
            File f = Workspace.resolve(activity, path);
            if (!f.isFile() || f.length() > 3 * 1024 * 1024) return null;
            byte[] buf = new byte[(int) f.length()];
            java.io.FileInputStream in = new java.io.FileInputStream(f);
            int read = in.read(buf);
            in.close();
            return Base64.encodeToString(read == buf.length ? buf : java.util.Arrays.copyOf(buf, Math.max(0, read)), Base64.NO_WRAP);
        } catch (Exception e) {
            return null;
        }
    }

    /* --------------------------------------------------------------- shell */

    @JavascriptInterface
    public String exec(String command) {
        return TerminalTool.exec(activity, command);
    }

    /* ------------------------------------------------------------ http glue */

    @JavascriptInterface
    public String httpRequest(String url, String method, String headersJson, String body) {
        return HttpTool.request(url, method, headersJson, body);
    }

    @JavascriptInterface
    public String httpStream(String url, String headersJson, String body, String streamId) {
        return HttpTool.stream(web, streamId, url, "POST", headersJson, body);
    }

    @JavascriptInterface
    public void httpAbort(String streamId) {
        HttpTool.abort(streamId);
    }

    /* ------------------------------------------------------------ app state */

    /**
     * Persistent UI state (chats, settings, theme …).
     *
     * It lives in a file inside the app sandbox rather than in WebView localStorage,
     * which is not guaranteed to be writable for a {@code file://} origin on every
     * WebView build. Both are written; this one is authoritative.
     */
    @JavascriptInterface
    public String readState() {
        String content = Workspace.read(activity, "state/app-state.json");
        return content == null ? "" : content;
    }

    @JavascriptInterface
    public boolean writeState(String json) {
        return Workspace.write(activity, "state/app-state.json", json);
    }

    /* ----------------------------------------------------------- diagnostics */

    /** Stack trace of the last fatal error, so the UI can offer a copy button. */
    @JavascriptInterface
    public String lastCrash() {
        return CrashLog.last(activity);
    }

    @JavascriptInterface
    public void clearCrash() {
        CrashLog.clear(activity);
    }

    @JavascriptInterface
    public String buildInfo() {
        try {
            org.json.JSONObject o = new org.json.JSONObject();
            o.put("versionName", BuildConfigCompat.VERSION_NAME);
            o.put("versionCode", BuildConfigCompat.VERSION_CODE);
            o.put("package", activity.getPackageName());
            o.put("debug", BuildConfigCompat.DEBUG);
            return o.toString();
        } catch (Exception e) {
            return "{}";
        }
    }

    /* ---------------------------------------------------------------- usage */

    @JavascriptInterface
    public int tokenLimit() {
        return prefs.getInt("token_limit", 180000);
    }

    @JavascriptInterface
    public int usageToday() {
        String today = new java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.US).format(new java.util.Date());
        return prefs.getInt("usage_" + today, 0);
    }

    @JavascriptInterface
    public void addUsage(int tokens) {
        String today = new java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.US).format(new java.util.Date());
        int current = prefs.getInt("usage_" + today, 0);
        prefs.edit().putInt("usage_" + today, current + Math.max(0, tokens)).apply();
    }

    @JavascriptInterface
    public boolean hasPermission(String permission) {
        try {
            return activity.checkSelfPermission(permission) == PackageManager.PERMISSION_GRANTED;
        } catch (Exception e) {
            return false;
        }
    }
}
