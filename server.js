DEVMODE = true;


var httpServer = require('./modules/http');
var socketio = require('./modules/socket')(httpServer);

process.on('uncaughtException', function (err) {
    console.log(err)
});