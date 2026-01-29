/* =======================
   MAP HIỂN THỊ
======================= */

const countryMap = {
  "trung-quoc": "🌎 Trung Quốc",
  "nhat-ban": "🌎 Nhật Bản",
  "han-quoc": "🌎 Hàn Quốc",
  "viet-nam": "🌎 Việt Nam",
  "au-my": "🌎 Âu Mỹ"
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
  "doi-thuong": "Đời thường"
};

/* =======================
   LOAD DATA
======================= */

let stories = [];

fetch("stories.json")
  .then(res => res.json())
  .then(data => {
    stories = data;
    renderStories(stories);
  })
  .catch(err => {
    console.error("Không tải được stories.json", err);
  });

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

    const statusText =
      story.status === "hoan-thanh"
        ? "✅ Hoàn thành"
        : "🟢 Đang ra";

    li.innerHTML = `
      <a href="${story.slug}/index.html">
        <strong>${story.title}</strong>
      </a>
      <br>

      <small>
        ✍️ ${story.author}
        · 🌍 ${story.country}
        · 📚 ${story.genre.join(", ")}
      </small>
      <br>

      <small>
        ${statusText} · 📖 ${story.chapters} chương
      </small>

      <p>${story.summary}</p>
    `;

    ul.appendChild(li);
  });
}

/* =======================
   FILTER LOGIC
======================= */

function applyFilters() {
  const titleKeyword =
    document.getElementById("search-title")?.value.toLowerCase() || "";

  const authorKeyword =
    document.getElementById("search-author")?.value.toLowerCase() || "";

  const country =
    document.getElementById("filter-country")?.value || "all";

  const genre =
    document.getElementById("filter-genre")?.value || "all";

  const filtered = stories.filter(story => {
    const matchTitle =
      story.title.toLowerCase().includes(titleKeyword);

    const matchAuthor =
      story.author.toLowerCase().includes(authorKeyword);

    const matchCountry =
      country === "all" || story.country === country;

    const matchGenre =
      genre === "all" || story.genre.includes(genre);

    return (
      matchTitle &&
      matchAuthor &&
      matchCountry &&
      matchGenre
    );
  });

  renderStories(filtered);
}

/* =======================
   EVENT LISTENERS
======================= */

document.getElementById("search-title")
  ?.addEventListener("input", applyFilters);

document.getElementById("search-author")
  ?.addEventListener("input", applyFilters);

document.getElementById("filter-country")
  ?.addEventListener("change", applyFilters);

document.getElementById("filter-genre")
  ?.addEventListener("change", applyFilters);
