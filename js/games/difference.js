const GAME_ID = "difference";
const profile = requireProfile();

// 4x4 grid = 16 hücre. Zorluğa göre fark sayısı.
const LEVELS = { 1: { diffs: 2 }, 2: { diffs: 4 }, 3: { diffs: 6 } };
const GRID_N = 16;
let state = null;

function startGame(level) {
  const cfg = LEVELS[level];
  const base = [];
  const pool = getEmojis(profile, 16);
  for (let i = 0; i < GRID_N; i++) base.push(pool[i % pool.length]);
  const right = base.slice();
  const diffIndexes = shuffle(base.map((_, i) => i)).slice(0, cfg.diffs);
  diffIndexes.forEach(i => {
    const alt = getEmojis(profile, 16).find(e => e !== base[i]);
    right[i] = alt;
  });
  state = { level, cfg, base, right, diffSet: new Set(diffIndexes), found: 0, errors: 0 };
  render();
}

function render() {
  document.getElementById("level-picker").innerHTML = "";
  document.getElementById("hint").textContent = "Sağdaki farklı olanlara dokun! 👆";
  const board = document.getElementById("board");
  board.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "diff-wrap";
  wrap.appendChild(buildGrid(state.base, false));
  wrap.appendChild(buildGrid(state.right, true));
  board.appendChild(wrap);
  updateHud();
}

function buildGrid(items, clickable) {
  const g = document.createElement("div");
  g.className = "diff-grid";
  items.forEach((e, i) => {
    const c = document.createElement("div");
    c.className = "diff-cell" + (clickable ? " right-side" : "");
    c.textContent = e;
    if (clickable) c.addEventListener("click", () => onCell(i, c));
    g.appendChild(c);
  });
  return g;
}

function updateHud() {
  document.getElementById("hud").innerHTML =
    `<span>✅ ${state.found}/${state.cfg.diffs}</span><span>❌ ${state.errors}</span>`;
}

function onCell(i, cell) {
  if (cell.classList.contains("found")) return;
  if (state.diffSet.has(i)) {
    cell.classList.add("found");
    state.found++; goodSound();
    updateHud();
    if (state.found === state.cfg.diffs) finish();
  } else {
    state.errors++; badSound();
    cell.animate([{transform:"translateX(0)"},{transform:"translateX(-6px)"},{transform:"translateX(6px)"},{transform:"translateX(0)"}], 400);
    updateHud();
  }
}

function finish() {
  const stars = computeStars(state.errors, 0, 2);
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
