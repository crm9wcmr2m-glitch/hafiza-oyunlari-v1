const GAME_ID = "sequence";
const profile = requireProfile();

const LEVELS = { 1: { len: 3 }, 2: { len: 5 }, 3: { len: 7 } };
const PAD_FREQS = [330, 440, 550, 660];
let state = null;

function startGame(level) {
  const cfg = LEVELS[level];
  const padEmojis = getEmojis(profile, 4);
  const sequence = [];
  for (let i = 0; i < cfg.len; i++) sequence.push(Math.floor(Math.random() * 4));
  state = { level, cfg, padEmojis, sequence, userIdx: 0, errors: 0, locked: true };
  render();
  setTimeout(() => playSequence(), 600);
}

function render() {
  document.getElementById("level-picker").innerHTML = "";
  document.getElementById("hint").textContent = "Sırayı dikkatle izle! 👀";
  const board = document.getElementById("board");
  board.innerHTML = "";
  const pads = document.createElement("div");
  pads.className = "sequence-pads";
  state.padEmojis.forEach((e, i) => {
    const b = document.createElement("button");
    b.className = "pad pad-" + i;
    b.textContent = e;
    b.dataset.index = i;
    b.addEventListener("click", () => onPad(i, b));
    pads.appendChild(b);
  });
  board.appendChild(pads);
  updateHud();
}
function updateHud() {
  document.getElementById("hud").innerHTML =
    `<span>📏 ${state.sequence.length}</span><span>❌ ${state.errors}</span>`;
}
function lightPad(i) {
  const pad = document.querySelector(".pad-" + i);
  if (!pad) return;
  pad.classList.add("lit");
  beep(PAD_FREQS[i], 0.35);
  setTimeout(() => pad.classList.remove("lit"), 400);
}
function playSequence() {
  state.locked = true;
  document.getElementById("hint").textContent = "Sırayı izle... 👀";
  state.sequence.forEach((p, idx) => {
    setTimeout(() => lightPad(p), idx * 650 + 200);
  });
  setTimeout(() => {
    state.locked = false; state.userIdx = 0;
    document.getElementById("hint").textContent = "Şimdi sen tekrar et! 👆";
  }, state.sequence.length * 650 + 400);
}
function onPad(i, btn) {
  if (state.locked) return;
  lightPad(i);
  const expected = state.sequence[state.userIdx];
  if (i === expected) {
    state.userIdx++;
    if (state.userIdx === state.sequence.length) {
      state.locked = true;
      setTimeout(() => finish(), 500);
    }
  } else {
    state.errors++; badSound();
    btn.animate([{transform:"translateX(0)"},{transform:"translateX(-8px)"},{transform:"translateX(8px)"},{transform:"translateX(0)"}], 400);
    state.userIdx = 0; state.locked = true;
    document.getElementById("hint").textContent = "Tekrar başlıyoruz! 🔁";
    updateHud();
    setTimeout(() => playSequence(), 1000);
  }
}
function finish() {
  const stars = computeStars(state.errors, 0, 1);
  showResult({
    gameId: GAME_ID, level: state.level, stars,
    onReplay: () => startGame(state.level),
    onNext: () => startGame(state.level + 1)
  });
}
function showPicker() {
  document.getElementById("board").innerHTML = "";
  document.getElementById("hud").innerHTML = "";
  document.getElementById("hint").textContent = "Bir seviye seç:";
  renderLevelPicker(GAME_ID, startGame);
}
showPicker();
