const GAME_ID = "shadow";
const profile = requireProfile();

const LEVELS = { 1: { rounds: 3, choices: 3 }, 2: { rounds: 5, choices: 4 }, 3: { rounds: 7, choices: 5 } };
let state = null;

function startGame(level) {
  const cfg = LEVELS[level];
  state = { level, cfg, round: 0, errors: 0 };
  nextRound();
}

function nextRound() {
  if (state.round >= state.cfg.rounds) return finish();
  state.round++;
  const emojis = getEmojis(profile, state.cfg.choices);
  const target = emojis[Math.floor(Math.random() * emojis.length)];
  state.target = target;
  render(emojis, target);
}

function render(choices, target) {
  document.getElementById("level-picker").innerHTML = "";
  document.getElementById("hint").textContent = "Gölgenin sahibini bul! 🌓";
  const board = document.getElementById("board");
  board.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "shadow-wrap";
  const shadow = document.createElement("div");
  shadow.className = "shadow-target";
  shadow.innerHTML = `<span class="shadow-emoji">${target}</span>`;
  wrap.appendChild(shadow);
  const row = document.createElement("div");
  row.className = "shadow-choices";
  choices.forEach(e => {
    const b = document.createElement("button");
    b.className = "shadow-choice";
    b.textContent = e;
    b.addEventListener("click", () => onPick(e, b));
    row.appendChild(b);
  });
  wrap.appendChild(row);
  board.appendChild(wrap);
  updateHud();
}

function updateHud() {
  document.getElementById("hud").innerHTML =
    `<span>🔁 ${state.round}/${state.cfg.rounds}</span><span>❌ ${state.errors}</span>`;
}

function onPick(emoji, btn) {
  if (emoji === state.target) {
    btn.classList.add("correct"); goodSound();
    setTimeout(() => nextRound(), 600);
  } else {
    btn.classList.add("wrong"); state.errors++; badSound();
    setTimeout(() => btn.classList.remove("wrong"), 500);
    updateHud();
  }
}

function finish() {
  const stars = computeStars(state.errors, 0, Math.ceil(state.cfg.rounds/3));
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
