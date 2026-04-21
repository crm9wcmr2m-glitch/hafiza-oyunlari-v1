const PROGRESS_KEY_ADV = "adventure_progress_v1";

function loadAdvProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY_ADV) || "{}"); } catch { return {}; }
}
function saveAdvProgress(p) { localStorage.setItem(PROGRESS_KEY_ADV, JSON.stringify(p)); }

function markSeen(catId, idx) {
  const p = loadAdvProgress();
  p[catId] = p[catId] || {};
  p[catId][idx] = true;
  saveAdvProgress(p);
}
function countSeen(catId, total) {
  const p = loadAdvProgress();
  return Object.keys(p[catId] || {}).length;
}

// URL'den kategori al
const params = new URLSearchParams(location.search);
const CAT_ID = params.get("cat") || "tarih";
const CAT = ADVENTURE_CATEGORIES[CAT_ID];
if (!CAT) location.href = "index.html";

let currentIdx = 0;
let flipped = false;

function init() {
  // Başlık
  document.getElementById("cat-title").textContent = CAT.icon + " " + CAT.title;
  document.getElementById("cat-title").style.color = CAT.color;
  document.title = CAT.title + " — Macera & Keşif";
  document.body.style.setProperty("--cat-color", CAT.color);
  document.body.style.setProperty("--cat-light", CAT.colorLight);
  showCard(0);
  updateProgress();
}

function showCard(idx) {
  currentIdx = idx;
  flipped = false;
  const card = CAT.cards[idx];
  const el = document.getElementById("card-inner");
  const front = document.getElementById("card-front");
  const back  = document.getElementById("card-back");

  el.classList.remove("flipped");

  front.innerHTML = `
    <div class="card-emoji">${card.emoji}</div>
    <div class="card-main-title">${card.title}</div>
    <div class="card-tap-hint">Dokunarak bilgiyi gör 👆</div>
  `;
  back.innerHTML = `
    <div class="card-emoji small">${card.emoji}</div>
    <div class="card-main-title">${card.title}</div>
    <div class="card-fact">${card.fact}</div>
    ${card.bonus ? `<div class="card-bonus">💡 ${card.bonus}</div>` : ""}
  `;

  markSeen(CAT_ID, idx);
  updateProgress();
  updateNav();
}

function flipCard() {
  flipped = !flipped;
  document.getElementById("card-inner").classList.toggle("flipped", flipped);
}

function prevCard() { if (currentIdx > 0) showCard(currentIdx - 1); }
function nextCard() { if (currentIdx < CAT.cards.length - 1) showCard(currentIdx + 1); }

function updateProgress() {
  const seen = countSeen(CAT_ID, CAT.cards.length);
  const total = CAT.cards.length;
  document.getElementById("progress-text").textContent = `${currentIdx + 1} / ${total}`;
  document.getElementById("progress-bar-fill").style.width = ((currentIdx + 1) / total * 100) + "%";
}

function updateNav() {
  document.getElementById("btn-prev").disabled = currentIdx === 0;
  document.getElementById("btn-next").disabled = currentIdx === CAT.cards.length - 1;
  document.getElementById("btn-next").textContent = currentIdx === CAT.cards.length - 1 ? "✅ Bitti" : "İleri ➡️";
}

// Swipe desteği
let touchStartX = 0;
document.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; }, { passive: true });
document.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) < 50) return;
  if (dx < 0) nextCard();
  else prevCard();
});

document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") nextCard();
  else if (e.key === "ArrowLeft") prevCard();
  else if (e.key === " " || e.key === "Enter") { e.preventDefault(); flipCard(); }
});

document.addEventListener("DOMContentLoaded", init);
