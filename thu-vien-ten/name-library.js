/* ===============================
   HEADER SHRINK ON SCROLL
================================ */
const header = document.getElementById("main-header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 80) {
    header.classList.add("shrink");
  } else {
    header.classList.remove("shrink");
  }
});


/* ===============================
   LOAD & RENDER NAME LIST
================================ */
const nameListEl = document.getElementById("name-list");
const wikiSection = document.getElementById("wiki-section");
const closeWikiBtn = document.getElementById("close-wiki");

fetch("names.json")
  .then(res => {
    if (!res.ok) throw new Error("Không tải được file JSON");
    return res.json();
  })
  .then(data => {
    renderNameList(data);
  })
  .catch(err => {
    console.error(err);
    nameListEl.innerHTML = "<p>Không thể tải danh sách tên.</p>";
  });


function renderNameList(list) {
  nameListEl.innerHTML = "";

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
   OPEN / CLOSE WIKI
================================ */
function openWiki(item) {
  nameListEl.style.display = "none";
  wikiSection.hidden = false;

  document.getElementById("wiki-title").textContent =
    item.wiki.title;

  document.getElementById("wiki-meta").innerHTML = `
    <p><strong>${item.wiki.meta}</strong></p>
    <p>🎂 ${item.wiki.year}</p>
    <p>🎓 ${item.wiki.job}</p>
    <p>📚 ${item.wiki.work}</p>
  `;

  document.getElementById("wiki-content").innerHTML =
    item.wiki.content;
}

closeWikiBtn.addEventListener("click", e => {
  e.preventDefault();
  wikiSection.hidden = true;
  nameListEl.style.display = "grid";
});
