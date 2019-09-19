'use strict';

var Map = require('../service/MapService');

module.exports.getMCHeatmaps = function getMCHeatmaps (req, res, next) {

    Map.getMCHeatmaps(req.swagger.params, res, next);

};

module.exports.getSCHeatmaps = function getSCHeatmaps (req, res, next) {

    Map.getSCHeatmaps(req.swagger.params, res, next);

};
