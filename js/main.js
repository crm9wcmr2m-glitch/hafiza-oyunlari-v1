const PROFILE_KEY = "memory_profile_v1";

function getProfile() {
  return localStorage.getItem(PROFILE_KEY);
}
function setProfile(p) {
  localStorage.setItem(PROFILE_KEY, p);
}
function clearProfile() {
  localStorage.removeItem(PROFILE_KEY);
}

const GAMES = [
  { id: "match",      title: "Kart Eşleştirme", icon: "🎴", file: "games/match.html" },
  { id: "sequence",   title: "Sıra Hatırlama",  icon: "🎶", file: "games/sequence.html" },
  { id: "difference", title: "Farkı Bul",       icon: "🔍", file: "games/difference.html" },
  { id: "missing",    title: "Hangisi Kayıp?",  icon: "❓", file: "games/missing.html" },
  { id: "shadow",     title: "Gölge Eşleme",    icon: "🌓", file: "games/shadow.html" }
];

const FUN_GAMES = [
  { id: "tetris", title: "Tetris",  icon: "🟦", file: "games/tetris.html" },
  { id: "pong",   title: "Pinpon",  icon: "🏓", file: "games/pong.html" }
];

function applyProfilePalette(profile) {
  document.body.classList.remove("profile-girl", "profile-boy");
  if (profile) document.body.classList.add("profile-" + profile);
}

function showMenu() {
  document.getElementById("profile-screen").classList.add("hidden");
  document.getElementById("menu-screen").classList.remove("hidden");
  const profile = getProfile();
  const theme = getTheme(profile);
  document.getElementById("welcome").textContent = "Hoş geldin!";
  document.getElementById("profile-badge").textContent = theme.emoji;
  renderGamesGrid(profile);
  renderFunGrid();
}

function renderGamesGrid(profile) {
  const grid = document.getElementById("games-grid");
  grid.innerHTML = "";
  GAMES.forEach(g => {
    const stars1 = getStars(g.id, 1);
    const stars2 = getStars(g.id, 2);
    const stars3 = getStars(g.id, 3);
    const total = stars1 + stars2 + stars3;
    const a = document.createElement("a");
    a.className = "game-card";
    a.href = g.file;
    a.innerHTML = `
      <div class="game-icon">${g.icon}</div>
      <div class="game-title">${g.title}</div>
      <div class="game-stars">${"⭐".repeat(total)}${"☆".repeat(9 - total)}</div>
    `;
    grid.appendChild(a);
  });
}

function renderFunGrid() {
  const grid = document.getElementById("fun-grid");
  grid.innerHTML = "";
  FUN_GAMES.forEach(g => {
    const a = document.createElement("a");
    a.className = "game-card";
    a.href = g.file;
    a.innerHTML = `
      <div class="game-icon">${g.icon}</div>
      <div class="game-title">${g.title}</div>
      <div class="game-stars">🎮</div>
    `;
    grid.appendChild(a);
  });
}

function showProfileScreen() {
  document.getElementById("menu-screen").classList.add("hidden");
  document.getElementById("profile-screen").classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  const profile = getProfile();
  if (profile) {
    applyProfilePalette(profile);
    showMenu();
  }

  document.querySelectorAll(".profile-card").forEach(btn => {
    btn.addEventListener("click", () => {
      const p = btn.dataset.profile;
      setProfile(p);
      applyProfilePalette(p);
      showMenu();
    });
  });

  document.getElementById("change-profile").addEventListener("click", () => {
    clearProfile();
    applyProfilePalette(null);
    showProfileScreen();
  });
});
