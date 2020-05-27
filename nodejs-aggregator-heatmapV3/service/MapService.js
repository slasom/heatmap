'use strict';

var sender = require('../communication/sender');
var vars = require('../index');

var reply = require('../communication/reply')
var body;

var app = vars.app;
/**
 * Get the locations frequency processed in the different connected devices.
 *
 * beginDate Date init date
 * endDate Date end date
 * latitude Double latitude
 * longitude Double longitude
 * radius Double radius
 * devices Integer number of devices
 * timeout Double timeout request (ms)
 * technology String Choose firebase or mqtt
 * returns List
 **/
var paramsgetMCHeatmaps=["beginDate","endDate","latitude","longitude","radius","devices","timeout","technology"];
module.exports.getMCHeatmaps = function(req, res, next) {

    body={}

    var keys = Object.keys(req);
    for (var i = 0; i < keys.length; i++) {
        body[paramsgetMCHeatmaps[i]]=req[keys[i]].value
    }
    sender.sendRequest(body,'Map','getMCHeatmaps',res);

};



//Listen FCM Results
app.post('/resultgetMCHeatmaps', function (req, res) {

    console.log("Result received from FCM - MCHeatmaps")
    var length=reply.insertReply(req.body)

    var devices=req.body.devices;

    console.log("Size: "+ JSON.stringify(req.body).length + " B")

    

    if(length==devices)
        sender.sendResult(req.body.idRequest,devices)
  
    res.status(201).send({
        message: 'Sent correctly!'
    });
});

/**
 * Get the locations frequency processed in the aggregator
 *
 * beginDate Date init date
 * endDate Date end date
 * latitude Double latitude
 * longitude Double longitude
 * radius Double radius
 * devices Integer number of devices
 * timeout Double timeout request (ms)
 * technology String Choose firebase or mqtt
 * returns List
 **/
var paramsgetSCHeatmaps=["beginDate","endDate","latitude","longitude","radius","devices","timeout","technology"];
module.exports.getSCHeatmaps = function(req, res, next) {

    body={}

    var keys = Object.keys(req);
    for (var i = 0; i < keys.length; i++) {
        body[paramsgetSCHeatmaps[i]]=req[keys[i]].value
    }
    sender.sendRequest(body,'Map','getSCHeatmaps',res);

};


//Listen FCM Results
app.post('/resultgetSCHeatmaps', function (req, res) {

    console.log("Result received from FCM - SCHeatmaps")
    var length=reply.insertReply(req.body)

    var devices=req.body.devices;

    console.log("Size: "+ JSON.stringify(req.body).length + " B")

    if(length==devices)
        sender.sendResult(req.body.idRequest,devices)
  
    res.status(201).send({
        message: 'Sent correctly!'
    });
});

