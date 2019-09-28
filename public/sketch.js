let canvasW = 500;
let canvasH = 500;
let players = [];

function getDirection() {
  return [(mouseX > canvasW / 2 ? 1 : -1), (mouseY > canvasH / 2 ? 1 : -1)];
}

class Player {
  constructor(_id) {
    this.id = _id;
    this.x = canvasW / 2;
    this.y = canvasH / 2;
  }

  draw () {
    let dir = getDirection();
    this.x += dir[0];
    this.y += dir[1];
    ellipse(this.x, this.y, 10);
  }
}

function setup() {
  createCanvas(canvasW, canvasH);
  players.push(new Player(0));
}

function draw() {
  background(0);
  ellipse(50, 50, 80, 80);
  for (let i in players) {
    players[i].draw();
  }
}
