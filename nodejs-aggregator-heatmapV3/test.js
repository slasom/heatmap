var http = require('http');    
var request = require('request'); 


 var bla = ["http://108.129.48.139/firebase/locations?beginDate=2019-06-10T08:00:28Z&endDate=2019-06-19T20:56:28Z&latitude=37.378833&longitude=-5.970739&radius=3000"];

var heatmap= "http://localhost:8080/mqtt/heatmaps?beginDate=2019-06-09T09:00:28Z&endDate=2019-06-21T22:32:28Z&latitude=37.378833&longitude= -5.976987&radius=3000";

 // var responses = [];
// var completed_requests = 0;

// for (i in urls) {
//     http.get(urls[i], function(res) {
//         responses.push(res);
//         completed_requests++;
//         if (completed_requests == urls.length) {
//             // All download done, process responses array
//             //console.log(responses);
//             responses.forEach((disp) => {
//                 console.log(disp.statusCode);
//             });
//         }
//     });
// }

function asyncFunctionCall(url) {
    return new Promise(resolve => {
      request(url, function (error, response, body) {
        if(typeof response !== 'undefined') {
          if((response.statusCode >= 400 && response.statusCode <= 451)
          || (response.statusCode >= 500 && response.statusCode <= 511)) {
            resolve(true);
            return;
          }
        }
        resolve(false);
      });
    });
  }




function write(bla) { // gets called one after another
    const promises = [];
    for(var i=0; i< 500; i++){
        promises.push(asyncFunctionCall(heatmap)); 
    }
    // bla.forEach((url) => {
    //     console.log(url)
    //     promises.push(asyncFunctionCall(url)); 
    // });

    return Promise.all(promises);
}

let p = Promise.resolve();

async function doTheWrites() {

    // Here i parse the json object "foo" in the json array "bar"
    // bla is an array of multiple urls.
    await write(bla);

}

doTheWrites().then(() => {
    // All done
  });
