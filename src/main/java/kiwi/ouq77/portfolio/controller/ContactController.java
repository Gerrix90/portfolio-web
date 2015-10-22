package kiwi.ouq77.portfolio.controller;

import java.io.UnsupportedEncodingException;
import java.security.GeneralSecurityException;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.mail.Address;
import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.Message.RecipientType;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import kiwi.ouq77.portfolio.launch.Launch;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.sun.mail.util.MailSSLSocketFactory;

/**
 * Handles requests for the application contact page.
 */
@Controller
public class ContactController {

	private static final Log log = LogFactory.getLog(ContactController.class);
	/**
	 * HEROKU CONFIG VARIABLES
	 */
	private static final String OWNER_NAME = System.getenv("OWNER_NAME").replaceAll("\"", "");
	private static final String JAVA_MAIL_EMAIL = System.getenv("JAVA_MAIL_EMAIL");
	private static final String JAVA_MAIL_PASSWORD = System.getenv("JAVA_MAIL_PASSWORD");
	/**
	 * END HEROKU CONFIG VARIABLES
	 */
	private static final Pattern ILLEGAL_CHARS_PATTERN = Pattern.compile("[<>^|%()&+]");
	private static final Pattern URL_PATTERN = Pattern.compile("http[s]?");
	private static final String INPUT_NAME = "name";
	private static final String INPUT_EMAIL = "email";
	private static final String INPUT_MESSAGE = "message";
	private static final String SUBJECT = "Message from %s | " + Launch.CUSTOM_APP_DOMAIN;
	private static final String SUBJECT_COPY = "Thanks for getting in touch | " + Launch.CUSTOM_APP_DOMAIN;
	private static final String CONTENT = "<p>You have been contacted by %s (%s). Their additional message is as follows:</p><br><br><p>%s</p>";
	private static final String CONTENT_COPY = "<p><strong>Thank you</strong> for getting in touch - I've received your message.</b><br><br><p>Here is a copy of what you sent:</p><br><br><p>%s (%s)<br><br>%s</p>";
	private static final String MESSAGE_DIV = "<div class=\"%s\">%s</div>";
	private static final String ERROR_CLASS = "error_message";
	private static final String SUCCESS_CLASS = "success_message";
	private static final String BR = "<br/>";
	private static final String SPAM = "Spam filter has been triggered";
	private static final String FIELD_REQUIRED = "Please enter your ";
	private static final String EMAIL_INVALID = "You have entered an invalid email";
	private static final String CONTAINS_ILLEGAL_CHARS = " contains one or more illegal characters: <i>< > ^ | \" ' % ; ) ( & + -</i>";
	private static final String CONTAINS_URL = " does not allow URLs";
	private static final String UNKNOWN_ERROR = "Something unexpected happend - please try again later...";
	private static final String SUCCESS = "<h3>Email Sent Successfully.</h3><p>Thank you <strong>%s</strong>, your message has been sent.</p>";

	@RequestMapping(value = "/send", method = RequestMethod.POST)
	public String send(
			@RequestParam final String heuning,
			@RequestParam final String name,
			@RequestParam final String email,
			@RequestParam final String message,
			final Model model) {

		final StringBuilder responseBuilder = new StringBuilder();
		if (StringUtils.isNotEmpty(heuning)) {
			responseBuilder.append(SPAM);
		}

		validateInput(responseBuilder, INPUT_NAME, name);
		validateInput(responseBuilder, INPUT_EMAIL, email);
		validateInput(responseBuilder, INPUT_MESSAGE, message);

		if (responseBuilder.length() == 0) {
			try {
				responseBuilder.append(send(name, email, message));
			} catch (final GeneralSecurityException e) {
				log.error(e);
				responseBuilder.append(UNKNOWN_ERROR);
			} catch (final Exception e) {
				log.error(e);
				responseBuilder.append(UNKNOWN_ERROR);
			}
		}

		final String response = String.format(MESSAGE_DIV, responseBuilder.toString().equals(String.format(SUCCESS, name)) ? SUCCESS_CLASS : ERROR_CLASS, responseBuilder.toString());

		model.addAttribute("response", response);

		return "ajax/response";
	}

	private String send(final String fromName, final String fromEmail, final String message) throws GeneralSecurityException {

		final Properties props = new Properties();
		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.port", "465");

		final MailSSLSocketFactory sf = new MailSSLSocketFactory();
		sf.setTrustedHosts(new String[] { "localhost", Launch.HEROKU_APP_DOMAIN, Launch.CUSTOM_APP_DOMAIN });
		props.put("mail.smtp.ssl.socketFactory", sf);

		props.put("mail.smtp.ssl.enable", "true");
		props.put("mail.smtp.auth", "true");

		final Authenticator auth = new Authenticator() {
			@Override
			public PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(JAVA_MAIL_EMAIL, JAVA_MAIL_PASSWORD);
			}
		};

		final Session mailSession = Session.getInstance(props, auth);

		final Message htmlMessage = new MimeMessage(mailSession);
		InternetAddress fromAddress;
		InternetAddress toAddress;
		try {
			fromAddress = new InternetAddress(fromEmail, fromName);
			toAddress = new InternetAddress(JAVA_MAIL_EMAIL, OWNER_NAME);
		} catch (final UnsupportedEncodingException e) {
			log.error(e);
			return UNKNOWN_ERROR;
		}

		// Send my copy
		try {
			htmlMessage.setFrom(fromAddress);
			htmlMessage.setReplyTo(new Address[] { fromAddress });
			htmlMessage.setRecipient(RecipientType.TO, toAddress);
			htmlMessage.setSubject(String.format(SUBJECT, fromName));
			htmlMessage.setContent(String.format(CONTENT, fromName, fromEmail, message), "text/html");
			Transport.send(htmlMessage);
		} catch (final MessagingException e) {
			log.error(e);
			return UNKNOWN_ERROR;
		}

		// Send user copy
		try {
			htmlMessage.setFrom(toAddress);
			htmlMessage.setRecipient(RecipientType.TO, fromAddress);
			htmlMessage.setSubject(SUBJECT_COPY);
			htmlMessage.setContent(String.format(CONTENT_COPY, fromName, fromEmail, message), "text/html");
			Transport.send(htmlMessage);
		} catch (final MessagingException e) {
			log.error(e);
			return UNKNOWN_ERROR;
		}

		return String.format(SUCCESS, fromName);
	}

	private void validateInput(final StringBuilder responseBuilder, final String field, final String input) {
		if (responseBuilder.length() != 0) {
			responseBuilder.append(BR);
		}

		if (StringUtils.isEmpty(input)) {
			responseBuilder.append(FIELD_REQUIRED).append(field);
		} else {
			if (INPUT_NAME.equals(field) || INPUT_MESSAGE.equals(field)) {
				if (invalidInput(input)) {
					responseBuilder.append(StringUtils.capitalize(field)).append(CONTAINS_ILLEGAL_CHARS);
				} else if (containsUrl(input)) {
					responseBuilder.append(StringUtils.capitalize(field)).append(CONTAINS_URL);
				}
			}

			if (INPUT_EMAIL.equals(field) && !EmailValidator.getInstance().isValid(input)) {
				responseBuilder.append(EMAIL_INVALID);
			}
		}
	}

	private boolean invalidInput(final String input) {
		final Matcher matcher = ILLEGAL_CHARS_PATTERN.matcher(input);
		return matcher.find();
	}

	private boolean containsUrl(final String input) {
		final Matcher matcher = URL_PATTERN.matcher(input);
		return matcher.find();
	}
}
