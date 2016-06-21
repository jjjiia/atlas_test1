// Generated by CoffeeScript 1.10.0
(function() {
  var path;
  'use strict';
  var app, async, express, http, path, request, serveStatic, server;

  express = require('express');

  request = require('request');

  path = require('path');

  http = require('http');

  path = require('path');

  async = require('async');

  serveStatic = require('serve-static');

  app = express();

  app.disable('etag');

  app.set('trust proxy', true);

  app.use(serveStatic('./', {
    'index': ['grid.html', 'grid.htm']
  }));

  app.use(serveStatic('./js'));

  app.use(serveStatic('./node_modules/web-audio-api/lib'));

  app.get('/', function(req, res) {
    res.render('index', function(err, html) {
      res.send(html);
    });
  });


  /* Start the server */

  server = app.listen(process.env.PORT || '8080', '0.0.0.0', function() {
    console.log('App listening at http://%s:%s', server.address().address, server.address().port);
    console.log('Press Ctrl+C to quit.');
    console.log('checking if adjustments work');
  });

}).call(this);