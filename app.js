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

// create orion interface
var orionControl = require('./scripts/orion-control');
orionControl.init(config.ORION);

var readPH = false;
var readCal = false;
var readNews = false;
var readWeather = true;

/** PH ADAPTER DIRTY TRY N ERROR**/

if(readPH){
	// create parking capacity adapter
	var pa = require('./adapter/ph-spreadsheet-importer/index.js');
	pa.init({key: config.GDocPH.key});

	setTimeout(function(){
		// init needed entities for adapter
		orionControl.initEntities(pa.getEntityDefinition());
		// start adapter work - pass in a function as callback to place updates
		pa.run(orionControl.updateEntities, 8000);
	}, 1000);
}

/** PH ADAPTER END **/

/** NEWS ADAPTER DIRTY TRY N ERROR**/

if(readNews){
	// create news adapter
	var na = require('./adapter/news-spreadsheet-importer/index');
	na.init({key: config.GDocNews.key});

	setTimeout(function(){
		// init needed entities for adapter
		orionControl.initEntities(na.getEntityDefinition());
		// start adapter work - pass in a function as callback to place updates
		na.run(orionControl.updateEntities, 8000);
	}, 1000);
}

/** NEWS ADAPTER END **/

/** WEATHER ADAPTER DIRTY TRY N ERROR**/

if(readWeather){
	// create weather adapter
	var wa = require('./adapter/weather-spreadsheet-importer/index');
	wa.init({key: config.GDocWeather.key});

	setTimeout(function(){
		// init needed entities for adapter
		orionControl.initEntities(wa.getEntityDefinition());
		// start adapter work - pass in a function as callback to place updates
		wa.run(orionControl.updateEntities, 8000);
	}, 1000);
}

/** WEATHER ADAPTER END **/


/** GCal ADAPTER **/

if(readCal){
	// create gcal adapter
	var ga = require('./adapter/gcal-importer/index');
	ga.init(config.GCal.url);
	setTimeout(function(){
		// init needed entities for adapter
		orionControl.initEntities(ga.getEntityDefinition());
		// start adapter work - pass in a function as callback to place updates
		ga.run(orionControl.updateEntities, 10000);
	}, 2000);
}

/** GCal ADAPTER END **/



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
