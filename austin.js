//   <Austin Joness>


var G = {};
var BALL_RADIUS = 6;
var BALL_COLOR = "green"
var GAME_DELAY = 60
function initialize() {
    G.canvas = get("canvas");
    G.context = G.canvas.getContext("2d");
    G.center = makePoint(G.canvas.width/2, G.canvas.height/2);
    G.ball = makeBall(G.center, BALL_RADIUS, BALL_COLOR);
    G.rightPaddle = makeBlock(makePoint(400 ,140 ), 10, 50,"blue");
    G.leftPaddle = makeBlock(makePoint(10, 140 ), 10, 50, "orange");
    G.gameOn = true;
    G.leftPaddlescore = 0
    G.rightPaddlescore = 0
    document.addEventListener("keydown", keydownHandler);
    document.addEventListener("keyup", keyupHandler);
    gameStep();

}


function keydownHandler(event) {
    if (event.key === "s") {
      G.leftPaddle.dy = 5;
    }else if (event.key === "w") {
      G.leftPaddle.dy = -5;
    }else if (event.key === "ArrowUp") {
      G.rightPaddle.dy = -5;
    }else if (event.key === "ArrowDown") {
      G.rightPaddle.dy = 5;
    }else if (event.key === " ") {
      G.gameOn = !G.gameOn
    }else if(event.key === "r"){
      initialize()
    }
}

function keyupHandler(event) {
    if (event.key === "s" || event.key === "w") {
      G.leftPaddle.dy = 0;
    }else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      G.rightPaddle.dy = 0;
    }
}


function render() {
    G.context.clearRect(0, 0, G.canvas.width, G.canvas.height);
    drawBlock(G.leftPaddle);
    drawBlock(G.rightPaddle);
    drawBall(G.ball);

}
function gameStep (){
  if(G.gameOn){
    G.leftPaddle.move();
    G.rightPaddle.move();
    G.ball.moveBall()
    showscore()
    render()
    if(G.ball.center.x -G.ball.radius <= 0 || G.ball.center.x + G.ball.radius >= G.canvas.width){
    G.ball.center = G.center

  }if(G.leftPaddlescore === 3){
    var winnerElement = get("winner")
    winnerElement.innerHTML = "LeftPaddle Wins!!!"
    G.gameOn = !G.gameOn
  }if(G.rightPaddlescore === 3){
    var winnerElement = get("winner")
    winnerElement.innerHTML = "RightPaddle Wins!!!"
    G.gameOn = !G.gameOn
  }
}setTimeout(gameStep, 60)

}
function showscore() {
    var lscoreElement = get("lscore");
    lscoreElement.innerHTML = " leftpaddle : " + G.leftPaddlescore;
    if(G.ball.center.x - G.ball.radius <= 0 ){
      G.rightPaddlescore = G.rightPaddlescore + 1
      G.gameOn = !G.gameOn

    }
    var rscoreElement = get("rscore");
    rscoreElement.innerHTML = " rightpaddle : " + G.rightPaddlescore;
    if(G.ball.center.x + G.ball.radius >= G.canvas.width ){
      G.leftPaddlescore = G.leftPaddlescore + 1
      G.gameOn = !G.gameOn

    }

}





function makeBlock(cornerPt, width, height, color) {
    var obj = {
        corner: cornerPt,
        w: width,
        h: height,
        color: color,
        move: function () {
          var newPt = translatePoint(this.corner, this.dx, this.dy)
          if (newPt.y >= 0 && newPt.y + this.h <= G.canvas.height) {
            this.corner = newPt;
          }
        }
    };
    obj.dx = 0;
    obj.dy = 0;

    return obj;
}
function makeBall(cen, rad, col){
  var obj = {
    center: cen,
    radius: rad,
    color: col,
    moveBall: function () {
      if(this.center.y >= G.rightPaddle.corner.y &&
         this.center.y <= G.rightPaddle.corner.y + G.rightPaddle.h &&
         Math.abs(this.center.x - G.rightPaddle.corner.x) <= this.radius){
        this.dx = -this.dx * 1.1;
      }
      if(this.center.y >= G.leftPaddle.corner.y &&
         this.center.y <= G.leftPaddle.corner.y + G.leftPaddle.h &&
         Math.abs(this.center.x - (G.leftPaddle.corner.x + G.leftPaddle.w)) <= this.radius){
        this.dx = -this.dx * 1.1;
      }
      if (this.center.x <= 0 || this.center.x >= G.canvas.width) {
          this.dx = -this.dx;
      }
      if (this.center.y <= 0 || this.center.y >= G.canvas.height) {
          this.dy = -this.dy;
      }
      this.center = translatePoint(this.center, this.dx, this.dy);
    }
  };
  obj.dx = 2;
  obj.dy = 2;
  return obj;
}

function translatePoint(p, dx, dy) {
    return makePoint(p.x + dx, p.y + dy);
}









function drawBlock(block) {
    G.context.fillStyle = block.color;
    G.context.fillRect(block.corner.x, block.corner.y, block.w, block.h);
}
function drawBall(ball){
  G.context.beginPath();
  G.context.fillStyle = ball.color;
  G.context.arc(ball.center.x, ball.center.y, ball.radius, 0, 2*Math.PI);
  G.context.fill();

}


// =================================================================

function makePoint(x, y) {
    var obj = {x: x, y: y};
    return obj;
}


function get(id) {
    var element = document.getElementById(id);
    if (element === null) {
        console.error("DOM id " + id + " not found!");
    }
    return element;
}
