var http 			= require('http'),
		director 	= require('director');

// some logic to be routed to

function helloMocha(route) {
	this.res.writeHead(200, { 'Content-Type': 'text/plain'});
	this.res.end('hello mocha from: ' + route);
}		

// define a routing table

var router = new director.http.Router({
	'/hello': {
		get: helloMocha	
	}
});

// setup a server when there is a request, dispatch the 
// route that was requested in the request object

var server = http.createServer(function (req, res) {
	router.dispatch(req, res, function(err) {
		if (err) {
			res.writeHead(404);
			res.end();
		}
	});
})

// You can also do ad-hoc routing, similar to express
// this can be done with a string or a regexp

router.get('/', helloMocha);
router.get('/mocha', helloMocha);
router.get('/latte', helloMocha);


server.listen(80);
