const canvas = document.getElementById("pong-canvas");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const PAD_W = 12, PAD_H = 70, BALL_R = 9, PAD_SPEED = 5;

const state = {
  lPad: { y: H/2 - PAD_H/2, score: 0 },
  rPad: { y: H/2 - PAD_H/2, score: 0 },
  ball: { x: W/2, y: H/2, vx: 4, vy: 3 },
  running: false, paused: false,
  keys: {}
};

function resetBall(dir = 1) {
  state.ball.x = W/2; state.ball.y = H/2;
  const angle = (Math.random() * 60 - 30) * Math.PI / 180;
  const spd = 4 + Math.min((state.lPad.score + state.rPad.score) * 0.15, 3);
  state.ball.vx = dir * spd * Math.cos(angle);
  state.ball.vy = spd * Math.sin(angle);
}

function clampPad(p) { p.y = Math.max(0, Math.min(H - PAD_H, p.y)); }

function update() {
  if (!state.running || state.paused) return;

  // Hareket
  if (state.keys["w"] || state.keys["W"])  state.lPad.y -= PAD_SPEED;
  if (state.keys["s"] || state.keys["S"])  state.lPad.y += PAD_SPEED;
  if (state.keys["ArrowUp"])   state.rPad.y -= PAD_SPEED;
  if (state.keys["ArrowDown"]) state.rPad.y += PAD_SPEED;
  clampPad(state.lPad); clampPad(state.rPad);

  // Top
  state.ball.x += state.ball.vx;
  state.ball.y += state.ball.vy;

  // Üst/alt duvar
  if (state.ball.y - BALL_R <= 0) { state.ball.y = BALL_R; state.ball.vy *= -1; }
  if (state.ball.y + BALL_R >= H) { state.ball.y = H - BALL_R; state.ball.vy *= -1; }

  // Sol raket
  if (state.ball.x - BALL_R <= PAD_W + 10 &&
      state.ball.y >= state.lPad.y && state.ball.y <= state.lPad.y + PAD_H) {
    state.ball.x = PAD_W + 10 + BALL_R;
    const rel = (state.ball.y - (state.lPad.y + PAD_H/2)) / (PAD_H/2);
    const angle = rel * 65 * Math.PI / 180;
    const spd = Math.hypot(state.ball.vx, state.ball.vy) * 1.04;
    state.ball.vx = Math.abs(Math.cos(angle)) * spd;
    state.ball.vy = Math.sin(angle) * spd;
    beep(440);
  }

  // Sağ raket
  if (state.ball.x + BALL_R >= W - PAD_W - 10 &&
      state.ball.y >= state.rPad.y && state.ball.y <= state.rPad.y + PAD_H) {
    state.ball.x = W - PAD_W - 10 - BALL_R;
    const rel = (state.ball.y - (state.rPad.y + PAD_H/2)) / (PAD_H/2);
    const angle = rel * 65 * Math.PI / 180;
    const spd = Math.hypot(state.ball.vx, state.ball.vy) * 1.04;
    state.ball.vx = -Math.abs(Math.cos(angle)) * spd;
    state.ball.vy = Math.sin(angle) * spd;
    beep(440);
  }

  // Skor
  if (state.ball.x - BALL_R <= 0) {
    state.rPad.score++; updateScores(); beep(220); resetBall(1); return;
  }
  if (state.ball.x + BALL_R >= W) {
    state.lPad.score++; updateScores(); beep(220); resetBall(-1); return;
  }
}

function draw() {
  ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
  // Orta çizgi
  ctx.setLineDash([10, 10]); ctx.strokeStyle = "#333"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.stroke();
  ctx.setLineDash([]);
  // Raketler
  ctx.fillStyle = "#22c55e";
  ctx.beginPath(); ctx.roundRect(8, state.lPad.y, PAD_W, PAD_H, 4); ctx.fill();
  ctx.fillStyle = "#3b82f6";
  ctx.beginPath(); ctx.roundRect(W - PAD_W - 8, state.rPad.y, PAD_W, PAD_H, 4); ctx.fill();
  // Top
  const grad = ctx.createRadialGradient(state.ball.x-3, state.ball.y-3, 2, state.ball.x, state.ball.y, BALL_R);
  grad.addColorStop(0, "#fff"); grad.addColorStop(1, "#f59e0b");
  ctx.beginPath(); ctx.arc(state.ball.x, state.ball.y, BALL_R, 0, Math.PI*2);
  ctx.fillStyle = grad; ctx.fill();

  if (!state.running) {
    ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#fff"; ctx.font = "bold 24px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("HAZIR", W/2, H/2);
  }
  if (state.paused) {
    ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#fff"; ctx.font = "bold 24px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("DURAKLADI", W/2, H/2);
  }
}

let _ac = null;
function beep(freq=440, dur=0.08) {
  try {
    _ac = _ac || new (window.AudioContext||window.webkitAudioContext)();
    const o = _ac.createOscillator(), g = _ac.createGain();
    o.frequency.value = freq; o.type = "square";
    g.gain.setValueAtTime(0.0001, _ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.12, _ac.currentTime+0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, _ac.currentTime+dur);
    o.connect(g); g.connect(_ac.destination); o.start(); o.stop(_ac.currentTime+dur);
  } catch {}
}

function updateScores() {
  document.getElementById("score-l").textContent = state.lPad.score;
  document.getElementById("score-r").textContent = state.rPad.score;
}

function loop() { update(); draw(); requestAnimationFrame(loop); }

document.getElementById("pong-start").addEventListener("click", () => {
  state.lPad.y = H/2 - PAD_H/2; state.rPad.y = H/2 - PAD_H/2;
  state.lPad.score = 0; state.rPad.score = 0;
  updateScores(); resetBall(1); state.running = true; state.paused = false;
  document.getElementById("pong-start").textContent = "🔁 Yeniden";
});

document.addEventListener("keydown", e => {
  state.keys[e.key] = true;
  if (e.key === " ") { e.preventDefault(); if (state.running) state.paused = !state.paused; }
  if (["ArrowUp","ArrowDown"].includes(e.key)) e.preventDefault();
});
document.addEventListener("keyup", e => { state.keys[e.key] = false; });

// Mobil dokunmatik butonlar
let mobileKeys = {};
function bindMobileBtn(id, key) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener("pointerdown", () => { state.keys[key] = true; });
  btn.addEventListener("pointerup",   () => { state.keys[key] = false; });
  btn.addEventListener("pointerleave",() => { state.keys[key] = false; });
}
bindMobileBtn("l-up",   "w");
bindMobileBtn("l-down", "s");
bindMobileBtn("r-up",   "ArrowUp");
bindMobileBtn("r-down", "ArrowDown");

requestAnimationFrame(loop);
