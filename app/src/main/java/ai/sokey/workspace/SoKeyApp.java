package ai.sokey.workspace;

import android.app.Application;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;

/** Application entry point: creates the notification channel used by agents/workflows. */
public class SoKeyApp extends Application {

    public static final String CHANNEL_AGENTS = "agents";

    @Override
    public void onCreate() {
        super.onCreate();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager nm = getSystemService(NotificationManager.class);
            if (nm != null) {
                NotificationChannel ch = new NotificationChannel(
                        CHANNEL_AGENTS,
                        getString(R.string.notification_channel_agents),
                        NotificationManager.IMPORTANCE_LOW);
                ch.setDescription(getString(R.string.notification_channel_agents_desc));
                ch.setShowBadge(false);
                nm.createNotificationChannel(ch);
            }
        }
        Workspace.init(this);
    }
}
