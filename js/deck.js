// เปลี่ยนนามสกุลรูปไพ่ได้ที่นี่ (เช่น ".png" หรือ ".webp")
const IMAGE_EXT = ".jpg";
const IMAGE_DIR = "images/cards/";
const REVERSE_CHANCE = 0.3;
const ROMAN = ["0","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX","XXI"];
const RANK_TH = { 1: "เอซ", 11: "เพจ", 12: "อัศวิน", 13: "ราชินี", 14: "ราชา" };

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function cardLabel(c) {
  return c.suit === "major" ? ROMAN[c.num] : (RANK_TH[c.num] || c.num);
}

function fallbackHTML(c) {
  return `<div class="fallback"><span class="num">${cardLabel(c)}</span><span class="sym">${SUITS[c.suit].sym}</span><span class="nm">${c.th}</span></div>`;
}

// ถ้าไม่พบรูป จะลบ <img> ทิ้งและแสดงไพ่สำรองแทน
function artHTML(c) {
  return `<div class="art">${fallbackHTML(c)}<img src="${IMAGE_DIR}${c.id}${IMAGE_EXT}" alt="${c.th}" loading="lazy" onerror="this.remove()"></div>`;
}

// สร้างไพ่ 1 ใบ: opts.flipped = เปิดหน้าแล้ว, opts.reversed = กลับหัว, opts.static = แสดงหน้าไพ่อย่างเดียว
function cardEl(c, opts = {}) {
  const el = document.createElement("div");
  el.className = "tcard" + (opts.flipped ? " flipped" : "") + (opts.reversed ? " reversed" : "") + (opts.static ? " static" : "");
  el.innerHTML = opts.static
    ? `<div class="inner"><div class="face front">${artHTML(c)}</div></div>`
    : `<div class="inner"><div class="face back"></div><div class="face front">${c ? artHTML(c) : ""}</div></div>`;
  return el;
}

function findCard(id) { return CARDS.find(c => c.id === id); }
