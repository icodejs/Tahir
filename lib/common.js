var fs = require('fs'),
	util = require('util'),
	path = require('path'),
	_ = require('underscored');
/*

		pump file into the response object

*/
function resPump(res, uri, callback) {
	var rs = fs.createReadStream(uri);

	util.pump(rs, res, function (err) {

		if (err) {
			return callback(err);
		}

		res.writeHead(200, getMIME(uri));

		return callback(null);

	});

}

function getMIME(uri) {
	// http://webdesign.about.com/od/multimedia/a/mime-types-by-content-type.htm
	var type = '';
	var ext = _.ltrim(path.extname(uri), '.');

	switch (ext.toLowerCase()) {
	case 'plain':
		type = 'text/plain';
		break;
	case 'html':
		type = 'text/html';
		break;
	case 'css':
		type = 'text/css';
		break;
	case 'png':
		type = 'image/png';
		break;
	case 'js':
		type = 'text/javascript';
		break;
	case 'ico':
		type = 'img/ico';
		break;
	default:
		throw new Error('Invalid file type: ' + ext);
	}

	return {
		'Content-Type': type
	};

}

/*

	Similarly to the classical Holy Grail, you would use an empty temporary
	constructor function F(). You then set the prototype of F() to be the parent
	object. Finally, you return a new instance of the temporary constructor:

*/
function object(o) {
	function F() {}
	F.prototype = o;
	return new F();
}


exports.getMIME = getMIME;
exports.resPump = resPump;
exports.object = object;

