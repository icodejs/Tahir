var resourceful = require('resourceful'),
	cv_template = require('../public/cv/cv_template'),
	config = require('./config');


var CV = resourceful.define('cv', function (id) {

	this.use('couchdb', {
		uri: config.settings.cv.dbConnectionString
	});

	this.string('_id');
	this.string('profilePic');
	this.string('type');
	this.string('fullname');
	this.string('position');
	this.string('currentJobTitle');
	this.array('skills'); // of string
	this.string('telephone');
	this.string('email');
	this.array('websites'); // of string
	this.array('socialLinks'); // of objects
	this.array('experience'); // of objects
	this.string('profile');
	this.array('education'); // of string
	this.array('interests'); // of string
	this.bool('live'); // of boolean
	this.timestamps();

	this.prototype.display = function () {
		console.log(this);
	};

});

// Resource.create(properties, [callback])

function create(cv, callback) {

	var _cv = new(CV)(cv);

	_cv.save(function (err, doc) {

		if (err) {
			return callback(err);
		}

		return callback(null, doc);

	});

}

function createFromTemplate(callback) {

	var tahir = cv_template.cv

	tahir._id = String(Date.now(), 10);

	CV.create(tahir, function (err, doc) {

		if (err) {
			return callback(err);
		}

		console.log('_rev: ' + doc._rev + ' new cv for ' + doc.fullname + ' was created!');

		doc.save(function (err, saved_doc) {

			if (err) {
				return callback(err);
			}

			console.log('_rev: ' + saved_doc._rev + ' new cv for ' + saved_doc.fullname + ' was saved!');

			return callback(null, saved_doc);

		});

	});

}

// Resource.get(id, [callback]): Fetch a resource by id
function load(id, callback) {

	CV.get(String(id), function (err, doc) {

		if (err) {
			return callback(err);
		}

		return callback(null, doc);;

	});

}

// Resource.update(id, properties, [callback])

function update(doc, callback) {

	CV.update(doc, function (err, doc) {

		if (err) {
			return callback(err);
		}

		console.log(doc.fullname + ' was updated');

		return callback(null, doc);

	});

}

// Resource.destroy(id, [callback])

function delete_doc(id, callback) {

	CV.destroy(String(id, 10), function (err, doc) {

		if (err) {
			return callback(err);
		}

		try {

			console.log('cv: ' + doc.id + 'was destroyed!');

			return callback(null, 'cv: ' + doc.id + 'was destroyed!');

		} catch (err) {

			return callback(err);

		}

	});

}

// Resource.all([callback])

function loadCollection(callback) {

	CV.all(function (err, docs) {

		if (err) {
			return callback(err);
		}

		var records = docs;

		return callback(null, records);

	});

}

// Resource.find(properties, [callback]) - e.g. where_object = { jobTitle: 'Database guru' }

function loadWhere(whereObject, callback) {

	CV.find(whereObject, function (err, docs) {

		if (err) {
			return callback(err);
		}

		var records = docs;

		return callback(null, doc);

	});

}

exports.load = load;
exports.loadCollection = loadCollection;
exports.create = create;