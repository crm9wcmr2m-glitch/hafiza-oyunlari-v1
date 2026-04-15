const GAME_ID = "match";
const profile = requireProfile();

const LEVELS = {
  1: { pairs: 3, cols: 3 },
  2: { pairs: 6, cols: 4 },
  3: { pairs: 8, cols: 4 }
};

let state = null;

function startGame(level) {
  const cfg = LEVELS[level];
  const emojis = getEmojis(profile, cfg.pairs);
  const deck = shuffle([...emojis, ...emojis]);
  state = { level, cfg, deck, flipped: [], matched: 0, errors: 0, locked: false };
  render();
}

function render() {
  document.getElementById("level-picker").innerHTML = "";
  document.getElementById("hint").textContent = "Aynı olan iki kartı bul! 🎴";
  const board = document.getElementById("board");
  board.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "match-grid cols-" + state.cfg.cols;
  state.deck.forEach((e, i) => {
    const card = document.createElement("button");
    card.className = "match-card";
    card.dataset.index = i;
    card.innerHTML = `
      <div class="match-card-inner">
        <div class="match-face match-back">❓</div>
        <div class="match-face match-front">${e}</div>
      </div>`;
    card.addEventListener("click", () => onFlip(i, card));
    grid.appendChild(card);
  });
  board.appendChild(grid);
  updateHud();
}

function updateHud() {
  document.getElementById("hud").innerHTML =
    `<span>🎯 ${state.matched}/${state.cfg.pairs}</span><span>❌ ${state.errors}</span>`;
}

function onFlip(i, card) {
  if (state.locked) return;
  if (card.classList.contains("flipped") || card.classList.contains("matched")) return;
  card.classList.add("flipped");
  state.flipped.push({ i, card });
  if (state.flipped.length === 2) {
    state.locked = true;
    const [a, b] = state.flipped;
    if (state.deck[a.i] === state.deck[b.i]) {
      setTimeout(() => {
        a.card.classList.add("matched"); b.card.classList.add("matched");
        state.matched++; state.flipped = []; state.locked = false;
        goodSound(); updateHud();
        if (state.matched === state.cfg.pairs) finish();
      }, 400);
    } else {
      state.errors++; badSound();
      setTimeout(() => {
        a.card.classList.remove("flipped"); b.card.classList.remove("flipped");
        state.flipped = []; state.locked = false; updateHud();
      }, 900);
    }
  }
}

function finish() {
  const stars = computeStars(state.errors, Math.floor(state.cfg.pairs/3), state.cfg.pairs);
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
