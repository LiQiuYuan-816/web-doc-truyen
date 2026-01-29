let stories = [];

fetch("stories.json")
  .then(res => res.json())
  .then(data => {
    stories = data;
    renderStories(stories);
  });

function renderStories(list) {
  const ul = document.getElementById("story-list");
  if (!ul) return;

  ul.innerHTML = "";

  list.forEach(story => {
    const li = document.createElement("li");

    li.innerHTML = `
      <a href="${story.slug}/index.html">
        <strong>${story.title}</strong>
      </a>
      <br>
      <small>
        ${story.author} · ${story.country} · ${story.genre.join(", ")}
      </small>
      <p>${story.summary}</p>
    `;

    ul.appendChild(li);
  });
}

function applyFilters() {
  const titleKeyword =
    document.getElementById("search-title").value.toLowerCase();

  const authorKeyword =
    document.getElementById("search-author").value.toLowerCase();

  const country =
    document.getElementById("filter-country").value;

  const genre =
    document.getElementById("filter-genre").value;

  const filtered = stories.filter(story => {
    const matchTitle =
      story.title.toLowerCase().includes(titleKeyword);

    const matchAuthor =
      story.author.toLowerCase().includes(authorKeyword);

    const matchCountry =
      country === "all" || story.country === country;

    const matchGenre =
      genre === "all" || story.genre.includes(genre);

    return matchTitle && matchAuthor && matchCountry && matchGenre;
  });

  renderStories(filtered);
}

// Gắn sự kiện
document.getElementById("search-title")
  .addEventListener("input", applyFilters);

document.getElementById("search-author")
  .addEventListener("input", applyFilters);

document.getElementById("filter-country")
  .addEventListener("change", applyFilters);

document.getElementById("filter-genre")
  .addEventListener("change", applyFilters);
