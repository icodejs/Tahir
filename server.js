var http = require('http'),
		cv = require('./lib/cv'),
		jsdom = require('jsdom'),
		url = require("url"),
		qs = require('querystring'),
		underscored = require('underscored'),
		common = require('./lib/common'),
		builder = require('./lib/builder'),
		config = require('./lib/config'),
		M25 = require('./lib/M25');


function adminSave() {
	var self = this;

	self.res.writeHead(200, {
		'Content-type': 'text/html'
	});

	// do something with the data and send a thank you page
	// validate the data

	var keys = underscored.keys(self.body),
	 		values = underscored.values(self.body);

	console.log(self.body);


	self.res.end(self.body.fullname);

}


function serveIndex() {
	var self = this;

	cv.load(config.settings.cv.id, function (err, data) {

		if (err) {
			throw err;
		}

		var pageProperties = Object.create(config.settings.pageProperties());
		pageProperties.root = __dirname;
		pageProperties.data = data;
		pageProperties.fragments.masthead.data = data.socialLinks;

		builder.homepage(pageProperties, function (err, html) {

			if (err) {
				throw err;
			}

			self.res.writeHead(200, common.getMIME(pageProperties.fragments.main.path));
			self.res.end(html);

		});

	});

}

function serveAdmin() {
	var self = this;

	//cv.load(config.settings.cv.id, function (err, data) {
	// if (err) {
	// 	throw err;
	// }
	var pageProperties = Object.create(config.settings.pageProperties());
	pageProperties.root = __dirname;
	pageProperties.fragments.main.path = '/public/controls/admin.html';

	builder.admin(pageProperties, function (err, html) {

		if (err) {
			throw err;
		}

		self.res.writeHead(200, common.getMIME(pageProperties.fragments.main.path));
		self.res.end(html);

	});

	//});
}

var m25 = new M25.Route({
	'/': {
		get: serveIndex
	},
	'/admin': {
		get: serveAdmin
	},
	'/admin-save': {
		post: adminSave
	}
});

var server = http.createServer(function (req, res) {
	m25.transport(req, res, function (err) {

		if (err) {
			throw err;
		}

	});

});

// live
//server.listen(80);
// dev
server.listen(8080);
console.log('serving on 8080');


/**
 *	NOTES
 *	---------------------------------------------------------------------
 * 	1. Serving static files: -
 * 	help: https://gist.github.com/701407 or just use node static
 *
 *	2. http://www.nodebeginner.org/ for handling requests and routing them
 */

