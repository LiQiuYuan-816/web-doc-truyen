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
        <div>📣 ${n.pinyin}</div>
        <div>🇻🇳 ${n.vi}</div>
        <div>🔎 ${n.alias}</div>
        <div>📝 ${n.note}</div>
      </div>
    `;
  });
}

document.getElementById("search-name").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();

  const filtered = names.filter(n =>
    n.zh.includes(q) ||
    n.vi.toLowerCase().includes(q) ||
    n.pinyin.toLowerCase().includes(q) ||
    n.alias.toLowerCase().includes(q)
  );

  render(filtered);
});
