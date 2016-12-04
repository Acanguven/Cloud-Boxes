var User = require("../models/user.js");
var jwt = require('jsonwebtoken');
var TOKEN_KEY = "nevergiveup44";
var express = require('express');
var router = express.Router();
var util = require('util');
var fs = require('fs');
var async = require('async');

function verifyTokenDetectUser(req, res, next) {
    jwt.verify(req.headers.authorization, TOKEN_KEY, function (err, decoded) {
        if (err) {
            res.send(200, {
                message: "Token error"
            });
            return false;
        }

        if (!decoded) {
            res.send(200, {
                message: "Token decoding error"
            });
            return false;
        }

        if (decoded.expireDate < Date.now()) {
            res.send(200, {
                message: "Token expired"
            });
            return false;
        }

        User.findOne({
            _id: decoded._id
        }).exec(function (err, user) {
            if (err || !user) {
                res.send(200, {
                    message: "Token user does not exist"
                });
                return false;
            } else {
                req.user = user;
                next();
            }
        });
    });
}

router.get('/', verifyTokenDetectUser, function (req, res, next) {
    res.send(200, { a: "test" });
});


router.post('/getPathFolders', verifyTokenDetectUser, function (req, res, next) {
    req.checkBody('folderpath', 'Invalid folder').notEmpty();
    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            res.send('There have been validation errors: ' + util.inspect(result.array()), 400);
            return;
        } else {
            var userDirectory = req.user.username;
            var targetFolder = "userfolder/" + userDirectory + req.body.folderpath;
            fs.readdir(targetFolder, function (err, items) {
                var structuredList = [];
                async.forEach(Object.keys(items), function (obj, cb) {
                    itemConstructor(items[obj], targetFolder, function (n) {
                        structuredList.push(n)
                        cb();
                    });
                }, function () {
                    res.send(200, structuredList);
                });
            });
        }
    });
});

function item(obj, path, cb) {
    var newItem = {};
    newItem.extension = "";
    newItem.title = (function () {
        var l = obj.split('.');
        l.pop();
        if (l.length > 0) {
            return l.join(".");
        } else {
            return obj;
        }
    })();
    newItem.path = "/" + obj;
    
    newItem.position = {
        refWidth: 0,
        refHeight: 0,
        x: Math.floor(Math.random() * 1000) + 1  ,
        y: Math.floor(Math.random() * 600) + 1  
    }
    fs.stat(path + obj, function (err, stt) {
        if (stt.isDirectory()) {
            newItem.extension = "dir";
            newItem.path += "/";
        } else {
            newItem.extension = obj.split('.').pop();
        }
        cb(newItem);
    });
}

function itemConstructor(obj, path, cb) {
    item(obj, path, function (d) {
        cb(d);
    });
}

module.exports = router;