// Tüm oyun sayfaları için paylaşılan yardımcılar.
const PROFILE_KEY_G = "memory_profile_v1";
function getProfileG() { return localStorage.getItem(PROFILE_KEY_G); }

function requireProfile() {
  const p = getProfileG();
  if (!p) { window.location.href = "../index.html"; return null; }
  document.body.classList.add("profile-" + p);
  return p;
}

function getLevelFromUrl() {
  const n = parseInt(new URLSearchParams(location.search).get("level") || "0", 10);
  return n >= 1 && n <= 3 ? n : 0;
}

const LEVEL_NAMES = { 1: "Kolay", 2: "Orta", 3: "Zor" };

// Web Audio API ile küçük bip sesleri.
let _audioCtx = null;
function beep(freq = 600, dur = 0.12, type = "sine") {
  try {
    _audioCtx = _audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = _audioCtx.createOscillator();
    const g = _audioCtx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, _audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, _audioCtx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, _audioCtx.currentTime + dur);
    o.connect(g); g.connect(_audioCtx.destination);
    o.start(); o.stop(_audioCtx.currentTime + dur);
  } catch {}
}
function goodSound() { beep(880, 0.12); setTimeout(() => beep(1174, 0.14), 100); }
function badSound()  { beep(220, 0.18, "sawtooth"); }

function sparkleAt(x, y) {
  const s = document.createElement("div");
  s.className = "sparkle";
  s.textContent = "⭐";
  s.style.left = x + "px";
  s.style.top = y + "px";
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 800);
}
function sparkleBurst(n = 6) {
  const w = window.innerWidth, h = window.innerHeight;
  for (let i = 0; i < n; i++) {
    setTimeout(() => sparkleAt(Math.random()*w, h*0.4 + Math.random()*h*0.2), i*80);
  }
}

// Seviye seçici render.
function renderLevelPicker(gameId, startGameFn) {
  const wrap = document.getElementById("level-picker");
  if (!wrap) return;
  wrap.innerHTML = "";
  [1,2,3].forEach(lv => {
    const unlocked = isUnlocked(gameId, lv);
    const stars = getStars(gameId, lv);
    const btn = document.createElement("button");
    btn.className = "level-btn" + (unlocked ? "" : " locked");
    btn.innerHTML = `<span>${unlocked ? "" : "🔒 "}${LEVEL_NAMES[lv]}</span>
                     <span class="level-stars">${"⭐".repeat(stars)}${"☆".repeat(3-stars)}</span>`;
    if (unlocked) btn.addEventListener("click", () => startGameFn(lv));
    wrap.appendChild(btn);
  });
}

// Sonuç modalı (yıldız, tekrar oyna / sonraki seviye / menü).
function showResult({ gameId, level, stars, onReplay, onNext }) {
  saveStars(gameId, level, stars);
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  const hasNext = level < 3;
  backdrop.innerHTML = `
    <div class="modal">
      <h2>Aferin! 🎉</h2>
      <div class="stars">${"⭐".repeat(stars)}${"☆".repeat(3-stars)}</div>
      <p>${LEVEL_NAMES[level]} seviyeyi bitirdin!</p>
      <div class="modal-actions">
        <button class="btn secondary" id="m-replay">🔁 Tekrar</button>
        ${hasNext ? `<button class="btn" id="m-next">Sonraki ➡️</button>` : ""}
        <a class="btn" href="../index.html">🏠 Menü</a>
      </div>
    </div>`;
  document.body.appendChild(backdrop);
  sparkleBurst(10); goodSound();
  document.getElementById("m-replay").onclick = () => { backdrop.remove(); onReplay && onReplay(); };
  if (hasNext) document.getElementById("m-next").onclick = () => { backdrop.remove(); onNext && onNext(); };
}

function computeStars(errors, parMax2, parMax1) {
  if (errors <= parMax2) return 3;
  if (errors <= parMax1) return 2;
  return 1;
}
