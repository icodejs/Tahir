var url = require("url"),
	qs = require('querystring'),
	underscored = require('underscored'),
	common = require('./common'),
	path = require('path');


function Route(routes) {

	this.routes = routes || {};

	this.notFound = function (res) {
		res.writeHead(404, {
			"Content-Type": "text/plain"
		});
		res.write("404 Not Found\n");
		res.end();
	};

}


Route.prototype.transport = function (req, res, callback) {

	var requestFilePath = underscored.rtrim(url.parse(req.url).pathname, '/') || '/',
		method = req.method,
		self = this,
		fn = self.routes[requestFilePath];

	try {

		if (fn) {

			fn.req = req;
			fn.res = res;

			if (method === 'GET') {

				fn.get();

			} else if (method === 'POST') {

				var data = '';

				req.on('data', function (chunk) {
					data += chunk;
				}).on('end', function () {

					fn.body = qs.parse(data.toString());

					fn.post();

				});

			}

		} else {

			if (requestFilePath.indexOf('public')) {

				var filePath = path.dirname(__dirname) + requestFilePath;

				common.resPump(res, filePath, function (err) {

					if (err) {
						self.notFound(res);
					}

				});

			}

		}

	} catch (e) {
		return callback(e);
	}

}

var Route = exports.Route = Route;


/**
 *	Consult this module for help with paths:
 * 	http://nodejs.org/docs/v0.6.9/api/path.html
 */