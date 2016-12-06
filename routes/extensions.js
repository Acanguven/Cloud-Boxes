var Extension = require("../models/extension.js");
var User = require("../models/user.js");
var jwt = require('jsonwebtoken');
var TOKEN_KEY = "nevergiveup44";
var express = require('express');
var router = express.Router();
var util = require('util');
var fs = require('fs');


function tokenizeUser(user) {
    var token = jwt.sign({
        expireDate: Date.now() + 1000 * 60 * 60 * 2, //Token expiration 2 hours.
        _id: user._id
    }, TOKEN_KEY);
    return token;
}

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
            if (err || !user || user.banned) {
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
    Extension.find({ $or: [{ live: true }, { creator: req.user._id }] }).exec(function (err, extensions) {
        res.send(200, extensions);
    });
});

router.get('/get/:id', verifyTokenDetectUser, function (req, res, next) {
    Extension.findOne({ _id: req.params.id }).exec(function (err, extension) {
        res.send(200, extension);
    });
});

router.post('/createNew', verifyTokenDetectUser, function (req, res, next) {
    var newExtension = new Extension();
    newExtension.creator = req.user;
    newExtension.save(function (err, nsaved) {
        console.log(err);
        Extension.find({}).populate('creator', 'name').lean().exec(function (err, extensions) {
            res.send(200, extensions);
        });
    });
});

router.post('/new', verifyTokenDetectUser, function (req, res, next) {
    var newExtension = new Extension(req.body);
    newExtension.creator = req.user;
    newExtension.save(function (err, ss) {
        if (!err) {
            res.send(200, { success: true, id: ss._id });
        } else {
            res.send(200, { success: false, id: ss._id });
        }
    });
});

router.post('/edit/:id', verifyTokenDetectUser, function (req, res, next) {
    Extension.findOne({ _id: req.params.id }).exec(function (err, extension) {
        if (!err && extension) {
            for (var x in req.body) {
                extension[x] = req.body[x];
            }
            extension.save(function (err) {
                if (!err) {
                    res.send(200, { success: true });
                } else {
                    res.send(200, { success: false });
                }
            });
        } else {
            res.send(200, { success: false });
        }
    });
});

router.post('/publish', verifyTokenDetectUser, function (req, res, next) {
    Extension.findOne({ _id: req.body.extension }).exec(function (err, extension) {
        extension.live = req.body.t ? req.body.t : false;
        extension.save(function () {
            Extension.find({}).populate('creator', 'name').lean().exec(function (err, extensions) {
                res.send(200, extensions);
            });
        });
    });
});

module.exports = router;