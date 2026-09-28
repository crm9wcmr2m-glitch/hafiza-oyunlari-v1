// Bitki Atölyesi — sürükle-bırak ile fare kullanımı öğreten giydirme oyunu.
const profile = requireProfile();

const PLANT_ROT_KEY = "plant_rot_v1";
function loadPlantRotations() {
  try { return JSON.parse(localStorage.getItem(PLANT_ROT_KEY) || "{}"); } catch { return {}; }
}
function getPlantRotation(plant) {
  const saved = loadPlantRotations();
  return typeof saved[plant.id] === "number" ? saved[plant.id] : (plant.rot || 0);
}
function savePlantRotation(id, deg) {
  const saved = loadPlantRotations();
  saved[id] = ((deg % 360) + 360) % 360;
  localStorage.setItem(PLANT_ROT_KEY, JSON.stringify(saved));
}

const PLANTS = {
  sebze: [
    { id: "havuc",     name: "Havuç",     emoji: "🥕", rot: -45 },
    { id: "domates",   name: "Domates",   emoji: "🍅" },
    { id: "patlican",  name: "Patlıcan",  emoji: "🍆", rot: 45 },
    { id: "misir",     name: "Mısır",     emoji: "🌽", rot: -52 },
    { id: "patates",   name: "Patates",   emoji: "🥔" },
    { id: "biber",     name: "Biber",     emoji: "🫑" },
    { id: "brokoli",   name: "Brokoli",   emoji: "🥦" },
    { id: "salatalik", name: "Salatalık", emoji: "🥒", rot: -45 }
  ],
  meyve: [
    { id: "elma",     name: "Elma",     emoji: "🍎" },
    { id: "muz",      name: "Muz",      emoji: "🍌", rot: 90 },
    { id: "cilek",    name: "Çilek",    emoji: "🍓" },
    { id: "karpuz",   name: "Karpuz",   emoji: "🍉" },
    { id: "portakal", name: "Portakal", emoji: "🍊" },
    { id: "uzum",     name: "Üzüm",     emoji: "🍇", rot: 20 },
    { id: "ananas",   name: "Ananas",   emoji: "🍍", rot: 20 },
    { id: "kivi",     name: "Kivi",     emoji: "🥝" }
  ]
};

const HEART = "M12 21s-6.7-4.35-9.3-7.9C.8 10.6 1 7 4 5.4 6 4.3 8.4 5 10 7c.5.6 1 1.4 2 1.4s1.5-.8 2-1.4c1.6-2 4-2.7 6-1.6 3 1.6 3.2 5.2 1.3 7.7C18.7 16.65 12 21 12 21z";
const STAR = "M12 2 L14.7 8.6 L22 9.2 L16.5 13.9 L18.2 21 L12 17.1 L5.8 21 L7.5 13.9 L2 9.2 L9.3 8.6 Z";

const ACCESSORIES = {
  eyes: [
    { id: "normal",    name: "Normal",  w: 100, svg: `<svg viewBox="0 0 120 50"><circle cx="35" cy="25" r="14" fill="#2d2d4a"/><circle cx="85" cy="25" r="14" fill="#2d2d4a"/><circle cx="39" cy="20" r="4" fill="#fff"/><circle cx="89" cy="20" r="4" fill="#fff"/></svg>` },
    { id: "happy",     name: "Mutlu",   w: 100, svg: `<svg viewBox="0 0 120 50"><path d="M15,30 Q35,8 55,30" stroke="#2d2d4a" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M65,30 Q85,8 105,30" stroke="#2d2d4a" stroke-width="7" fill="none" stroke-linecap="round"/></svg>` },
    { id: "sleepy",    name: "Uykulu",  w: 100, svg: `<svg viewBox="0 0 120 50"><path d="M15,28 L55,28" stroke="#2d2d4a" stroke-width="6" stroke-linecap="round"/><path d="M65,28 L105,28" stroke="#2d2d4a" stroke-width="6" stroke-linecap="round"/></svg>` },
    { id: "surprised", name: "Şaşkın",  w: 100, svg: `<svg viewBox="0 0 120 50"><circle cx="35" cy="25" r="19" fill="#fff" stroke="#2d2d4a" stroke-width="4"/><circle cx="85" cy="25" r="19" fill="#fff" stroke="#2d2d4a" stroke-width="4"/><circle cx="35" cy="25" r="7" fill="#2d2d4a"/><circle cx="85" cy="25" r="7" fill="#2d2d4a"/></svg>` },
    { id: "angry",     name: "Kızgın",  w: 100, svg: `<svg viewBox="0 0 120 50"><path d="M14,10 L54,20" stroke="#2d2d4a" stroke-width="6" stroke-linecap="round"/><path d="M106,10 L66,20" stroke="#2d2d4a" stroke-width="6" stroke-linecap="round"/><circle cx="35" cy="30" r="11" fill="#2d2d4a"/><circle cx="85" cy="30" r="11" fill="#2d2d4a"/></svg>` },
    { id: "love",      name: "Sevgi Dolu", w: 100, svg: `<svg viewBox="0 0 120 50"><g transform="translate(14,4) scale(1.6)"><path d="${HEART}" fill="#ff6fae"/></g><g transform="translate(64,4) scale(1.6)"><path d="${HEART}" fill="#ff6fae"/></g></svg>` }
  ],
  nose: [
    { id: "round",  name: "Yuvarlak",   w: 60, svg: `<svg viewBox="0 0 80 60"><ellipse cx="40" cy="30" rx="14" ry="16" fill="#e8a86a"/><circle cx="34" cy="36" r="2.5" fill="#8a5a2a"/><circle cx="46" cy="36" r="2.5" fill="#8a5a2a"/></svg>` },
    { id: "button", name: "Minik",      w: 50, svg: `<svg viewBox="0 0 80 60"><circle cx="40" cy="30" r="10" fill="#e8a86a"/></svg>` },
    { id: "carrot", name: "Sivri",      w: 60, svg: `<svg viewBox="0 0 80 60"><path d="M40,10 L54,34 Q40,42 26,34 Z" fill="#ff8c42"/></svg>` }
  ],
  mouth: [
    { id: "smile",     name: "Gülümseme",  w: 90, svg: `<svg viewBox="0 0 120 40"><path d="M15,10 Q60,42 105,10" stroke="#2d2d4a" stroke-width="7" fill="none" stroke-linecap="round"/></svg>` },
    { id: "sad",       name: "Üzgün",      w: 90, svg: `<svg viewBox="0 0 120 40"><path d="M15,30 Q60,2 105,30" stroke="#2d2d4a" stroke-width="7" fill="none" stroke-linecap="round"/></svg>` },
    { id: "surprised", name: "Şaşkın",     w: 90, svg: `<svg viewBox="0 0 120 40"><ellipse cx="60" cy="20" rx="14" ry="18" fill="#7a3b2e"/></svg>` },
    { id: "tongue",    name: "Dil Çıkarma",w: 90, svg: `<svg viewBox="0 0 120 40"><path d="M15,10 Q60,42 105,10" stroke="#2d2d4a" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M45,26 Q60,42 75,26 Q60,34 45,26" fill="#ff6f91"/></svg>` },
    { id: "neutral",   name: "Sakin",      w: 90, svg: `<svg viewBox="0 0 120 40"><path d="M25,20 L95,20" stroke="#2d2d4a" stroke-width="6" stroke-linecap="round"/></svg>` }
  ],
  teeth: [
    { id: "normal", name: "Normal",      w: 90, svg: `<svg viewBox="0 0 100 30"><rect x="20" y="4" width="60" height="18" rx="4" fill="#fff" stroke="#ddd" stroke-width="1"/><path d="M35,4 L35,22 M50,4 L50,22 M65,4 L65,22" stroke="#ddd" stroke-width="1"/></svg>` },
    { id: "buck",   name: "Tavşan Dişi", w: 90, svg: `<svg viewBox="0 0 100 30"><rect x="38" y="2" width="12" height="24" rx="3" fill="#fff" stroke="#ddd"/><rect x="50" y="2" width="12" height="24" rx="3" fill="#fff" stroke="#ddd"/></svg>` },
    { id: "gap",    name: "Diş Boşluğu", w: 90, svg: `<svg viewBox="0 0 100 30"><rect x="20" y="4" width="25" height="18" rx="4" fill="#fff" stroke="#ddd"/><rect x="55" y="4" width="25" height="18" rx="4" fill="#fff" stroke="#ddd"/></svg>` },
    { id: "braces", name: "Breketli",    w: 90, svg: `<svg viewBox="0 0 100 30"><rect x="20" y="4" width="60" height="18" rx="4" fill="#fff" stroke="#ddd" stroke-width="1"/><path d="M35,4 L35,22 M50,4 L50,22 M65,4 L65,22" stroke="#ddd" stroke-width="1"/><rect x="20" y="10" width="60" height="5" fill="#7dd3fc"/><circle cx="35" cy="12.5" r="2.5" fill="#3b82f6"/><circle cx="50" cy="12.5" r="2.5" fill="#3b82f6"/><circle cx="65" cy="12.5" r="2.5" fill="#3b82f6"/></svg>` }
  ],
  ears: [
    { id: "round",  name: "Yuvarlak", w: 160, svg: `<svg viewBox="0 0 160 60"><ellipse cx="18" cy="30" rx="15" ry="21" fill="#ffd6a5" stroke="#e8a86a" stroke-width="3"/><ellipse cx="142" cy="30" rx="15" ry="21" fill="#ffd6a5" stroke="#e8a86a" stroke-width="3"/></svg>` },
    { id: "pointy", name: "Sivri",    w: 160, svg: `<svg viewBox="0 0 160 60"><path d="M10,45 Q5,10 30,15 Q28,40 10,45Z" fill="#ffd6a5" stroke="#e8a86a" stroke-width="3"/><path d="M150,45 Q155,10 130,15 Q132,40 150,45Z" fill="#ffd6a5" stroke="#e8a86a" stroke-width="3"/></svg>` },
    { id: "floppy", name: "Sarkık",   w: 160, svg: `<svg viewBox="0 0 160 60"><ellipse cx="20" cy="38" rx="14" ry="24" fill="#ffd6a5" stroke="#e8a86a" stroke-width="3" transform="rotate(15 20 38)"/><ellipse cx="140" cy="38" rx="14" ry="24" fill="#ffd6a5" stroke="#e8a86a" stroke-width="3" transform="rotate(-15 140 38)"/></svg>` }
  ],
  hair: [
    { id: "long",      name: "Uzun Saç",       gender: "girl", w: 190, svg: `<svg viewBox="0 0 200 130"><path d="M100,10 C50,10 18,45 20,85 C21,105 30,120 42,128 C38,102 42,80 55,65 C50,90 55,112 68,124 L72,124 C64,100 65,75 78,58 C88,50 112,50 122,58 C135,75 136,100 128,124 L132,124 C145,112 150,90 145,65 C158,80 162,102 158,128 C170,120 179,105 180,85 C182,45 150,10 100,10Z" fill="#6b4226"/><path d="M100,10 C70,10 45,25 32,50 C50,35 75,26 100,26 C125,26 150,35 168,50 C155,25 130,10 100,10Z" fill="#8a5a35"/><path d="M100,16 L100,55" stroke="#4a2d18" stroke-width="2" fill="none"/></svg>` },
    { id: "pigtails",  name: "Toplu Saç",      gender: "girl", w: 190, svg: `<svg viewBox="0 0 200 130"><path d="M100,14 C60,14 38,38 42,62 C55,48 76,40 100,40 C124,40 145,48 158,62 C162,38 140,14 100,14Z" fill="#7a4a2a"/><path d="M38,55 C20,60 8,80 14,100 C20,118 38,128 52,120 C44,105 40,88 42,70 C42,63 40,58 38,55Z" fill="#7a4a2a"/><path d="M162,55 C180,60 192,80 186,100 C180,118 162,128 148,120 C156,105 160,88 158,70 C158,63 160,58 162,55Z" fill="#7a4a2a"/><path d="M22,75 Q30,85 24,98" stroke="#5a341c" stroke-width="2" fill="none"/><path d="M178,75 Q170,85 176,98" stroke="#5a341c" stroke-width="2" fill="none"/><rect x="28" y="56" width="18" height="9" rx="4" fill="#ff4fa0"/><rect x="154" y="56" width="18" height="9" rx="4" fill="#ff4fa0"/></svg>` },
    { id: "curly",     name: "Kıvırcık",       gender: "girl", w: 190, svg: `<svg viewBox="0 0 200 130"><circle cx="62" cy="58" r="28" fill="#c9862f"/><circle cx="100" cy="36" r="34" fill="#c9862f"/><circle cx="138" cy="58" r="28" fill="#c9862f"/><circle cx="40" cy="82" r="22" fill="#c9862f"/><circle cx="160" cy="82" r="22" fill="#c9862f"/><circle cx="72" cy="46" r="12" fill="#e0a95a"/><circle cx="110" cy="28" r="14" fill="#e0a95a"/><circle cx="145" cy="48" r="10" fill="#e0a95a"/><rect x="30" y="58" width="140" height="16" rx="8" fill="#ff6fae"/><circle cx="100" cy="66" r="9" fill="#ffd166" stroke="#e0a95a" stroke-width="2"/></svg>` },
    { id: "short",     name: "Kısa Saç",       gender: "boy",  w: 190, svg: `<svg viewBox="0 0 200 130"><path d="M100,20 C58,20 34,48 34,76 C34,84 37,90 43,94 L157,94 C163,90 166,84 166,76 C166,48 142,20 100,20Z" fill="#2d2d4a"/><path d="M100,20 C75,20 54,30 44,48 C60,36 80,29 100,29 C120,29 140,36 156,48 C146,30 125,20 100,20Z" fill="#454568"/><path d="M60,36 L54,58 M80,26 L76,52 M100,22 L100,54 M120,26 L124,52 M140,36 L146,58" stroke="#1a1a30" stroke-width="2" stroke-linecap="round"/></svg>` },
    { id: "sideparts", name: "Yandan Taramalı",gender: "boy",  w: 190, svg: `<svg viewBox="0 0 200 130"><path d="M100,20 C58,20 34,48 34,76 C34,84 37,90 43,94 L157,94 C163,90 166,84 166,76 C166,48 142,20 100,20Z" fill="#4a3223"/><path d="M100,20 C74,20 52,29 42,46 C60,34 84,28 106,29 C122,30 142,35 158,46 C146,28 124,20 100,20Z" fill="#6b4a30"/><path d="M58,28 Q54,42 50,56" stroke="#3a2317" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M70,24 L64,50 M88,21 L84,50 M108,22 L114,50 M126,26 L134,52 M144,34 L152,58" stroke="#3a2317" stroke-width="2" stroke-linecap="round"/></svg>` },
    { id: "spiky",     name: "Fırça Kesim",    gender: "boy",  w: 190, svg: `<svg viewBox="0 0 200 130"><ellipse cx="100" cy="72" rx="58" ry="20" fill="#2a6fb8"/><path d="M48,66 L54,28 L66,54 L76,18 L90,50 L100,14 L110,50 L124,18 L134,54 L146,28 L152,66Z" fill="#3b82f6"/><path d="M48,66 L54,28 L60,42 L66,54Z" fill="#2a6fb8"/><path d="M124,18 L134,54 L140,42 L146,28Z" fill="#5aa0f0"/></svg>` },
    { id: "messy",     name: "Dağınık",        gender: "any",  w: 190, svg: `<svg viewBox="0 0 200 130"><path d="M100,30 C62,30 38,50 38,72 C38,80 41,86 46,90 L154,90 C159,86 162,80 162,72 C162,50 138,30 100,30Z" fill="#c1622a"/><path d="M38,55 L44,25 L58,45 L68,15 L82,40 L100,18 L118,40 L132,15 L142,45 L156,25 L162,55Z" fill="#c1622a"/><path d="M56,40 L48,58 M78,30 L74,50 M100,26 L98,48 M122,30 L128,50 M144,40 L152,58" stroke="#8f4218" stroke-width="2.5" stroke-linecap="round"/></svg>` },
    { id: "afro",      name: "Afro",           gender: "any",  w: 190, svg: `<svg viewBox="0 0 200 130"><circle cx="100" cy="62" r="52" fill="#3a2317"/><circle cx="58" cy="70" r="26" fill="#3a2317"/><circle cx="142" cy="70" r="26" fill="#3a2317"/><circle cx="100" cy="30" r="24" fill="#3a2317"/><circle cx="80" cy="46" r="10" fill="#5a3d28"/><circle cx="120" cy="40" r="12" fill="#5a3d28"/><circle cx="100" cy="62" r="14" fill="#5a3d28"/></svg>` }
  ],
  beard: [
    { id: "mustache", name: "Bıyık",       gender: "boy", w: 120, svg: `<svg viewBox="0 0 160 90"><path d="M80,40 Q60,25 35,35 Q45,45 55,42 Q65,50 80,45 Q95,50 105,42 Q115,45 125,35 Q100,25 80,40Z" fill="#5b3a29"/></svg>` },
    { id: "goatee",   name: "Keçi Sakalı",  gender: "boy", w: 120, svg: `<svg viewBox="0 0 160 90"><path d="M65,20 Q60,60 80,75 Q100,60 95,20 Q80,35 65,20Z" fill="#4a3223"/></svg>` },
    { id: "full",     name: "Tam Sakal",    gender: "boy", w: 120, svg: `<svg viewBox="0 0 160 90"><path d="M30,15 C25,45 35,75 80,82 C125,75 135,45 130,15 C120,35 105,45 80,45 C55,45 40,35 30,15Z" fill="#3a2317"/></svg>` },
    { id: "bushy",    name: "Gür Sakal",    gender: "boy", w: 120, svg: `<svg viewBox="0 0 160 90"><path d="M25,10 C15,45 30,80 80,88 C130,80 145,45 135,10 C130,35 120,25 112,40 C108,25 98,45 92,30 C88,48 78,48 74,30 C68,45 58,25 54,40 C46,25 36,35 25,10Z" fill="#2d2d4a"/></svg>` }
  ],
  glasses: [
    { id: "round",    name: "Yuvarlak", gender: "any", w: 150, svg: `<svg viewBox="0 0 200 70"><circle cx="55" cy="35" r="28" fill="rgba(255,255,255,0.15)" stroke="#2d2d4a" stroke-width="5"/><circle cx="145" cy="35" r="28" fill="rgba(255,255,255,0.15)" stroke="#2d2d4a" stroke-width="5"/><path d="M83,32 L117,32" stroke="#2d2d4a" stroke-width="5"/><path d="M27,30 L5,20" stroke="#2d2d4a" stroke-width="5"/><path d="M173,30 L195,20" stroke="#2d2d4a" stroke-width="5"/></svg>` },
    { id: "colorful", name: "Renkli",   gender: "any", w: 150, svg: `<svg viewBox="0 0 200 70"><rect x="27" y="10" width="56" height="48" rx="16" fill="#ffe07d" stroke="#ff6fae" stroke-width="5"/><rect x="117" y="10" width="56" height="48" rx="16" fill="#ffe07d" stroke="#ff6fae" stroke-width="5"/><path d="M83,32 L117,32" stroke="#ff6fae" stroke-width="5"/></svg>` },
    { id: "heart",    name: "Kalp",     gender: "girl", w: 150, svg: `<svg viewBox="0 0 200 70"><g transform="translate(25,4) scale(2.3)"><path d="${HEART}" fill="rgba(255,111,174,0.35)" stroke="#ff4f81" stroke-width="1.4"/></g><g transform="translate(115,4) scale(2.3)"><path d="${HEART}" fill="rgba(255,111,174,0.35)" stroke="#ff4f81" stroke-width="1.4"/></g><path d="M83,30 L117,30" stroke="#ff4f81" stroke-width="5"/></svg>` },
    { id: "star",     name: "Yıldız",   gender: "girl", w: 150, svg: `<svg viewBox="0 0 200 70"><g transform="translate(25,3) scale(2.2)"><path d="${STAR}" fill="rgba(160,108,213,0.35)" stroke="#a06cd5" stroke-width="1.4"/></g><g transform="translate(115,3) scale(2.2)"><path d="${STAR}" fill="rgba(160,108,213,0.35)" stroke="#a06cd5" stroke-width="1.4"/></g><path d="M83,30 L117,30" stroke="#a06cd5" stroke-width="5"/></svg>` },
    { id: "square",   name: "Kare",     gender: "boy",  w: 150, svg: `<svg viewBox="0 0 200 70"><rect x="25" y="8" width="60" height="50" rx="6" fill="rgba(200,220,255,0.25)" stroke="#1a1a1a" stroke-width="7"/><rect x="115" y="8" width="60" height="50" rx="6" fill="rgba(200,220,255,0.25)" stroke="#1a1a1a" stroke-width="7"/><path d="M85,32 L115,32" stroke="#1a1a1a" stroke-width="7"/></svg>` },
    { id: "aviator",  name: "Güneş",    gender: "boy",  w: 150, svg: `<svg viewBox="0 0 200 70"><path d="M55,10 C75,10 85,25 82,42 C80,55 65,60 52,55 C40,50 32,35 38,22 C42,13 48,10 55,10Z" fill="#333" stroke="#d4a017" stroke-width="4"/><path d="M145,10 C125,10 115,25 118,42 C120,55 135,60 148,55 C160,50 168,35 162,22 C158,13 152,10 145,10Z" fill="#333" stroke="#d4a017" stroke-width="4"/><path d="M82,28 L118,28" stroke="#d4a017" stroke-width="4"/></svg>` }
  ],
  earrings: [
    { id: "hoop",  name: "Halka", gender: "girl", w: 34, svg: `<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="18" fill="none" stroke="#d4a017" stroke-width="6"/></svg>` },
    { id: "heart", name: "Kalp",  gender: "girl", w: 34, svg: `<svg viewBox="0 0 60 60"><g transform="translate(15,10) scale(1.3)"><path d="${HEART}" fill="#ff6fae"/></g></svg>` },
    { id: "star",  name: "Yıldız",gender: "girl", w: 34, svg: `<svg viewBox="0 0 60 60"><g transform="translate(15,10) scale(1.3)"><path d="${STAR}" fill="#ffd166"/></g></svg>` },
    { id: "pearl", name: "İnci",  gender: "girl", w: 34, svg: `<svg viewBox="0 0 60 60"><circle cx="30" cy="28" r="11" fill="#f5f5f5" stroke="#ccc" stroke-width="2"/><circle cx="26" cy="24" r="3" fill="#fff"/></svg>` }
  ],
  arms: [
    { id: "down", name: "İnik",     w: 200, svg: `<svg viewBox="0 0 220 120"><path d="M30,20 L15,95" stroke="#5c9d3b" stroke-width="16" stroke-linecap="round" fill="none"/><circle cx="15" cy="98" r="13" fill="#3f7a2a"/><path d="M190,20 L205,95" stroke="#5c9d3b" stroke-width="16" stroke-linecap="round" fill="none"/><circle cx="205" cy="98" r="13" fill="#3f7a2a"/></svg>` },
    { id: "wave", name: "El Sallayan", w: 200, svg: `<svg viewBox="0 0 220 120"><path d="M30,20 L15,95" stroke="#5c9d3b" stroke-width="16" stroke-linecap="round" fill="none"/><circle cx="15" cy="98" r="13" fill="#3f7a2a"/><path d="M190,60 Q218,30 200,8" stroke="#5c9d3b" stroke-width="16" stroke-linecap="round" fill="none"/><circle cx="200" cy="8" r="13" fill="#3f7a2a"/></svg>` },
    { id: "hips", name: "Belde",    w: 200, svg: `<svg viewBox="0 0 220 120"><path d="M35,25 Q10,55 40,70" stroke="#5c9d3b" stroke-width="16" stroke-linecap="round" fill="none"/><circle cx="40" cy="70" r="12" fill="#3f7a2a"/><path d="M185,25 Q210,55 180,70" stroke="#5c9d3b" stroke-width="16" stroke-linecap="round" fill="none"/><circle cx="180" cy="70" r="12" fill="#3f7a2a"/></svg>` }
  ],
  legs: [
    { id: "standing", name: "Duran",  w: 170, svg: `<svg viewBox="0 0 200 100"><path d="M75,5 L75,75" stroke="#5c9d3b" stroke-width="18" stroke-linecap="round" fill="none"/><ellipse cx="75" cy="86" rx="22" ry="11" fill="#3f7a2a"/><path d="M125,5 L125,75" stroke="#5c9d3b" stroke-width="18" stroke-linecap="round" fill="none"/><ellipse cx="125" cy="86" rx="22" ry="11" fill="#3f7a2a"/></svg>` },
    { id: "running",  name: "Koşan",  w: 170, svg: `<svg viewBox="0 0 200 100"><path d="M75,5 Q55,40 85,70" stroke="#5c9d3b" stroke-width="18" stroke-linecap="round" fill="none"/><ellipse cx="88" cy="76" rx="22" ry="11" fill="#3f7a2a" transform="rotate(20 88 76)"/><path d="M125,5 Q150,35 115,70" stroke="#5c9d3b" stroke-width="18" stroke-linecap="round" fill="none"/><ellipse cx="112" cy="76" rx="22" ry="11" fill="#3f7a2a" transform="rotate(-20 112 76)"/></svg>` },
    { id: "dance",    name: "Dans",   w: 170, svg: `<svg viewBox="0 0 200 100"><path d="M70,5 Q100,45 130,70" stroke="#5c9d3b" stroke-width="18" stroke-linecap="round" fill="none"/><ellipse cx="132" cy="76" rx="20" ry="10" fill="#3f7a2a" transform="rotate(25 132 76)"/><path d="M130,5 Q100,45 70,70" stroke="#5c9d3b" stroke-width="18" stroke-linecap="round" fill="none"/><ellipse cx="68" cy="76" rx="20" ry="10" fill="#3f7a2a" transform="rotate(-25 68 76)"/></svg>` }
  ]
};

const TABS = [
  { key: "eyes",     label: "Gözler",   icon: "👀" },
  { key: "nose",     label: "Burun",    icon: "👃" },
  { key: "mouth",    label: "Ağız",     icon: "👄" },
  { key: "teeth",    label: "Diş",      icon: "🦷" },
  { key: "ears",     label: "Kulaklar", icon: "👂" },
  { key: "hair",     label: "Saç",      icon: { girl: "💇‍♀️", boy: "💇‍♂️" } },
  { key: "beard",    label: "Sakal",    icon: "🧔", gender: "boy" },
  { key: "glasses",  label: "Gözlük",   icon: "👓" },
  { key: "earrings", label: "Küpe",     icon: "💎", gender: "girl" },
  { key: "arms",     label: "Kollar",   icon: "💪" },
  { key: "legs",     label: "Bacaklar", icon: "🦵" }
];

let state = {
  step: "category", // category | plant | workshop
  category: null,
  plant: null,
  activeTab: "eyes",
  placed: [],
  selectedUid: null
};
let uidCounter = 1;
let zCounter = 1;

const root = document.getElementById("plant-root");

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function randomOf(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function getAccessoryList(cat) {
  const list = ACCESSORIES[cat] || [];
  const filtered = list.filter(a => !a.gender || a.gender === "any" || a.gender === profile);
  filtered.sort((a, b) => {
    const rank = it => (!it.gender || it.gender === "any") ? 1 : 0;
    return rank(a) - rank(b);
  });
  return filtered;
}

function findAccessory(cat, id) {
  return (ACCESSORIES[cat] || []).find(a => a.id === id);
}

function render() {
  if (state.step === "category") renderCategoryStep();
  else if (state.step === "plant") renderPlantStep();
  else renderWorkshop();
}

function renderCategoryStep() {
  root.innerHTML = `
    <p class="hint">Sebze mi, meyve mi seçelim? 🌱</p>
    <div class="profile-grid plant-category-grid">
      <button class="profile-card" data-cat="sebze"><span class="profile-emoji">🥕</span><span class="profile-name">Sebze</span></button>
      <button class="profile-card" data-cat="meyve"><span class="profile-emoji">🍎</span><span class="profile-name">Meyve</span></button>
    </div>`;
  root.querySelectorAll("[data-cat]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.category = btn.dataset.cat;
      state.step = "plant";
      render();
    });
  });
}

function renderPlantStep() {
  const list = PLANTS[state.category];
  root.innerHTML = `
    <p class="hint">Hangi bitkiyi canlandıralım? ${state.category === "sebze" ? "🥕" : "🍎"}</p>
    <div class="plant-pick-grid" id="plant-pick-grid"></div>
    <div class="plant-controls"><button class="btn secondary" id="cat-back">⬅️ Geri</button></div>`;
  const grid = document.getElementById("plant-pick-grid");
  list.forEach(p => {
    const card = document.createElement("button");
    card.className = "game-card plant-pick-card";
    card.innerHTML = `<div class="game-icon"><span style="display:inline-block; transform: rotate(${getPlantRotation(p)}deg);">${p.emoji}</span></div><div class="game-title">${p.name}</div>`;
    card.addEventListener("click", () => {
      state.plant = p;
      resetWorkshopDefaults();
      state.step = "workshop";
      render();
    });
    grid.appendChild(card);
  });
  document.getElementById("cat-back").addEventListener("click", () => {
    state.step = "category";
    render();
  });
}

function resetWorkshopDefaults() {
  uidCounter = 1;
  zCounter = 1;
  state.placed = [];
  state.activeTab = "eyes";
  state.selectedUid = null;
}

function renderWorkshop() {
  root.innerHTML = `
    <p class="hint">Aksesuarları sürükle, bitkinin üstüne bırak! 🖱️</p>
    <p class="hint plant-subhint">Kaldırmak için üstüne dokun ve ❌'ya bas, ya da dışarı sürükle.</p>
    <div class="workshop">
      <div class="plant-stage" id="plant-stage">
        <div class="plant-body"><span class="plant-body-emoji" id="plant-body-emoji" style="transform: rotate(${getPlantRotation(state.plant)}deg);">${state.plant.emoji}</span></div>
      </div>
      <div class="plant-rotate-row">
        <button class="btn secondary rotate-btn" id="rot-left">⟲ Sola Döndür</button>
        <span class="plant-rotate-hint">Bitki dik durmuyorsa döndür 👇</span>
        <button class="btn secondary rotate-btn" id="rot-right">⟳ Sağa Döndür</button>
      </div>
      <div class="plant-tabs" id="plant-tabs"></div>
      <div class="palette-row" id="palette-row"></div>
      <div class="plant-controls">
        <button class="btn secondary" id="wk-back">🔄 Bitki Değiştir</button>
        <button class="btn secondary" id="wk-clear">🧹 Temizle</button>
        <button class="btn" id="wk-surprise">🎲 Sürpriz</button>
      </div>
    </div>`;

  renderTabs();
  renderPalette();
  renderStageItems();

  const stage = document.getElementById("plant-stage");
  stage.addEventListener("pointerdown", e => {
    if (e.target === stage || e.target.classList.contains("plant-body")) {
      if (state.selectedUid !== null) {
        state.selectedUid = null;
        renderStageItems();
      }
    }
  });

  document.getElementById("wk-back").addEventListener("click", () => {
    state.step = "plant";
    render();
  });
  document.getElementById("wk-clear").addEventListener("click", () => {
    state.placed = [];
    state.selectedUid = null;
    renderStageItems();
  });
  document.getElementById("wk-surprise").addEventListener("click", surprise);

  document.getElementById("rot-left").addEventListener("click", () => rotatePlant(-15));
  document.getElementById("rot-right").addEventListener("click", () => rotatePlant(15));
}

function rotatePlant(delta) {
  const next = getPlantRotation(state.plant) + delta;
  savePlantRotation(state.plant.id, next);
  const el = document.getElementById("plant-body-emoji");
  if (el) el.style.transform = `rotate(${next}deg)`;
}

function getVisibleTabs() {
  return TABS.filter(t => !t.gender || t.gender === profile);
}

function resolveTabIcon(t) {
  return typeof t.icon === "string" ? t.icon : (t.icon[profile] || t.icon.girl);
}

function renderTabs() {
  const wrap = document.getElementById("plant-tabs");
  wrap.innerHTML = "";
  getVisibleTabs().forEach(t => {
    const b = document.createElement("button");
    b.className = "tab-btn" + (state.activeTab === t.key ? " active" : "");
    b.innerHTML = `${resolveTabIcon(t)}<span>${t.label}</span>`;
    b.addEventListener("click", () => {
      state.activeTab = t.key;
      renderTabs();
      renderPalette();
    });
    wrap.appendChild(b);
  });
}

function renderPalette() {
  const wrap = document.getElementById("palette-row");
  wrap.innerHTML = "";
  getAccessoryList(state.activeTab).forEach(item => {
    const el = document.createElement("div");
    el.className = "palette-item";
    el.innerHTML = `<div class="palette-thumb">${item.svg}</div><span>${item.name}</span>`;
    attachPaletteDrag(el, state.activeTab, item);
    wrap.appendChild(el);
  });
}

function moveGhost(ghost, x, y) {
  ghost.style.left = x + "px";
  ghost.style.top = y + "px";
}

function attachPaletteDrag(el, cat, item) {
  el.addEventListener("pointerdown", e => {
    e.preventDefault();
    const ghost = document.createElement("div");
    ghost.className = "drag-ghost";
    ghost.innerHTML = item.svg;
    document.body.appendChild(ghost);
    moveGhost(ghost, e.clientX, e.clientY);

    function onMove(ev) { moveGhost(ghost, ev.clientX, ev.clientY); }
    function onUp(ev) {
      window.removeEventListener("pointermove", onMove);
      ghost.remove();
      const stage = document.getElementById("plant-stage");
      const rect = stage.getBoundingClientRect();
      const inside = ev.clientX >= rect.left && ev.clientX <= rect.right &&
                     ev.clientY >= rect.top && ev.clientY <= rect.bottom;
      if (inside) {
        const x = clamp(((ev.clientX - rect.left) / rect.width) * 100, 6, 94);
        const y = clamp(((ev.clientY - rect.top) / rect.height) * 100, 6, 94);
        state.placed.push({ uid: uidCounter++, cat, itemId: item.id, x, y, z: zCounter++ });
        state.selectedUid = null;
        renderStageItems();
        beep(700, 0.08);
      }
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
  });
}

function attachPlacedDrag(el, p) {
  el.addEventListener("pointerdown", e => {
    e.preventDefault();
    e.stopPropagation();
    const stage = document.getElementById("plant-stage");
    const rect = stage.getBoundingClientRect();
    const startX = e.clientX, startY = e.clientY;
    let moved = false;
    p.z = zCounter++;
    el.style.zIndex = p.z;

    function onMove(ev) {
      const dx = ev.clientX - startX, dy = ev.clientY - startY;
      if (!moved && Math.hypot(dx, dy) > 5) moved = true;
      if (moved) {
        p.x = clamp(((ev.clientX - rect.left) / rect.width) * 100, 6, 94);
        p.y = clamp(((ev.clientY - rect.top) / rect.height) * 100, 6, 94);
        el.style.left = p.x + "%";
        el.style.top = p.y + "%";
      }
    }
    function onUp(ev) {
      window.removeEventListener("pointermove", onMove);
      const outside = ev.clientX < rect.left - 40 || ev.clientX > rect.right + 40 ||
                       ev.clientY < rect.top - 40 || ev.clientY > rect.bottom + 40;
      if (moved && outside) {
        state.placed = state.placed.filter(x => x.uid !== p.uid);
        state.selectedUid = null;
        renderStageItems();
      } else if (!moved) {
        state.selectedUid = state.selectedUid === p.uid ? null : p.uid;
        renderStageItems();
      } else {
        renderStageItems();
      }
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
  });
}

function renderStageItems() {
  const stage = document.getElementById("plant-stage");
  stage.querySelectorAll(".placed-item, .remove-badge").forEach(n => n.remove());
  state.placed.slice().sort((a, b) => a.z - b.z).forEach(p => {
    const def = findAccessory(p.cat, p.itemId);
    if (!def) return;
    const el = document.createElement("div");
    el.className = "placed-item" + (state.selectedUid === p.uid ? " selected" : "");
    el.style.left = p.x + "%";
    el.style.top = p.y + "%";
    el.style.width = (def.w || 90) + "px";
    el.style.zIndex = p.z;
    el.innerHTML = def.svg;
    attachPlacedDrag(el, p);
    stage.appendChild(el);

    if (state.selectedUid === p.uid) {
      const badge = document.createElement("button");
      badge.className = "remove-badge";
      badge.textContent = "❌";
      badge.style.left = p.x + "%";
      badge.style.top = p.y + "%";
      badge.addEventListener("pointerdown", e => e.stopPropagation());
      badge.addEventListener("click", e => {
        e.stopPropagation();
        state.placed = state.placed.filter(x => x.uid !== p.uid);
        state.selectedUid = null;
        renderStageItems();
      });
      stage.appendChild(badge);
    }
  });
}

function surprise() {
  const picks = [
    { cat: "eyes",  x: 50, y: 36 },
    { cat: "nose",  x: 50, y: 48 },
    { cat: "mouth", x: 50, y: 58 },
    { cat: "ears",  x: 50, y: 32 },
    { cat: "hair",  x: 50, y: 14 },
    { cat: "arms",  x: 50, y: 68 },
    { cat: "legs",  x: 50, y: 92 }
  ];
  if (Math.random() < 0.6) picks.push({ cat: "glasses", x: 50, y: 34 });
  if (Math.random() < 0.35) picks.push({ cat: "beard", x: 50, y: 62 });
  if (Math.random() < 0.5) picks.push({ cat: "earrings", x: 34, y: 46 });
  if (Math.random() < 0.5) picks.push({ cat: "teeth", x: 50, y: 60 });

  state.placed = picks.map(p => {
    const item = randomOf(getAccessoryList(p.cat));
    return item ? { uid: uidCounter++, cat: p.cat, itemId: item.id, x: p.x, y: p.y, z: zCounter++ } : null;
  }).filter(Boolean);
  state.selectedUid = null;
  renderStageItems();
  goodSound();
  sparkleBurst(6);
}

render();
