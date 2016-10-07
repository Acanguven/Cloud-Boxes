var socketSettings = require('../config/socket');

module.exports = function (server) {
    var io = require('socket.io')(server);
    
    io.on('connection', function (socket) {
        socketSettings.live ? socket.emit('serverlive') : socket.emit('serveroffline');        
    });
};

