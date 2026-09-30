(() => {
  const canvas = document.getElementById("linea-canvas");
  const ctx = canvas.getContext("2d");
  const wrap = canvas.parentElement;
  const liveScoreEl = document.getElementById("live-score");
  const startOverlay = document.getElementById("start-overlay");
  const overOverlay = document.getElementById("over-overlay");
  const finalScoreEl = document.getElementById("final-score");
  const bestScoreStartEl = document.getElementById("best-score-start");
  const bestScoreOverEl = document.getElementById("best-score-over");
  const btnPlay = document.getElementById("btn-play");
  const btnRetry = document.getElementById("btn-retry");

  const BEST_KEY = "linea_best_v1";
  const PX_PER_METER = 30;
  const BASE_SPEED = 95; // px/sec
  const GRAVITY = 1000; // px/sec^2
  const MIN_SEG_DIST = 4; // px between recorded draw points
  const ANCHOR_RATIO = 0.28; // character's fixed screen-x as ratio of width

  let W = 0, H = 0, DPR = 1;
  let anchorX = 0;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = wrap.clientWidth;
    H = wrap.clientHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    anchorX = W * ANCHOR_RATIO;
  }
  window.addEventListener("resize", resize);
  resize();

  let state = "idle"; // idle | playing | over
  let strokes = [];
  let activeStroke = null;
  let activePointerId = null;
  let character, cameraOffsetX, speedMult, walkClock, best;

  best = Number(localStorage.getItem(BEST_KEY) || 0);

  function fmtMeters(px) {
    return Math.floor(px / PX_PER_METER) + " m";
  }

  function updateBestLabels() {
    const txt = best > 0 ? ("En iyi: " + fmtMeters(best)) : "";
    bestScoreStartEl.textContent = txt;
    bestScoreOverEl.textContent = txt;
  }
  updateBestLabels();

  function resetGame() {
    strokes = [];
    activeStroke = null;
    activePointerId = null;
    const groundY = H * 0.55;
    strokes.push([
      { x: -100, y: groundY },
      { x: 220, y: groundY }
    ]);
    character = { worldX: 0, y: groundY, vy: 0, grounded: true };
    cameraOffsetX = character.worldX - anchorX;
    speedMult = 1;
    walkClock = 0;
  }

  function screenToWorld(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) + cameraOffsetX,
      y: (clientY - rect.top)
    };
  }

  function onPointerDown(e) {
    if (state !== "playing") return;
    if (activePointerId !== null) return;
    activePointerId = e.pointerId;
    const p = screenToWorld(e.clientX, e.clientY);
    activeStroke = [p];
    strokes.push(activeStroke);
    canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (activePointerId !== e.pointerId || !activeStroke) return;
    const p = screenToWorld(e.clientX, e.clientY);
    const last = activeStroke[activeStroke.length - 1];
    const dx = p.x - last.x, dy = p.y - last.y;
    if (Math.hypot(dx, dy) >= MIN_SEG_DIST) {
      activeStroke.push(p);
    }
    e.preventDefault();
  }

  function endStroke(e) {
    if (activePointerId !== e.pointerId) return;
    activePointerId = null;
    activeStroke = null;
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", endStroke);
  canvas.addEventListener("pointercancel", endStroke);
  canvas.addEventListener("pointerleave", endStroke);

  function groundCandidatesAt(worldX) {
    const out = [];
    for (const s of strokes) {
      if (s.length < 2) continue;
      if (worldX < s[0].x || worldX > s[s.length - 1].x) continue;
      for (let i = 1; i < s.length; i++) {
        const a = s[i - 1], b = s[i];
        if (worldX >= a.x && worldX <= b.x) {
          const t = b.x === a.x ? 0 : (worldX - a.x) / (b.x - a.x);
          const y = a.y + (b.y - a.y) * t;
          const angle = Math.atan2(b.y - a.y, b.x - a.x);
          out.push({ y, angle });
          break;
        }
      }
    }
    return out;
  }

  function trimStrokes() {
    const cutoff = cameraOffsetX - 60;
    strokes = strokes.filter(s => s === activeStroke || s[s.length - 1].x >= cutoff);
  }

  let lastT = null;
  function loop(ts) {
    requestAnimationFrame(loop);
    if (lastT === null) lastT = ts;
    let dt = (ts - lastT) / 1000;
    lastT = ts;
    if (dt > 0.05) dt = 0.05;

    if (state === "playing") update(dt);
    render();
  }

  function update(dt) {
    speedMult = 1 + Math.min(character.worldX / 4500, 0.9);
    const speed = BASE_SPEED * speedMult;
    character.worldX += speed * dt;
    cameraOffsetX = character.worldX - anchorX;

    const candidates = groundCandidatesAt(character.worldX);
    let best_ = null, bestDist = Infinity;
    for (const c of candidates) {
      const d = Math.abs(c.y - character.y);
      if (d < bestDist) { bestDist = d; best_ = c; }
    }

    if (best_ && bestDist < 260) {
      character.grounded = true;
      character.vy = 0;
      const ease = Math.min(1, dt * 14);
      character.y += (best_.y - character.y) * ease;
      character.groundAngle = best_.angle;
    } else {
      character.grounded = false;
      character.vy += GRAVITY * dt;
      character.y += character.vy * dt;
    }

    walkClock += dt * speed * 0.08;
    trimStrokes();

    liveScoreEl.textContent = fmtMeters(character.worldX);

    if (character.y > H + 260) {
      gameOver();
    }
  }

  function gameOver() {
    state = "over";
    const meters = character.worldX;
    finalScoreEl.textContent = fmtMeters(meters);
    if (meters > best) {
      best = meters;
      localStorage.setItem(BEST_KEY, String(best));
    }
    updateBestLabels();
    overOverlay.classList.remove("hidden");
  }

  function drawCharacter(x, footY, angle, grounded) {
    const legLen = 26;
    const hipY = footY - legLen * Math.cos(angle * 0.3);
    const bodyH = 34;
    const neckY = hipY - bodyH;
    const headR = 10;
    const hatH = 16;
    const swing = grounded ? Math.sin(walkClock) * 8 : 0;

    ctx.save();
    ctx.strokeStyle = "#161616";
    ctx.fillStyle = "#161616";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(x, hipY);
    ctx.lineTo(x - 6 + swing, footY);
    ctx.moveTo(x, hipY);
    ctx.lineTo(x + 6 - swing, footY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x - 3, hipY);
    ctx.quadraticCurveTo(x - 15, hipY - bodyH * 0.55, x - 2, neckY);
    ctx.quadraticCurveTo(x + 7, hipY - bodyH * 0.55, x + 3, hipY);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + 1, neckY - headR + 2, headR, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + 1 - headR * 0.9, neckY - headR * 2 + 3);
    ctx.lineTo(x + 1 + headR * 0.6, neckY - headR * 2 + 3);
    ctx.lineTo(x + 1 + headR * 0.1, neckY - headR * 2 - hatH);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#f4efe3";
    ctx.beginPath();
    ctx.arc(x + 5, neckY - headR + 1, 1.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#f4efe3";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "#7a5c3e";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const s of strokes) {
      if (s.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(s[0].x - cameraOffsetX, s[0].y);
      for (let i = 1; i < s.length; i++) {
        ctx.lineTo(s[i].x - cameraOffsetX, s[i].y);
      }
      ctx.stroke();
    }

    if (character) {
      drawCharacter(anchorX, character.y, character.groundAngle || 0, character.grounded && state === "playing");
    }
  }

  btnPlay.addEventListener("click", () => {
    resetGame();
    state = "playing";
    startOverlay.classList.add("hidden");
  });

  btnRetry.addEventListener("click", () => {
    resetGame();
    state = "playing";
    overOverlay.classList.add("hidden");
  });

  resetGame();
  requestAnimationFrame(loop);
})();
