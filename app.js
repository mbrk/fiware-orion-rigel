var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config/config.js');


var routes = require('./routes/index');
var adapter = require('./routes/adapter');
var cb = require('./routes/contextbroker');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/** PH ADAPTER DIRTY TRY N ERROR**/


// create orion interface
var orionControl = require('./scripts/orion-control');
orionControl.init(config.ORION);
// create parking capacity adapter
var pa = require('./adapter/ph-spreadsheet-importer/index.js');
pa.init({key: config.GDoc.key});
// init needed entities for adapter
orionControl.initEntities(pa.getEntityDefinition());
// create callback for adapter results
function paResultCallback(r){
	orionControl.updateEntities(r);
}
// start adapter work - pass in a function as callback
pa.run(paResultCallback, 10000);


/** PH ADAPTER END **/

app.use('/', routes);
app.use('/adapter', adapter);
app.use('/cb', cb);
app.use('/contextbroker', cb);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
