var http = require('http');
var fs = require('fs');
var path = require('path');
var async = require('async');
var serverSettings = require('../config/http');
var compressor = require('node-minify');



function devtodist(ended) {
    async.parallel([
        function (cb) {
            new compressor.minify({
                type: 'gcc',
                fileIn: [__dirname + '/../public/dev/js/os.js'],
                fileOut: __dirname + '/../public/dist/js/os.js',
                callback: function (err, min) {
                    new compressor.minify({
                        type: 'uglifyjs',
                        fileIn: __dirname + '/../public/dist/js/os.js',
                        fileOut: __dirname + '/../public/dist/js/os.js',
                        callback: function (err2, min) {
                            cb(err || err2);
                        }
                    });
                }
            });
        },
        function (cb) {
            new compressor.minify({
                type: 'no-compress',
                fileIn: [__dirname + '/../public/dev/os.html'],
                fileOut: __dirname + '/../public/dist/os.html',
                callback: function (err, min) {
                    cb(err)
                }
            });
        },
        function (cb) {
            new compressor.minify({
                type: 'no-compress',
                fileIn: [__dirname + '/../public/dev/favicon.ico'],
                fileOut: __dirname + '/../public/dist/favicon.ico',
                callback: function (err, min) {
                    cb(err)
                }
            });
        },
        function (cb) {
            new compressor.minify({
                type: 'yui-css',
                fileIn: [__dirname + '/../public/dev/css/main.css'],
                fileOut: __dirname + '/../public/dist/css/main.css',
                callback: function (err, min) {
                    cb(err)
                }
            });
        }
    ], function (err) {
        if (err) {
            console.log(err);
        } else {
            ended();
        }
    });
}

devtodist(function () {
    console.log("Development files compressed and uglified to distribution folder");
});

function readAndServePath(filePath, response, contentType) {
    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile('./404.html', function (error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                response.end();
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
}

var server = http.createServer(function (request, response) {
    var filePath = "";
    if (!DEVMODE) {
        filePath = './public/dist' + request.url;
        if (filePath == './public/dist/')
            filePath = './public/dist/os.html';
    } else {
        filePath = './public/dev' + request.url;
        if (filePath == './public/dev/')
            filePath = './public/dev/os.html';
    }
    
    
    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
    }
    
    readAndServePath(filePath, response, contentType);
}).listen(serverSettings.port, function () {
    console.log("Http server started on port " + serverSettings.port);
});


module.exports = server;
