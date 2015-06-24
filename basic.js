var casper = require('casper').create();

// Start at this page ->
casper.start('http://www.ncaa.com');

// Casper will proceed to the next then() statement once the remote page hits DOM-ready
// unless you ask it to wait for something else to happen, such as the presence of a selector ->
casper.waitForSelector('a#widget-all-scores');


// Our scoreboard widget is rendered by Handlebars some time after DOM-ready. the wait statement
// above was necessary to ensure Casper runs the following code once the scoreboard widget has
// rendered (#widget-all-scores is an element on the Handlebars template so it is a good thing to
// use to detect that the scoreboard is present and ready to interact with) ->
casper.then(function () {
	// note that "this" context within casper callbacks is always the casper object
	// itself, eg. this.click === casper.click
	this.echo(this.getTitle());
	this.click('a#widget-all-scores');

	// Since we asked Casper to click a link that will trigger a new page load (ie. navigating
	// away from the NCAA homepage we started on), it's not likely you have anything else to do
	// on this step (then() method). Another step is needed so that Casper knows to wait for the
	// next page to load before proceeding.
});

// Once the next page has loaded, print its title ->
casper.then(function () {
	this.echo(this.getTitle());
});

casper.run(); // run() method comes at the end of your steps

// *** For demo purposes only: silence console.log()s from
//     the remote pages phantom.js is hitting. usually you
//     want to see these!                                
casper.on('remote.message', function () {});