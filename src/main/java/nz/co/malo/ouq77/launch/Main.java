package nz.co.malo.ouq77.launch;

import java.io.File;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;
import java.util.logging.ConsoleHandler;
import java.util.logging.Handler;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;

import org.apache.catalina.Context;
import org.apache.catalina.connector.Connector;
import org.apache.catalina.startup.Tomcat;
import org.apache.commons.lang3.StringUtils;

public class Main {

	private static final Level DEFAULT_LEVEL = Level.INFO;
	private static final String LOGGER_LEVEL = "LOGGER_LEVEL";
	private static final String WEB_PORT_SYS_ENV = "PORT";
	private static final String WEB_APPLICATION_DIR_LOCATION = "target/ouq77.herokuapp.com";
	private static final String ANDROID_APP_URL = "ANDROID_APP_URL";
	private static final String INSTAGRAM_IMAGE_FOLDER = "INSTAGRAM_IMAGE_FOLDER";
	private static final SimpleDateFormat MAVEN_SDF = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX");
	private static final SimpleDateFormat CACHE_SDF = new SimpleDateFormat("yyyyMMddHHmm");
	private static final String BUILD_TIMESTAMP = "BUILD_TIMESTAMP";
	private static final String CACHE_VERSION = "CACHE_VERSION";
	private static final String ARTICLE_MODIFIED_TIME = "ARTICLE_MODIFIED_TIME";

	public static void main(final String[] args) throws Exception {

		final Level level = StringUtils.isNotEmpty(System.getenv(LOGGER_LEVEL)) ? Level.parse(System.getenv(LOGGER_LEVEL)) : DEFAULT_LEVEL;
		final Logger logger = Logger.getLogger("");
		logger.setLevel(level);
		final Handler[] handlers = logger.getHandlers();
		Handler handler = (handlers.length == 1 && handlers[0] instanceof ConsoleHandler) ? handlers[0] : new ConsoleHandler();
		handler.setFormatter(new SimpleFormatter());
		handler.setLevel(level);
		handler.setEncoding("UTF-8");
		logger.addHandler(handler);

		final Tomcat tomcat = new Tomcat();
		// The port that we should run on can be set into an environment variable
		// Look for that variable and default to 8080 if it isn't there.
		final String webPort = System.getenv(WEB_PORT_SYS_ENV) != null && !System.getenv(WEB_PORT_SYS_ENV).isEmpty() ? System.getenv(WEB_PORT_SYS_ENV) : "8080";

		tomcat.setPort(Integer.valueOf(webPort));
		final Connector c = tomcat.getConnector();
		c.setProperty("compression", "on");
		c.setProperty("compressionMinSize", "1024");
		c.setProperty("noCompressionUserAgents", "gozilla, traviata");
		c.setProperty("compressableMimeType", "text/html,text/xml, text/css, application/json, application/javascript");

		// Heroku logging
		System.out.println("configuring app with basedir: " + new File("./" + WEB_APPLICATION_DIR_LOCATION).getAbsolutePath());
		final Context ctx = tomcat.addWebapp("/", new File(WEB_APPLICATION_DIR_LOCATION).getAbsolutePath());
		ctx.addParameter(ANDROID_APP_URL, System.getenv(ANDROID_APP_URL));
		ctx.addParameter(INSTAGRAM_IMAGE_FOLDER, System.getenv(INSTAGRAM_IMAGE_FOLDER));

		final Properties prop = new Properties();
		final ClassLoader loader = Thread.currentThread().getContextClassLoader();
		final InputStream stream = loader.getResourceAsStream("webapp.properties");
		prop.load(stream);

		final String buildTimestamp = prop.getProperty(BUILD_TIMESTAMP);
		final Date cacheDate = MAVEN_SDF.parse(buildTimestamp);
		ctx.addParameter(CACHE_VERSION, CACHE_SDF.format(cacheDate));
		ctx.addParameter(ARTICLE_MODIFIED_TIME, buildTimestamp);

		tomcat.start();
		tomcat.getServer().await();
	}
}