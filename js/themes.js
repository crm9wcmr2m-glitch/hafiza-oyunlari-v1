// Kız ve erkek profilleri için hafıza oyunu emoji temaları.
// Yiyecek emojisi kullanılmaz.
const THEMES = {
  girl: {
    name: "Kız",
    emoji: "👧",
    palette: "girl",
    items: ["🦄","🧚","👸","🌸","🌼","🦋","🐰","🐱","🌈","⭐","💎","🎀","🪄","🏰","🦢","🌺"]
  },
  boy: {
    name: "Erkek",
    emoji: "👦",
    palette: "boy",
    items: ["🚗","🚀","🦖","🤖","⚽","🚁","🚂","🦁","🐯","🛩️","🏎️","🦈","⚡","🏆","🛸","🦕"]
  }
};

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Profil için emoji setinden n benzersiz öğe döndür.
function getEmojis(profile, n) {
  const theme = THEMES[profile] || THEMES.girl;
  return shuffle(theme.items).slice(0, n);
}

function getTheme(profile) {
  return THEMES[profile] || THEMES.girl;
}
