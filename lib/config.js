exports.settings = {
	cv: {
		dbConnectionString: 'couchdb://bconsole.iriscouch.com/cv',
		id: '1328479202177'
	},
	pageProperties: function() {
		return {
			fragments: {
				main: 		{ path: '/public/controls/index.html' },
				header: 	{ path: '/public/controls/header.html' },
				masthead: { path: '/public/controls/masthead.html' },
				scripts: 	{ path: '/public/controls/scripts.html' }
			}
		};
	}

};