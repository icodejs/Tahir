  var http = require('http'),
      director = require('director');

  function helloWorld(route) {
    this.res.writeHead(200, { 'Content-Type': 'text/plain' })
    this.res.end('hello world from (' + route + ')');
  }

  var router = new director.http.Router({
    '/hello': {
      get: helloWorld
    }
  });

  var server = http.createServer(function (req, res) {
    router.dispatch(req, res, function (err) {
      if (err) {
        res.writeHead(404);
        res.end();
      }
    });
  });

  router.get('/bonjour', helloWorld);
  router.get(/hola/, helloWorld);

  server.listen(3000);

  console.log('server running on port: 3000');