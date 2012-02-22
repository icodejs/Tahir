var fs 		= require('fs'),
		util 	= require('util'),
		path 	= require('path'),
		_			=	require('underscored');


/*
	########################################################
		read a file and sends the result back as utf-8 text
	########################################################
*/

function fileContentsText (uri, callback) {

	fs.readFile(uri, 'utf-8', function (err, data) {

	  if (err) {
		  return callback(err);
		}

	  callback(null, data);

	});

}


/*
	######################################
		pump file into the response object
	######################################
*/

function pumpFileToResponse (req, res, uri, callback) {

	var rs = fs.createReadStream(uri);

	util.pump(rs, res, function (err) {

		if (err) {
			return callback(err);
		}

		res.writeHead(200, getMIME(uri));

		callback(null);

	});

}


function getMIME (uri) {
	// http://webdesign.about.com/od/multimedia/a/mime-types-by-content-type.htm
	var type = '';
	var ext = _.ltrim(path.extname(uri), '.');

	switch(ext.toLowerCase()) {
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

	return { 'Content-Type': type };

}


exports.fileContentsText		= fileContentsText;
exports.getMIME							= getMIME;
exports.pumpFileToResponse	= pumpFileToResponse;
