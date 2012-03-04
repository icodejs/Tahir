var jsdom = require('jsdom'),
    plates = require('plates'),
    events = require('events'),
    fs = require('fs'),
    jquery = './lib/jquery.js';


function getPageControl(fragment, callback) {

  fs.readFile(fragment.root + fragment.item.path, 'utf-8', function (err, fragmentHTML) {

    if (err) {
      return callback(err);
    }

    if (fragment.map && fragment.item.mapFunction && fragment.item.data) {

      fragment.template = fragmentHTML;

      fragment.item.mapFunction(fragment, function (err, mappedHTML) {

        if (err) {
          return callback(err);
        }

        return callback(null, fragment.key, mappedHTML);

      });

    } else {

      return callback(null, fragment.key, fragmentHTML);

    }

  });

} // end getPageControl


function buildPageControl(config, callback) {
  // clean this up to use some kind of flow control
  var _fragments = {},
    eventsEmitter = new events.EventEmitter(),
    count = Object.keys(config.fragments).length,
    _key;

  for (_key in config.fragments) {

    if (config.fragments.hasOwnProperty(_key)) {

      var frag = config.fragments[_key];

      getPageControl({
        root: config.root,
        map: config.map,
        item: frag,
        key: _key
      }, function (err, key, htmlTemplate) {

        if (err) {
          return callback(err);
        } else {

          _fragments[key] = htmlTemplate;

          count -= 1;

          if (count === 0) {
            eventsEmitter.emit('complete');
          }

        }

      });

    }

  }

  eventsEmitter.on('complete', function () {
    return callback(null, _fragments);
  });

}


function mastheadMapper(fragment, callback) {

  var window = jsdom.jsdom().createWindow();

  jsdom.jQueryify(window, jquery, function () {

    var $masthead = window.$(fragment.template);

    fragment.map.class('link').to('name').where('href').is('/').insert('url');

    var $socialLinks = $masthead.find('#socialLinks'),
      updated_socialLinks = plates.bind($socialLinks.html(), fragment.item.data, fragment.map);

    $socialLinks.html(updated_socialLinks);

    return callback(null, $masthead.wrap('<div />').parent().html());

  });

}


function homepage(config, callback) {

  config.map = plates.Map();
  config.fragments.masthead.mapFunction = mastheadMapper;

  buildPageControl(config, function (err, htmlFragments) {

    if (err) {
      return callback(err);
    }

    var window = jsdom.jsdom().createWindow();

    jsdom.jQueryify(window, jquery, function () {

      // this mapping is only here for testing and will be replace with
      // a main content section that will have it's own mapping functin
      // depending on what page we are on.
      config.map.where('class').is('name').use('name').where('class').is('url').use('url');

      window.$('html').html(htmlFragments.main);
      window.$('head').html(htmlFragments.header);
      window.$('title').text(config.data.fullname + ': ' + config.data.position);
      window.$('#masthead').html(htmlFragments.masthead);

      // this mapping logic will also be removed and placed into function
      // for mapping main conent
      var $experiences = window.$('#experiences');
      $experiences.html(plates.bind($experiences.html(), config.data.experience, config.map));

      var output = window.$('html').html() + htmlFragments.scripts;

      return callback(null, "<!DOCTYPE html>\n<html>" + output + '</html>');

    }); // end jsdom.jQueryify
  }); // end fragment builder
} // end export page


function admin(config, callback) {

  config.map = plates.Map();

  buildPageControl(config, function (err, htmlFragments) {

    if (err) {
      return callback(err);
    }

    var window = jsdom.jsdom().createWindow();

    jsdom.jQueryify(window, jquery, function () {

      window.$('html').html(htmlFragments.main);
      window.$('head').html(htmlFragments.header);
      window.$('title').text('Admin page');
      window.$('#masthead').html(htmlFragments.masthead);

      var $select_cv_ctl = window.$('#cv');

      config.map.where('class').is('tmp_cv').use('type').where('value').is('-1').insert('_id');
      $select_cv_ctl.html(plates.bind($select_cv_ctl.html(), config.data, config.map));

      var output = window.$('html').html() + htmlFragments.scripts;

      return callback(null, "<!DOCTYPE html>\n<html>" + output + '</html>');

    });

  });

}


exports.homepage = homepage;
exports.admin = admin;


/**
 *  This module will be in charge of building UIs
 */