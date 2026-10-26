#!/usr/bin/env bash
# Siteyi GitHub Pages önizlemesi için derler ve gh-pages dalına gönderir.
# Yayın adresi: https://formxweb.github.io/Aspava/
set -euo pipefail

cd "$(dirname "$0")/.."
npm run build:pages

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
cp -r out/. "$tmp"

cd "$tmp"
git init -q -b gh-pages
git add -A
git commit -q -m "GitHub Pages önizlemesi"
git push -f "$(git -C "$OLDPWD" remote get-url origin)" gh-pages
