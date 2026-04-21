const canvas   = document.getElementById("tetris-canvas");
const ctx       = canvas.getContext("2d");
const nextCvs   = document.getElementById("next-canvas");
const nextCtx   = nextCvs.getContext("2d");

const COLS = 10, ROWS = 20, BLOCK = 24;

const COLORS = ["#00cfff","#ffcc00","#9b59b6","#2ecc71","#e74c3c","#e67e22","#3498db"];
const SHAPES = [
  [[1,1,1,1]],
  [[1,1],[1,1]],
  [[0,1,0],[1,1,1]],
  [[0,1,1],[1,1,0]],
  [[1,1,0],[0,1,1]],
  [[1,0,0],[1,1,1]],
  [[0,0,1],[1,1,1]]
];

let board, piece, next, score, level, lines, dropInterval, running, paused;
let lastDrop = 0;
let animId = null;

// ── Yardımcı Fonksiyonlar ──────────────────────────────────────────────

function newBoard() { return Array.from({length: ROWS}, () => Array(COLS).fill(null)); }

function makePiece(type) {
  const shape = SHAPES[type].map(r => r.slice());
  return { shape, color: COLORS[type], x: Math.floor(COLS/2) - Math.floor(shape[0].length/2), y: 0 };
}

function randType() { return Math.floor(Math.random() * SHAPES.length); }

function rotate90(s) { return s[0].map((_, i) => s.map(r => r[i]).reverse()); }

function valid(p, dx=0, dy=0, sh=null) {
  const s = sh || p.shape;
  for (let r=0; r<s.length; r++) for (let c=0; c<s[r].length; c++) {
    if (!s[r][c]) continue;
    const nx = p.x+c+dx, ny = p.y+r+dy;
    if (nx<0 || nx>=COLS || ny>=ROWS) return false;
    if (ny>=0 && board[ny][nx]) return false;
  }
  return true;
}

function place() {
  piece.shape.forEach((r,ri) => r.forEach((v,ci) => {
    if (v) board[piece.y+ri][piece.x+ci] = piece.color;
  }));
  let cleared = 0;
  for (let r=ROWS-1; r>=0; r--) {
    if (board[r].every(c=>c)) { board.splice(r,1); board.unshift(Array(COLS).fill(null)); cleared++; r++; }
  }
  lines += cleared;
  score += [0,100,300,500,800][cleared] * level;
  level = Math.floor(lines/10)+1;
  dropInterval = Math.max(80, 900-(level-1)*80);
  updateHud();
  spawnPiece();
}

function spawnPiece() {
  piece = next; next = makePiece(randType());
  if (!valid(piece)) { gameOver(); return; }
  drawNext();
}

function ghostY() {
  let gy = 0;
  while (valid(piece, 0, gy+1)) gy++;
  return gy;
}

// ── Çizim ─────────────────────────────────────────────────────────────

function drawBlock(c, x, y, sz=BLOCK, c2=ctx) {
  c2.fillStyle = c;
  c2.fillRect(x*sz+1, y*sz+1, sz-2, sz-2);
  c2.fillStyle = "rgba(255,255,255,0.18)";
  c2.fillRect(x*sz+1, y*sz+1, sz-2, 4);
  c2.fillStyle = "rgba(0,0,0,0.18)";
  c2.fillRect(x*sz+1, y*sz+sz-5, sz-2, 4);
}

function draw() {
  ctx.fillStyle = "#0d0d1a"; ctx.fillRect(0,0,canvas.width,canvas.height);

  // Izgara
  ctx.strokeStyle = "rgba(255,255,255,0.04)"; ctx.lineWidth = 1;
  for (let r=0;r<ROWS;r++){ctx.beginPath();ctx.moveTo(0,r*BLOCK);ctx.lineTo(canvas.width,r*BLOCK);ctx.stroke();}
  for (let c=0;c<COLS;c++){ctx.beginPath();ctx.moveTo(c*BLOCK,0);ctx.lineTo(c*BLOCK,canvas.height);ctx.stroke();}

  board.forEach((row,r) => row.forEach((c,ci) => { if(c) drawBlock(c,ci,r); }));

  if (piece) {
    // Ghost
    const gy = ghostY();
    ctx.globalAlpha = 0.18;
    piece.shape.forEach((r,ri) => r.forEach((v,ci) => {
      if(v) drawBlock(piece.color, piece.x+ci, piece.y+ri+gy);
    }));
    ctx.globalAlpha = 1;
    // Asıl parça
    piece.shape.forEach((r,ri) => r.forEach((v,ci) => {
      if(v) drawBlock(piece.color, piece.x+ci, piece.y+ri);
    }));
  }

  if (!running) {
    ctx.fillStyle = "rgba(0,0,0,0.62)"; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#fff"; ctx.font = "bold 22px sans-serif"; ctx.textAlign = "center";
    ctx.fillText(score>0 ? "OYUN BİTTİ" : "HAZIR", canvas.width/2, canvas.height/2-14);
    if (score>0) { ctx.font="16px sans-serif"; ctx.fillText("Skor: "+score, canvas.width/2, canvas.height/2+14); }
  }
  if (paused && running) {
    ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#fff"; ctx.font = "bold 22px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("⏸ DURAKLADI", canvas.width/2, canvas.height/2);
  }
}

function drawNext() {
  nextCtx.fillStyle = "#0d0d1a"; nextCtx.fillRect(0,0,60,60);
  const s = next.shape;
  const sz = 14;
  const ox = Math.floor((4-s[0].length)/2)*sz + 1;
  const oy = Math.floor((4-s.length)/2)*sz + 1;
  s.forEach((r,ri) => r.forEach((v,ci) => { if(v) drawBlock(next.color, 0, 0, 1, nextCtx); }));
  // doğru çizim
  nextCtx.fillStyle = "#0d0d1a"; nextCtx.fillRect(0,0,60,60);
  s.forEach((r,ri) => r.forEach((v,ci) => {
    if (!v) return;
    nextCtx.fillStyle = next.color;
    nextCtx.fillRect(ox+ci*sz, oy+ri*sz, sz-1, sz-1);
    nextCtx.fillStyle = "rgba(255,255,255,0.2)";
    nextCtx.fillRect(ox+ci*sz, oy+ri*sz, sz-1, 3);
  }));
}

function updateHud() {
  document.getElementById("score").textContent = score;
  document.getElementById("level").textContent = level;
}

// ── Oyun Döngüsü ───────────────────────────────────────────────────────

function loop(ts) {
  if (running && !paused && ts - lastDrop > dropInterval) {
    lastDrop = ts; softDrop();
  }
  draw();
  animId = requestAnimationFrame(loop);
}

function softDrop() { if (valid(piece,0,1)) piece.y++; else place(); }

function hardDrop() {
  if (!running || paused) return;
  while (valid(piece,0,1)) piece.y++;
  place();
}

function moveLeft()  { if (running && !paused && valid(piece,-1)) piece.x--; }
function moveRight() { if (running && !paused && valid(piece, 1)) piece.x++; }

function rotatepiece() {
  if (!running || paused) return;
  const r = rotate90(piece.shape);
  // Wall kick: normal, -1, +1, -2, +2
  for (const kick of [0,-1,1,-2,2]) {
    if (valid(piece, kick, 0, r)) { piece.x += kick; piece.shape = r; return; }
  }
}

// ── Başlat / Bitir ─────────────────────────────────────────────────────

function startGame() {
  board = newBoard(); score=0; level=1; lines=0; dropInterval=900; running=true; paused=false;
  next = makePiece(randType()); spawnPiece(); updateHud();
  document.getElementById("start-btn").textContent = "🔁 Yeniden";
  document.getElementById("btn-pause").textContent = "⏸ Duraklat";
  if (animId) cancelAnimationFrame(animId);
  lastDrop = performance.now();
  animId = requestAnimationFrame(loop);
}

function togglePause() {
  if (!running) return;
  paused = !paused;
  document.getElementById("btn-pause").textContent = paused ? "▶ Devam" : "⏸ Duraklat";
  if (!paused) { lastDrop = performance.now(); }
}

function gameOver() {
  running = false;
  document.getElementById("start-btn").textContent = "▶ Tekrar";
}

// ── Buton & Klavye Olayları ────────────────────────────────────────────

document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("btn-pause").addEventListener("click", togglePause);
document.getElementById("btn-drop").addEventListener("click",  hardDrop);

document.addEventListener("keydown", e => {
  if (!running) return;
  if (e.key==="p"||e.key==="P") { togglePause(); return; }
  if (paused) return;
  switch(e.key) {
    case "ArrowLeft":  e.preventDefault(); moveLeft();  break;
    case "ArrowRight": e.preventDefault(); moveRight(); break;
    case "ArrowDown":  e.preventDefault(); softDrop();  break;
    case "ArrowUp":    e.preventDefault(); rotatepiece(); break;
    case " ":          e.preventDefault(); hardDrop();  break;
  }
});

// ── Dokunmatik: Canvas = Döndür ────────────────────────────────────────

canvas.addEventListener("touchstart", e => {
  e.preventDefault();
  rotatepiece();
}, { passive: false });

canvas.addEventListener("click", () => rotatepiece());

// ── Dokunmatik: Sol / Sağ Zon (basılı tut = sürekli hareket) ──────────

function setupZone(zoneId, moveFn) {
  const zone = document.getElementById(zoneId);
  if (!zone) return;
  let holdTimer = null;
  let holdInterval = null;

  function startHold() {
    zone.classList.add("pressed");
    moveFn(); // anlık hareket
    holdTimer = setTimeout(() => {
      holdInterval = setInterval(moveFn, 80); // basılı tutunca sürekli
    }, 250);
  }
  function endHold() {
    zone.classList.remove("pressed");
    clearTimeout(holdTimer);
    clearInterval(holdInterval);
  }

  zone.addEventListener("touchstart",  e => { e.preventDefault(); startHold(); }, { passive: false });
  zone.addEventListener("touchend",    e => { e.preventDefault(); endHold();   }, { passive: false });
  zone.addEventListener("touchcancel", e => { e.preventDefault(); endHold();   }, { passive: false });
  zone.addEventListener("mousedown", startHold);
  zone.addEventListener("mouseup",   endHold);
  zone.addEventListener("mouseleave",endHold);
}

setupZone("zone-left",  moveLeft);
setupZone("zone-right", moveRight);

// ── İlk Çizim ──────────────────────────────────────────────────────────

board = newBoard(); running = false; paused = false; score=0; level=1; lines=0; dropInterval=900;
next = makePiece(0); piece = makePiece(0); draw();
