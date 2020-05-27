'use strict';

var sender = require('../communication/sender');
var body;

/**
 * Restart app in to mobile devices.
 *
 * timeout Double wait time to start app after close (ms)
 * technology String Choose firebase or mqtt
 * returns List
 **/
var paramsrestartApp=["waittime","technology"];
module.exports.restartApp = function(req, res, next) {

    body={}

    var keys = Object.keys(req);
    for (var i = 0; i < keys.length; i++) {
        body[paramsrestartApp[i]]=req[keys[i]].value
    }
    sender.sendRequest(body,'Device','restartApp',res);

};

var paramsrestartApp=["technology"];
module.exports.saveLogs = function(req, res, next) {

    body={}

    var keys = Object.keys(req);
    for (var i = 0; i < keys.length; i++) {
        body[paramsrestartApp[i]]=req[keys[i]].value
    }
    sender.sendRequest(body,'Device','saveLogs',res);

};

var paramsrestartApp=["technology"];
module.exports.deleteLogs = function(req, res, next) {

    body={}

    var keys = Object.keys(req);
    for (var i = 0; i < keys.length; i++) {
        body[paramsrestartApp[i]]=req[keys[i]].value
    }
    sender.sendRequest(body,'Device','deleteLogs',res);

};

