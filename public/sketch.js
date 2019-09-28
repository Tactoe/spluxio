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

function deleteArrayElem(array, elem) {
  let index = array.indexOf(elem);
  if (index > -1) {
    array.splice(index, 1);
  }
}

class Player {
  constructor(_id) {
    this.id = _id;
    this.pos = {
      x: canvasW / 2,
      y: canvasH / 2
    }
    this.dir = [0, 0];
    this.speed = 3;
    this.color = 'blue';
    this.trail = [];
    this.next = 0;
  }

  draw () {
    if (millis() > this.next) {
      this.trail.push(this.pos);
      this.next = millis() + 100;
    }
    push();
    fill(this.color);
    strokeWeight(4);
    stroke(this.color);
    if (this.trail.length > 4) {
      for(let i = 0; i < this.trail.length - 1; i++) {
        line(this.trail[i].x, this.trail[i].y, this.trail[i + 1].x, this.trail[i + 1].y);
      }
    }
    if (this.trail.length > 1000000) {
      this.trail.splice(0, 1);
    }
    ellipse(this.pos.x, this.pos.y, 10);
    pop();
  }
}

class LocalPlayer extends Player {

  draw () {
    this.pos.x += this.dir[0] * this.speed / 60;
    this.pos.y += this.dir[1] * this.speed / 60;
    if (millis() > this.next) {
      // console.log('pusing', this.pos)
      this.trail.push({x: this.pos.x, y: this.pos.y});
      // console.log(this.trail)
      this.next = millis() + 100;
    }
    push();
    fill(this.color);
    strokeWeight(4);
    stroke(this.color);
    if (this.trail.length > 4) {
      for(let i = 0; i < this.trail.length - 1; i++) {
        line(this.trail[i].x, this.trail[i].y, this.trail[i + 1].x, this.trail[i + 1].y);
      }
    }
    if (this.trail.length > 1000000) {
      this.trail.splice(0, 1);
    }
    ellipse(this.pos.x, this.pos.y, 10);
    pop();
    socket.emit('updatePosition', {userid: localPlayerId, pos: {x: this.pos.x, y: this.pos.y}})
  }

}

function setup() {
  createCanvas(canvasW, canvasH);
  //players[](new Player(0));
  socket = io.connect('http://localhost:3000');

  socket.on('onConnect', function (data) {
    console.log('I have succesfully connected, my id is', data.userid)
    players[data.userid] = new LocalPlayer(data.userid);
    for (let key in data.idList) {
      players[data.idList[key]] = new Player(data.idList[key]);
    }
    localPlayerId = data.userid;
  });
  socket.on('newPlayerConnect', function(data) {
    console.log('Someone succesfully connected, their id is', data.userid)
    players[data.userid] = new Player(data.userid);
  });
  socket.on('playerDisconnect', function(data) {
    console.log('Removing', data.userid)
    delete players[data.userid];
  });
  socket.on('updatePositionBroadcast', function (data) {
    players[data.userid].pos = data.pos;
  });
}

// function updatePosition(data) {
//   // let angle = Mathf.Atan2(dir.y, dir.x) * Mathf.Rad2Deg;
//   // transform.rotation = Quaternion.AngleAxis(angle, Vector3.forward);
//   players[data.userid].x = data.x;
//   players[data.userid].y = data.y;
// }
//
function draw() {
  background(255);
  for (let i in players) {
    players[i].draw();
  }
}

function clamp(n, min, max) {
  // return Math.min(Math.max(n, min), max);
  return n
}

function mouseDragged() {
  let player = players[localPlayerId];
  player.dir = [clamp(mouseX - player.pos.x, -30, 30), clamp(mouseY - player.pos.y, -30, 30)];
}
