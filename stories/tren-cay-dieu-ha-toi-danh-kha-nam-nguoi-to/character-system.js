let characters = [];

/* ==============================
   LOAD DATA NHÂN VẬT
============================== */

fetch("../../../thu-vien-ten/name-data.json")
.then(res => res.json())
.then(data => {
 characters = data;
 highlightNames();
});

/* ==============================
   ESCAPE REGEX
============================== */

function escapeRegExp(string){
 return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ==============================
   HIGHLIGHT TÊN TRONG CHƯƠNG
============================== */

function highlightNames(){

 const container = document.querySelector(".chapter-content");
 if(!container) return;

 let html = container.innerHTML;

 characters.forEach(c => {

  const names = [c.zh, c.vi, c.pinyin];

  names.forEach(name => {

   if(!name) return;

   const safeName = escapeRegExp(name);

   const info =
`${c.vi}
Zh: ${c.zh}
Pinyin: ${c.pinyin}`;

   const regex = new RegExp(`\\b${safeName}\\b`, "gi");

   html = html.replace(
    regex,
    `<span class="highlight-name" data-info="${info}">$&</span>`
   );

  });

 });

 container.innerHTML = html;
}

/* ==============================
   MỞ / ĐÓNG SEARCH BOX
============================== */

const btn = document.getElementById("searchBtn");
const box = document.getElementById("searchBox");

if(btn && box){

 btn.onclick = () => {

  if(box.style.display === "block"){
   box.style.display = "none";
  }else{
   box.style.display = "block";
  }

 };

}

/* ==============================
   TÌM NHÂN VẬT
============================== */

const input = document.getElementById("characterSearchInput");
const results = document.getElementById("characterResults");

if(input && results){

 input.addEventListener("input", function(){

  const key = this.value.toLowerCase().trim();

  if(!key){
   results.innerHTML = "";
   return;
  }

  const found = characters.filter(c =>

   (c.zh && c.zh.toLowerCase().includes(key)) ||
   (c.vi && c.vi.toLowerCase().includes(key)) ||
   (c.pinyin && c.pinyin.toLowerCase().includes(key))

  );

  results.innerHTML = found.map(c => `
   <div class="character-item">
    <b>${c.vi}</b><br>
    Zh: ${c.zh}<br>
    Pinyin: ${c.pinyin}
   </div>
  `).join("");

 });

}
