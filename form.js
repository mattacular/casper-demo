var casper = require('casper').create();

casper.echo('Loading user login screen...', 'INFO');
casper.start('http://qa.ncaa.com/user');

// wait for the login form to render before we proceed
casper.waitForSelector('form#user-login');

casper.then(function () {
	this.echo('Logging in as "jeditor"...', 'INFO');

	// casper.fill() uses "name" attributes. if you need to fill out a bad form that
	// doesn't use them for some reason, Casper provides an alternate fillSelectors()
	// method that is CSS selector based.
	this.fill('form#user-login', {
		name: 'jeditor',
		pass: 'jeditor'
	}, true); // <-- true tells fill() to submit the form after filling it out

	// just like when we used casper.click() in the previous example, submitting the form
	// is going to cause a new page load so it's necessary to break out of this step and
	// use a wait method to schedule the next step where we will work on the new page
	// that the form submission redirects us to.
});

casper.waitForUrl(/\/users\/jeditor/);

casper.then(function () {
	this.echo('Title:\t' + this.getTitle());
	this.echo('URL:\t' + this.getCurrentUrl());

	this.echo('Navigating to article create page...', 'INFO');
	this.open('http://qa.ncaa.com/node/add/article'); // use open() to navigate to new pages by URL
});

casper.waitForUrl(/node\/add\/article/);

casper.then(function () {
	this.echo('Title:\t' + this.getTitle());
	this.echo('URL:\t' + this.getCurrentUrl());
});

casper.run();