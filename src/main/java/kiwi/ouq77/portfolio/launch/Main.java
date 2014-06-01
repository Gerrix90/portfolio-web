package kiwi.ouq77.portfolio.launch;

import java.io.File;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;

import kiwi.ouq77.portfolio.scheduler.DynoKeepAliveScheduler;

import org.apache.catalina.Context;
import org.apache.catalina.connector.Connector;
import org.apache.catalina.startup.Tomcat;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class Main {

	private static final Log log = LogFactory.getLog(Main.class);
	/**
	 * HEROKU CONFIG VARIABLES
	 */
	public static final String CUSTOM_APP_DOMAIN_KEY = "CUSTOM_APP_DOMAIN";
	public static final String HEROKU_APP_DOMAIN = System.getenv("HEROKU_APP_DOMAIN");
	private static final String ANDROID_APP_URL_KEY = "ANDROID_APP_URL";
	private static final String INSTAGRAM_IMAGE_FOLDER_KEY = "INSTAGRAM_IMAGE_FOLDER";
	private static final String PORT = System.getenv("PORT") != null && !System.getenv("PORT").isEmpty() ? System.getenv("PORT") : "8080";
	/**
	 * END HEROKU CONFIG VARIABLES
	 */
	public static final String CUSTOM_APP_DOMAIN = System.getenv(CUSTOM_APP_DOMAIN_KEY);
	private static final String ANDROID_APP_URL = System.getenv(ANDROID_APP_URL_KEY);
	private static final String INSTAGRAM_IMAGE_FOLDER = System.getenv(INSTAGRAM_IMAGE_FOLDER_KEY);
	private static final String WEB_APPLICATION_DIR_LOCATION = "target/ouq77.herokuapp.com";
	private static final String MAVEN_SDF = "MAVEN_SDF";
	private static final String BUILD_TIMESTAMP = "BUILD_TIMESTAMP";
	private static final String CACHE_VERSION_KEY = "CACHE_VERSION";
	private static final String ARTICLE_MODIFIED_TIME_KEY = "ARTICLE_MODIFIED_TIME";
	private static final SimpleDateFormat CACHE_SDF = new SimpleDateFormat("yyyyMMddHHmm");

	public static void main(final String[] args) throws Exception {

		final Tomcat tomcat = new Tomcat();
		tomcat.setPort(Integer.valueOf(PORT));

		final Connector c = tomcat.getConnector();
		c.setProperty("compression", "on");
		c.setProperty("compressionMinSize", "1024");
		c.setProperty("noCompressionUserAgents", "gozilla, traviata");
		c.setProperty("compressableMimeType", "text/html, text/xml, text/css, application/json, application/javascript");

		log.info("configuring app with basedir: " + new File("./" + WEB_APPLICATION_DIR_LOCATION).getAbsolutePath());
		final Context ctx = tomcat.addWebapp("/", new File(WEB_APPLICATION_DIR_LOCATION).getAbsolutePath());
		ctx.addParameter(ANDROID_APP_URL_KEY, ANDROID_APP_URL);
		ctx.addParameter(INSTAGRAM_IMAGE_FOLDER_KEY, INSTAGRAM_IMAGE_FOLDER);
		ctx.addParameter(CUSTOM_APP_DOMAIN_KEY, CUSTOM_APP_DOMAIN);

		final Properties props = new Properties();
		final ClassLoader loader = Thread.currentThread().getContextClassLoader();
		final InputStream stream = loader.getResourceAsStream("webapp.properties");
		props.load(stream);

		final SimpleDateFormat mavenSdf = new SimpleDateFormat(props.getProperty(MAVEN_SDF));
		final String buildTimestamp = props.getProperty(BUILD_TIMESTAMP);
		final Date cacheDate = mavenSdf.parse(buildTimestamp);
		ctx.addParameter(CACHE_VERSION_KEY, CACHE_SDF.format(cacheDate));
		ctx.addParameter(ARTICLE_MODIFIED_TIME_KEY, buildTimestamp);

		final DynoKeepAliveScheduler dynoKeepAliveScheduler = new DynoKeepAliveScheduler();
		dynoKeepAliveScheduler.start();

		tomcat.start();
		tomcat.getServer().await();

	}
}