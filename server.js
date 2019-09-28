let express = require('express');
let socket = require('socket.io')
let UUID = require('node-uuid');

let app = express();
let server = app.listen(3000);
let players= {};

app.use(express.static('public'));

let io = socket(server);

io.sockets.on('connection', function (client) {

  setupConnection(client);

  client.on('updatePosition', function (data) {
    //players[data.userid].pos = data.pos;
    client.broadcast.emit('updatePositionBroadcast', data);
  });

  client.on('disconnect', function() {
    console.log('client disconecctd', client.userid);
    delete players[client.userid];
    client.broadcast.emit('playerDisconnect', {userid: client.userid});
  });
});

function setupConnection(client) {
  client.userid = UUID();
  let idList = [];
  for (let key in players) {
    idList.push(players[key].userid);
  }
  client.emit('onConnect', { userid: client.userid, idList: idList } );
  players[client.userid] = client;
  console.log('someone connected', client.userid);
  client.broadcast.emit('newPlayerConnect', {userid: client.userid});
}
