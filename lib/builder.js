/*
	##################################################
		This module will be in charge of building UIs
	##################################################
*/

var jsdom		= require('jsdom'),
		utils		=	require('../lib/utils'),
		plates	= require('plates'),
		jquery	=	'./lib/jquery.js';


/*
	private functions
*/

function header(config, map, callback) {

	utils.fileContentsText(config.root + config.filePaths.header, function (err, headerTemplate) {

		if (err) {
			return callback(err);
		}

		callback(null, headerTemplate);

	});

}


function masthead(config, map, callback) {

	utils.fileContentsText(config.root + config.filePaths.masthead, function (err, mastheadTemplate) {

		if (err) {
			return callback(err);
		}

		var window = jsdom.jsdom().createWindow();

		jsdom.jQueryify(window, jquery, function() {

			var $masthead = window.$(mastheadTemplate);

			if (config.data) {

				map.class('link')
					.to('name')
						.where('href')
							.is('/')
								.insert('url');

				var $socialLinks 	= $masthead.find('#socialLinks')
				var updated_socialLinks = plates.bind($socialLinks.html(), config.data.socialLinks, map);

				$socialLinks.html(updated_socialLinks);

			}

			var output_template = $masthead.wrap('<div />').parent().html();

		  callback(null, output_template);

		});

	});

}


function footer(config, map, callback) {

	utils.fileContentsText(config.root + config.filePaths.footer, function (err, footerTemplate) {

		if (err) {
			return callback(err);
		}

		callback(null, footerTemplate);

	});

}


function scripts(config, map, callback) {

	utils.fileContentsText(config.root + config.filePaths.scripts, function (err, scriptTemplate) {

		if (err) {
			return callback(err);
		}

		callback(null, scriptTemplate);

	});

}


function main(config, callback) {

	utils.fileContentsText(config.root + config.filePaths.main, function (err, mainTemplate) {

		if (err) {
			return callback(err);
		}

		callback(null, mainTemplate);

	});

}


/*
	public functions
*/

exports.page = function(req, res, config, callback) {

	var map = plates.Map();

	main(config, function (err, mainTemplate) {

		if (err) {
			return callback(err);
		}

		header(config, map, function (err, headerTemplate) {

			if (err) {
				return callback(err);
			}

			masthead(config, map, function (err, mastheadTemplate) {

				if (err) {
					return callback(err);
				}

				scripts(config, map, function (err, scriptTemplate) {

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

						res.writeHead(200, utils.getMIME(config.filePaths.main)); // get MIME from file ext of main index file
						callback(null, "<!DOCTYPE html>\n<html>" + output + '</html>');

					}); // end jsdom.jQueryify

			  }); // end script load

			}); // end masthead load

		}); // end header load

	}); // end main load

} // end export page


exports.admin = function (req, res, config, callback) {

	var map = plates.Map();

	main(config, function (err, mainTemplate) {

		if (err) {
			return callback(err);
		}

		header(config, map, function (err, headerTemplate) {

			if (err) {
				return callback(err);
			}

			masthead(config, map, function (err, mastheadTemplate) {

				if (err) {
					return callback(err);
				}

				scripts(config, map, function (err, scriptTemplate) {

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

						res.writeHead(200, utils.getMIME(config.filePaths.main));
						callback(null, "<!DOCTYPE html>\n<html>" + output + '</html>');

					}); // end jsdom.jQueryify

			  }); // end script load

			}); // end masthead load

		}); // end header load

	}); // end main load
}


exports.getCv = function (req, res, callback) {

}

