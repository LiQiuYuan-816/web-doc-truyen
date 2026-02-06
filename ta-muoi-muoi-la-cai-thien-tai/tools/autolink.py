import os
import re

WIKI_DIRS = [
    "wiki/characters",
    "wiki/locations"
]

def get_terms():
    terms = {}
    for folder in WIKI_DIRS:
        for file in os.listdir(folder):
            if file.endswith(".html"):
                name = file.replace(".html", "").replace("-", " ")
                path = f"../{folder}/{file}"
                terms[name] = path
    return terms

def autolink(text, terms):
    for name, link in sorted(terms.items(), key=lambda x: -len(x[0])):
        pattern = r'\b' + re.escape(name) + r'\b'
        text = re.sub(
            pattern,
            f'<a href="{link}">{name}</a>',
            text
        )
    return text

with open("raw-chapters/chap01.html", encoding="utf-8") as f:
    html = f.read()

terms = get_terms()
result = autolink(html, terms)

with open("chapters/chap01.html", "w", encoding="utf-8") as f:
    f.write(result)
