var http 			= require('http')
		contextify = require('contextify'),
		jsdom = require('jsdom');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(80);
