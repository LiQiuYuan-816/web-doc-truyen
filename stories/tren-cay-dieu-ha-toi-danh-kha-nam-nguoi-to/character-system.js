let characters = [];

/* ==============================
   LOAD DATA
============================== */

fetch("../../../thu-vien-ten/name-data.json")
.then(res => res.json())
.then(data => {
 characters = data;
 highlightNames();
});

/* ==============================
   UTIL
============================== */

function escapeRegExp(string){
 return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ==============================
   GET ALL NAMES
============================== */

function getAllNames(){

 const list = [];

 characters.forEach(c => {

  [c.zh, c.vi, c.pinyin].forEach(field => {

   if(!field) return;

   field.split(",").forEach(n => {

    const name = n.trim();

    if(name){
     list.push({
      name,
      info:`${c.vi}
Zh: ${c.zh}
Pinyin: ${c.pinyin}`
     });
    }

   });

  });

 });

 return list;

}

/* ==============================
   HIGHLIGHT NAMES
============================== */

function highlightNames(){

 const container = document.querySelector(".chapter-content");
 if(!container) return;

 const names = getAllNames();

 const walker = document.createTreeWalker(
  container,
  NodeFilter.SHOW_TEXT,
  null,
  false
 );

 let node;

 while(node = walker.nextNode()){

  const text = node.nodeValue;

  names.forEach(n => {

   const regex = new RegExp(escapeRegExp(n.name),"gi");

   if(regex.test(text)){

    const spanHTML = text.replace(
     regex,
     `<span class="highlight-name" data-info="${n.info}">$&</span>`
    );

    const temp = document.createElement("span");
    temp.innerHTML = spanHTML;

    node.replaceWith(temp);
   }

  });

 }

}

/* ==============================
   UI INIT
============================== */

document.addEventListener("DOMContentLoaded", function(){

 /* SEARCH BOX TOGGLE */

 const btn = document.getElementById("searchBtn");
 const box = document.getElementById("searchBox");

 if(btn && box){

  btn.addEventListener("click", function(){

   const isHidden =
    getComputedStyle(box).display === "none";

   box.style.display = isHidden ? "block" : "none";

  });

 }

 /* CHARACTER SEARCH */

 const input = document.getElementById("characterSearchInput");
 const results = document.getElementById("characterResults");

 if(!input || !results) return;

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

});
