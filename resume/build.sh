#!/usr/bin/env bash
# Regenerate the resume PDF from resume.html via headless Chrome.
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=6000 --run-all-compositor-stages-before-draw \
  --print-to-pdf="$DIR/Maxence-Mauduit_Resume.pdf" \
  "file://$DIR/resume.html" 2>/dev/null
echo "wrote $DIR/Maxence-Mauduit_Resume.pdf"
