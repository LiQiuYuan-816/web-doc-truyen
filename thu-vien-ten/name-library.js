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
      <div class="name-item">
        <div class="hanzi">${n.zh}</div>
        ${renderFields(n)}
      </div>
    `;
  });

  document.querySelectorAll(".vi-name[data-wiki]").forEach((el, i) => {
    el.onclick = () => openWiki(list[i].wiki);
  });
}

function renderFields(n) {
  return Object.keys(LABELS)
    .filter(k => n[k])
    .map(k => {
      if (k === "vi" && n.wiki) {
        return `
          <div class="field">
            ${ICONS[k]}
            <strong>${LABELS[k]}:</strong>
            <span class="vi-name" data-wiki>${n[k]}</span>
          </div>
        `;
      }

      return `
        <div class="field">
          ${ICONS[k]} <strong>${LABELS[k]}:</strong> ${n[k]}
        </div>
      `;
    })
    .join("");
}

document.getElementById("search-name").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  const filtered = names.filter(n =>
    Object.values(n).join(" ").toLowerCase().includes(q)
  );
  render(filtered);
});

function openWiki(wikiData) {
  document.getElementById("name-list").style.display = "none";
  const wiki = document.getElementById("wiki-section");
  wiki.hidden = false;

  document.getElementById("wiki-title").textContent = wikiData.title;
  document.getElementById("wiki-meta").innerHTML = wikiData.meta || "";
  document.getElementById("wiki-content").innerHTML = wikiData.content;
}

document.getElementById("close-wiki").onclick = e => {
  e.preventDefault();
  document.getElementById("wiki-section").hidden = true;
  document.getElementById("name-list").style.display = "";
};
