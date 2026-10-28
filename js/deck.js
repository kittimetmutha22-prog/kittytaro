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

// ไอคอน SVG (เส้น 24x24) ใช้แทนอีโมจิและสัญลักษณ์พิเศษที่บางเครื่องแสดงไม่ได้
const ICON_PATHS = {
  major: '<path d="M12 2l2.9 6.9 7.1.4-5.5 4.8 1.7 6.9L12 17.3 5.8 21l1.7-6.9L2 9.3l7.1-.4z"/>',
  wands: '<path d="M6 21L17 3"/><path d="M15 6.5l3 .5M13 10l3 .5M9.5 14.5l-3-.5M11 11.5l-3-.5"/>',
  cups: '<path d="M6 3h12v4a6 6 0 0 1-12 0z"/><path d="M12 13v5M8 21h8"/>',
  swords: '<path d="M12 2l2 3v11h-4V5z"/><path d="M7 16h10M12 16v6"/>',
  pentacles: '<circle cx="12" cy="12" r="9"/><path d="M12 5l4.1 12.7L5.3 9.8h13.4L7.9 17.7z"/>',
  love: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
  work: '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  money: '<circle cx="8" cy="8" r="6"/><path d="M18.1 10.4A6 6 0 1 1 10.3 18"/><path d="M7 6h1v4"/>',
  health: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.4 5.1-6 2.4-.5 4.9-2 5.9-3"/>'
};
function svgIcon(name, cls = "ico") {
  return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON_PATHS[name]}</svg>`;
}
const ASPECTS = [["love", "ความรัก"], ["work", "การงาน"], ["money", "การเงิน"], ["health", "สุขภาพ"]];

function fallbackHTML(c) {
  return `<div class="fallback"><span class="num">${cardLabel(c)}</span>${svgIcon(c.suit, "sym")}<span class="nm">${c.th}</span></div>`;
}

// ถ้าไม่พบรูป จะลบ <img> ทิ้งและแสดงไพ่สำรองแทน
function artHTML(c) {
  return `<div class="art">${fallbackHTML(c)}<img src="${IMAGE_DIR}${c.id}${IMAGE_EXT}" alt="${c.th}" loading="lazy" onerror="this.remove()"></div>`;
}

// สร้างไพ่ 1 ใบ: opts.flipped = เปิดหน้าแล้ว, opts.reversed = กลับหัว, opts.static = แสดงหน้าไพ่อย่างเดียว
// opts.decorative = ซ่อนจากโปรแกรมอ่านหน้าจอ (เมื่อมีชื่อไพ่เป็นข้อความอยู่แล้ว)
function cardEl(c, opts = {}) {
  const el = document.createElement("div");
  if (opts.decorative) el.setAttribute("aria-hidden", "true");
  else if (c) { el.setAttribute("role", "img"); el.setAttribute("aria-label", c.th + (opts.reversed ? " (กลับหัว)" : "")); }
  el.className = "tcard" + (opts.flipped ? " flipped" : "") + (opts.reversed ? " reversed" : "") + (opts.static ? " static" : "");
  el.innerHTML = opts.static
    ? `<div class="inner"><div class="face front">${artHTML(c)}</div></div>`
    : `<div class="inner"><div class="face back"></div><div class="face front">${c ? artHTML(c) : ""}</div></div>`;
  return el;
}

function findCard(id) { return CARDS.find(c => c.id === id); }
