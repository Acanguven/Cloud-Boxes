var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var expressValidator = require('express-validator');
var os = require('os');
mongoose.connect(require('./config/database.js').url);
mongoose.connection.on('error', console.error.bind(console, 'connection from socket error:'));
mongoose.connection.once('open', console.log.bind(console, 'connected to database'));

var userRoute = require('./routes/user');
var fileSystem = require('./routes/filesystem');
var extensions = require('./routes/extensions');
var app = express();


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(expressValidator()); 
if (os.hostname().indexOf("DESKTOP-") == 0) {
    app.use(cors());
}
/* Routes */
app.use('/api/user', userRoute);
app.use('/api/fs', fileSystem);
app.use('/api/extensions', extensions);


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
    res.send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.send({
    message: err.message,
    error: {}
  });
});

process.on('uncaughtException', function (error) {
    console.log(error.stack);
});



module.exports = app;
