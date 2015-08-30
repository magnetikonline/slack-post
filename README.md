# Slack Post
Node module for sending posts to Slack via the incoming webhooks API. Supports both simple and advanced messaging formats.

[![NPM](https://nodei.co/npm/slackpost.png?downloads=true)](https://nodei.co/npm/slackpost/)

An existing incoming webhook integration will be required and can be created via the [Slack administration system](https://my.slack.com/services/new/incoming-webhook/) to successfully use this module.

For further API details see [Incoming webhooks](https://api.slack.com/incoming-webhooks) and [Attachments (advanced messaging)](https://api.slack.com/docs/attachments) Slack API documents.

- [Methods](#methods)
	- [slackPost.post(webhookURL,postText)](#slackpostpostwebhookurlposttext)
	- [slackPost.setUsername(name)](#slackpostsetusernamename)
	- [slackPost.setChannel(channel)](#slackpostsetchannelchannel)
	- [slackPost.setIconEmoji(iconEmoji)](#slackpostseticonemojiiconemoji)
	- [slackPost.setIconURL(iconURL)](#slackpostseticonurliconurl)
	- [slackPost.enableUnfurlLinks()](#slackpostenableunfurllinks)
	- [slackPost.disableMarkdown()](#slackpostdisablemarkdown)
	- [slackPost.setColor(color)](#slackpostsetcolorcolor)
	- [slackPost.setPreText(preText[,enableMarkdown])](#slackpostsetpretextpretextenablemarkdown)
	- [slackPost.setAuthor(name[,authorURL][,iconURL])](#slackpostsetauthornameauthorurliconurl)
	- [slackPost.setTitle(title[,URL])](#slackpostsettitletitleurl)
	- [slackPost.setRichText(richText[,enableMarkdown])](#slackpostsetrichtextrichtextenablemarkdown)
	- [slackPost.addField(title,value[,isShort])](#slackpostaddfieldtitlevalueisshort)
	- [slackPost.enableFieldMarkdown()](#slackpostenablefieldmarkdown)
	- [slackPost.setThumbnail(URL)](#slackpostsetthumbnailurl)
	- [slackPost.setImage(URL)](#slackpostsetimageurl)
	- [slackPost.send(callback)](#slackpostsendcallback)
- [Example usage](#example-usage)

## Methods

### slackPost.post(webhookURL,postText)
- Creates a new Slack Post message object instance.
- The `webhookURL` must be in the format provided by the Slack administration integration endpoint.
- Failing to provide a valid formatted URL will throw an error upon calling this method.
- Provided `postText` will be used as follows:
	- For simple messages (text posts) will be the message text.
	- For [advanced messages](https://api.slack.com/docs/attachments), `postText` will be used as the fall back for Slack user agents/scenarios that do not support advanced messaging.

Example:
```js
var slackPost = require('slackpost');

var myNewPost = slackPost.post(
	'https://hooks.slack.com/services/ABCDEFGHI/012345678/fjdke456HRekdftFOGRPh21s',
	'Hello, HAL. Do you read me, HAL?'
);
```

### slackPost.setUsername(name)
- Override the default username for the incoming webhook.
- Returns the current slackPost object instance.

### slackPost.setChannel(channel)
- Override the default posting channel for the incoming webhook with either:
	- An alternative channel.
	- Direct message Slack username.
- Format must be one of `#channel` or `@username`, anything else will throw an error.
- Returns the current slackPost object instance.

### slackPost.setIconEmoji(iconEmoji)
- Override the default icon for incoming webhook with a Slack defined emoji.
- Provide the desired emoji name _without_ leading or trailing `:`.
- Returns the current slackPost object instance.

Example:
```js
var slackPost = require('slackpost');

var myNewPost = slackPost.post(WEBHOOK_URL,'Message');

// set the post icon to ":chicken:"
myNewPost.setIconEmoji('chicken');
```

### slackPost.setIconURL(iconURL)
- Override the default icon for incoming webhook with a public image URL.
- Returns the current slackPost object instance.

### slackPost.enableUnfurlLinks()
- When enabled, Slack will automatically attempt to extract and display details for URLs referenced from within given text post content.
- Returns the current slackPost object instance.

### slackPost.disableMarkdown()
- When disabled, will action Slack to avoid marking up post text with Markdown-like syntax.
- Method only applies to simple message format - by default message text is automatically formatted.
- Returns the current slackPost object instance.

### slackPost.setColor(color)
- Sets the mesage left hand border color - applies to the advanced message format only.
- `color` as either a HTML color code (e.g. `#439fe0`) or one of `good`, `warning` or `danger`.
- Slack color names are also defined at `require('slackpost').COLOR_LIST`.
- If no `color` is defined for an advanced post - `GOOD` will be used by default.
- Returns the current slackPost object instance.

Example:
```js
var slackPost = require('slackpost');

var myNewPost = slackPost.post(WEBHOOK_URL,'Message');

// color options
myNewPost.setColor(slackPost.COLOR_LIST['GOOD']);
myNewPost.setColor(slackPost.COLOR_LIST['WARNING']);
myNewPost.setColor(slackPost.COLOR_LIST['DANGER']);
myNewPost.setColor('#439fe0');
```

### slackPost.setPreText(preText[,enableMarkdown])
- Set the optional text that appears above the advanced message block.
- If `enableMarkdown` is true, will action Slack Markdown-like formatting of the pretext.
- When called, will enabled the advanced message format.
- Returns the current slackPost object instance.

### slackPost.setAuthor(name[,authorURL][,iconURL])
- Sets a small display section at the top of the message for the message post author.
- Optional `authorURL` allows setting of a URL for the author (will link both the `name` and `iconURL`).
- Optional `iconURL` will set a small 16x16px image to the left of the author `name`.
- When called, will enabled the advanced message format.
- Returns the current slackPost object instance.

### slackPost.setTitle(title[,URL])
- Sets a `title`, in bold text near the top of the message area.
- Optional `URL` allows for the title to be hyperlinked.
- When called, will enabled the advanced message format.
- Returns the current slackPost object instance.

### slackPost.setRichText(richText[,enableMarkdown])
- Sets the `richText` (main text) for the advanced message area.
	- Content will automatically collapse if it contains 700+ characters or 5+ linebreaks, and will display a "Show more..." link to expand the content.
- If `enableMarkdown` is true, will action Slack Markdown-like formatting of the main message text.
- When called, will enabled the advanced message format.
- Returns the current slackPost object instance.

### slackPost.addField(title,value[,isShort])
- Adds message meta data in a table format at the footer of the advanced message area. Can be called multiple times to add multiple field items.
- Optional `isShort` controls if field data is considered short enough to allow side-by-side tabular display with other field items, otherwise field item will consume its own full table row.
- When called, will enabled the advanced message format.
- Returns the current slackPost object instance.

Example:
```js
var slackPost = require('slackpost');

var myNewPost = slackPost.post(WEBHOOK_URL,'Message');

// add some fields - Name and Company will appear side-by-side
myNewPost.addField('Name','Don Draper',true);
myNewPost.addField('Company','Sterling Cooper',true);

// Job title field will appear on its own row
myNewPost.addField('Job title','Creative Director');
```

### slackPost.enableFieldMarkdown()
- When enabled, will action Slack to markup all provided field item values via `slackPost.addField()` with Markdown-like syntax.
- Method only applies to the advanced message format with one or more fields defined.
- Returns the current slackPost object instance.

### slackPost.setThumbnail(URL)
- Provides a public URL to an image that will be displayed as a thumbnail on the right side of an advanced message.
- Image formats of GIF, JPEG, PNG, and BMP are supported.
- When called, will enabled the advanced message format.
- Returns the current slackPost object instance.

### slackPost.setImage(URL)
- Provides a public URL to an image that will be displayed as an image inside the message area.
- Image formats of GIF, JPEG, PNG, and BMP are supported.
- Large images will be resized to a maximum width of 400px or a maximum height of 500px - whilst maintaining aspect ratio.
- When called, will enabled the advanced message format.
- Returns the current slackPost object instance.

### slackPost.send(callback)
- Sends a composed message, using the methods presented above to the Slack incoming webhook API endpoint.
- `callback` is expected to be a function, receiving one parameter:
	- Upon success parameter will be `null`.
	- In the case of error, parameter will be an instance of `Error()`.

## Example usage
Sending a simple message:
```js
var slackPost = require('slackpost');

var simpleMsg = slackPost.post(
	'https://hooks.slack.com/services/ABCDEFGHI/012345678/fjdke456HRekdftFOGRPh21s',
	'Hello, HAL. Do you read me, HAL?'
);

simpleMsg
	.setUsername('HAL9000')
	.setChannel('#spaceship')
	.enableUnfurlLinks()
	.disableMarkdown();

simpleMsg.send(function (err) {

	if (err) {
		// error sending message to Slack API
		console.dir(err);
		return;
	}

	// success!
});
```

Sending an advanced message:
```js
var slackPost = require('slackpost');

var advancedMsg = slackPost.post(
	'https://hooks.slack.com/services/ABCDEFGHI/012345678/fjdke456HRekdftFOGRPh21s',
	'This is my fallback text for mobile notifications and IRC users/etc.'
);

advancedMsg
	.setUsername('magnetik')
	.setChannel('@alexandra')
	.setColor(slackPost.COLOR_LIST.WARNING)
	.setAuthor(
		'Peter Mescalchin',
		'http://magnetikonline.com'
	)
	.setRichText('This is some *rich-text* messaging!',true);

advancedMsg.send(function (err) {

	if (err) {
		// error sending message to Slack API
		console.dir(err);
		return;
	}

	// success!
});
```
