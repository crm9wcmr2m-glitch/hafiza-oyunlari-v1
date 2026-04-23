// Pong — iOS 12+ uyumlu, yatay mod, parmak sürükleme
var canvas = document.getElementById("pong-canvas");
var ctx = canvas.getContext("2d");

// Mantıksal oyun boyutları (sabit oran)
var LW = 600, LH = 360;
var PAD_W = 12, PAD_H = 72, BALL_R = 9;

var state = {
  lPad: { y: LH/2 - PAD_H/2, score: 0 },
  rPad: { y: LH/2 - PAD_H/2, score: 0 },
  ball: { x: LW/2, y: LH/2, vx: 4.5, vy: 3 },
  running: false, paused: false,
  keys: {}
};

// Canvas'ı kaba göre boyutlandır
function resizeCanvas() {
  var wrap = canvas.parentElement;
  canvas.width  = wrap.offsetWidth;
  canvas.height = wrap.offsetHeight;
}
function scheduleResize() {
  resizeCanvas();
  setTimeout(resizeCanvas, 250);
  setTimeout(resizeCanvas, 600);
}
window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", scheduleResize);
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", resizeCanvas);
}
resizeCanvas();

// Mantıksal → piksel dönüşümü
function scaleX() { return canvas.width  / LW; }
function scaleY() { return canvas.height / LH; }

function clampPad(p) {
  if (p.y < 0) p.y = 0;
  if (p.y > LH - PAD_H) p.y = LH - PAD_H;
}

function resetBall(dir) {
  dir = dir || 1;
  state.ball.x = LW/2; state.ball.y = LH/2;
  var angle = (Math.random()*60 - 30) * Math.PI / 180;
  var spd = 4.5 + Math.min((state.lPad.score + state.rPad.score) * 0.15, 3);
  state.ball.vx = dir * spd * Math.cos(angle);
  state.ball.vy = spd * Math.sin(angle);
}

// Yuvarlak dikdörtgen (roundRect polyfill — iOS 12 uyumlu)
function fillRoundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x+r, y);
  c.lineTo(x+w-r, y);
  c.quadraticCurveTo(x+w, y, x+w, y+r);
  c.lineTo(x+w, y+h-r);
  c.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  c.lineTo(x+r, y+h);
  c.quadraticCurveTo(x, y+h, x, y+h-r);
  c.lineTo(x, y+r);
  c.quadraticCurveTo(x, y, x+r, y);
  c.closePath();
  c.fill();
}

var PAD_SPD = 5.5;

function update() {
  if (!state.running || state.paused) return;

  // Klavye
  if (state.keys["w"] || state.keys["W"]) state.lPad.y -= PAD_SPD;
  if (state.keys["s"] || state.keys["S"]) state.lPad.y += PAD_SPD;
  if (state.keys["ArrowUp"])   state.rPad.y -= PAD_SPD;
  if (state.keys["ArrowDown"]) state.rPad.y += PAD_SPD;
  clampPad(state.lPad); clampPad(state.rPad);

  // Top hareketi
  state.ball.x += state.ball.vx;
  state.ball.y += state.ball.vy;

  // Duvar
  if (state.ball.y - BALL_R <= 0) { state.ball.y = BALL_R; state.ball.vy *= -1; }
  if (state.ball.y + BALL_R >= LH) { state.ball.y = LH - BALL_R; state.ball.vy *= -1; }

  // Sol raket çarpışma
  var lx = PAD_W + 8;
  if (state.ball.x - BALL_R <= lx + PAD_W &&
      state.ball.x - BALL_R >= lx - 2 &&
      state.ball.y >= state.lPad.y - 2 &&
      state.ball.y <= state.lPad.y + PAD_H + 2) {
    state.ball.x = lx + PAD_W + BALL_R;
    var rel  = (state.ball.y - (state.lPad.y + PAD_H/2)) / (PAD_H/2);
    var ang  = rel * 65 * Math.PI / 180;
    var spd  = Math.sqrt(state.ball.vx*state.ball.vx + state.ball.vy*state.ball.vy) * 1.03;
    state.ball.vx = Math.abs(Math.cos(ang)) * spd;
    state.ball.vy = Math.sin(ang) * spd;
    beep(440);
  }

  // Sağ raket çarpışma
  var rx = LW - PAD_W - 8 - PAD_W;
  if (state.ball.x + BALL_R >= rx &&
      state.ball.x + BALL_R <= rx + PAD_W + 2 &&
      state.ball.y >= state.rPad.y - 2 &&
      state.ball.y <= state.rPad.y + PAD_H + 2) {
    state.ball.x = rx - BALL_R;
    var rel  = (state.ball.y - (state.rPad.y + PAD_H/2)) / (PAD_H/2);
    var ang  = rel * 65 * Math.PI / 180;
    var spd  = Math.sqrt(state.ball.vx*state.ball.vx + state.ball.vy*state.ball.vy) * 1.03;
    state.ball.vx = -Math.abs(Math.cos(ang)) * spd;
    state.ball.vy = Math.sin(ang) * spd;
    beep(440);
  }

  // Skor
  if (state.ball.x - BALL_R <= 0) {
    state.rPad.score++; updateScores(); beep(220); resetBall(1);
  }
  if (state.ball.x + BALL_R >= LW) {
    state.lPad.score++; updateScores(); beep(220); resetBall(-1);
  }
}

function draw() {
  var W = canvas.width, H = canvas.height;
  var sx = scaleX(), sy = scaleY();

  ctx.fillStyle = "#000"; ctx.fillRect(0,0,W,H);

  // Orta çizgi
  ctx.setLineDash([Math.round(10*sy), Math.round(10*sy)]);
  ctx.strokeStyle = "#222"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(W/2,0); ctx.lineTo(W/2,H); ctx.stroke();
  ctx.setLineDash([]);

  // Sol raket (yeşil)
  ctx.fillStyle = "#22c55e";
  fillRoundRect(ctx,
    (PAD_W+8)*sx, state.lPad.y*sy,
    PAD_W*sx, PAD_H*sy, 4);

  // Sağ raket (mavi)
  ctx.fillStyle = "#3b82f6";
  fillRoundRect(ctx,
    (LW-PAD_W-8-PAD_W)*sx, state.rPad.y*sy,
    PAD_W*sx, PAD_H*sy, 4);

  // Top
  var bx = state.ball.x*sx, by = state.ball.y*sy, br = BALL_R*Math.min(sx,sy);
  var grad = ctx.createRadialGradient(bx-br*0.3, by-br*0.3, br*0.1, bx, by, br);
  grad.addColorStop(0,"#fff"); grad.addColorStop(1,"#f59e0b");
  ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI*2);
  ctx.fillStyle = grad; ctx.fill();

  // Overlay
  if (!state.running) {
    ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(0,0,W,H);
    ctx.fillStyle = "#fff";
    ctx.font = "bold "+Math.round(22*Math.min(sx,sy))+"px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("HAZIR", W/2, H/2+6);
  }
  if (state.paused && state.running) {
    ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(0,0,W,H);
    ctx.fillStyle = "#fff";
    ctx.font = "bold "+Math.round(22*Math.min(sx,sy))+"px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("DURAKLADI", W/2, H/2+6);
  }
}

var _ac = null;
function beep(freq, dur) {
  freq = freq || 440; dur = dur || 0.08;
  try {
    _ac = _ac || new (window.AudioContext || window.webkitAudioContext)();
    var o = _ac.createOscillator(), g = _ac.createGain();
    o.frequency.value = freq; o.type = "square";
    g.gain.setValueAtTime(0.0001, _ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.1, _ac.currentTime+0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, _ac.currentTime+dur);
    o.connect(g); g.connect(_ac.destination); o.start(); o.stop(_ac.currentTime+dur);
  } catch(e){}
}

function updateScores() {
  document.getElementById("score-l").textContent = state.lPad.score;
  document.getElementById("score-r").textContent = state.rPad.score;
}

function startGame() {
  state.lPad.y = LH/2-PAD_H/2; state.rPad.y = LH/2-PAD_H/2;
  state.lPad.score = 0; state.rPad.score = 0;
  updateScores(); resetBall(1); state.running = true; state.paused = false;
  document.getElementById("btn-start").textContent = "🔁 Yeniden";
  document.getElementById("btn-pause").textContent = "⏸";
}

function togglePause() {
  if (!state.running) return;
  state.paused = !state.paused;
  document.getElementById("btn-pause").textContent = state.paused ? "▶" : "⏸";
}

document.getElementById("btn-start").addEventListener("click", startGame);
document.getElementById("btn-pause").addEventListener("click", togglePause);

document.addEventListener("keydown", function(e) {
  state.keys[e.key] = true;
  if (e.key === " ") { e.preventDefault(); if (state.running) togglePause(); }
  if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
});
document.addEventListener("keyup", function(e) { state.keys[e.key] = false; });

// ── Dokunmatik: parmak sürükleme ──────────────────────────────────────
// Her touch hangi raketle ilişkili, takip ediyoruz
var touchMap = {}; // touchId → "left" | "right"

function touchToLogical(touch) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: (touch.clientX - rect.left) / rect.width  * LW,
    y: (touch.clientY - rect.top)  / rect.height * LH
  };
}

canvas.addEventListener("touchstart", function(e) {
  e.preventDefault();
  for (var i=0; i<e.changedTouches.length; i++) {
    var t = e.changedTouches[i];
    var pos = touchToLogical(t);
    var side = pos.x < LW/2 ? "left" : "right";
    touchMap[t.identifier] = side;
    if (side === "left")  state.lPad.y = pos.y - PAD_H/2;
    else                  state.rPad.y = pos.y - PAD_H/2;
    clampPad(state.lPad); clampPad(state.rPad);
  }
}, { passive: false });

canvas.addEventListener("touchmove", function(e) {
  e.preventDefault();
  for (var i=0; i<e.changedTouches.length; i++) {
    var t = e.changedTouches[i];
    var side = touchMap[t.identifier];
    if (!side) continue;
    var pos = touchToLogical(t);
    if (side === "left")  { state.lPad.y = pos.y - PAD_H/2; clampPad(state.lPad); }
    else                  { state.rPad.y = pos.y - PAD_H/2; clampPad(state.rPad); }
  }
}, { passive: false });

canvas.addEventListener("touchend", function(e) {
  e.preventDefault();
  for (var i=0; i<e.changedTouches.length; i++) {
    delete touchMap[e.changedTouches[i].identifier];
  }
}, { passive: false });

canvas.addEventListener("touchcancel", function(e) {
  e.preventDefault();
  for (var i=0; i<e.changedTouches.length; i++) {
    delete touchMap[e.changedTouches[i].identifier];
  }
}, { passive: false });

// ── Oyun döngüsü ────────────────────────────────────────────────────────
function loop() { update(); draw(); requestAnimationFrame(loop); }
requestAnimationFrame(loop);
