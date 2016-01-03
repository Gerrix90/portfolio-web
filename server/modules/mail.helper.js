'use strict';
const
    ERROR_MESSAGES = require('./../config/error.props.json'),
    DISALLOWED_CHARS = /[<>^|%()&+]/,
    URL_REGEX = /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/,
    EMAIL_REGEX = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;

const
    GMAIL_SENDER_EMAIL = process.env.GMAIL_SENDER_EMAIL || 'Louw Swart <louw@ouq77.kiwi>',
    CUSTOM_APP_DOMAIN = process.env.CUSTOM_APP_DOMAIN || 'portfolio.ouq77.kiwi',
    SUBJECT = "Message from {0} | " + CUSTOM_APP_DOMAIN,
    SUBJECT_COPY = 'Thanks for getting in touch | ' + CUSTOM_APP_DOMAIN,
    CONTENT = '<p style="font-family:\'Open Sans\',sans-serif;color:#474d5d">You have been contacted by {0} ({1}). Their additional message is as follows:</p><br><p style="font-family:\'Open Sans\',sans-serif;color:#474d5d">{2}</p>',
    CONTENT_COPY = '<p style="font-family:\'Open Sans\',sans-serif;color:#474d5d"><strong>Thank you</strong> for getting in touch, {0} - I\'ve received your message and will respond soon.<br><br>Thanks,<br>Louw</p><br><p style="font-family:\'Open Sans\',sans-serif;color:#474d5d">Here is a copy of what you sent:</p><br><p style="font-family:\'Open Sans\',sans-serif;color:#474d5d">{1}</p>';

/**
 * Accepts a submission and validates the content
 * @param {Object} submission
 * @param {string} submission.name
 * @param {string} submission.email
 * @param {string} submission.text
 * @param {string} submission.heuning
 *
 * @return {Array} one or more errors, or empty array if none
 */
var validate = (submission) => {
  let response = [],
      isUrl = false;

  if (submission.heuning) {
    response.push(ERROR_MESSAGES.e_spam.code);
    return response;
  }

    if (!submission.name) {
      response.push(ERROR_MESSAGES.e_name_required.code);
    } else if (containsDisallowedChars(submission.name)) {
      response.push(ERROR_MESSAGES.e_name_disallowed_chars.code);
    } else if (containsUrl(submission.name)) {
      isUrl = true;
    }
    if (!submission.email) {
      response.push(ERROR_MESSAGES.e_email_required.code);
    }
    else if (!isValidEmail(submission.email)) {
      response.push(ERROR_MESSAGES.e_email_invalid.code);
    }
  if (!submission.text) {
    response.push(ERROR_MESSAGES.e_message_required.code);
  } else if (containsDisallowedChars(submission.text)) {
    response.push(ERROR_MESSAGES.e_message_disallowed_chars.code);
  } else if (containsUrl(submission.text)) {
    isUrl = true;
  }

  if (isUrl) {
    response.push(ERROR_MESSAGES.e_contains_url.code);
  }

  return response;
}

/**
 * Accepts a submission and builds a message for sending
 * @param {Object} submission
 * @param {string} submission.name
 * @param {string} submission.email
 * @param {string} submission.text
 *
 * @return {Object} message
 * {string} message.replyTo
 * {string} message.to
 * {string} message.subject
 * {string} message.html
 */
var buildMessage = (submission) => {
  let message = {
    replyTo: submission.name + ' <' + submission.email + '>', // sender address
    to: GMAIL_SENDER_EMAIL, // list of receivers
    subject: new String(SUBJECT), // Subject line
    html: new String(CONTENT) // html body
  };

  message.subject = formatValue(message.subject, [submission.name]);
  message.html = formatValue(message.html, [submission.name, submission.email, submission.text]);

  return message;
}

/**
 * Accepts a submission and builds a copy for sending to the sender
 * @param {Object} submission
 * @param {string} submission.name
 * @param {string} submission.email
 * @param {string} submission.text
 *
 * @return {Object} message
 * {string} message.to
 * {string} message.subject
 * {string} message.html
 */
var buildMessageCopy = (submission) => {
  let message = {
    to: submission.name + ' <' + submission.email + '>', // list of receivers
    subject: new String(SUBJECT_COPY), // Subject line
    html: new String(CONTENT_COPY) // html body
  };

  message.html = formatValue(message.html, [submission.name, submission.text]);

  return message;
}

var containsDisallowedChars = (value) => {
  return DISALLOWED_CHARS.test(value);
}

var containsUrl = (value) => {
  return URL_REGEX.test(value);
}

var isValidEmail = (email) => {
  return EMAIL_REGEX.test(email);
}

/**
 * Formats a value with the args passed in
 * @param {string} value
 * @param {Array} args
 * @returns {string} formatted value
 */
var formatValue = (value, args) => {
  return value.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != 'undefined' ?
        args[number] : match;
  });
}

module.exports.validate = validate;
module.exports.buildMessage = buildMessage;
module.exports.buildMessageCopy = buildMessageCopy;