package ai.sokey.workspace;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.util.Log;

/**
 * Restarts the agent service after a reboot, but only when the user asked for it
 * (setting stored as {@link #PREF_BOOT_RESUME}).
 */
public class BootReceiver extends BroadcastReceiver {

    public static final String PREF_BOOT_RESUME = "boot_resume";
    private static final String TAG = "SoKeyBoot";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null || !Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) return;
        SharedPreferences prefs = context.getSharedPreferences("sokey", Context.MODE_PRIVATE);
        if (!prefs.getBoolean(PREF_BOOT_RESUME, false)) return;
        try {
            Intent svc = new Intent(context, AgentService.class);
            svc.setAction(AgentService.ACTION_START);
            svc.putExtra(AgentService.EXTRA_LABEL,
                    context.getString(R.string.notif_running));
            if (Build.VERSION.SDK_INT >= 26) context.startForegroundService(svc);
            else context.startService(svc);
        } catch (Exception e) {
            Log.w(TAG, "boot resume failed", e);
        }
    }
}
