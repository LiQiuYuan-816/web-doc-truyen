let characters = [];

/* load dữ liệu nhân vật */

fetch("../../../thu-vien-ten/name-data.json")
.then(res => res.json())
.then(data => {
 characters = data;
 highlightNames();
});

/* highlight tên trong chương */

function highlightNames(){

 let container = document.querySelector(".chapter-content");
 if(!container) return;

 let html = container.innerHTML;

 characters.forEach(c => {

  let names = [c.zh, c.vi, c.pinyin];

  names.forEach(name => {

   if(!name) return;

   let info =
`${c.vi}
Zh: ${c.zh}
Pinyin: ${c.pinyin}`;

   let regex = new RegExp(name, "gi");

   html = html.replace(
    regex,
    `<span class="highlight-name" data-info="${info}">${name}</span>`
   );

  });

 });

 container.innerHTML = html;
}

/* mở / đóng tìm kiếm */

const btn = document.getElementById("searchBtn");
const box = document.getElementById("searchBox");

if(btn){
 btn.onclick = () => {
  box.style.display =
  box.style.display === "none" ? "block" : "none";
 };
}

/* tìm nhân vật */

const input = document.getElementById("searchInput");
const results = document.getElementById("results");

if(input){

 input.addEventListener("input", function(){

  const key = this.value.toLowerCase();

  const found = characters.filter(c =>

   c.zh.toLowerCase().includes(key) ||
   c.vi.toLowerCase().includes(key) ||
   c.pinyin.toLowerCase().includes(key)

  );

  results.innerHTML = found.map(c => `
   <div>
    <b>${c.vi}</b><br>
    Zh: ${c.zh}<br>
    Pinyin: ${c.pinyin}
   </div>
  `).join("");

 });

}
