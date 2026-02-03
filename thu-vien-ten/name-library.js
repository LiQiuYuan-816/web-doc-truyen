const LABELS = {
  pinyin: "Pinyin",
  vi: "Tên Việt",
  alias: "Tham khảo thêm",
  note: "Ghi chú"
};

const ICONS = {
  pinyin: "📣",
  vi: "🇻🇳",
  alias: "🔎",
  note: "📝"
};

let names = [];

fetch("name-data.json")
  .then(res => res.json())
  .then(data => {
    names = data;
    render(names);
  });

function render(list) {
  const box = document.getElementById("name-list");
  box.innerHTML = "";

  list.forEach(n => {
    box.innerHTML += `
      <div class="card">
        <div class="zh">${n.zh}</div>
        ${renderFields(n)}
      </div>
    `;
  });
}

function renderFields(n) {
  return Object.keys(LABELS)
    .map(k => `
      <div class="field">
        ${ICONS[k]} <strong>${LABELS[k]}:</strong> ${n[k] ?? "…"}
      </div>
    `)
    .join("");
}

document.getElementById("search-name").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();

  const filtered = names.filter(n =>
    Object.values(n)
      .join(" ")
      .toLowerCase()
      .includes(q)
  );

  render(filtered);
});
