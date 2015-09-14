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
- `webhookURL` must be in the format expected by the Slack administration integration endpoint - method will throw an error if web hook URL invalid.
- `postText` is implemented as follows:
	- For simple messages (text posts) this will be the message text.
	- For [advanced messages](https://api.slack.com/docs/attachments) used as the fall back text for Slack user agents and scenarios that don't support advanced messaging display/rendering.

Example:
```js
var slackPost = require('slackpost');

var myNewPost = slackPost.post(
	'https://hooks.slack.com/services/ABCDEF012/012345ABC/fjdke456HRekdftFOGRPh21s',
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
- Provide the desired emoji name _without_ leading/trailing `:` characters.
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
- When enabled, Slack will automatically attempt to extract and display summarized details for URLs within the post content.
- By default URLs referenced in posts made by an incoming webhook will _not_ be unfurled - unless they are deemed media content links.
- Returns the current slackPost object instance.

### slackPost.disableMarkdown()
- When disabled, will action Slack to avoid marking up post text with Markdown-like syntax.
- Method only applies only to the simple message format, which by default will be automatically marked up.
- Returns the current slackPost object instance.

### slackPost.setColor(color)
- Sets message left hand border color, which only applies to the advanced message format.
- `color` is given as a HTML color code (e.g. `#439fe0`) or one of `good`, `warning` or `danger`.
- Slack color names are also defined at `require('slackpost').COLOR_LIST`.
- If no `color` has been set by a call to `slackPost.setColor()` then `GOOD` will be used by default.
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
- If `enableMarkdown` is true, will action Slack Markdown-like formatting of given `preText`.
- When called, will enable the advanced message format.
- Returns the current slackPost object instance.

### slackPost.setAuthor(name[,authorURL][,iconURL])
- Sets a small display section at the top of the message for the post author.
- Optional `authorURL` allows setting of a URL for the author (will link both the `name` and `iconURL` within the rendered Slack post).
- Optional `iconURL` will set a small 16x16px image to the left of the author `name`.
- When called, will enable the advanced message format.
- Returns the current slackPost object instance.

### slackPost.setTitle(title[,URL])
- Sets a `title`, in bold text near the top of the message area.
- Optional `URL` allows for the title to be hyperlinked.
- When called, will enable the advanced message format.
- Returns the current slackPost object instance.

### slackPost.setRichText(richText[,enableMarkdown])
- Sets the `richText` (main text) for an advanced message post.
	- Content will automatically collapse if it contains 700+ characters or 5+ linebreaks, and will display a "Show more..." link to expand the content.
- If `enableMarkdown` is true, will action Slack Markdown-like formatting of given `richText`.
- When called, will enable the advanced message format.
- Returns the current slackPost object instance.

### slackPost.addField(title,value[,isShort])
- Adds message meta data in a tabular format at the footer of the message area. Method can be called multiple times to add multiple field items to the rendered table.
- Optional `isShort` boolean controls if field data is considered short enough to allow side-by-side tabular display with the following/next field item, otherwise field `title`/`value` will consume its own full table row.
- When called, will enable the advanced message format.
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
- When called, will action Slack to markup field item values added via [`slackPost.addField()`](#slackpostaddfieldtitlevalueisshort) with Markdown-like syntax.
- Method only applies to the advanced message format with one or more fields created.
- Returns the current slackPost object instance.

### slackPost.setThumbnail(URL)
- Provides a public URL to an image that will be displayed as a thumbnail on the right side of an advanced message.
- Image formats of GIF, JPEG, PNG, and BMP are supported.
- When called, will enable the advanced message format.
- Returns the current slackPost object instance.

### slackPost.setImage(URL)
- Provides a public URL to an image that will be displayed as an image inside the message area.
- Image formats of GIF, JPEG, PNG, and BMP are supported.
- Large images will be resized to a maximum width of 400px or a maximum height of 500px - whilst maintaining aspect ratio.
- When called, will enable the advanced message format.
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
	'https://hooks.slack.com/services/ABCDEF012/012345ABC/fjdke456HRekdftFOGRPh21s',
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
	'https://hooks.slack.com/services/ABCDEF012/012345ABC/fjdke456HRekdftFOGRPh21s',
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
