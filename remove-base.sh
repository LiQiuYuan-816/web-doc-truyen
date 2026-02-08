#!/usr/bin/env bash

find . -name "*.html" | while read file; do
  if grep -qi "<base " "$file"; then
    sed -i '/<base /Id' "$file"
    echo "REMOVED <base>: $file"
  fi
done
