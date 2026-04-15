// Seviye kilidi ve yıldız takibi (localStorage).
const PROGRESS_KEY = "memory_progress_v1";

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
  } catch { return {}; }
}
function saveProgress(p) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

function getStars(game, level) {
  const p = loadProgress();
  return p[game]?.[level]?.stars || 0;
}

// Seviye açık mı? Kolay (1) daima açık; Orta (2) Kolay bitince; Zor (3) Orta bitince.
function isUnlocked(game, level) {
  if (level <= 1) return true;
  return getStars(game, level - 1) >= 1;
}

function saveStars(game, level, stars) {
  const p = loadProgress();
  p[game] = p[game] || {};
  const prev = p[game][level]?.stars || 0;
  p[game][level] = { stars: Math.max(prev, stars) };
  saveProgress(p);
}

function resetProgress() {
  localStorage.removeItem(PROGRESS_KEY);
}
