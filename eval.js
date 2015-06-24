var casper = require('casper').create(),
	utils = require('utils');

casper.echo('Loading school page...');

casper.start('http://www.ncaa.com/schools/georgia-tech');

// capture the whole page ->
casper.then(function () {
	var field = 'context',
		context;

	this.echo('Evaluating school page...');

	// Suppose we want to inspect the Drupal.settings object on this page.
	// The "field" and "remoteContext" variables are being used to demonstrate
	// that data can be shared between Casper <-> the remote DOM using
	// casper.evaluate():
	context = this.evaluate(function (field, context) {

		if (Drupal.settings.ncaa[field]) {
			// whatever you return from this function will be
			// relayed back as the return from casper.evaluate()
			return Drupal.settings.ncaa[field];
		}

		return false;
	}, field); 
	// `-- Variables that you use in your remotely evaluated function need 
	//     to be passed through like so


	// Casper comes with a utility class "utils", 
	// @see: http://casperjs.readthedocs.org/en/latest/modules/utils.html
	utils.dump(context);
});

casper.run();

// *** For demo purposes only: silence console.log()s from
//     the remote pages phantom.js is hitting. usually you
//     want to see these! 
casper.on('remote.message', function () {});