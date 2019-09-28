let canvasW = 500;
let canvasH = 500;
let players = {};
let localPlayerId;
let socket;

function getDirection() {
  return [(mouseX > canvasW / 2 ? 1 : -1), (mouseY > canvasH / 2 ? 1 : -1)];
}

function isWithinBounds(x, y, minPos, maxPos) {
  return (x >= minPos[0] && x <= maxPos[0] && y >= minPos[1] && y <= maxPos[1]);
}

class GameDirector {
  constructor() {
    this.round = 0;
    this.lgbtList = [];
  }

  startGame(players) {
    this.lgbtList = players.slice(0, players.length / 3);
  }
}

class Player {
  constructor(_id) {
    this.id = _id;
    this.x = canvasW / 2;
    this.y = canvasH / 2;
    this.currentDir = [0, 0];
  }

  draw () {
    ellipse(this.x, this.y, 10);
  }
}

class LocalPlayer extends Player {

  draw () {
    this.x += this.currentDir[0];
    this.y += this.currentDir[1];
    ellipse(this.x, this.y, 10);
    // socket.emit('updatePosition', {x: this.x, y: this.y})
  }

}

function setup() {
  createCanvas(canvasW, canvasH);
  //players[](new Player(0));

  socket.on('onConnect', function (data) {
    console.log('I have succesfully connected, my id is', data.id)
    players[data.id] = new LocalPlayer(data.id);
  });
  socket.on('newPlayerConnect', function(data) {
    console.log('Someone succesfully connected, their id is', data.id)
    players[data.id] = new Player(data.id);
  });
}

// function updatePosition(data) {
//   // let angle = Mathf.Atan2(dir.y, dir.x) * Mathf.Rad2Deg;
//   // transform.rotation = Quaternion.AngleAxis(angle, Vector3.forward);
//   players[data.id].x = data.x;
//   players[data.id].y = data.y;
// }
//
function draw() {
  background(0);
  for (let i in players) {
    players[i].draw();
  }
}

function mousePressed() {
  let player = players[localPlayerId];
  // let angle = Mathf.Atan2(dir.y, dir.x) * Mathf.Rad2Deg;
  // transform.rotation = Quaternion.AngleAxis(angle, Vector3.forward);
  // socket.emit('updatePosition', {id: localPlayerId, dir: [mouseX - player.x, mouseY - player.y]})
}
