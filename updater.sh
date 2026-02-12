#!/bin/bash

SCRIPT_FILE="script.html"

echo "Bắt đầu thay toàn bộ script trong index.html..."
echo

find stories -mindepth 2 -maxdepth 2 -type f -name "index.html" \
  ! -path "stories/tu-vo-han-luu-xuyen-tien-cau-sinh-luyen-tong-sau/*" \
| while read f; do

  echo "----------------------------------------"
  echo "📄 File: $f"

  TMP_FILE="$(mktemp)"

  awk -v scriptfile="$SCRIPT_FILE" '
    BEGIN { skip=0 }

    # Nếu gặp <script> thì bắt đầu bỏ qua
    /<script[ >]/ {
        skip=1
        next
    }

    # Nếu đang bỏ qua và gặp </script> thì kết thúc bỏ qua
    skip && /<\/script>/ {
        skip=0
        next
    }

    # Nếu không nằm trong script thì in ra
    !skip { print }

    END {
        # Sau khi in xong toàn bộ file → thêm script mới
        while ((getline line < scriptfile) > 0)
            print line
        close(scriptfile)
    }
  ' "$f" > "$TMP_FILE"

  if [ -s "$TMP_FILE" ]; then
    mv "$TMP_FILE" "$f"
    echo "✅ Đã xóa script cũ và chèn script mới"
  else
    echo "❌ Lỗi xử lý → Không ghi đè"
    rm -f "$TMP_FILE"
  fi

done

echo
echo "Hoàn tất."
