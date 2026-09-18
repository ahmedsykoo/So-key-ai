package ai.sokey.workspace;

import android.content.ContentProvider;
import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.MatrixCursor;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import android.provider.OpenableColumns;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Locale;

/**
 * A dependency-free "FileProvider": hands workspace files to other apps (share sheet,
 * APK installer) as {@code content://ai.sokey.workspace.files/...} URIs.
 */
public class ShareProvider extends ContentProvider {

    public static final String AUTHORITY = "ai.sokey.workspace.files";

    public static Uri uriFor(Context ctx, File file) {
        return new Uri.Builder()
                .scheme("content")
                .authority(AUTHORITY)
                .appendPath(Workspace.relative(ctx, file))
                .build();
    }

    public static String mimeOf(String name) {
        String n = name == null ? "" : name.toLowerCase(Locale.US);
        if (n.endsWith(".apk")) return "application/vnd.android.package-archive";
        if (n.endsWith(".md")) return "text/markdown";
        if (n.endsWith(".json")) return "application/json";
        if (n.endsWith(".txt") || n.endsWith(".log")) return "text/plain";
        if (n.endsWith(".png")) return "image/png";
        if (n.endsWith(".jpg") || n.endsWith(".jpeg")) return "image/jpeg";
        if (n.endsWith(".pdf")) return "application/pdf";
        if (n.endsWith(".ttf") || n.endsWith(".otf")) return "font/ttf";
        return "application/octet-stream";
    }

    @Override
    public boolean onCreate() {
        return true;
    }

    private File resolveUri(Uri uri) throws FileNotFoundException {
        if (getContext() == null) throw new FileNotFoundException("no context");
        String relative = uri.getPath() == null ? "" : uri.getPath().replaceFirst("^/", "");
        try {
            File f = Workspace.resolve(getContext(), relative);
            if (!f.isFile()) throw new FileNotFoundException(relative);
            return f;
        } catch (Exception e) {
            throw new FileNotFoundException(relative);
        }
    }

    @Override
    public ParcelFileDescriptor openFile(Uri uri, String mode) throws FileNotFoundException {
        File f = resolveUri(uri);
        return ParcelFileDescriptor.open(f, ParcelFileDescriptor.MODE_READ_ONLY);
    }

    @Override
    public String getType(Uri uri) {
        String last = uri.getLastPathSegment();
        return mimeOf(last);
    }

    @Override
    public Cursor query(Uri uri, String[] projection, String selection, String[] selectionArgs, String sortOrder) {
        try {
            File f = resolveUri(uri);
            MatrixCursor cursor = new MatrixCursor(new String[]{OpenableColumns.DISPLAY_NAME, OpenableColumns.SIZE});
            cursor.addRow(new Object[]{f.getName(), f.length()});
            return cursor;
        } catch (FileNotFoundException e) {
            return null;
        }
    }

    @Override
    public int update(Uri uri, ContentValues values, String selection, String[] selectionArgs) {
        return 0;
    }

    @Override
    public int delete(Uri uri, String selection, String[] selectionArgs) {
        return 0;
    }

    @Override
    public Uri insert(Uri uri, ContentValues values) {
        return null;
    }
}
