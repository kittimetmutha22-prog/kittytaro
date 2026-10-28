const $ = id => document.getElementById(id);
const type = new URLSearchParams(location.search).get("type") || "three";
const spread = getSpread(type);
const N = spread.pos.length;
let deck = [], picks = [];

$("title").textContent = spread.title;
$("desc").textContent = spread.desc;
document.title = spread.title + " | ไพ่ยิปซี";

// ช่องวางไพ่ (คว่ำไว้)
function renderSlots() {
  $("spread").innerHTML = "";
  spread.pos.forEach((p, i) => {
    const s = document.createElement("div");
    s.className = "slot";
    s.innerHTML = `<div class="pos">${i + 1}. ${p}</div>`;
    s.dataset.i = i;
    $("spread").appendChild(s);
  });
}

function startPick() {
  deck = shuffle(CARDS).map(c => ({ card: c, reversed: Math.random() < REVERSE_CHANCE }));
  picks = [];
  renderSlots();
  $("step-ask").hidden = true;
  $("step-result").hidden = true;
  $("step-pick").hidden = false;
  const fan = $("fan");
  fan.innerHTML = "";
  deck.forEach((d, i) => {
    const el = cardEl(null);
    el.onclick = () => pick(i, el);
    fan.appendChild(el);
  });
  $("step-pick").classList.add("shuffle");
  setTimeout(() => $("step-pick").classList.remove("shuffle"), 600);
  updateHint();
}

function updateHint() {
  $("pick-hint").textContent = `เลือกไพ่อีก ${N - picks.length} ใบ จากทั้งหมด ${N} ใบ`;
}

function pick(i, el) {
  if (picks.length >= N || el.classList.contains("picked")) return;
  el.classList.add("picked");
  const d = deck[i];
  const slot = $("spread").children[picks.length];
  const c = cardEl(d.card, { reversed: d.reversed });
  slot.prepend(c);
  picks.push(d);
  updateHint();
  if (picks.length === N) reveal();
}

function reveal() {
  $("step-pick").hidden = true;
  [...$("spread").querySelectorAll(".tcard")].forEach((el, i) =>
    setTimeout(() => el.classList.add("flipped"), 250 * i));
  setTimeout(showResult, 250 * N + 700);
}

function meaningText(d) {
  return d.reversed ? d.card.rev : d.card.up;
}

function summaryHTML() {
  const majors = picks.filter(d => d.card.suit === "major").length;
  const rev = picks.filter(d => d.reversed).length;
  const count = {};
  picks.forEach(d => { if (d.card.suit !== "major") count[d.card.suit] = (count[d.card.suit] || 0) + 1; });
  const top = Object.entries(count).sort((a, b) => b[1] - a[1])[0];
  const suitMsg = {
    wands: "พลังของไม้เท้า (ไฟ) เด่น เรื่องนี้เกี่ยวกับความมุ่งมั่น การลงมือทำ และแรงบันดาลใจ",
    cups: "พลังของถ้วย (น้ำ) เด่น เรื่องนี้เกี่ยวกับความรู้สึก ความรัก และความสัมพันธ์",
    swords: "พลังของดาบ (ลม) เด่น เรื่องนี้เกี่ยวกับความคิด การตัดสินใจ และการสื่อสาร",
    pentacles: "พลังของเหรียญ (ดิน) เด่น เรื่องนี้เกี่ยวกับการเงิน การงาน และความมั่นคง"
  };
  const lines = [];
  const q = $("question").value.trim();
  if (q) lines.push(`<b>คำถาม:</b> ${q.replace(/[<>&]/g, "")}`);
  if (N === 1) {
    lines.push(`ไพ่ของคุณคือ <b>${picks[0].card.th}</b> ${picks[0].reversed ? "(กลับหัว)" : ""} — ${picks[0].card.kw}`);
  } else {
    const ratio = majors / N;
    lines.push(ratio >= 0.4
      ? `มีไพ่ชุดใหญ่ถึง ${majors} ใบ แสดงว่าเป็นช่วงเวลาสำคัญที่โชคชะตามีบทบาทสูง`
      : `มีไพ่ชุดใหญ่ ${majors} ใบ เรื่องส่วนใหญ่อยู่ในมือคุณที่จะกำหนดได้`);
    if (top && top[1] >= 2) lines.push(suitMsg[top[0]]);
    lines.push(rev / N > 0.4
      ? `มีไพ่กลับหัว ${rev} ใบ อาจมีอุปสรรคหรือพลังงานติดขัด ควรทบทวนและค่อยเป็นค่อยไป`
      : `ไพ่กลับหัว ${rev} ใบ พลังงานโดยรวมไหลลื่นดี`);
    const last = picks[N - 1];
    if (type === "three" || type === "full") lines.push(`ผลลัพธ์ชี้ไปที่ <b>${last.card.th}</b>: ${meaningText(last)}`);
  }
  return `<h2>สรุปภาพรวม</h2><p>${lines.join("</p><p>")}</p>`;
}

function showResult() {
  $("summary").innerHTML = summaryHTML();
  const res = $("result");
  res.innerHTML = "";
  picks.forEach((d, i) => {
    const c = d.card;
    const isOverview = i === 0 && (type === "one" || type === "monthly" || type === "yearly");
    const item = document.createElement("div");
    item.className = "item panel";
    item.appendChild(cardEl(c, { static: true, reversed: d.reversed }));
    const info = document.createElement("div");
    info.innerHTML = `<small class="muted">${i + 1}. ${spread.pos[i]}</small>
      <h3><a href="card.html?id=${c.id}">${c.th}</a> <small class="muted">${c.en}</small></h3>
      <span class="tag ${d.reversed ? "rev" : ""}">${d.reversed ? "กลับหัว" : "หัวตั้ง"}</span><small class="muted">${c.kw}</small>
      <p>${meaningText(d)}</p>` +
      (isOverview ? `<p>❤️ ความรัก: ${c.love}<br>💼 การงาน: ${c.work}<br>💰 การเงิน: ${c.money}<br>🌿 สุขภาพ: ${c.health}</p>` : "");
    item.appendChild(info);
    res.appendChild(item);
  });
  $("step-result").hidden = false;
  $("step-result").scrollIntoView({ behavior: "smooth" });
}

$("btn-shuffle").onclick = startPick;
$("btn-again").onclick = () => { $("spread").innerHTML = ""; $("step-result").hidden = true; $("step-ask").hidden = false; scrollTo(0, 0); };
$("btn-copy").onclick = () => {
  const text = spread.title + "\n" + picks.map((d, i) =>
    `${i + 1}. ${spread.pos[i]}: ${d.card.th}${d.reversed ? " (กลับหัว)" : ""} — ${meaningText(d)}`).join("\n");
  navigator.clipboard.writeText(text).then(() => { $("btn-copy").textContent = "คัดลอกแล้ว ✓"; });
};
