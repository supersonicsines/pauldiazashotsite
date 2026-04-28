#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
OUT_DIR="$ROOT/public/previews"

mkdir -p "$OUT_DIR"

capture() {
	local url="$1"
	local file="$2"

	"$CHROME" \
		--headless=new \
		--disable-gpu \
		--no-sandbox \
		--hide-scrollbars \
		--window-size=1280,720 \
		--screenshot="$OUT_DIR/$file" \
		"$url"
}

capture "https://gammaswap.com" "gammaswap.png"
capture "https://www.codex.io" "codex.png"
