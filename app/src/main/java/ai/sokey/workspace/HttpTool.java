package ai.sokey.workspace;

import android.webkit.WebView;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Networking for the web layer.
 *
 * The UI's own {@code fetch()} can be blocked by CORS when it talks to a gateway on
 * 127.0.0.1 or on the LAN (a file:// page has a null origin). Requests therefore also
 * exist here, where no CORS rules apply, and SSE streaming is pushed back into JS
 * through {@code window.__sokeyStreamEvent(...)}.
 */
public final class HttpTool {

    private static final Charset UTF8 = Charset.forName("UTF-8");
    private static final Map<String, HttpURLConnection> LIVE = new ConcurrentHashMap<String, HttpURLConnection>();

    private HttpTool() {}

    /* ------------------------------------------------------------- blocking */

    public static String request(String url, String method, String headersJson, String body) {
        HttpURLConnection conn = null;
        try {
            conn = open(url, method, headersJson);
            if (body != null && !body.isEmpty() && !"GET".equalsIgnoreCase(method)) {
                conn.setDoOutput(true);
                OutputStream out = conn.getOutputStream();
                out.write(body.getBytes(UTF8));
                out.flush();
                out.close();
            }
            int code = conn.getResponseCode();
            InputStream in = code >= 400 ? conn.getErrorStream() : conn.getInputStream();
            String text = readAll(in, 200000);
            JSONObject o = new JSONObject();
            o.put("status", code);
            o.put("body", text);
            return o.toString();
        } catch (Exception e) {
            try {
                JSONObject o = new JSONObject();
                o.put("status", 0);
                o.put("error", String.valueOf(e.getMessage()));
                return o.toString();
            } catch (Exception inner) {
                return "{\"status\":0,\"error\":\"unknown\"}";
            }
        } finally {
            if (conn != null) conn.disconnect();
        }
    }

    /* ------------------------------------------------------------ streaming */

    /** Opens an SSE connection; every event is forwarded to the page as JSON. */
    public static String stream(final WebView web, final String streamId, final String url,
                                final String method, final String headersJson, final String body) {
        Thread t = new Thread(new Runnable() {
            @Override public void run() {
                HttpURLConnection conn = null;
                try {
                    conn = open(url, method, headersJson);
                    conn.setRequestProperty("Accept", "text/event-stream");
                    if (body != null && !body.isEmpty()) {
                        conn.setDoOutput(true);
                        OutputStream out = conn.getOutputStream();
                        out.write(body.getBytes(UTF8));
                        out.flush();
                        out.close();
                    }
                    LIVE.put(streamId, conn);
                    int code = conn.getResponseCode();
                    if (code >= 400) {
                        String err = readAll(conn.getErrorStream(), 4000);
                        emit(web, streamId, "error", "HTTP " + code + (err.isEmpty() ? "" : " — " + err));
                        return;
                    }
                    BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), UTF8));
                    StringBuilder content = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        if (line.isEmpty() || line.startsWith(":")) continue;
                        if (!line.startsWith("data:")) continue;
                        String payload = line.substring(5).trim();
                        if ("[DONE]".equals(payload)) break;
                        try {
                            JSONObject json = new JSONObject(payload);
                            if (json.has("usage")) {
                                JSONObject u = json.getJSONObject("usage");
                                emitUsage(web, streamId, u.optInt("total_tokens", 0));
                            }
                            if (!json.has("choices")) continue;
                            JSONObject choice = json.getJSONArray("choices").optJSONObject(0);
                            if (choice == null) continue;
                            JSONObject delta = choice.optJSONObject("delta");
                            if (delta == null) delta = choice.optJSONObject("message");
                            if (delta == null) continue;
                            String piece = delta.optString("content", "");
                            if (piece.isEmpty()) continue;
                            content.append(piece);
                            emit(web, streamId, "delta", piece);
                        } catch (Exception ignored) {
                        }
                    }
                    reader.close();
                    emit(web, streamId, "done", content.toString());
                } catch (Exception e) {
                    emit(web, streamId, "error", String.valueOf(e.getMessage()));
                } finally {
                    LIVE.remove(streamId);
                    if (conn != null) conn.disconnect();
                }
            }
        }, "sokey-http-" + streamId);
        t.setDaemon(true);
        t.start();
        return "{\"started\":true,\"id\":\"" + streamId + "\"}";
    }

    public static void abort(String streamId) {
        HttpURLConnection c = LIVE.remove(streamId);
        if (c != null) {
            try {
                c.disconnect();
            } catch (Exception ignored) {
            }
        }
    }

    /* --------------------------------------------------------------- helpers */

    private static HttpURLConnection open(String url, String method, String headersJson) throws Exception {
        HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
        conn.setRequestMethod(method == null || method.isEmpty() ? "GET" : method);
        conn.setConnectTimeout(15000);
        conn.setReadTimeout(120000);
        conn.setRequestProperty("User-Agent", "So-key-Ai/1.0 (Android)");
        Map<String, String> headers = parseHeaders(headersJson);
        for (Map.Entry<String, String> e : headers.entrySet()) {
            conn.setRequestProperty(e.getKey(), e.getValue());
        }
        return conn;
    }

    static Map<String, String> parseHeaders(String json) {
        Map<String, String> map = new HashMap<String, String>();
        if (json == null || json.isEmpty()) return map;
        try {
            JSONObject o = new JSONObject(json);
            Iterator<String> it = o.keys();
            while (it.hasNext()) {
                String k = it.next();
                map.put(k, o.optString(k, ""));
            }
        } catch (Exception ignored) {
        }
        return map;
    }

    private static String readAll(InputStream in, int limit) {
        if (in == null) return "";
        StringBuilder sb = new StringBuilder();
        try {
            BufferedReader r = new BufferedReader(new InputStreamReader(in, UTF8));
            char[] buf = new char[4096];
            int n;
            while ((n = r.read(buf)) > 0 && sb.length() < limit) sb.append(buf, 0, n);
            r.close();
        } catch (Exception ignored) {
        }
        return sb.length() > limit ? sb.substring(0, limit) : sb.toString();
    }

    private static void emit(WebView web, String streamId, String type, String text) {
        if (web == null) return;
        try {
            JSONObject o = new JSONObject();
            o.put("id", streamId);
            o.put("type", type);
            o.put("text", text == null ? "" : text);
            final String js = "window.__sokeyStreamEvent && window.__sokeyStreamEvent(" + o.toString() + ");";
            web.post(new Runnable() {
                @Override public void run() {
                    web.evaluateJavascript(js, null);
                }
            });
        } catch (Exception ignored) {
        }
    }

    private static void emitUsage(WebView web, String streamId, int tokens) {
        if (web == null || tokens <= 0) return;
        try {
            JSONObject o = new JSONObject();
            o.put("id", streamId);
            o.put("type", "usage");
            o.put("tokens", tokens);
            final String js = "window.__sokeyStreamEvent && window.__sokeyStreamEvent(" + o.toString() + ");";
            web.post(new Runnable() {
                @Override public void run() {
                    web.evaluateJavascript(js, null);
                }
            });
        } catch (Exception ignored) {
        }
    }
}
