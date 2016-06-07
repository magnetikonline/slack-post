'use strict';

let assert = require('assert'),
	slackPost = require('../index.js'),

	TEST_WEB_HOOK_URL = 'https://hooks.slack.com/services/ABCDEF012/012345ABC/fjdke456HRekdftFOGRPh21s',
	TEST_CHANNEL = '#test-channel',
	TEST_CHANNEL_DIRECT_MESSAGE = '@magnetikonline';


{
	assert.doesNotThrow(
		() => {

			slackPost.post(TEST_WEB_HOOK_URL);
		},
		Error,
		'Calling slackPost.post() with valid webhook URL should not throw an error'
	);

	assert.throws(
		() => {

			slackPost.post('https://invalid-hook.com/');
		},
		Error,
		'Calling slackPost.post() with invalid webhook URL should throw an error'
	);
}


{
	let RETURN_SELF_METHOD_LIST = [
			'setUsername','setChannel','setIconEmoji','setIconURL','enableUnfurlLinks',
			'disableMarkdown','setColor','setPreText','setAuthor','setTitle','setRichText',
			'addField','enableFieldMarkdown','setThumbnail','setImage'
		],
		testPost = slackPost.post(TEST_WEB_HOOK_URL);

	RETURN_SELF_METHOD_LIST.forEach((methodName) => {

		// the setChannel() method expects a valid first parameter - lets mock one
		let param;
		if (methodName == 'setChannel') {
			param = TEST_CHANNEL;
		}

		assert(
			testPost[methodName](param) === testPost,
			'Calling method testPost.' + methodName + '() should return itself to allow method chaining'
		);
	});
}


{
	let TEST_POST_TEXT = 'This is my testing post text',
		testPost = slackPost.post(TEST_WEB_HOOK_URL,TEST_POST_TEXT),
		payload;

	assert(
		testPost.webhookURL == TEST_WEB_HOOK_URL,
		'testPost.webhookURL should equal given constructor web hook URL'
	);

	payload = testPost.buildPayload();

	assert(
		payload.text == TEST_POST_TEXT,
		'Simple message post text not defined in API request payload'
	);

	assert(
		payload.mrkdwn === undefined,
		'Simple message Markdown rendering toggle should not be set by default'
	);

	assert(
		payload.attachments === undefined,
		'Simple message post format API request payload should not define an attachments attribute'
	);

	testPost.disableMarkdown();
	payload = testPost.buildPayload();

	assert(
		payload.mrkdwn === false,
		'Simple message Markdown rendering toggle should be set to disabled'
	);
}


{
	let TEST_USERNAME = 'magnetikonline',
		TEST_ICON_EMOJI = 'smile',
		TEST_ICON_URL = 'http://domain.com/my-icon.png',
		testPost,
		payload;

	function createPost() {

		testPost = slackPost.post(TEST_WEB_HOOK_URL);
	}

	createPost();
	payload = testPost.buildPayload();

	assert(
		payload.username === undefined,
		'Post message username override should not be defined for an API request payload by default'
	);

	assert(
		payload.channel === undefined,
		'Post message destination channel override should not be defined for an API request payload by default'
	);

	assert(
		payload.icon_emoji === undefined,
		'Post message bot icon emoji override should not be defined for an API request payload by default'
	);

	assert(
		payload.icon_url === undefined,
		'Post message bot icon public image URL override should not be defined for an API request payload by default'
	);

	assert(
		payload.unfurl_links === undefined,
		'Unfurling of embedded post URLs should not be defined for an API request payload by default'
	);

	createPost();
	testPost.setUsername(TEST_USERNAME);
	payload = testPost.buildPayload();

	assert(
		payload.username == TEST_USERNAME,
		'Post message username override is not defined for generated API request payload'
	);

	createPost();

	assert.throws(
		() => {

			testPost.setChannel('invalid-channel-format');
		},
		Error,
		'Calling testPost.setChannel() with an invalid channel identifier (does not start with "#" or "@") should throw an error'
	);

	assert.throws(
		() => {

			testPost.setChannel('#channel with spaces');
		},
		Error,
		'Calling testPost.setChannel() with a channel identifier containing spaces should throw an error'
	);

	assert.doesNotThrow(
		() => {

			testPost.setChannel(TEST_CHANNEL);
		},
		Error,
		'Calling testPost.setChannel() with a valid channel name should not throw an error'
	);

	assert.doesNotThrow(
		() => {

			testPost.setChannel(TEST_CHANNEL_DIRECT_MESSAGE);
		},
		Error,
		'Calling testPost.setChannel() with a valid direct message username should not throw an error'
	);

	createPost();
	testPost.setChannel(TEST_CHANNEL);
	payload = testPost.buildPayload();

	assert(
		payload.channel == TEST_CHANNEL,
		'Post message channel override not defined/valid for generated API request payload'
	);

	createPost();
	testPost.setIconEmoji(TEST_ICON_EMOJI);
	payload = testPost.buildPayload();

	assert(
		payload.icon_emoji == (':' + TEST_ICON_EMOJI + ':'),
		'Post message bot icon emoji override not defined/valid for generated API request payload'
	);

	createPost();
	testPost.setIconURL(TEST_ICON_URL);
	payload = testPost.buildPayload();

	assert(
		payload.icon_url == TEST_ICON_URL,
		'Post message bot icon public image URL override not defined/valid for generated API request payload'
	);

	createPost();
	testPost.setIconEmoji(TEST_ICON_EMOJI);
	testPost.setIconURL(TEST_ICON_URL);
	payload = testPost.buildPayload();

	assert(
		(payload.icon_emoji == (':' + TEST_ICON_EMOJI + ':')) &&
		(payload.icon_url === undefined),
		'When post message bot icon emoji and URL overrides are both set, icon emoji should be defined for generated API request payload'
	);

	createPost();
	testPost.enableUnfurlLinks();
	payload = testPost.buildPayload();

	assert(
		payload.unfurl_links === true,
		'Post message unfurl links option not enabled for generated API request payload'
	);
}


{
	let TEST_FALLBACK_TEXT = 'This is my testing fall back text',
		TEST_PRE_TEXT = 'This is my pre-text message',
		TEST_SIDE_COLOR = '#f00',
		TEST_AUTHOR_NAME = 'Peter Mescalchin',
		TEST_AUTHOR_URL = 'http://magnetikonline.com',
		TEST_AUTHOR_ICON_URL = 'http://magnetikonline.com/img/favicon.png',
		TEST_POST_TITLE = 'My post title',
		TEST_POST_TITLE_URL = 'https://slack.com/',
		TEST_POST_RICH_TEXT = 'This is my advanced post rich text',
		TEST_FIELD_TITLE = 'Field title',
		TEST_FIELD_VALUE = 'Field value',
		TEST_THUMBNAIL_URL = 'http://domain.com/thumbnail.gif',
		TEST_IMAGE_URL = 'http://domain.com/image.gif',
		testPost,
		payload,
		payloadAttachments;

	function createPost() {

		testPost = slackPost.post(TEST_WEB_HOOK_URL,TEST_FALLBACK_TEXT);
	}

	function assertAttachmentsAttribute(message) {

		assert(
			Array.isArray(payload.attachments) &&
			(payload.attachments.length == 1),
			message
		);
	}

	createPost();
	testPost.setPreText(TEST_PRE_TEXT);
	payload = testPost.buildPayload();

	assertAttachmentsAttribute('Advanced message post API request payload should define an attachments attribute when pre-text is defined');

	assert(
		payload.attachments[0].color == 'good',
		'Advanced message post API request payload should define the default color as "good"'
	);

	assert(
		payload.attachments[0].fallback == TEST_FALLBACK_TEXT,
		'Advanced message post API request payload should use the constructor post text as the fall back text'
	);

	assert(
		payload.attachments[0].pretext == TEST_PRE_TEXT,
		'Advanced message post pre text not defined/valid for API request payload'
	);

	assert(
		payload.attachments[0].mrkdwn_in === undefined,
		'Advanced message post Markdown rendering of pre text should be undefined for API request payload'
	);

	testPost.setColor(TEST_SIDE_COLOR);
	testPost.setPreText(TEST_PRE_TEXT,true);
	payload = testPost.buildPayload();

	assert(
		payload.attachments[0].color == TEST_SIDE_COLOR,
		'Advanced message post custom sidebar color not defined/valid for API request payload'
	);

	assert.deepEqual(
		payload.attachments[0].mrkdwn_in,['pretext'],
		'Advanced message post Markdown rendering of pre text should be enabled for API request payload'
	);

	createPost();
	testPost.setAuthor(TEST_AUTHOR_NAME);
	payload = testPost.buildPayload();

	assertAttachmentsAttribute('Advanced message post API request payload should define an attachments attribute when post author is defined');

	assert(
		payload.attachments[0].author_name == TEST_AUTHOR_NAME,
		'Advanced message post author name not defined/valid for API request payload'
	);

	assert(
		(payload.attachments[0].author_link === undefined) &&
		(payload.attachments[0].author_icon === undefined),
		'Advanced message post author URL & icon should both be undefined when not defined for API request payload'
	);

	testPost.setAuthor(TEST_AUTHOR_NAME,TEST_AUTHOR_URL);
	payload = testPost.buildPayload();

	assert(
		payload.attachments[0].author_link == TEST_AUTHOR_URL,
		'Advanced message post author URL not defined/valid for API request payload'
	);

	assert(
		payload.attachments[0].author_icon === undefined,
		'Advanced message post author icon should be undefined when not defined for API request payload'
	);

	testPost.setAuthor(TEST_AUTHOR_NAME,TEST_AUTHOR_URL,TEST_AUTHOR_ICON_URL);
	payload = testPost.buildPayload();

	assert(
		payload.attachments[0].author_icon == TEST_AUTHOR_ICON_URL,
		'Advanced message post author icon URL not defined/valid for API request payload'
	);

	createPost();
	testPost.setTitle(TEST_POST_TITLE);
	payload = testPost.buildPayload();

	assertAttachmentsAttribute('Advanced message post API request payload should define an attachments attribute when post title is defined');

	assert(
		payload.attachments[0].title == TEST_POST_TITLE,
		'Advanced message post title not defined/valid for API request payload'
	);

	assert(
		payload.attachments[0].title_link === undefined,
		'Advanced message post title URL should be undefined when not defined for API request payload'
	);

	testPost.setTitle(TEST_POST_TITLE,TEST_POST_TITLE_URL);
	payload = testPost.buildPayload();

	assert(
		payload.attachments[0].title_link == TEST_POST_TITLE_URL,
		'Advanced message post title URL not defined/valid for API request payload'
	);

	createPost();
	testPost.setRichText(TEST_POST_RICH_TEXT);
	payload = testPost.buildPayload();

	assertAttachmentsAttribute('Advanced message post API request payload should define an attachments attribute when post rich text is defined');

	assert(
		payload.attachments[0].text == TEST_POST_RICH_TEXT,
		'Advanced message post rich text not defined/valid for API request payload'
	);

	assert(
		payload.attachments[0].mrkdwn_in === undefined,
		'Advanced message post Markdown rendering of rich text should be undefined for API request payload'
	);

	testPost.setRichText(TEST_POST_RICH_TEXT,true);
	payload = testPost.buildPayload();

	assert.deepEqual(
		payload.attachments[0].mrkdwn_in,['text'],
		'Advanced message post Markdown rendering of rich text should be enabled for API request payload'
	);

	createPost();
	testPost.addField(TEST_FIELD_TITLE,TEST_FIELD_VALUE);
	testPost.addField(TEST_FIELD_TITLE,TEST_FIELD_VALUE,true);
	testPost.addField(TEST_FIELD_TITLE,TEST_FIELD_VALUE);
	payload = testPost.buildPayload();

	assertAttachmentsAttribute('Advanced message post API request payload should define an attachments attribute when message meta data/fields are defined');

	assert.deepEqual(
		payload.attachments[0].fields,
		[
			{ title: 'Field title',value: 'Field value',short: false },
			{ title: 'Field title',value: 'Field value',short: true },
			{ title: 'Field title',value: 'Field value',short: false }
		],
		'Advanced message post expected fields structure not defined for API request payload'
	);

	assert(
		payload.attachments[0].mrkdwn_in === undefined,
		'Advanced message post Markdown rendering of fields should be undefined for API request payload'
	);

	testPost.enableFieldMarkdown();
	payload = testPost.buildPayload();

	assert.deepEqual(
		payload.attachments[0].mrkdwn_in,['fields'],
		'Advanced message post Markdown rendering of fields should be enabled for API request payload'
	);

	createPost();
	testPost.setThumbnail(TEST_THUMBNAIL_URL);
	payload = testPost.buildPayload();

	assertAttachmentsAttribute('Advanced message post API request payload should define an attachments attribute when thumbnail URL is defined');

	assert(
		payload.attachments[0].thumb_url == TEST_THUMBNAIL_URL,
		'Advanced message post thumbnail URL not defined/valid for API request payload'
	);

	createPost();
	testPost.setImage(TEST_IMAGE_URL);
	payload = testPost.buildPayload();

	assertAttachmentsAttribute('Advanced message post API request payload should define an attachments attribute when image URL is defined');

	assert(
		payload.attachments[0].image_url == TEST_IMAGE_URL,
		'Advanced message post image URL not defined/valid for API request payload'
	);

	createPost();
	testPost.setThumbnail(TEST_THUMBNAIL_URL);
	testPost.setImage(TEST_IMAGE_URL);
	payload = testPost.buildPayload();

	assert(
		(payload.attachments[0].thumb_url == TEST_THUMBNAIL_URL) &&
		(payload.attachments[0].image_url === undefined),
		'When advanced message post thumbnail and image URL are both set, thumbnail URL should be defined for generated API request payload'
	);
}
