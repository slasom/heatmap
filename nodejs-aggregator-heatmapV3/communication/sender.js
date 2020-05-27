'use strict';

var vars = require('../index');
var request = require('request');
var reply=require('./reply')

var mqttApp = vars.mqttApp;
var mqttRequest = vars.mqttRequest;
var port= vars.port;
var topic = vars.topic;


//IP for use to reply from FCM
var ip= vars.ip;

//TODO: Change timeOutValue if necessary
//var timeOutValue = 4000;
var result;

var idRequest=0;

//TODO: Change for your FCM configuration.
var authorizationKey='AAAAgd_UWTU:APA91bF7oweax64Dl1wImcH6sVw6HHbb9HdjpPJ8KPtSaXNjd8nDPbVn3QPfmqUdYbQR0ZUx3rS_6I4VOEiX7S0sVOA4k_Qu601DHUfw543MtRgOPLYtluy8XgvDjfM5M8VlZXkyZicu';


//Write file
var fs = require('fs');
var filename = "test.csv";

var optionsAndroid = {
    uri: 'https://fcm.googleapis.com/fcm/send',
    method: 'POST',
    headers:{
        'Content-Type':'application/json',
        'Authorization':'key='+authorizationKey
    },
    json: true,
    body: {
        "to": "",
        "data":{
            "resource": "",
            "method": "",
            "sender":"",
            "idRequest":0,
            "params" : {

                }
            },
            
        "android":{
            "priority":"high"
            }
        }
    };

var optionsMqtt={
    "resource": "",
    "method": "",
    "sender":"",
    "idRequest": 0,
    "params": {

        }
  };

var reqMap = new Map();

var beginHR;
var begin;



// module.exports.xxxx = obj.XXXX;
//

exports.sendRequest =function (body, resource, method, res){
    var id=idRequest
    idRequest++

    switch(body.technology){
        case "mqtt":
            var sender='http://108.129.48.139:80/result'+method
            //TODO: Change if necessary by your configuration
            optionsMqtt.resource=resource;
            optionsMqtt.method=method;
            optionsMqtt.idRequest=id;
            optionsMqtt.sender=sender
            //TODO: Change or delete body.technology if necessary
            //delete body['technology'];
            optionsMqtt.params=body;

            //console.log(optionsMqtt)

            reply.createRequest(id);
            reqMap.set(id, { res: res, method: method, body: body, sent: false});


            beginHR = process.hrtime()
            begin = beginHR[0] * 1000000 + beginHR[1] / 1000;

            //TODO: Change if necessary by your configuration
            mqttApp.publish(topic, JSON.stringify(optionsMqtt));


            checkResult(id,method, body)

        break;

        case "firebase":

            delete body['technology'];

            //TODO: Change if necessary by your configuration
            var sender='http://108.129.48.139:80/result'+method

            optionsAndroid.body.to= '/topics/'+topic
            optionsAndroid.body.data.resource=resource
            optionsAndroid.body.data.method=method
            optionsAndroid.body.data.idRequest=id
            optionsAndroid.body.data.sender="\""+sender+"\""

            optionsAndroid.body.data.params=body


           // console.log(optionsAndroid)
            reply.createRequest(id);
            reqMap.set(id, { res: res, method: method, body: body, sent: false});
            
            beginHR = process.hrtime()
            begin = beginHR[0] * 1000000 + beginHR[1] / 1000;


            request(optionsAndroid, function (error, response, body) {
                if (!error && response.statusCode == 201 || response.statusCode == 200) {
                    console.log(body)
                }else{
                    console.log("Error:" + response.body)
                    res.status(404).send('No response from firebase: '+ response.body)
                }
            });

            checkResult(id,method, body)

        break;

        default:
            res.status(405).send({
                message: 'The technology param is incorrect'
            });
        break;
    }
}


function checkResult(id,method, body){
   
    var res;
    var obj;


    if(method=="restartApp" || method=="saveLogs" || method=="deleteLogs"){
        obj = reqMap.get(id);
        res=obj.res;
        res.status(201).send("Posted");
    }else{
       
        console.log("Timeout Value: "+body.timeout)
        setTimeout(function(){
            obj = reqMap.get(id);

            if(obj.sent==false){
                reqMap.set(id, { res: null, method: null, body: null, sent: true});
                res=obj.res;
               
                if(res=='mqtt')
                    mqttRequest.publish('result',"No results!");
                else
		    res.contentType('text/plain');
                    res.status(204).end();   

                var endHR = process.hrtime()
                var end = endHR[0] * 1000000 + endHR[1] / 1000;
                var duration = (end - begin) / 1000;
                var roundedDuration = Math.round(duration * 1000) / 1000;

                console.log("Request Duration (Not Complete): "+roundedDuration)
                
            }

        }, body.timeout);
    }      

}

exports.sendResult = function (id,devices){

        id= parseInt(id)
        var obj = reqMap.get(id);
        if(obj.sent==false){

            var endHR = process.hrtime()
            var end = endHR[0] * 1000000 + endHR[1] / 1000;
            var duration = (end - begin) / 1000;
            var tmobile = Math.round(duration * 1000) / 1000;

            console.log("Mobile Request Duration: "+tmobile)

           
            
            var res = obj.res;
            var method = obj.method;
            var params = obj.body;

            reqMap.set(id, { res: null, method: null, body: null, sent: true});
            
            var cloud;
            var size_body;
	    var size_array;


            [result,cloud,size_body,size_array]=reply.getResult(id, method,params)            
            
            console.log("Cloud DurationV2: "+cloud)
            
            //DateTime
            var dateTime = require('node-datetime');
            var dt = dateTime.create();
            var date_formatted = dt.format('Y-m-d,H:M:S');
            console.log("DateTime: "+date_formatted);

            writeFile(id,method,date_formatted,tmobile,cloud,size_body,size_array,devices)
        
            if(res=='mqtt'){
                mqttRequest.publish('result',JSON.stringify(result));
            }else{
                res.contentType('application/json');
                res.status(200).send(result);
            }
                


        }
    
    
    }



    function writeFile(id,method,timestamp,mobile,cloud, body,size_array,devices) {
        fs.writeFile(filename, id+","+timestamp+","+method+","+mobile+","+cloud+","+body+","+size_array+","+devices+'\n', { flag: "a" }, function(err) {
          if (err) {
            //console.log("file " + filename + " already exists, testing next");
           
          }
          else {
            //console.log("Succesfully written " + filename);
          }
        });
      
      }