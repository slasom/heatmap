'use strict';

var fs = require('fs'),
http = require('http'),
path = require('path');
var ip = require("ip");
var reply = require('./communication/reply')

var swStats = require('swagger-stats');
var apiSpec = require(path.join(__dirname, 'openapi.json'));

var dirIP= ip.address()

var express = require("express");
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json({
    strict: false,
    limit: '50mb'
}));



app.use(swStats.getMiddleware({swaggerSpec:apiSpec}));
var oasTools = require('oas-tools');
var jsyaml = require('js-yaml');
var mqtt=require('mqtt');

var topic='HeatmapAPI';




//TODO: Change for your configuration
var serverPort = process.env.PORT ||  8080;

//TODO: Change for your mqtt server
const mqttApp = mqtt.connect("mqtt://108.129.48.139:1883");

//TODO: Change for your mqtt server for other app to send request here
const mqttRequest = mqtt.connect("mqtt://108.129.48.139:1884");

exports.topic=topic;
exports.ip=dirIP;
exports.port=serverPort;

exports.mqttApp=mqttApp;

exports.app=app;


var spec = fs.readFileSync(path.join(__dirname, '/api/openapi.yaml'), 'utf8');
var oasDoc = jsyaml.safeLoad(spec);

var options_object = {
    controllers: path.join(__dirname, './controllers'),
    loglevel: 'info',
    strict: false,
    router: true,
    validator: true
};

//MQTT connection App
mqttApp.on("connect",function(){
    console.log("Connected MQTT App");
})

mqttApp.on('error', function () {
    logger.error({
        method: "connect(error)",
        arguments: arguments,
        cause: "likely MQTT issue - will automatically reconnect soon",
    }, "unexpected error");
});


//Listen MQTT App for Results
mqttApp.subscribe('result')

mqttApp.on('message', function (topic, message) {
    console.log("Result received from MQTT")
    message= message.toString('utf8')
    
    var body=JSON.parse(message);
    var devices=body.devices

    var length=reply.insertReply(body)

    if(length==devices)
        sender.sendResult(body.idRequest,devices)

});



//MQTT connection for Mqtt Request

mqttRequest.on("connect",function(){
    console.log("connected client out");
})

mqttRequest.on('error', function () {
    logger.error({
        method: "connect(error)",
        arguments: arguments,
        cause: "likely MQTT issue - will automatically reconnect soon",
    }, "unexpected error");
});

var sender = require('./communication/sender');
//Listen MQTT Request
mqttRequest.subscribe(topic)

mqttRequest.on('message', function (topic, message) {
    console.log("Request received from MQTT")
    message= message.toString('utf8')
    var body=JSON.parse(message);
    sender(body.params,body.resource,body.method,"mqtt");

});



oasTools.configure(options_object);

oasTools.initialize(oasDoc, app, function() {
    http.createServer(app).listen(serverPort, function() {
        console.log("App running at http://localhost:" + serverPort);
        console.log("________________________________________________________________");
        if (options_object.docs !== false) {
            console.log('API docs (Swagger UI) available on http://localhost:' + serverPort + '/docs');
            console.log("________________________________________________________________");
        }
    });
});