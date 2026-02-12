#!/bin/bash

SCRIPT_FILE="script.html"

echo "Bắt đầu chèn script vào trước </body>..."
echo

find stories -mindepth 2 -maxdepth 2 -type f -name "index.html" | while read f; do

  echo "========================================"
  echo "📄 File: $f"

  # Kiểm tra có </body> không
  if ! grep -q "</body>" "$f"; then
      echo "❌ Không có </body> → Bỏ qua"
      continue
  fi

  # Kiểm tra đã có script nằm trước </body> chưa
  body_line=$(grep -n "</body>" "$f" | tail -1 | cut -d: -f1)
  script_line=$(grep -n "<script" "$f" | tail -1 | cut -d: -f1)

  if [[ -n "$script_line" && "$script_line" -lt "$body_line" ]]; then
      echo "⏭ Script đã nằm trong </body> → Bỏ qua"
      continue
  fi

  TMP_FILE="$(mktemp)"

  awk -v scriptfile="$SCRIPT_FILE" '
  /<\/body>/ {
      while ((getline line < scriptfile) > 0)
          print line
      close(scriptfile)
      print
      next
  }
  { print }
  ' "$f" > "$TMP_FILE"

  mv "$TMP_FILE" "$f"

  echo "✅ Đã chèn script vào trước </body>"

done

echo
echo "🎯 Hoàn tất."
