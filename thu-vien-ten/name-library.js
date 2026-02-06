/* ===============================
   HEADER SHRINK
================================ */
const header = document.getElementById("main-header");

window.addEventListener("scroll", () => {
  header.classList.toggle("shrink", window.scrollY > 80);
});

/* ===============================
   ELEMENTS
================================ */
const nameListEl = document.getElementById("name-list");
const wikiSection = document.getElementById("wiki-section");
const closeWikiBtn = document.getElementById("close-wiki");

const inputName = document.getElementById("search-name");
const inputStory = document.getElementById("search-story");
const selectCountry = document.getElementById("search-country");

let allNames = [];

/* ===============================
   LOAD JSON
================================ */
fetch("name-data.json")
  .then(res => res.json())
  .then(data => {
    allNames = data;
    renderNameList(allNames);
  })
  .catch(() => {
    nameListEl.innerHTML = "<p>Không thể tải dữ liệu.</p>";
  });

/* ===============================
   LIVE SEARCH
================================ */
[inputName, inputStory].forEach(el =>
  el.addEventListener("input", filterList)
);

selectCountry.addEventListener("change", filterList);

function filterList() {
  const keyword = inputName.value.toLowerCase().trim();
  const story = inputStory.value.toLowerCase().trim();
  const country = selectCountry.value;

  const filtered = allNames.filter(item => {
    const matchName =
      !keyword ||
      item.vi.toLowerCase().includes(keyword) ||
      item.zh.toLowerCase().includes(keyword) ||
      item.pinyin.toLowerCase().includes(keyword);

    const matchStory =
      !story || item.story.toLowerCase().includes(story);

    const matchCountry =
      !country || item.country === country;

    return matchName && matchStory && matchCountry;
  });

  renderNameList(filtered);
}

/* ===============================
   RENDER LIST
================================ */
function renderNameList(list) {
  nameListEl.innerHTML = "";

  if (list.length === 0) {
    nameListEl.innerHTML = "<p>Không tìm thấy kết quả.</p>";
    return;
  }

  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "name-card";

    card.innerHTML = `
      <div class="name-main">${item.vi}</div>
      <div class="name-sub">${item.pinyin}</div>
      <div class="name-story">${item.story}</div>
    `;

    card.addEventListener("click", () => openWiki(item));
    nameListEl.appendChild(card);
  });
}

/* ===============================
   WIKI
================================ */
function openWiki(item) {
  nameListEl.style.display = "none";
  wikiSection.hidden = false;

  document.getElementById("wiki-title").textContent =
    item.wiki.title;

document.getElementById("wiki-meta").innerHTML = `
  <div class="wiki-block wiki-intro">
    <strong>${item.wiki.meta}</strong>
  </div>

  <div class="wiki-block wiki-info">
    <p>🎂 ${item.wiki.year}</p>
    <p>🎓 ${item.wiki.job}</p>
    <p>📚 ${item.wiki.work}</p>
  </div>
`;

  document.getElementById("wiki-content").innerHTML =
    item.wiki.content;
}

closeWikiBtn.addEventListener("click", e => {
  e.preventDefault();
  wikiSection.hidden = true;
  nameListEl.style.display = "grid";
});
