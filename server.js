var http				= require('http'),
		cv					= require('./lib/cv'),
		jsdom				= require('jsdom'),
		url					= require("url"),
		qs 					= require('querystring'),
		_						=	require('underscored'),
		utils				=	require('./lib/utils'),
		builder			=	require('./lib/builder'),
		config 			= require('./lib/config')
		M25 				= require('./lib/M25');


var m25 = new M25.Route({
	'/': 						{ get: serveIndex },
	'/admin': 			{ get: serveAdmin },
	'/admin-save': 	{ post: adminSave }
});

var server = http.createServer(function (req, res) {
	m25.transport(req, res, function (err) {

		if (err) {
			throw err;
		}

	});

});


function adminSave() {
	var self = this;
	var POST = '';

	self.res.writeHead(200, {'Content-type': 'text/html'});

	self.req.on('data', function (chunk){
		POST += chunk;
	})
	.on('end', function () {

		// do something with the data and send a thank you page
		// validate the data
		var formData	= qs.parse(POST.toString());
		var keys			= _.keys(formData);
		var values		= _.values(formData);

		// console.log('formData field1: ' + formData.field1);
		// console.log('formData field2: ' + formData.field1);
		// console.log('keys: ' + keys);
		// console.log('values: ' + values);
		// console.log('first value by key: ' + formData[keys[0]]);

		self.res.end(POST.toString());

	});
}


function serveIndex() {
	var self = this;

	cv.load(config.settings.cv.id, function (err, data) {

		if (err) {
			throw err;
		}

		var pageProperties = new config.settings.pageProperties;
		pageProperties.root = __dirname;
		pageProperties.data = data;
		pageProperties.fragments.masthead.data = data.socialLinks;

		builder.homepage(pageProperties, function (err, html) {

			if (err) {
				throw err;
			}

			self.res.writeHead(200, utils.getMIME(pageProperties.fragments.main.path));
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

		var pageProperties = new config.settings.pageProperties;
		pageProperties.root = __dirname;
		pageProperties.fragments.main.path = '/public/controls/admin.html';

		builder.admin(pageProperties, function (err, html) {

			if (err) {
				throw err;
			}

			self.res.writeHead(200, utils.getMIME(pageProperties.fragments.main.path));
			self.res.end(html);

		});

	//});

}

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

