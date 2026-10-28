// ใช้ร่วมกันทั้ง cards.html (รายการ) และ card.html (รายละเอียด)
const lib = document.getElementById("lib");
const detail = document.getElementById("detail");

if (lib) {
  const q = document.getElementById("q"), suit = document.getElementById("suit");
  const render = () => {
    const term = q.value.trim().toLowerCase();
    const list = CARDS.filter(c => (!suit.value || c.suit === suit.value) &&
      (!term || (c.th + c.en + c.kw).toLowerCase().includes(term)));
    lib.innerHTML = "";
    list.forEach(c => {
      const a = document.createElement("a");
      a.href = `card.html?id=${c.id}`;
      a.appendChild(cardEl(c, { static: true }));
      a.insertAdjacentHTML("beforeend", `<div>${c.th}</div><small class="muted">${c.en}</small>`);
      lib.appendChild(a);
    });
    document.getElementById("count").textContent = `แสดง ${list.length} ใบ`;
  };
  q.oninput = suit.onchange = render;
  render();
}

if (detail) {
  const c = findCard(new URLSearchParams(location.search).get("id")) || CARDS[0];
  document.title = `${c.th} (${c.en}) | ความหมายไพ่ยิปซี`;
  const i = CARDS.indexOf(c);
  const prev = CARDS[(i + 77) % 78], next = CARDS[(i + 1) % 78];
  detail.innerHTML = `<div class="detail"><div class="cardbox"></div><div class="info meaning">
    <small class="muted">${SUITS[c.suit].th}${SUITS[c.suit].el ? " · ธาตุ" + SUITS[c.suit].el : ""}</small>
    <h1>${c.th}</h1><p class="muted">${c.en}</p>
    <p><b>คำสำคัญ:</b> ${c.kw}</p>
    <h3>ความหมายไพ่หัวตั้ง</h3><p>${c.up}</p>
    <h3>ความหมายไพ่กลับหัว</h3><p>${c.rev}</p>
    <h3>❤️ ความรัก</h3><p>${c.love}</p>
    <h3>💼 การงาน</h3><p>${c.work}</p>
    <h3>💰 การเงิน</h3><p>${c.money}</p>
    <h3>🌿 สุขภาพ</h3><p>${c.health}</p>
    <div class="row" style="justify-content:space-between">
      <a class="btn ghost" href="card.html?id=${prev.id}">← ${prev.th}</a>
      <a class="btn ghost" href="card.html?id=${next.id}">${next.th} →</a>
    </div></div></div>`;
  detail.querySelector(".cardbox").appendChild(cardEl(c, { static: true }));
}
