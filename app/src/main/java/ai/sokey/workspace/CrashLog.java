package ai.sokey.workspace;

import android.content.Context;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Last-chance error capture.
 *
 * A build that dies before the WebView exists shows only "So-key Ai keeps stopping"
 * with no way to see why. This keeps the stack trace inside the app workspace so the
 * user can copy it from المظهر ← حول التطبيق (or read it from
 * files/workspace/logs/crash-last.txt) and send it back.
 */
public final class CrashLog {

    private static volatile String lastError = "";

    private CrashLog() {}

    /** Installs a pass-through handler: everything is recorded, nothing is swallowed. */
    public static void install(final Context context) {
        final Context app = context.getApplicationContext();
        final Thread.UncaughtExceptionHandler previous = Thread.getDefaultUncaughtExceptionHandler();
        Thread.setDefaultUncaughtExceptionHandler(new Thread.UncaughtExceptionHandler() {
            @Override
            public void uncaughtException(Thread thread, Throwable error) {
                record(app, error);
                if (previous != null) previous.uncaughtException(thread, error);
            }
        });
    }

    public static void record(Context context, Throwable error) {
        try {
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            pw.println("So-key Ai " + BuildConfigCompat.VERSION_NAME
                    + " (" + BuildConfigCompat.VERSION_CODE + ")");
            pw.println(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US).format(new Date()));
            pw.println("device: " + android.os.Build.MANUFACTURER + " " + android.os.Build.MODEL
                    + " · Android " + android.os.Build.VERSION.RELEASE
                    + " (API " + android.os.Build.VERSION.SDK_INT + ")");
            pw.println();
            pw.println("--- what failed ---");
            error.printStackTrace(pw);
            Throwable cause = error.getCause();
            int depth = 0;
            while (cause != null && depth < 5) {
                pw.println();
                pw.println("--- caused by ---");
                cause.printStackTrace(pw);
                cause = cause.getCause();
                depth++;
            }
            pw.flush();
            String text = sw.toString();
            lastError = text;
            Workspace.write(context, "logs/crash-last.txt", text);
        } catch (Throwable ignored) {
            // never let the reporter itself become a failure
        }
    }

    public static String last(Context context) {
        if (lastError != null && !lastError.isEmpty()) return lastError;
        String stored = Workspace.read(context, "logs/crash-last.txt");
        return stored == null ? "" : stored;
    }

    public static void clear(Context context) {
        lastError = "";
        Workspace.delete(context, "logs/crash-last.txt");
    }
}
