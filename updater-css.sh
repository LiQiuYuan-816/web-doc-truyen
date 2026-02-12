#!/bin/bash

CSS_FILE="chapter-sidebar.css"
MARKER="/* ===== AUTO ADDED EXTRA CSS ===== */"

echo "Bắt đầu chèn CSS..."
echo

find stories -type f -name "style.css" \
  ! -path "stories/tu-vo-han-luu-xuyen-tien-cau-sinh-luyen-tong-sau/*" \
| while read f; do

  echo "----------------------------------------"
  echo "📄 File: $f"

  # Nếu đã có marker thì bỏ qua
  if grep -qF "$MARKER" "$f"; then
    echo "⚠ Đã có CSS này rồi → Bỏ qua"
    continue
  fi

  echo "" >> "$f"
  echo "$MARKER" >> "$f"
  cat "$CSS_FILE" >> "$f"

  echo "✅ Đã chèn CSS vào cuối file"

done

echo
echo "Hoàn tất."
