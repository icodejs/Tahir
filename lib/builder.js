var jsdom		= require('jsdom'),
		utils		=	require('../lib/utils'),
		plates	= require('plates'),
		jquery	=	'./lib/jquery.js';


/*
	private functions
*/

function fragmentBuilder(mapper, callback) {

	var _mapper = mapper || {
		root: '',
		map: null,
		data: null,
		path: '',
		mapFunction: null
	};

	utils.fileContentsText(_mapper.root + _mapper.path, function (err, fragmentHTML) {

		if (err) {
			return callback(err);
		}

		if (_mapper.map && _mapper.mapFunction && _mapper.data) {

			_mapper.template = fragmentHTML

			_mapper.mapFunction(_mapper, function(err, mappedHTML) {

				if (err) {
					callback(err);
				}

				callback(null, mappedHTML);

			});

		} else {
			callback(null, fragmentHTML);
		}

	});

}


function mastheadMapper(mapper, callback) {

		var window = jsdom.jsdom().createWindow();

		jsdom.jQueryify(window, jquery, function() {

			var $masthead = window.$(mapper.template);

			mapper.map.class('link')
				.to('name')
					.where('href')
						.is('/')
							.insert('url');

			var $socialLinks 	= $masthead.find('#socialLinks')
			var updated_socialLinks = plates.bind($socialLinks.html(), mapper.data.socialLinks, mapper.map);

			$socialLinks.html(updated_socialLinks);

		  callback(null, $masthead.wrap('<div />').parent().html());

		});

}


/*
	public functions
*/

exports.page = function(config, callback) {

	var map = plates.Map();

	// main
	fragmentBuilder({ root: config.root, path: config.filePaths.main }, function (err, mainTemplate) {

		if (err) {
			return callback(err);
		}

		// header
		fragmentBuilder({ root: config.root, path: config.filePaths.header }, function (err, headerTemplate) {

			if (err) {
				return callback(err);
			}

			// masthead
			fragmentBuilder({ root: config.root, map: map, data: config.data, path: config.filePaths.masthead, mapFunction: mastheadMapper}, function (err, mastheadTemplate) {

				if (err) {
					return callback(err);
				}

				// scripts
				fragmentBuilder({ root: config.root, path: config.filePaths.scripts }, function (err, scriptTemplate) {

					if (err) {
						return callback(err);
					}

					var window = jsdom.jsdom().createWindow();

					jsdom.jQueryify(window, jquery, function() {

					  map.where('class')
					  	.is('name')
					  		.use('name')
					  			.where('class')
					  				.is('url')
					  					.use('url');

						window.$('html').html(mainTemplate);
						window.$('head').html(headerTemplate);
			      window.$('title').text(config.data.fullname + ': ' + config.data.position);
			      window.$('#masthead').html(mastheadTemplate);

						var $experiences = window.$('#experiences');
						$experiences.html(plates.bind($experiences.html(), config.data.experience, map));

						var output = window.$('html').html() + scriptTemplate;

						callback(null, "<!DOCTYPE html>\n<html>" + output + '</html>');

					}); // end jsdom.jQueryify

			  }); // end script load

			}); // end masthead load

		}); // end header load

	}); // end main load

} // end export page


exports.admin = function (config, callback) {

	var map = plates.Map();

	// main
	fragmentBuilder({ root: config.root, path: config.filePaths.main }, function (err, mainTemplate) {

		if (err) {
			return callback(err);
		}

		// header
		fragmentBuilder({ root: config.root, path: config.filePaths.header }, function (err, headerTemplate) {

			if (err) {
				return callback(err);
			}

			// masthead
			fragmentBuilder({ root: config.root, map: map, data: config.data, path: config.filePaths.masthead, mapFunction: mastheadMapper}, function (err, mastheadTemplate) {

				if (err) {
					return callback(err);
				}

				// scripts
				fragmentBuilder({ root: config.root, path: config.filePaths.scripts }, function (err, scriptTemplate) {

					if (err) {
						return callback(err);
					}

					var window = jsdom.jsdom().createWindow();

					jsdom.jQueryify(window, jquery, function() {

						window.$('html').html(mainTemplate);
						window.$('head').html(headerTemplate);
			      window.$('title').text('Admin page');
			      window.$('#masthead').html(mastheadTemplate);

						var output = window.$('html').html() + scriptTemplate;

						callback(null, "<!DOCTYPE html>\n<html>" + output + '</html>');

					}); // end jsdom.jQueryify

			  }); // end script load

			}); // end masthead load

		}); // end header load

	}); // end main load
}


exports.getCv = function (req, res, callback) {

}

/**
 * 	This module will be in charge of building UIs
 */
