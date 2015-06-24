// When you're writing a casper test suite, the casper object is automatically
// injected into the page so you do not have to require->create your own:
// var casper = require('casper').create();
casper.test.begin('The schools autocomplete should be fully functional', 7, function schoolAutocomplete(test) { // each case is wrapped in casper.test.begin()
	//            ^-- stated goal of this test                           ^-- # of assert tests          ^-- "test" class is passed into the suite

	// Inside the test case, you write a casper sequence just like you
	// would outside of the test case:
	casper.start('http://www.ncaa.com');

	casper.then(function () {
		test.assertTitleMatch(/^ncaa\.com/i, 'The NCAA.com homepage loaded and is titled correctly.');
		test.assertExists('.ncaa-nav-primary', 'The NCAA.com primary nav parent element exists.');
		test.assertNotVisible('.school_nav.content-panel', 'The "Schools" dropdown is closed by default.');

		// Simulating mouseover/hover events in Phantom is tricky & unreliable so we are going to force the dropdown open
		// manually...
		this.evaluate(function () {
			jQuery('.school_nav.content-panel').show(); // We know jQuery is loaded in the remote DOM
		});
	});

	casper.waitUntilVisible('.school_nav.content-panel');

	casper.then(function () {
		// According to the DOM, the school dropdown should now be visible, so let's assert that
		test.assertVisible('.school_nav.content-panel', 'The "Schools" dropdown is visible after opening.');

		// I'll believe it when I see it though...
		this.captureSelector('captures/schools-nav-open.png', '.school_nav.content-panel');

		test.assertVisible('.ui-widget.search-schools', 'The jQuery UI autocomplete search field is visible after opening the dropdown.');

		// Casper provides this sendKeys() method to send keyboard events to the remote page.
		// We need to type into the autocomplete field to trigger jQuery UI to fetch results. 
		//
		// Note that this.fill() is for filling out forms, it does not necessarily send any DOM
		// events. jQuery UI is listening for a keyup/keydown event so fill() was not appropriate
		// for this case.
		this.sendKeys('#school-search-term', 'Geor', { keepFocus: true });
	});

	casper.waitUntilVisible('.ui-autocomplete.ui-menu.ui-widget'); // wait a moment for jQuery UI animations to play

	casper.then(function () {
		test.assertVisible('.ui-autocomplete.ui-menu.ui-widget', 'The JQuery UI autocomplete results drawer is visible after filling the autocomplete box.');

		test.assertEval(function () {
			return (jQuery('.ui-autocomplete.ui-menu.ui-widget li.ui-menu-item').length >= 1);
		}, 'There is at least one autocomplete result.');

		this.capture('captures/schools-autocomplete-open.png');
	});

	casper.run(function () {
		test.done();
	});
});

// *** For demo purposes only: silence console.log()s from
//     the remote pages phantom.js is hitting. usually you
//     want to see these! 
casper.on('remote.message', function () {});