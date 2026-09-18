package ai.sokey.workspace;

import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;

/**
 * Keeps long agent/workflow runs alive while the app is in the background.
 * Started from the UI (workflow runs, long agent tasks) and stopped when they finish.
 */
public class AgentService extends Service {

    public static final String ACTION_START = "ai.sokey.workspace.START_AGENTS";
    public static final String ACTION_STOP = "ai.sokey.workspace.STOP_AGENTS";
    public static final String EXTRA_LABEL = "label";

    private static final int NOTIFICATION_ID = 4242;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent == null ? ACTION_START : intent.getAction();
        if (ACTION_STOP.equals(action)) {
            stopForeground(true);
            stopSelf();
            return START_NOT_STICKY;
        }
        String label = intent == null ? null : intent.getStringExtra(EXTRA_LABEL);
        startForeground(NOTIFICATION_ID, buildNotification(label == null ? getString(R.string.notif_running) : label));
        return START_STICKY;
    }

    private Notification buildNotification(String text) {
        Intent open = new Intent(this, MainActivity.class);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= 23) flags |= PendingIntent.FLAG_IMMUTABLE;
        PendingIntent pi = PendingIntent.getActivity(this, 0, open, flags);
        Notification.Builder b = Build.VERSION.SDK_INT >= 26
                ? new Notification.Builder(this, SoKeyApp.CHANNEL_AGENTS)
                : new Notification.Builder(this);
        b.setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(getString(R.string.app_name))
                .setContentText(text)
                .setOngoing(true)
                .setContentIntent(pi);
        if (Build.VERSION.SDK_INT >= 21) b.setColor(0xFFF97316);
        return b.build();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
