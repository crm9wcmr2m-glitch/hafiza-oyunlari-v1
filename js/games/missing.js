const GAME_ID = "missing";
const profile = requireProfile();

const LEVELS = {
  1: { total: 4, missing: 1, showMs: 3500 },
  2: { total: 6, missing: 2, showMs: 4000 },
  3: { total: 8, missing: 3, showMs: 4500 }
};
let state = null;

function startGame(level) {
  const cfg = LEVELS[level];
  const items = getEmojis(profile, cfg.total);
  const missingIndexes = shuffle(items.map((_, i) => i)).slice(0, cfg.missing);
  const missingItems = missingIndexes.map(i => items[i]);
  state = { level, cfg, items, missingIndexes: new Set(missingIndexes), missingItems, picked: [], errors: 0 };
  renderShow();
}

function renderShow() {
  document.getElementById("level-picker").innerHTML = "";
  document.getElementById("hint").textContent = "Hepsini ezberle! 🧠";
  const board = document.getElementById("board");
  board.innerHTML = "";
  const row = document.createElement("div");
  row.className = "missing-row";
  state.items.forEach(e => {
    const d = document.createElement("div");
    d.className = "missing-item";
    d.innerHTML = `<span>${e}</span>`;
    row.appendChild(d);
  });
  board.appendChild(row);
  updateHud();
  setTimeout(() => renderAsk(), state.cfg.showMs);
}

function renderAsk() {
  document.getElementById("hint").textContent =
    `Hangisi(leri) kayboldu? ${state.cfg.missing} tane seç 👆`;
  const board = document.getElementById("board");
  board.innerHTML = "";
  const row = document.createElement("div");
  row.className = "missing-row";
  state.items.forEach((e, i) => {
    const d = document.createElement("div");
    d.className = "missing-item";
    if (state.missingIndexes.has(i)) {
      d.classList.add("hidden-view");
      d.innerHTML = `<span>${e}</span>`;
    } else {
      d.innerHTML = `<span>${e}</span>`;
    }
    row.appendChild(d);
  });
  board.appendChild(row);

  // Seçenekler: kayıp öğeler + distraktörler.
  const pool = getEmojis(profile, 16).filter(x => !state.items.includes(x));
  const distractors = pool.slice(0, state.cfg.missing + 2);
  const options = shuffle([...state.missingItems, ...distractors]);
  const opts = document.createElement("div");
  opts.className = "options-row";
  options.forEach(e => {
    const b = document.createElement("button");
    b.className = "option-btn";
    b.textContent = e;
    b.addEventListener("click", () => onPick(e, b));
    opts.appendChild(b);
  });
  board.appendChild(opts);
}

function updateHud() {
  document.getElementById("hud").innerHTML =
    `<span>❓ ${state.cfg.missing}</span><span>❌ ${state.errors}</span>`;
}

function onPick(emoji, btn) {
  if (btn.disabled) return;
  if (state.missingItems.includes(emoji) && !state.picked.includes(emoji)) {
    btn.classList.add("correct"); btn.disabled = true;
    state.picked.push(emoji); goodSound();
    if (state.picked.length === state.missingItems.length) {
      setTimeout(() => finish(), 500);
    }
  } else {
    btn.classList.add("wrong"); state.errors++; badSound(); updateHud();
    setTimeout(() => btn.classList.remove("wrong"), 400);
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
