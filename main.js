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
  "doi-thuong": "Đời thường",
  "ky-si": "Kỵ sĩ",
  "ma-phap": "Ma pháp",
  "co-dai": "Cổ đại",
  "lang-man": "Lãng mạn",
  "cc-sakura": "Card Captain Sakura",
  "dien-sinh": "Diễn sinh",
  "hien-dai": "Hiện đại",
  "conan": "Thám Tử Conan",
  "hoa-hoat": "Hoa hoạt",
  "dien-kinh": "Điền kinh",
  "tuong-lai": "Tương lai",
  "my-thuc": "Mỹ thực",
  "truyen-tranh": "Truyện tranh"
};
/* =======================
CONFIG
======================= */
const PAGE_SIZE = 5;
/* =======================
STATE
======================= */
let stories = [];
let currentList = [];  // Danh sách sau lọc
let currentPage = 1;
let totalPages = 1;    // Tổng trang dựa trên danh sách sau lọc
const BASE_PATH = "/web-doc-truyen";

/* =======================
LOAD DATA
======================= */
fetch("stories.json")
  .then(res => {
    if (!res.ok) throw new Error("Không tải được stories.json");
    return res.json();
  })
  .then(data => {
    if (!Array.isArray(data)) {
      console.error("stories.json phải là mảng");
      return;
    }
    stories = data.map(normalizeStory);
    console.log(`✅ Đã tải ${stories.length} truyện`); // Kiểm tra số lượng
    applyFilters();
  })
  .catch(err => {
    console.error("Không tải được stories.json", err);
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
    genre: Array.isArray(raw.genre) ? raw.genre : [],
    status: raw.status || "dang-ra",
    chapters: Number(raw.chapters) || 0,
    summary: raw.summary || "Chưa có giới thiệu."
  };
}

/* =======================
RENDER STORY LIST
======================= */
function renderStories(list) {
  const ul = document.getElementById("story-list");
  if (!ul) return;
  ul.innerHTML = "";
  
  if (list.length === 0) {
    ul.innerHTML = "<li>Không có truyện phù hợp.</li>";
    return;
  }
  
  list.forEach(story => {
    const li = document.createElement("li");
    const statusText = story.status === "hoan-thanh" ? "✅ Hoàn thành" : "🟢 Đang ra";
    const countryText = countryMap[story.country] || story.country;
    const maxGenres = 6;
    const genreText = story.genre
      .slice(0, maxGenres)
      .map(g => `<span class="genre-tag">${genreMap[g] || g}</span>`)
      .join("") + (story.genre.length > maxGenres ? `<span class="genre-more">…</span>` : "");
    
    li.innerHTML = `
      <a href="${BASE_PATH}/stories/${story.slug}/index.html">
        <strong>${story.title}</strong>
      </a>
      <br>
      <small>✍️ ${story.author} · 🌍 ${countryText}</small><br>
      <small>📚 ${genreText}</small><br>
      <small>${statusText} · 📖 ${story.chapters} chương</small>
      <p>${story.summary.replace(/\n/g, "<br>")}</p>
    `;
    ul.appendChild(li);
  });
}

/* =======================
PAGINATION - ĐÃ SỬA
======================= */
function renderPage(list, page = 1) {
  currentList = list;
  
  // Tính tổng trang TRƯỚC khi giới hạn currentPage
  totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  
  // Giữ trang trong khoảng hợp lệ
  currentPage = Math.max(1, Math.min(page, totalPages));
  
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageData = list.slice(start, end);
  
  renderStories(pageData);
  renderPagination();
}

function renderPagination() {
  const container = document.getElementById("pagination");
  if (!container) return;
  
  container.innerHTML = "";
  
  if (totalPages <= 1) return;

  // Nút Trước
  if (currentPage > 1) {
    container.innerHTML += `<button onclick="gotoPage(${currentPage - 1})">‹</button>`;
  }

  // Ô nhập nhảy trang - Hiển thị ĐÚNG tổng số trang
  container.innerHTML += `
    <span>Trang</span>
    <input type="number" id="jump-page-input" min="1" max="${totalPages}" 
           value="${currentPage}" style="width: 50px; text-align: center; padding: 2px 4px;">
    <span>/ ${totalPages}</span>
    <button onclick="jumpToPage()">Đi</button>
  `;

  // Nút Sau
  if (currentPage < totalPages) {
    container.innerHTML += `<button onclick="gotoPage(${currentPage + 1})">›</button>`;
  }
}

function gotoPage(page) {
  renderPage(currentList, page);
}

function jumpToPage() {
  const input = document.getElementById("jump-page-input");
  if (!input) return;
  
  let targetPage = parseInt(input.value, 10);
  if (isNaN(targetPage)) targetPage = 1;
  
  // Giới hạn chặt chẽ
  targetPage = Math.max(1, Math.min(targetPage, totalPages));
  
  gotoPage(targetPage);
}

// Nhấn Enter để nhảy trang
document.addEventListener("keydown", function(e) {
  if (e.key === "Enter" && document.activeElement?.id === "jump-page-input") {
    e.preventDefault();
    jumpToPage();
  }
});

/* =======================
FILTER LOGIC
======================= */
function applyFilters() {
  const titleKeyword = document.getElementById("search-title")?.value.toLowerCase() || "";
  const authorKeyword = document.getElementById("search-author")?.value.toLowerCase() || "";
  const country = document.getElementById("filter-country")?.value || "all";
  const genre = document.getElementById("filter-genre")?.value || "all";
  
  const filtered = stories.filter(story => {
    const matchTitle = story.title.toLowerCase().includes(titleKeyword);
    const matchAuthor = story.author.toLowerCase().includes(authorKeyword);
    const matchCountry = country === "all" || story.country === country;
    const matchGenre = genre === "all" || story.genre.includes(genre);
    return matchTitle && matchAuthor && matchCountry && matchGenre;
  });
  
  console.log(`🔍 Sau lọc: ${filtered.length} truyện → Tổng ${Math.ceil(filtered.length / PAGE_SIZE)} trang`);
  
  // Luôn bắt đầu từ trang 1 sau khi lọc
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
document.getElementById("search-title")?.addEventListener("input", debouncedFilter);
document.getElementById("search-author")?.addEventListener("input", debouncedFilter);
document.getElementById("filter-country")?.addEventListener("change", applyFilters);
document.getElementById("filter-genre")?.addEventListener("change", applyFilters);
