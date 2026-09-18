package ai.sokey.workspace;

import android.app.Application;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;

/**
 * Application entry point.
 *
 * Everything here is defensive: an exception thrown from Application.onCreate kills the
 * process before any UI exists ("So-key Ai keeps stopping"), so each step is guarded and
 * failures are recorded instead of propagated.
 */
public class SoKeyApp extends Application {

    public static final String CHANNEL_AGENTS = "agents";

    @Override
    public void onCreate() {
        super.onCreate();
        try {
            CrashLog.install(this);
        } catch (Throwable ignored) {
        }
        try {
            Workspace.init(this);
        } catch (Throwable t) {
            CrashLog.record(this, t);
        }
        try {
            createChannels();
        } catch (Throwable t) {
            CrashLog.record(this, t);
        }
    }

    private void createChannels() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager nm = getSystemService(NotificationManager.class);
        if (nm == null) return;
        NotificationChannel ch = new NotificationChannel(
                CHANNEL_AGENTS,
                getString(R.string.notification_channel_agents),
                NotificationManager.IMPORTANCE_LOW);
        ch.setDescription(getString(R.string.notification_channel_agents_desc));
        ch.setShowBadge(false);
        nm.createNotificationChannel(ch);
    }
}
