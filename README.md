## My CV

This is my CV, created using a combination of Node.js, Bootstrap (HTML5 & CSS3) and JQuery.

An attempt at learning the quirks of Node and writing custom modules.

### My modules

- M25 (basic routing and static file serving)

        var m25 = new M25.Route({
            '/': {
                get: serveIndex
            },
            '/admin': {
                get: serveAdmin
            },
            '/admin-save': {
                post: adminSave
            },
        });

        var server = http.createServer(function (req, res) {
            m25.transport(req, res, function (err) {

                if (err) {
                    throw err;
                }

            });

        });

- Builder (builds a HTML page from include files and injects dynamic content using Nodejitsu's Flatiron Plats and a prefined config file of the sections / files you require).

### Learning objectives

- Static file serving
- Couchdb CRUD
- Routing
- Templating
- Smart ways of building HTML pages from include files
- Deploying to a Node [no.de](http://tahir.no.de/admin) Smart Machine / Remote server

**This is a POC and a work in progress**