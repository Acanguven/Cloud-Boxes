'use strict'



/*
 * 
 * Angular
 * 
 */
var app = angular.module("cloudboxes", []);

app.factory("AccountService", function (OsService, OverlayService) {
    var user = {
        loggedIn: false
    }


    return {
        isLoggedIn: function () {
            return user.loggedIn;
        },
        login: function (username, password) {
            OsService.getCB().modules["Authentication"].dologin(username, password, function (status) {
                user.loggedIn = status;
                OverlayService.hideOverlay("login");
            });
        }
    }
});

app.factory("OverlayService", function ($rootScope) {
    var overlays = {
        login: false
    };

    $rootScope.overlays = overlays;

    return {
        showOverlay: function (name) {
            $rootScope.$apply(function () {
                overlays[name] = true;
            });
        },
        hideOverlay: function (name) {
            overlays[name] = false;
        }
    }
});

app.factory("OsService", function () {
    var os = null;
    return {
        getCB: function () {
            return os;
        },
        startCB: function () {
            os = new CloudBoxes();
        }
    };
});

app.controller("login", function ($scope, AccountService, OsService) {
    $scope.tryLogin = function (email, password) {
        AccountService.login(email, password);
    }
});

app.run(function (OsService) {
    OsService.startCB();
})










/*
 * 
 * Cloud Boxes Base
 * 
 */
function CloudBoxes() {
    this.version = 0.1;
    this.socket = null;
    this.modules = {};
    this.OsCanvas = this.buildCanvas();


    this.connectServer();
}

CloudBoxes.prototype.loadModules = function () {

}

CloudBoxes.prototype.buildCanvas = function () {
    return new OsCanvas();
}

CloudBoxes.prototype.loadModule = function (moduleName) {
    this.modules[moduleName] = new window[moduleName](this);
    this.modules[moduleName].init();
}

CloudBoxes.prototype.connectServer = function () {
    var _this = this;
    this.socket = io(top.location.origin);
    this.socket.on('serverlive', function () {
        _this.loadModule("Authentication");
    });
    this.socket.on('serveroffline', function () {

    });
}


/*
 * 
 * Os Canvas
 * 
 */
function OsCanvas() {
    this.canvas = document.getElementById("oscanvas");
    this.ctx = this.canvas.getContext('2d');
    this.buildSize();
    this.registerResize();
    this.canvasObjects = [];
    var fps = 0;
    this.startDrawing();

    //this.canvas.addEventListener('click', this.requestFullScreen, true);

    return this;
}

OsCanvas.prototype.buildSize = function () {
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;
}

OsCanvas.prototype.registerResize = function () {
    var _this = this;
    window.onresize = function (event) {
        _this.buildSize();
        for (var i = 0; i < _this.canvasObjects.length; i++) {
            _this.canvasObjects[i].resized();
        }
    };
}
OsCanvas.prototype.startDrawing = function () {
    var _this = this;
    var updater = function () {
        _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
        for (var i = 0; i < _this.canvasObjects.length; i++) {
            _this.canvasObjects[i].draw();
        }
        window.requestAnimationFrame(updater);
    }
    window.requestAnimationFrame(updater);
}

OsCanvas.prototype.createImg = function (src) {
    var img = new Img(src, this);
    this.canvasObjects.push(img);
    return img;
}

OsCanvas.prototype.createText = function (src) {

}

OsCanvas.prototype.requestFullScreen = function () {
    if (!document.fullscreenElement &&
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}


/*
 * 
 * Auth
 * 
 */
function Authentication(CloudBoxesInstance) {
    this.CloudBoxes = CloudBoxesInstance;
}


Authentication.prototype.init = function () {
    angular.element(document.getElementById("overlay")).injector().get('OverlayService').showOverlay("login");
}

Authentication.prototype.dologin = function (username, password, cb) {
    var loginStatus = true; //make it real todo
    this.startLoginAnimation();
    cb(loginStatus);
}

Authentication.prototype.startLoginAnimation = function () {
    var _this = this;
    var authLogo = this.CloudBoxes.OsCanvas.createImg("/img/logo.png");
    authLogo.on("load", function () {
        authLogo.centerImg();
        var tempTop = authLogo.position.top;
        authLogo.position.top = 0 - authLogo.position.height;
        authLogo.animateMove(authLogo.position.left, authLogo.position.top, authLogo.position.left, tempTop, 500, 0);
    });
}


/*
 * 
 * Canvas Contents
 * 
 */

function Img(src, oscanvas) {
    var _this = this;
    this.oscanvas = oscanvas;
    this.img = new Image;
    this.img.src = src;
    this.animationMoveFrame = undefined;
    this.img.onload = function () {
        _this.position.width = _this.img.width;
        _this.position.height = _this.img.height;
        _this.loaded = true;
        _this.fireEvent("load");
    }
    this.loaded = false;
    this.position = {
        left: 0,
        top: 0,
        width: this.img.width,
        height: this.img.height,
        refWidth: this.oscanvas.canvas.width,
        refHeight: this.oscanvas.canvas.height
    }
    this.eventsList = [];
}

Img.prototype.on = function (event, callback) {
    this.eventsList.push({
        event: event,
        callback: callback
    });
}

Img.prototype.resized = function () {
    this.position.left = (this.oscanvas.canvas.width * this.position.left) / this.position.refWidth;
    this.position.top = (this.oscanvas.canvas.height * this.position.top) / this.position.refHeight;
    this.position.refWidth = this.oscanvas.canvas.width;
    this.position.refHeight = this.oscanvas.canvas.height;
}

Img.prototype.fireEvent = function (event) {
    for (var x = 0; x < this.eventsList.length; x++) {
        if (this.eventsList[0].event == event) {
            this.eventsList[0].callback(this);
        }
    }
}

Img.prototype.animateMove = function (startX, startY, stopX, stopY, duration, startDelay, cb) {
    var _this = this;

    var startDate = Date.now() + (startDelay ? startDelay : 0);
    var xDif = startX - stopX;
    var yDif = startY - stopY;
    var updater = function () {
        var currentStatus = Date.now() - startDate;
        var animatePercent = (currentStatus / duration);
        _this.position.left = startX - (xDif * animatePercent);
        _this.position.top = startY - (yDif * animatePercent);

        if (currentStatus > duration) {
            _this.position.left = stopX;
            _this.position.top = stopY;
            (cb ? cb() : '')
        } else {
            window.requestAnimationFrame(updater);
        }
    }

    setTimeout(updater, startDelay ? startDelay : 0)
}

Img.prototype.centerImg = function () {
    var _this = this;

    var updateCenter = function () {
        if (_this.loaded == false) {
            setTimeout(updateCenter, 0)
        } else {
            _this.position.left = _this.oscanvas.canvas.width / 2 - _this.img.width / 2;
            _this.position.top = _this.oscanvas.canvas.height / 2 - _this.img.height / 2;
        }
    }
    updateCenter();
}

Img.prototype.draw = function () {
    if (this.loaded) {
        this.oscanvas.ctx.drawImage(this.img, this.position.left, this.position.top, this.position.width, this.position.height);
    }
}