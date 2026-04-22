// Tetris — iOS 12+ uyumlu (iPhone 6 dahil)
var canvas   = document.getElementById("tetris-canvas");
var ctx      = canvas.getContext("2d");
var nextCvs  = document.getElementById("next-canvas");
var nextCtx  = nextCvs.getContext("2d");

var COLS = 10, ROWS = 20, BLOCK = 24;

var COLORS = ["#00cfff","#ffcc00","#9b59b6","#2ecc71","#e74c3c","#e67e22","#3498db"];
var SHAPES = [
  [[1,1,1,1]],
  [[1,1],[1,1]],
  [[0,1,0],[1,1,1]],
  [[0,1,1],[1,1,0]],
  [[1,1,0],[0,1,1]],
  [[1,0,0],[1,1,1]],
  [[0,0,1],[1,1,1]]
];

var board, piece, next, score, level, lines, dropInterval, running, paused;
var lastDrop = 0;
var animId = null;

function newBoard() {
  var b = [];
  for (var i=0; i<ROWS; i++) { var row=[]; for(var j=0;j<COLS;j++) row.push(null); b.push(row); }
  return b;
}

function makePiece(type) {
  var shape = [];
  for (var i=0;i<SHAPES[type].length;i++) shape.push(SHAPES[type][i].slice());
  return { shape:shape, color:COLORS[type], x:Math.floor(COLS/2)-Math.floor(shape[0].length/2), y:0 };
}

function randType() { return Math.floor(Math.random()*SHAPES.length); }

function rotate90(s) {
  var rows=s.length, cols=s[0].length, r=[];
  for(var c=0;c<cols;c++){var row=[];for(var ri=rows-1;ri>=0;ri--) row.push(s[ri][c]);r.push(row);}
  return r;
}

function valid(p, dx, dy, sh) {
  dx = dx||0; dy = dy||0;
  var s = sh||p.shape;
  for (var r=0;r<s.length;r++) for(var c=0;c<s[r].length;c++){
    if(!s[r][c]) continue;
    var nx=p.x+c+dx, ny=p.y+r+dy;
    if(nx<0||nx>=COLS||ny>=ROWS) return false;
    if(ny>=0&&board[ny][nx]) return false;
  }
  return true;
}

function place() {
  for(var r=0;r<piece.shape.length;r++) for(var c=0;c<piece.shape[r].length;c++){
    if(piece.shape[r][c]) board[piece.y+r][piece.x+c]=piece.color;
  }
  var cleared=0;
  for(var r=ROWS-1;r>=0;r--){
    var full=true; for(var c=0;c<COLS;c++) if(!board[r][c]){full=false;break;}
    if(full){board.splice(r,1);board.unshift(newBoard()[0]);cleared++;r++;}
  }
  lines+=cleared;
  score+=[0,100,300,500,800][cleared]*level;
  level=Math.floor(lines/10)+1;
  dropInterval=Math.max(80,900-(level-1)*80);
  updateHud();
  spawnPiece();
}

function spawnPiece() {
  piece=next; next=makePiece(randType());
  if(!valid(piece,0,0)){gameOver();return;}
  drawNext();
}

function ghostY() {
  var gy=0; while(valid(piece,0,gy+1)) gy++; return gy;
}

function drawBlock(c, x, y, sz, c2) {
  sz=sz||BLOCK; c2=c2||ctx;
  c2.fillStyle=c;
  c2.fillRect(x*sz+1,y*sz+1,sz-2,sz-2);
  c2.fillStyle="rgba(255,255,255,0.18)";
  c2.fillRect(x*sz+1,y*sz+1,sz-2,4);
  c2.fillStyle="rgba(0,0,0,0.18)";
  c2.fillRect(x*sz+1,y*sz+sz-5,sz-2,4);
}

function draw() {
  ctx.fillStyle="#0d0d1a"; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle="rgba(255,255,255,0.04)"; ctx.lineWidth=1;
  for(var r=0;r<ROWS;r++){ctx.beginPath();ctx.moveTo(0,r*BLOCK);ctx.lineTo(canvas.width,r*BLOCK);ctx.stroke();}
  for(var c=0;c<COLS;c++){ctx.beginPath();ctx.moveTo(c*BLOCK,0);ctx.lineTo(c*BLOCK,canvas.height);ctx.stroke();}
  for(var r=0;r<ROWS;r++) for(var c=0;c<COLS;c++) if(board[r][c]) drawBlock(board[r][c],c,r);
  if(piece){
    var gy=ghostY();
    ctx.globalAlpha=0.18;
    for(var r=0;r<piece.shape.length;r++) for(var c=0;c<piece.shape[r].length;c++)
      if(piece.shape[r][c]) drawBlock(piece.color,piece.x+c,piece.y+r+gy);
    ctx.globalAlpha=1;
    for(var r=0;r<piece.shape.length;r++) for(var c=0;c<piece.shape[r].length;c++)
      if(piece.shape[r][c]) drawBlock(piece.color,piece.x+c,piece.y+r);
  }
  if(!running){
    ctx.fillStyle="rgba(0,0,0,0.62)"; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#fff"; ctx.font="bold 22px sans-serif"; ctx.textAlign="center";
    ctx.fillText(score>0?"OYUN BİTTİ":"HAZIR",canvas.width/2,canvas.height/2-14);
    if(score>0){ctx.font="16px sans-serif";ctx.fillText("Skor: "+score,canvas.width/2,canvas.height/2+14);}
  }
  if(paused&&running){
    ctx.fillStyle="rgba(0,0,0,0.55)"; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#fff"; ctx.font="bold 22px sans-serif"; ctx.textAlign="center";
    ctx.fillText("DURAKLADI",canvas.width/2,canvas.height/2);
  }
}

function drawNext() {
  nextCtx.fillStyle="#0d0d1a"; nextCtx.fillRect(0,0,56,56);
  var s=next.shape, sz=13;
  var ox=Math.floor((4-s[0].length)/2)*sz+1;
  var oy=Math.floor((4-s.length)/2)*sz+1;
  for(var r=0;r<s.length;r++) for(var c=0;c<s[r].length;c++){
    if(!s[r][c]) continue;
    nextCtx.fillStyle=next.color;
    nextCtx.fillRect(ox+c*sz,oy+r*sz,sz-1,sz-1);
    nextCtx.fillStyle="rgba(255,255,255,0.2)";
    nextCtx.fillRect(ox+c*sz,oy+r*sz,sz-1,3);
  }
}

function updateHud(){
  document.getElementById("score").textContent=score;
  document.getElementById("level").textContent=level;
}

function loop(ts){
  if(running&&!paused&&ts-lastDrop>dropInterval){lastDrop=ts;softDrop();}
  draw();
  animId=requestAnimationFrame(loop);
}

function softDrop(){ if(valid(piece,0,1)) piece.y++; else place(); }

function hardDrop(){
  if(!running||paused) return;
  while(valid(piece,0,1)) piece.y++;
  place();
}

function moveLeft(){  if(running&&!paused&&valid(piece,-1,0)) piece.x--; }
function moveRight(){ if(running&&!paused&&valid(piece, 1,0)) piece.x++; }

function rotatePiece(){
  if(!running||paused) return;
  var r=rotate90(piece.shape);
  var kicks=[0,-1,1,-2,2];
  for(var i=0;i<kicks.length;i++){
    if(valid(piece,kicks[i],0,r)){piece.x+=kicks[i];piece.shape=r;return;}
  }
}

function startGame(){
  board=newBoard(); score=0; level=1; lines=0; dropInterval=900; running=true; paused=false;
  next=makePiece(randType()); spawnPiece(); updateHud();
  document.getElementById("start-btn").textContent="🔁 Yeniden";
  document.getElementById("btn-pause").textContent="⏸ Duraklat";
  if(animId) cancelAnimationFrame(animId);
  lastDrop=performance.now();
  animId=requestAnimationFrame(loop);
}

function togglePause(){
  if(!running) return;
  paused=!paused;
  document.getElementById("btn-pause").textContent=paused?"▶ Devam":"⏸ Duraklat";
  if(!paused) lastDrop=performance.now();
}

function gameOver(){
  running=false;
  document.getElementById("start-btn").textContent="▶ Tekrar";
}

document.getElementById("start-btn").addEventListener("click",startGame);
document.getElementById("btn-pause").addEventListener("click",togglePause);
document.getElementById("btn-drop").addEventListener("click",hardDrop);

document.addEventListener("keydown",function(e){
  if(!running) return;
  if(e.key==="p"||e.key==="P"){togglePause();return;}
  if(paused) return;
  if(e.key==="ArrowLeft"){e.preventDefault();moveLeft();}
  else if(e.key==="ArrowRight"){e.preventDefault();moveRight();}
  else if(e.key==="ArrowDown"){e.preventDefault();softDrop();}
  else if(e.key==="ArrowUp"){e.preventDefault();rotatePiece();}
  else if(e.key===" "){e.preventDefault();hardDrop();}
});

// Canvas dokunma = döndür
canvas.addEventListener("touchstart",function(e){e.preventDefault();rotatePiece();},{passive:false});
canvas.addEventListener("click",function(){rotatePiece();});

// Sol / Sağ zon — basılı tut desteği
function setupZone(id, moveFn){
  var zone=document.getElementById(id);
  if(!zone) return;
  var holdTimer=null, holdInterval=null;
  function startHold(){
    zone.classList.add("pressed");
    moveFn();
    holdTimer=setTimeout(function(){holdInterval=setInterval(moveFn,80);},250);
  }
  function endHold(){
    zone.classList.remove("pressed");
    clearTimeout(holdTimer); clearInterval(holdInterval);
  }
  zone.addEventListener("touchstart",function(e){e.preventDefault();startHold();},{passive:false});
  zone.addEventListener("touchend",  function(e){e.preventDefault();endHold();  },{passive:false});
  zone.addEventListener("touchcancel",function(e){e.preventDefault();endHold(); },{passive:false});
  zone.addEventListener("mousedown",startHold);
  zone.addEventListener("mouseup",endHold);
  zone.addEventListener("mouseleave",endHold);
}

setupZone("zone-left", moveLeft);
setupZone("zone-right",moveRight);

// İlk çizim
board=newBoard(); running=false; paused=false; score=0; level=1; lines=0; dropInterval=900;
next=makePiece(0); piece=makePiece(0); draw();
