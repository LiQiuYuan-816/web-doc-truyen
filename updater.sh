#!/bin/bash

echo "Bắt đầu di chuyển script vào trước </body>..."
echo

find stories -mindepth 2 -maxdepth 2 -type f -name "index.html" | while read f; do

  echo "========================================"
  echo "📄 File: $f"

  html_line=$(grep -n "</html>" "$f" | tail -1 | cut -d: -f1)
  script_line=$(grep -n "<script" "$f" | tail -1 | cut -d: -f1)

  if [[ -n "$html_line" && -n "$script_line" && "$script_line" -gt "$html_line" ]]; then

      echo "🔎 Phát hiện script nằm sau </html> → Đang xử lý..."

      TMP_FILE="$(mktemp)"

      awk '
      BEGIN {
          inscript=0
          script=""
      }

      /<script[ >]/ {
          inscript=1
      }

      inscript {
          script = script $0 "\n"
          next
      }

      /<\/script>/ && inscript {
          inscript=0
          next
      }

      /<\/body>/ {
          if (script != "") {
              printf "%s", script
              script=""
          }
          print
          next
      }

      { print }
      ' "$f" > "$TMP_FILE"

      mv "$TMP_FILE" "$f"
      echo "✅ Đã di chuyển script vào trước </body>"

  else
      echo "⏭ Script đã đúng vị trí hoặc không tồn tại → Bỏ qua"
  fi

done

echo
echo "🎯 Hoàn tất."
