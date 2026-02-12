#!/bin/bash

SCRIPT_FILE="chapter-script.html"
MARKER="<!-- ================= HEADER SHRINK ================= -->"

echo "Bắt đầu thay HEADER SHRINK block..."
echo

find stories -mindepth 3 -maxdepth 3 -type f -name "*.html" \
| while read f; do

  echo "----------------------------------------"
  echo "📄 File: $f"

  # Kiểm tra marker tồn tại
  if ! grep -qF "$MARKER" "$f"; then
    echo "⚠ Không có HEADER SHRINK → Bỏ qua"
    continue
  fi

  TMP_FILE="$(mktemp)"

  awk -v marker="$MARKER" -v scriptfile="$SCRIPT_FILE" '
    $0 ~ marker {
        print
        skip=1

        # Bỏ qua script thứ 1
        while (getline && $0 !~ /<\/script>/) {}
        # Bỏ qua script thứ 2
        while (getline && $0 !~ /<\/script>/) {}

        # Chèn script mới
        while ((getline line < scriptfile) > 0) print line
        close(scriptfile)

        next
    }
    { print }
  ' "$f" > "$TMP_FILE"

  if [ -s "$TMP_FILE" ]; then
    mv "$TMP_FILE" "$f"
    echo "✅ Đã thay phần HEADER SHRINK"
  else
    echo "❌ Lỗi → Không ghi đè"
    rm -f "$TMP_FILE"
  fi

done

echo
echo "Hoàn tất."
