var http 			= require('http'),
		director 	= require('director'),
		util 			= require('util'),
		fs 				= require('fs'),
		cv 				= require('./lib/cv').cv;
//jsdom			= require('jsdom')
// some logic to be routed to

function helloMocha() {
	this.res.writeHead(200, { 'Content-Type': 'text/plain'});
	this.res.end('hello mocha from: ');
}		

function serveFile(res, uri, callback) {
	var rs = fs.createReadStream(__dirname + uri);
	util.pump(rs, res, function(err) {
		if (err) { callback(err) }

		var ext = uri.split('.')[1];

		if (ext) {
			res.writeHead(200, getMIME(ext));
			callback(null, res);
		} else {
			callback(new Error('Unable to locate a file extension for file: ' + uri));
		}
	});		
}

function serveHTML(uri, callback) {
	fs.readFile(__dirname + uri, 'utf-8', function (err, data) {
	  if (err) { 
		  callback(err);
		}
	  callback(null, data);
	});	
}

function getMIME(ext) {
		// http://webdesign.about.com/od/multimedia/a/mime-types-by-content-type.htm 
		var type = '';
		switch(ext.toLowerCase()) {
			case 'html':
			  type = 'text/html';
			  break;
			case 'css':
			  type = 'text/css';
			  break;
			case 'png':
			  type = 'image/png';
			  break;			  
			default:
			  throw new Error('Unable to find a relevant MIME Type')
		}		
		return { 'Content-Type': type};
}

// define a routing table
var router = new director.http.Router({
	'/': {
		get: function () {	
			var that = this;
			serveHTML('/public/index.html', function(err, html){
				if (err) { throw err }

				// integrate weld : https://github.com/hij1nx/weld
				// abstract this out into a function that can excepts
				// a json object and the template html
				// and the targetted element to be bound.

				jsdom.env({
				  html: html,
				  scripts: ['./lib/jquery.js'],
				  done: function(err, window) {
						if (err) { throw err }	
								  	
				    var $ = window.$;
				    var output = '';

				    $('a').each(function() {
				      output += $(this).text() + '<br />'
				    });

				    that.res.end(html);
				  }
				});						
				//that.res.end(html);
			}); // end serveHTML
		}	
	},
	'/public/bootstrap/bootstrap.css': {
		get: function () {	
			serveFile(this.res, '/public/bootstrap/bootstrap.css', function(err, res){
				if (err) { throw err }

				res.end();		
			});
		}	
	},	
	'/public/css/base.css': {
		get: function () {	
			serveFile(this.res, '/public/css/base.css', function(err, res){
				if (err) { throw err }

				res.end();		
			});
		}	
	},
	'/public/img/browsers.png': {
		get: function () {	
			serveFile(this.res, '/public/img/browsers.png', function(err, res){
				if (err) { throw err }

				res.end();		
			});
		}	
	}			
});

// setup a server when there is a request, dispatch the 
// route that was requested in the request object

// this is the generic on that can be used to send all traffic
// through to the relevant router.
// use this to request the url using require('url'), but add some kind
// of validation so that users cant access system folder by passing
// in known folder structures.

var server = http.createServer(function (req, res) {
	router.dispatch(req, res, function(err) {
		if (err) {
			res.writeHead(404);
			res.end();
		}
	});
});


// You can also do ad-hoc routing, similar to express
// this can be done with a string or a regexp

// router.get('/mocha', helloMocha);
// router.get('/latte', helloMocha);

// live
server.listen(80);

// dev
//server.listen(8080);
