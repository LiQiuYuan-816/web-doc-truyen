#!/usr/bin/env bash

BASE_URL="/web-doc-truyen/"

find . -name "*.html" -exec bash -c '
  file="$1"

  # Nếu đã có <base> thì bỏ qua
  if grep -qi "<base " "$file"; then
    echo "SKIP (đã có base): $file"
    exit 0
  fi

  # Chèn <base> ngay sau <head>
  sed -i "s|<head>|<head>\n<base href=\"'"$BASE_URL"'\">|i" "$file"

  echo "OK  : $file"
' _ {} \;
