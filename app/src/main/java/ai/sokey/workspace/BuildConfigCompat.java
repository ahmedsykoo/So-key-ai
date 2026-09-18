package ai.sokey.workspace;

/**
 * Build flags without the Gradle-generated BuildConfig.
 * ADB (or the build script) can flip DEBUG through a system property; the default is a
 * developer-friendly true, matching the debug-signed demo APK this repository produces.
 */
public final class BuildConfigCompat {
    public static final boolean DEBUG = "1".equals(System.getProperty("sokey.debug", "1"));
    public static final String VERSION_NAME = "1.0.0";
    public static final int VERSION_CODE = 1;

    private BuildConfigCompat() {}
}
