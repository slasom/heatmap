'use strict';

var Device = require('../service/DeviceService');

module.exports.restartApp = function restartApp (req, res, next) {

    Device.restartApp(req.swagger.params, res, next);
   

};

module.exports.saveLogs = function saveLogs (req, res, next) {

    Device.saveLogs(req.swagger.params, res, next);
   

};

module.exports.deleteLogs = function deleteLogs (req, res, next) {

    Device.deleteLogs(req.swagger.params, res, next);
   

};


 
    
