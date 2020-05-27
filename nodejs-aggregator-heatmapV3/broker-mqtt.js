//This class is used to deploy a mqtt server locally
var mosca = require('mosca');

var settings = {
    port:1883
}

var server = new mosca.Server(settings);

server.on('ready', function(){
    console.log("ready");
});

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
  console.log('Published', packet.payload);
});

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');
}