const canvas = document.getElementById("tetris-canvas");
const ctx = canvas.getContext("2d");
const nextCanvas = document.getElementById("next-canvas");
const nextCtx = nextCanvas.getContext("2d");
const COLS = 10, ROWS = 20, BLOCK = 24;
const COLORS = ["#00cfff","#ffcc00","#9b59b6","#2ecc71","#e74c3c","#e67e22","#3498db"];
const SHAPES = [
  [[1,1,1,1]],                          // I
  [[1,1],[1,1]],                        // O
  [[0,1,0],[1,1,1]],                    // T
  [[0,1,1],[1,1,0]],                    // S
  [[1,1,0],[0,1,1]],                    // Z
  [[1,0,0],[1,1,1]],                    // J
  [[0,0,1],[1,1,1]]                     // L
];

let board, piece, next, score, level, lines, dropTimer, dropInterval, running, paused;

function newBoard() { return Array.from({length: ROWS}, () => Array(COLS).fill(null)); }

function newPiece(type) {
  const shape = SHAPES[type].map(r => r.slice());
  return { shape, color: COLORS[type], x: Math.floor(COLS/2) - Math.floor(shape[0].length/2), y: 0 };
}

function randomType() { return Math.floor(Math.random() * SHAPES.length); }

function rotate(shape) {
  return shape[0].map((_, i) => shape.map(r => r[i]).reverse());
}

function valid(p, dx=0, dy=0, sh=null) {
  const s = sh || p.shape;
  for (let r = 0; r < s.length; r++) {
    for (let c = 0; c < s[r].length; c++) {
      if (!s[r][c]) continue;
      const nx = p.x + c + dx, ny = p.y + r + dy;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
      if (ny >= 0 && board[ny][nx]) return false;
    }
  }
  return true;
}

function place() {
  piece.shape.forEach((r, ri) => r.forEach((v, ci) => {
    if (v) board[piece.y + ri][piece.x + ci] = piece.color;
  }));
  let cleared = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(c => c)) { board.splice(r, 1); board.unshift(Array(COLS).fill(null)); cleared++; r++; }
  }
  lines += cleared;
  score += [0, 100, 300, 500, 800][cleared] * level;
  level = Math.floor(lines / 10) + 1;
  dropInterval = Math.max(100, 800 - (level - 1) * 70);
  updateHud();
  spawnPiece();
}

function spawnPiece() {
  piece = next; next = newPiece(randomType());
  if (!valid(piece)) { endGame(); return; }
  drawNext();
}

function drawBlock(c, x, y, size=BLOCK, ctx2=ctx) {
  ctx2.fillStyle = c;
  ctx2.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
  ctx2.fillStyle = "rgba(255,255,255,0.15)";
  ctx2.fillRect(x * size + 1, y * size + 1, size - 2, 4);
}

function draw() {
  ctx.fillStyle = "#0d0d1a"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Izgara
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  for (let r = 0; r < ROWS; r++) { ctx.beginPath(); ctx.moveTo(0, r*BLOCK); ctx.lineTo(canvas.width, r*BLOCK); ctx.stroke(); }
  for (let c = 0; c < COLS; c++) { ctx.beginPath(); ctx.moveTo(c*BLOCK, 0); ctx.lineTo(c*BLOCK, canvas.height); ctx.stroke(); }
  // Board
  board.forEach((row, r) => row.forEach((c, ci) => { if (c) drawBlock(c, ci, r); }));
  // Ghost piece
  if (piece) {
    let gy = 0;
    while (valid(piece, 0, gy + 1)) gy++;
    ctx.globalAlpha = 0.2;
    piece.shape.forEach((r, ri) => r.forEach((v, ci) => {
      if (v) drawBlock(piece.color, piece.x + ci, piece.y + ri + gy);
    }));
    ctx.globalAlpha = 1;
    // Active piece
    piece.shape.forEach((r, ri) => r.forEach((v, ci) => {
      if (v) drawBlock(piece.color, piece.x + ci, piece.y + ri);
    }));
  }
  if (!running) {
    ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff"; ctx.font = "bold 20px sans-serif"; ctx.textAlign = "center";
    ctx.fillText(score > 0 ? "OYUN BİTTİ" : "HAZIR", canvas.width/2, canvas.height/2 - 10);
    if (score > 0) { ctx.font = "16px sans-serif"; ctx.fillText("Skor: " + score, canvas.width/2, canvas.height/2 + 18); }
  }
  if (paused) {
    ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff"; ctx.font = "bold 22px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("DURAKLADI", canvas.width/2, canvas.height/2);
  }
}

function drawNext() {
  nextCtx.fillStyle = "#0d0d1a"; nextCtx.fillRect(0, 0, 80, 80);
  const s = next.shape, ox = Math.floor((4 - s[0].length)/2), oy = Math.floor((4 - s.length)/2);
  s.forEach((r, ri) => r.forEach((v, ci) => {
    if (v) drawBlock(next.color, ox + ci, oy + ri, 20, nextCtx);
  }));
}

function updateHud() {
  document.getElementById("score").textContent = score;
  document.getElementById("level").textContent = level;
}

let lastTime = 0;
function loop(ts) {
  if (!running || paused) { requestAnimationFrame(loop); draw(); return; }
  if (ts - lastTime > dropInterval) { lastTime = ts; drop(); }
  draw();
  requestAnimationFrame(loop);
}

function drop() { if (valid(piece, 0, 1)) piece.y++; else place(); }

function startGame() {
  board = newBoard(); score = 0; level = 1; lines = 0; dropInterval = 800; running = true; paused = false;
  next = newPiece(randomType());
  spawnPiece();
  updateHud();
  document.getElementById("start-btn").textContent = "🔁 Yeniden";
  requestAnimationFrame(loop);
}

function endGame() { running = false; document.getElementById("start-btn").textContent = "▶ Tekrar"; draw(); }

document.getElementById("start-btn").addEventListener("click", startGame);

document.addEventListener("keydown", e => {
  if (!running) return;
  if (e.code === "Space") { e.preventDefault(); paused = !paused; return; }
  if (paused) return;
  if (e.key === "ArrowLeft")  { if (valid(piece, -1, 0)) piece.x--; }
  else if (e.key === "ArrowRight") { if (valid(piece, 1, 0)) piece.x++; }
  else if (e.key === "ArrowDown") { drop(); }
  else if (e.key === "ArrowUp") {
    const r = rotate(piece.shape);
    if (valid(piece, 0, 0, r)) piece.shape = r;
  }
  else if (e.code === "Space") {
    while (valid(piece, 0, 1)) piece.y++;
    place();
  }
});

// Mobil butonlar
document.getElementById("m-left")?.addEventListener("click",  () => { if (running && !paused && valid(piece, -1)) piece.x--; draw(); });
document.getElementById("m-right")?.addEventListener("click", () => { if (running && !paused && valid(piece, 1))  piece.x++; draw(); });
document.getElementById("m-down")?.addEventListener("click",  () => { if (running && !paused) drop(); draw(); });
document.getElementById("m-rot")?.addEventListener("click",   () => {
  if (!running || paused) return;
  const r = rotate(piece.shape); if (valid(piece, 0, 0, r)) piece.shape = r; draw();
});
document.getElementById("m-drop")?.addEventListener("click",  () => {
  if (!running || paused) return;
  while (valid(piece, 0, 1)) piece.y++; place(); draw();
});

// İlk çizim
board = newBoard(); running = false; paused = false; score = 0; level = 1; lines = 0; dropInterval = 800;
next = newPiece(0); piece = newPiece(0); draw();
