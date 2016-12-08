var User = require("../models/user.js");
var Extension = require("../models/extension.js");
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
        }).populate("extensions").exec(function (err, user) {
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
    res.send(req.user);
});

router.post('/register', function (req, res, next) {
    req.checkBody('username', 'Invalid username').notEmpty().isAlpha();
    req.checkBody('password', 'Invalid password').notEmpty();
    req.checkBody('name', 'Invalid name').notEmpty();

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            res.send('There have been validation errors: ' + util.inspect(result.array()), 400);
            return;
        } else {
            var newUser = new User(req.body);
            newUser.password = newUser.generateHash(req.body.password);
            newUser.save(function (err, nuser) {
                if (err) {
                    res.send(err);
                } else {
                    fs.mkdir("userfolder/" + nuser.username, function () {
                        res.send(200, {
                            token: tokenizeUser(nuser),
                            name: nuser.name,
                            surname: nuser.surname,
                            extensions: nuser.extensions,
                            preferences: nuser.preferences
                        });
                    });
                }
            });
        }
    });
});

router.get('/continueTokenSession', verifyTokenDetectUser, function (req, res, next) {
    res.send(200, {
        token: tokenizeUser(req.user),
        name: req.user.name,
        surname: req.user.surname,
        extensions: req.user.extensions,
        preferences: req.user.preferences
    });
});

router.post('/updateExtensions', verifyTokenDetectUser, function (req, res, next) {
    req.user.extensions = req.body;
    req.user.save();
    res.send(200);
});

router.post('/login', function (req, res, next) {
    req.checkBody('username', 'Invalid username').notEmpty();
    req.checkBody('password', 'Invalid password').notEmpty();


    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            res.send('There have been validation errors: ' + util.inspect(result.array()), 400);
            return;
        } else {
            User.findOne({ username: req.body.username }).populate("extensions").exec(function (err, user) {
                if (!err && user) {
                    if (user.validPassword(req.body.password)) {
                        var token = tokenizeUser(user);
                        res.send(200, {
                            token: tokenizeUser(user),
                            name: user.name,
                            surname: user.surname,
                            extensions: user.extensions,
                            preferences: user.preferences
                        });
                    }
                } else {
                    res.send(200, {
                        message: "User not found"
                    });
                }
            });
        }
    });

});

module.exports = router;