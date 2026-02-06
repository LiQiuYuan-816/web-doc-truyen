import os

WIKI_ROOT = "wiki"

SECTIONS = {
    "Nhân vật": "characters",
    "Địa danh": "locations"
}

def filename_to_title(filename):
    return filename.replace(".html", "").replace("-", " ")

def build_list(folder):
    items = []
    path = os.path.join(WIKI_ROOT, folder)
    if not os.path.exists(path):
        return items

    for file in sorted(os.listdir(path)):
        if file.endswith(".html"):
            title = filename_to_title(file)
            link = f"{folder}/{file}"
            items.append((title, link))
    return items

html = """<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Wiki Thế Giới</title>
  <link rel="stylesheet" href="../assets/css/wiki.css">
</head>
<body>
<div class="wiki-container">

<h1>📚 Wiki Thế Giới</h1>
"""

for section, folder in SECTIONS.items():
    items = build_list(folder)
    if not items:
        continue

    html += f"<h2>{section}</h2>\n<ul>\n"
    for title, link in items:
        html += f'  <li><a href="{link}">{title}</a></li>\n'
    html += "</ul>\n"

html += """
</div>
</body>
</html>
"""

with open("wiki/index.html", "w", encoding="utf-8") as f:
    f.write(html)

