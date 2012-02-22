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


function adminSave(req, res) {
	var POST = '';

	res.writeHead(200, {'Content-type': 'text/html'});

	req.on('data', function (chunk){
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

		res.end(POST.toString());

	});
}


function serveIndex(req, res) {

	cv.load(config.settings.cv.id, function (err, doc) {

		if (err) {
			throw err;
		}

		var config = {
			data: doc,
			filePaths: {
					main: '/public/controls/index.html',
					header: '/public/controls/header.html',
					masthead: '/public/controls/masthead.html',
					footer: '/public/controls/footer.html',
					scripts: '/public/controls/scripts.html'
				},
			root: __dirname
		};

		builder.page(req, res, config, function (err, html) {

			if (err) {
				throw err;
			}

			res.end(html);

		});

	});

}

function serveAdmin(req, res) {

	//cv.load(config.settings.cv.id, function (err, doc) {

		// if (err) {
		// 	throw err;
		// }

		var config = {
			data: null,
			filePaths: {
					main: '/public/controls/admin.html',
					header: '/public/controls/header.html',
					masthead: '/public/controls/masthead.html',
					footer: '/public/controls/footer.html',
					scripts: '/public/controls/scripts.html'
				},
			root: __dirname
		};

		builder.admin(req, res, config, function (err, html) {

			if (err) {
				throw err;
			}

			res.end(html);

		});

	//});

}

// live
//server.listen(80);

// dev
server.listen(8080);
console.log('serving on 8080');


/*
	#########################################################################
		NOTES
		---------------------------------------------------------------------

		1. Serving static files: -
		help: https://gist.github.com/701407 or just use node static

		2. http://www.nodebeginner.org/ for handling requests and routing them

	#########################################################################
*/

