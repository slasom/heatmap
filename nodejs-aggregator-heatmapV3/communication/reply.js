'use strict';

var manager=require('../manager/locationmanager')

//TODO: Change the type of result variable if it's necessary
var resultRequest=[];


//TODO: Change for your data processing
exports.insertReply = function (json){

    if(resultRequest.length>0){
        for(let val of resultRequest) {
            if(val.idRequest==json.idRequest){
                val.content.push(json.body)

                return val.content.length;
            }
        }

    }else
        return 0
    //return insertResultRequest(content)
}


exports.getResult = function(id,method,params){
    var res =  returnResults(id);

    if (res.length>0)
        res= processReply(res,method,params)
    else
        return null

    deleteRequest(id)

    return res;

}


exports.createRequest = function(id){
    var schema={"idRequest":0,"content":[]}
    schema.idRequest=id
    resultRequest.push(schema)
}




function processReply (result,method,params){

    var beginHR = process.hrtime()
    var begin = beginHR[0] * 1000000 + beginHR[1] / 1000;
    
    switch(method){
        case "getSCHeatmaps":
            result=manager.convertLocations(result,params)
            result=manager.filterHeatMap(result,params)
            result=manager.buildHeatMap(result)
            
            break;
            
        case "getMCHeatmaps":
            result=manager.convertLocationFrequency(result)
            result=manager.aggregateLocations(result)
        break;

    }

    var endHR = process.hrtime()
        var end = endHR[0] * 1000000 + endHR[1] / 1000;
        var duration = (end - begin) / 1000;
        var roundedDuration = Math.round(duration * 1000) / 1000;

        console.log("Cloud Computing Duration: "+roundedDuration)

    return result

}

function deleteRequest(id){
    resultRequest = resultRequest.filter(function(item){
        return item.idRequest !== id;
    });
}


function insertResultRequest(json) {
    if(resultRequest.length>0){
        for(let val of resultRequest) {
            if(val.idRequest==json.idRequest){
                val.content.push(json.body)

                return val.content.length;
            }
        }

    }else
        return 0

}

function returnResults(idRequest){
    if(resultRequest.length>0){
        for(let val of resultRequest) {
            if(val.idRequest==idRequest){
                return val.content
            }
        }

        return []

    }else
        return []
}