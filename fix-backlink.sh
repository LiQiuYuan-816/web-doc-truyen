#!/usr/bin/env bash

echo "🔧 Fix backlink for index.html only..."

find . -name "index.html" | while read file; do
  # Nếu đã đúng ../../index.html thì bỏ qua
  if grep -q 'href="\.\./\.\./index.html"' "$file"; then
    echo "SKIP (đã đúng): $file"
    continue
  fi

  # Chỉ xử lý khi có ../index.html
  if grep -q 'href="\.\./index.html"' "$file"; then
    sed -i '
      s|href="\.\./index.html"|href="../../index.html"|g;
      s|href="\.\./thu-vien-ten/name-library.html"|href="../../thu-vien-ten/name-library.html"|g
    ' "$file"

    echo "OK  (đã sửa): $file"
  fi
done

echo "✅ Hoàn tất"
