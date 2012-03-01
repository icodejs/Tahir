var jsdom = require('jsdom'),
		plates = require('plates'),
		events = require('events'),
		fs = require('fs'),
		jquery = './lib/jquery.js';


/*
	private functions
*/

function getFragment(_fragment, callback) {
	// add a check to check whether the file exists
	fs.readFile(_fragment.root + _fragment.item.path, 'utf-8', function (err, fragmentHTML) {

		if (err) {
			return callback(err);
		}

		if (_fragment.map && _fragment.item.mapFunction && _fragment.item.data) {

			_fragment.template = fragmentHTML;
			_fragment.item.mapFunction(_fragment, function (err, mappedHTML) {

				if (err) {
					return callback(err);
				}

				callback(null, _fragment.key, mappedHTML);

			});

		} else {
			callback(null, _fragment.key, fragmentHTML);
		}

	});

} // end getFragment

function fragmentBuilder(fc, callback) {
	// clean this up to use some kind of flow control
	var _fragments = {},
		eventsEmitter = new events.EventEmitter(),
		fragmentCount = Object.keys(fc.fragments).length,
		_key;

	for (_key in fc.fragments) {

		if (fc.fragments.hasOwnProperty(_key)) {

			var frag = fc.fragments[_key];

			getFragment({
				root: fc.root,
				map: fc.map,
				item: frag,
				key: _key
			}, function (err, key, htmlTemplate) {

				if (err) {
					return callback(err);
				} else {

					_fragments[key] = htmlTemplate;

					fragmentCount -= 1;

					if (fragmentCount === 0) {
						eventsEmitter.emit('complete');
					}

				}

			});

			eventsEmitter.on('complete', function () {
				callback(null, _fragments);
			});

		}

	}

}

function mastheadMapper(fragment, callback) {
	var window = jsdom.jsdom().createWindow();

	jsdom.jQueryify(window, jquery, function () {

		var $masthead = window.$(fragment.template);

		fragment.map.class('link').to('name').where('href').is('/').insert('url');

		var $socialLinks = $masthead.find('#socialLinks'),
			updated_socialLinks = plates.bind($socialLinks.html(), fragment.item.data, fragment.map);

		$socialLinks.html(updated_socialLinks);

		callback(null, $masthead.wrap('<div />').parent().html());

	});

}

function homepage(config, callback) {
	var map = plates.Map();

	/**
	 * 	Augment the config with additional data
	 */

	config.map = map;
	config.fragments.masthead.mapFunction = mastheadMapper;

	/**
	 * 	Call fragmentBuilder and pass in config and return a HTML
	 *	fragment including any additional template mapping.
	 */

	fragmentBuilder(config, function (err, htmlFragments) {

		if (err) {
			return callback(err);
		}

		/**
		 * 	Use jQuerify to manipulate the return HTML
		 */

		var window = jsdom.jsdom().createWindow();

		jsdom.jQueryify(window, jquery, function () {

			/**
			 * 	Use Flatiron plates to set how you want the template
			 *	to be mapped.
			 */

			// this mapping is only here for testing and will be replace with
			// a main content section that will have it's own mapping functin
			// depending on what page we are on.
			map.where('class').is('name').use('name').where('class').is('url').use('url');

			window.$('html').html(htmlFragments.main);
			window.$('head').html(htmlFragments.header);
			window.$('title').text(config.data.fullname + ': ' + config.data.position);
			window.$('#masthead').html(htmlFragments.masthead);

			// this mapping logic will also be removed and placed into function
			// for mapping main conent
			var $experiences = window.$('#experiences');
			$experiences.html(plates.bind($experiences.html(), config.data.experience, map));

			/**
			 * 	Strip off the enclosing HTML tags and insert the script tags
			 *	then add the doc type and re-enclose the output with HTML tags.
			 */

			var output = window.$('html').html() + htmlFragments.scripts;

			callback(null, "<!DOCTYPE html>\n<html>" + output + '</html>');

		}); // end jsdom.jQueryify
	}); // end fragment builder
} // end export page

function admin(config, callback) {
	/**
	 * 	Augment the config with additional data
	 */

	var map = plates.Map();
	config.map = map;

	/**
	 * 	Send the data off and return a HTML fragment with
	 *	any additional mapping.
	 */

	fragmentBuilder(config, function (err, htmlFragments) {

		if (err) {
			return callback(err);
		}

		var window = jsdom.jsdom().createWindow();

		/**
		 * 	Use jQuerify to manipulate the return HTML
		 */

		jsdom.jQueryify(window, jquery, function () {

			window.$('html').html(htmlFragments.main);
			window.$('head').html(htmlFragments.header);
			window.$('title').text('Admin page');
			window.$('#masthead').html(htmlFragments.masthead);

			/**
			 * 	Strip off the enclosing HTML tags and insert the script tags
			 *	then add the doc type and re-enclose the output with HTML tags.
			 */

			var output = window.$('html').html() + htmlFragments.scripts;

			callback(null, "<!DOCTYPE html>\n<html>" + output + '</html>');

		});

	});

}


exports.homepage = homepage;
exports.admin = admin;


/**
 * 	This module will be in charge of building UIs
 */