'use strict';

var HTTP_CODE_OK = 200,
	WEBHOOK_URL_REGEXP = /^https:\/\/(hooks\.slack\.com)(\/services\/[A-Za-z0-9\/]+)$/,
	COLOR_LIST = {
		GOOD: 'good',
		WARNING: 'warning',
		DANGER: 'danger'
	},

	https = require('https');


exports.post = function(webhookURL,postText) {

	// valid webhook URL?
	if (!WEBHOOK_URL_REGEXP.test(webhookURL)) {
		throw new Error('Invalid Slack Webhook URL');
	}

	return new Post(webhookURL,postText);
};

exports.COLOR_LIST = COLOR_LIST;

function Post(webhookURL,postText) {

	this.webhookURL = webhookURL;
	this.postText = postText;
	this.fieldList = [];
	this.advancedMarkdownList = [];
}

Post.prototype.setUsername = function(name) {

	this.username = name;
	return this;
};

Post.prototype.setChannel = function(channel) {

	// does channel start with [#] (other channel) or [@] (direct message)?
	if (!/^[#@].+/.test(channel)) {
		throw new Error('Invalid channel identifier');
	}

	this.channel = channel;
	return this;
};

Post.prototype.setIconEmoji = function(iconEmoji) {

	this.iconEmoji = ':' + iconEmoji + ':';
	return this;
};

Post.prototype.setIconURL = function(iconURL) {

	this.iconURL = iconURL;
	return this;
};

Post.prototype.enableUnfurlLinks = function() {

	this.unfurlLinks = true;
	return this;
};

Post.prototype.disableMarkdown = function() {

	this.simpleDisableMarkdown = true;
	return this;
};

Post.prototype.setColor = function(color) {

	this.postColor = color;
	return this;
};

Post.prototype.setPreText = function(preText,enableMarkdown) {

	this.preText = preText;
	if (enableMarkdown) {
		this.advancedMarkdownList.push('pretext');
	}

	return this;
};

Post.prototype.setAuthor = function(name,authorURL,iconURL) {

	this.authorName = name;
	this.authorURL = authorURL;
	this.authorIconURL = iconURL;

	return this;
};

Post.prototype.setTitle = function(title,URL) {

	this.postTitle = title;
	this.postTitleURL = URL;

	return this;
};

Post.prototype.setRichText = function(richText,enableMarkdown) {

	this.richText = richText;
	if (enableMarkdown) {
		this.advancedMarkdownList.push('text');
	}

	return this;
};

Post.prototype.addField = function(title,value,isShort) {

	this.fieldList.push({
		title: title,
		value: value,
		short: !!isShort
	});

	return this;
};

Post.prototype.enableFieldMarkdown = function() {

	this.advancedMarkdownList.push('fields');
	return this;
};

Post.prototype.setThumbnail = function(URL) {

	this.thumbnailURL = URL;
	return this;
};

Post.prototype.setImage = function(URL) {

	this.imageURL = URL;
	return this;
};

Post.prototype.buildPayload = function() {

	// build payload for sending to Slack API as JSON
	var payload = {};

	if (this.username !== undefined) {
		// set custom username
		payload.username = this.username;
	}

	if (this.channel !== undefined) {
		// set custom channel
		payload.channel = this.channel;
	}

	if (this.iconEmoji !== undefined) {
		// set emoji message icon
		payload.icon_emoji = this.iconEmoji;

	} else if (this.iconURL !== undefined) {
		// set image URL message icon
		payload.icon_url = this.iconURL;
	}

	if (this.unfurlLinks) {
		// extract content from post links
		payload.unfurl_links = true;
	}

	// simple or advanced message mode?
	if (
		(this.preText !== undefined) ||
		(this.authorName !== undefined) ||
		(this.postTitle !== undefined) ||
		(this.richText !== undefined) ||
		(this.fieldList.length > 0) ||
		(this.thumbnailURL !== undefined) ||
		(this.imageURL !== undefined)
	) {
		// advanced message mode
		var attachments = {
			// if no color given, default to 'GOOD'
			color: this.postColor || COLOR_LIST.GOOD,

			// default post text becomes the fallback where rich messages are not supported
			// examples: IRC Slack usage and mobile notifications
			fallback: this.postText
		};

		if (this.preText !== undefined) {
			// add pre text placed above main message text
			attachments.pretext = this.preText;
		}

		if (this.authorName !== undefined) {
			// add post author name and (optional) link/icon
			attachments.author_name = this.authorName;

			if (this.authorURL !== undefined) {
				attachments.author_link = this.authorURL;
			}

			if (this.authorIconURL !== undefined) {
				attachments.author_icon = this.authorIconURL;
			}
		}

		if (this.postTitle !== undefined) {
			// add post title and (optional) url link
			attachments.title = this.postTitle;

			if (this.postTitleURL !== undefined) {
				attachments.title_link = this.postTitleURL;
			}
		}

		if (this.richText !== undefined) {
			// add main message text
			attachments.text = this.richText;
		}

		if (this.fieldList.length > 0) {
			// add title/value fields
			attachments.fields = this.fieldList;
		}

		if (this.thumbnailURL !== undefined) {
			// add thumbnail
			attachments.thumb_url = this.thumbnailURL;

		} else if (this.imageURL !== undefined) {
			// add image
			attachments.image_url = this.imageURL;
		}

		if (this.advancedMarkdownList.length > 0) {
			// enable markdown for and/or pretext/text/fields
			attachments.mrkdwn_in = this.advancedMarkdownList;
		}

		// add attachments data structure to payload
		payload.attachments = [attachments];

	} else {
		// simple message mode
		if (this.simpleDisableMarkdown) {
			// markdown support enabled by default
			payload.mrkdwn = false;
		}

		payload.text = this.postText;
	}

	return payload;
};

Post.prototype.send = function(callback) {

	// make HTTPS post request to send message
	var webhookURLMatch = WEBHOOK_URL_REGEXP.exec(this.webhookURL),
		requestOptions = {
			hostname: webhookURLMatch[1],
			method: 'POST',
			path: webhookURLMatch[2]
		},
		request = https.request(
			requestOptions,
			function(response) {

				// OK response received from Slack API?
				if (response.statusCode != HTTP_CODE_OK) {
					return callback(new Error('Error posting to Slack API'));
				}

				// success
				return callback(null);
			}
		);

	// send message payload as JSON and end request
	request.end(JSON.stringify(this.buildPayload()));
};
