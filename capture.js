var casper = require('casper').create();

casper.echo('Loading bracket page...');

// Start at this page ->
casper.start('http://www.ncaa.com/interactive-bracket/basketball-men/d1');

// The bracket page uses AJAX to load most of its content. Casper needs to be told how to wait
// for that to finish so it can trigger the next step (then() function). wait for that to finish ->
casper.waitUntilVisible('.game-set.championship.final');

// Capture the whole page ->
casper.then(function () {
	this.capture('captures/bracket-default.png');

	// launch a bracket popup by clicking one of the contest pods ->
	this.echo('Clicking final game...');
	this.click('.game-set.championship.final .game-cell');

	// the first time a popup is requested, two JSON feeds get AJAXed in before it can render the popup
	// and the video recap portion. Even once those feeds are present, an animation plays before the popup
	// is fully visible. Since we want to take a screenshot of it fully rendered, we need to account for all
	// three of these things using wait methods.
});

// Wait until the popup is visible ->
casper.waitUntilVisible('#bracket-popup');

// Wait until the recap gets AJAXed in ->
casper.waitUntilVisible('#bracket-popup-recap .story');

// Wait for the animations to play ->
casper.wait(2000);

// Capture the bracket popup container only ->
casper.then(function () {
	this.capture('captures/bracket-with-popup.png');
	this.captureSelector('captures/bracket-banner.png', '.core-header-banner .core-header-image');
});

casper.run(); // run() method comes at the end of your steps

// *** For demo purposes only: silence console.log()s from
//     the remote pages phantom.js is hitting. usually you
//     want to see these! 
casper.on('remote.message', function () {});