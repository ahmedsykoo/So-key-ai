package ai.sokey.workspace;

import android.Manifest;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.OpenableColumns;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import org.json.JSONObject;

import java.io.InputStream;

/**
 * The single WebView host of So-key Ai: renders the workspace UI from
 * {@code file:///android_asset/www/index.html} and exposes the native tool surface
 * through {@link NativeBridge}.
 */
public class MainActivity extends Activity {

    private static final int REQ_PICK_FILE = 2001;
    private static final int REQ_PICK_FONT = 2002;
    private static final int REQ_NOTIFICATIONS = 2003;

    private WebView web;
    private FrameLayout rootView;
    private volatile Object pickLock = new Object();
    private volatile String pickResult;
    private volatile String pickDisplayName;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Workspace.init(getApplicationContext());

        rootView = new FrameLayout(this);
        rootView.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        rootView.setBackgroundColor(Color.parseColor("#07070C"));

        web = new WebView(this);
        web.setLayoutParams(new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        s.setAllowFileAccessFromFileURLs(true);
        s.setJavaScriptCanOpenWindowsAutomatically(false);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(false);
        s.setTextZoom(100);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            s.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }
        if (BuildConfigCompat.DEBUG) {
            WebView.setWebContentsDebuggingEnabled(true);
        }

        web.addJavascriptInterface(new NativeBridge(this, web), "AndroidNative");
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url == null) return false;
                if (url.startsWith("file://")) return false;
                openExternally(url);
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                // drop the splash window background once the workspace is painted
                try {
                    setTheme(R.style.Theme_SoKeyAi);
                } catch (Exception ignored) {
                }
                pushInsets();
            }
        });

        rootView.addView(web);
        setContentView(rootView);
        web.loadUrl("file:///android_asset/www/index.html");

        if (Build.VERSION.SDK_INT >= 21) {
            getWindow().setStatusBarColor(Color.parseColor("#07070C"));
            getWindow().setNavigationBarColor(Color.parseColor("#07070C"));
        }
        applyDarkSystemBars(true);

        rootView.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
            @Override
            public WindowInsets onApplyWindowInsets(View v, WindowInsets insets) {
                int top, bottom;
                if (Build.VERSION.SDK_INT >= 30) {
                    android.graphics.Insets bars = insets.getInsets(WindowInsets.Type.systemBars());
                    top = bars.top;
                    bottom = bars.bottom;
                } else {
                    top = insets.getSystemWindowInsetTop();
                    bottom = insets.getSystemWindowInsetBottom();
                }
                web.setPadding(0, top, 0, bottom);
                pushInsets(top, bottom);
                return insets;
            }
        });
    }

    private void pushInsets() { pushInsets(-1, -1); }

    private void pushInsets(int top, int bottom) {
        if (web == null) return;
        final int t = top < 0 ? web.getPaddingTop() : top;
        final int b = bottom < 0 ? web.getPaddingBottom() : bottom;
        web.post(new Runnable() {
            @Override public void run() {
                web.evaluateJavascript("window.__sokeyInsets && window.__sokeyInsets(" + t + "," + b + ");", null);
            }
        });
    }

    /* ----------------------------------------------------------- system UI */

    void applyDarkSystemBars(boolean darkIconsOnLight) {
        if (Build.VERSION.SDK_INT >= 30) {
            WindowInsetsController c = getWindow().getInsetsController();
            if (c != null) {
                int mask = WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS;
                c.setSystemBarsAppearance(darkIconsOnLight ? 0 : mask, mask);
            }
        } else {
            View decor = getWindow().getDecorView();
            int flags = decor.getSystemUiVisibility();
            if (darkIconsOnLight) flags &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
            else flags |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
            decor.setSystemUiVisibility(flags);
        }
    }

    /* -------------------------------------------------------- file pickers */

    /**
     * Opens a system picker and blocks the calling (WebView bridge) thread until the
     * user chooses a file, so the JS API can stay synchronous.
     */
    String pickFileBlocking(boolean forFont) {
        pickResult = null;
        pickDisplayName = null;
        final int requestCode = forFont ? REQ_PICK_FONT : REQ_PICK_FILE;
        runOnUiThread(new Runnable() {
            @Override public void run() {
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType(forFont ? "*/*" : "*/*");
                if (forFont) intent.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"font/ttf", "font/otf", "application/x-font-ttf", "application/octet-stream"});
                try {
                    startActivityForResult(intent, requestCode);
                } catch (ActivityNotFoundException e) {
                    synchronized (pickLock) {
                        pickResult = "";
                        pickLock.notifyAll();
                    }
                }
            }
        });
        synchronized (pickLock) {
            long deadline = System.currentTimeMillis() + 180000;
            while (pickResult == null && System.currentTimeMillis() < deadline) {
                try {
                    pickLock.wait(1000);
                } catch (InterruptedException e) {
                    break;
                }
            }
        }
        return pickResult;
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != REQ_PICK_FILE && requestCode != REQ_PICK_FONT) return;
        String result = "";
        if (resultCode == RESULT_OK && data != null && data.getData() != null) {
            Uri uri = data.getData();
            String name = queryName(uri);
            try {
                InputStream in = getContentResolver().openInputStream(uri);
                if (requestCode == REQ_PICK_FONT) {
                    String stored = Workspace.importFont(this, in, name);
                    if (stored != null) {
                        JSONObject o = new JSONObject();
                        o.put("name", name);
                        o.put("file", stored);
                        o.put("size", new java.io.File(Workspace.fontsDir(this), stored).length());
                        result = o.toString();
                    }
                } else {
                    String rel = Workspace.importStream(this, in, name);
                    result = rel == null ? "" : rel;
                }
            } catch (Exception ignored) {
            }
        }
        synchronized (pickLock) {
            pickResult = result;
            pickLock.notifyAll();
        }
    }

    private String queryName(Uri uri) {
        String name = null;
        Cursor c = null;
        try {
            c = getContentResolver().query(uri, null, null, null, null);
            if (c != null && c.moveToFirst()) {
                int idx = c.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                if (idx >= 0) name = c.getString(idx);
            }
        } catch (Exception ignored) {
        } finally {
            if (c != null) c.close();
        }
        if (name == null) {
            String last = uri.getLastPathSegment();
            name = last == null ? "file" : last.substring(last.lastIndexOf('/') + 1);
        }
        return name;
    }

    /* ---------------------------------------------------------- intents */

    void openExternally(String url) {
        try {
            Intent i = new Intent(this, BrowserActivity.class);
            i.putExtra(BrowserActivity.EXTRA_URL, url);
            startActivity(i);
        } catch (Exception e) {
            try {
                startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
            } catch (Exception ignored) {
            }
        }
    }

    void maybeRequestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= 33
                && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            runOnUiThread(new Runnable() {
                @Override public void run() {
                    try {
                        requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, REQ_NOTIFICATIONS);
                    } catch (Exception ignored) {
                    }
                }
            });
        }
    }

    void startAgents(String label) {
        maybeRequestNotificationPermission();
        Intent i = new Intent(this, AgentService.class);
        i.setAction(AgentService.ACTION_START);
        i.putExtra(AgentService.EXTRA_LABEL, label);
        if (Build.VERSION.SDK_INT >= 26) startForegroundService(i);
        else startService(i);
    }

    void stopAgents() {
        Intent i = new Intent(this, AgentService.class);
        i.setAction(AgentService.ACTION_STOP);
        startService(i);
    }

    /* ------------------------------------------------------------- back */

    @Override
    public void onBackPressed() {
        if (web == null) {
            super.onBackPressed();
            return;
        }
        web.evaluateJavascript("window.__sokeyBack ? window.__sokeyBack() : false",
                new android.webkit.ValueCallback<String>() {
                    @Override public void onReceiveValue(String value) {
                        if (!"true".equals(value)) {
                            finish();
                        }
                    }
                });
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (web != null) {
            web.evaluateJavascript("window.__sokeyResume && window.__sokeyResume()", null);
        }
    }

    @Override
    protected void onDestroy() {
        if (web != null) {
            rootView.removeView(web);
            web.destroy();
            web = null;
        }
        super.onDestroy();
    }
}
