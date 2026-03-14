let characters = [];

fetch("../../../thu-vien-ten/name-data.json")
.then(res => res.json())
.then(data => {
 characters = data;
 highlightNames();
});

function escapeRegExp(string){
 return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getAllNames(){
 const list = [];

 characters.forEach(c => {

  [c.zh, c.vi, c.pinyin].forEach(field => {

   if(!field) return;

   field.split(",").forEach(n=>{
    const name = n.trim();
    if(name) list.push({
      name,
      info:`${c.vi}
Zh: ${c.zh}
Pinyin: ${c.pinyin}`
    });
   });

  });

 });

 return list;
}

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

  let text = node.nodeValue;

  names.forEach(n=>{

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
