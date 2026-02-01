/* =======================
   MAP HIỂN THỊ
======================= */

const countryMap = {
  "trung-quoc": "Trung Quốc",
  "nhat-ban": "Nhật Bản",
  "han-quoc": "Hàn Quốc",
  "viet-nam": "Việt Nam",
  "au-my": "Âu Mỹ"
};

const genreMap = {
  "tu-tien": "Tu Tiên",
  "tay-huyen": "Tây huyễn",
  "xuyen-nhanh": "Xuyên nhanh",
  "xuyen-thu": "Xuyên thư",
  "lam-ruong": "Làm ruộng",
  "xay-dung": "Xây dựng",
  "quyen-muu": "Quyền mưu",
  "thuc-te-ao": "Thực tế ảo",
  "dien-canh": "Điện cạnh",
  "canh-ky": "Cạnh kỹ",
  "the-thao": "Thể thao",
  "khong-cp": "Không CP",
  "dam-my": "Đam mỹ",
  "chu-cong": "Chủ công",
  "chu-thu": "Chủ thụ",
  "tinh-te": "Tinh tế",
  "linh-gac-dan-duong": "Lính gác dẫn đường",
  "abo": "ABO",
  "co-giap": "Cơ giáp",
  "the-bai": "Thẻ bài",
  "doc-tam": "Đọc tâm",
  "doc-the": "Đọc thể",
  "xem-anh-the": "Xem ảnh thể",
  "ao-tuong": "Ảo tưởng",
  "cung-dinh-hau-tuoc": "Cung đình hầu tước",
  "duong-nhai-con": "Dưỡng nhãi con",
  "vuon-truong": "Vườn trường",
  "hoc-ba": "Học bá",
  "hai-huoc": "Hài hước",
  "am-ap": "Ấm áp",
  "ngon-tinh": "Ngôn tình",
  "nguyen-sang": "Nguyên sang",
  "dong-nhan": "Đồng nhân",
  "vo-han-luu": "Vô hạn lưu",
  "kiem-hiep": "Kiếm hiệp",
  "khoa-huyen": "Khoa huyễn",
  "gioi-giai-tri": "Giới giải trí",
  "tro-choi": "Trò chơi",
  "trinh-tham": "Trinh thám",
  "phat-song-truc-tiep": "Phát sóng trực tiếp",
  "xuyen-khong": "Xuyên không",
  "am-nhac": "Âm nhạc",
  "trong-sinh": "Trọng sinh",
  "doi-thuong": "Đời thường"
   
};

/* =======================
CONFIG
======================= */

const PAGE_SIZE = 20;

/* =======================
STATE
======================= */

let stories = [];
let currentList = [];
let currentPage = 1;


/* =======================
LOAD DATA
======================= */

fetch( "stories.json" )
.then(res => {
if (!res.ok) throw new Error( "Không tải được stories.json" );
return res.json();
})
.then(data => {
if (!Array.isArray(data)) {
console.error( "stories.json phải là mảng" );
return;
}
stories = data.map(normalizeStory);
applyFilters();
})
.catch(err => {
console.error( "Không tải được stories.json", err);
});

/* =======================
NORMALIZE DATA
======================= */

function normalizeStory(raw) {
return {
id: raw.id || crypto.randomUUID(),
title: raw.title || "Không có tiêu đề",
slug: raw.slug || "#",
author: raw.author || "Không rõ",
country: raw.country || "khong-ro",
genre: Array.isArray(raw.genre)? raw.genre: [],
status: raw.status || "dang-ra",
chapters: Number(raw.chapters) || 0,
summary: raw.summary || "Chưa có giới thiệu."
};
}

/* =======================
RENDER STORY LIST
======================= */

function renderStories(list) {
const ul = document.getElementById( "story-list" );
if (!ul) return;

ul.innerHTML = "";

if (list.length === 0) {
ul.innerHTML = "<li>Không có truyện phù hợp.</li>";
return;
}

list.forEach(story => {
const li = document.createElement( "li" );

const statusText =
story.status === "hoan-thanh"
?"✅ Hoàn thành"
:"🟢 Đang ra";

const countryText =
countryMap[story.country] || story.country;

const maxGenres = 6;

const genreText =
story.genre
.slice(0, maxGenres)
.map(g => `<span class= "genre-tag" >${genreMap[g] || g}</span>`)
.join( "" ) +
(story.genre.length > maxGenres
?`<span class= "genre-more" >…</span>`
:"");

li.innerHTML = `
<a href= "${story.slug}/index.html" >
<strong>${story.title}</strong>
</a>
<br>

<small>✍️ ${story.author} · 🌍 ${countryText}</small><br>
<small>📚 ${genreText}</small><br>
<small>${statusText} · 📖 ${story.chapters} chương</small>
<p>${story.summary}</p>
`;
fragment.appendChild(li);
  });
ul.appendChild(li);
});
}

/* =======================
PAGINATION
======================= */

function renderPage(list, page = 1) {
currentList = list;
currentPage = page;

const start = (page - 1) * PAGE_SIZE;
const end = start + PAGE_SIZE;

renderStories(list.slice(start, end));
renderPagination(list.length);
}

function renderPagination(totalItems) {
const container = document.getElementById( "pagination" );
if (!container) return;

const totalPages = Math.ceil(totalItems / PAGE_SIZE);
container.innerHTML = "";

if (totalPages <= 1) return;

if (currentPage > 1) {
container.innerHTML += `<button onclick= "gotoPage(${currentPage - 1})" >‹</button>`;
}

container.innerHTML += `<span>Trang ${currentPage} / ${totalPages}</span>`;

if (currentPage < totalPages) {
container.innerHTML += `<button onclick= "gotoPage(${currentPage + 1})" >›</button>`;
}
}

function gotoPage(page) {
renderPage(currentList, page);
}


/* =======================
FILTER LOGIC
======================= */

function applyFilters() {
const titleKeyword =
document.getElementById( "search-title" )?.value.toLowerCase() || "";

const authorKeyword =
document.getElementById( "search-author" )?.value.toLowerCase() || "";

const country =
document.getElementById( "filter-country" )?.value || "all";

const genre =
document.getElementById( "filter-genre" )?.value || "all";

const filtered = stories.filter(story => {
const matchTitle = story.title.toLowerCase().includes(titleKeyword);
const matchAuthor = story.author.toLowerCase().includes(authorKeyword);
const matchCountry = country === "all" || story.country === country;
const matchGenre = genre === "all" || story.genre.includes(genre);

return matchTitle && matchAuthor && matchCountry && matchGenre;
});

renderPage(filtered, 1);
}

/* =======================
DEBOUNCE
======================= */

function debounce(fn, delay = 300) {
let timer;
return (...args) => {
clearTimeout(timer);
timer = setTimeout(() => fn(...args), delay);
};
}

const debouncedFilter = debounce(applyFilters, 300);

/* =======================
EVENT LISTENERS
======================= */

document.getElementById( "search-title" )
?.addEventListener( "input", applyFilters);

document.getElementById( "search-author" )
?.addEventListener( "input", applyFilters);

document.getElementById( "filter-country" )
?.addEventListener( "change", applyFilters);

document.getElementById( "filter-genre" )
?.addEventListener( "change", applyFilters);
