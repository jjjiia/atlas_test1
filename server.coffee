`var path`
'use strict'

express = require('express')
request = require 'request'
path = require('path')
http = require('http')
path = require('path')
async = require('async')
serveStatic = require('serve-static')
app = express()
app.disable 'etag'
app.set 'trust proxy', true
app.use serveStatic('./', 'index': [
  'grid.html'
  'grid.htm'
])
app.use serveStatic('./js')
app.use serveStatic('./node_modules/web-audio-api/lib')


app.get '/', (req, res) ->
  # res.status(200).send("Hello, world!");
  res.render 'index', (err, html) ->
    res.send html
    return
  # res.sendfile('./bower_components/shower-bright/index.html');
  return
# [END hello_world]
# [START server]

### Start the server ###

server = app.listen(process.env.PORT or '8080', '0.0.0.0', ->
  console.log 'App listening at http://%s:%s', server.address().address, server.address().port
  console.log 'Press Ctrl+C to quit.'
  console.log 'checking if adjustments work'
  return
)