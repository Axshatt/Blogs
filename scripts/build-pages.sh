#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
stage=$(mktemp -d "$PWD/.pages-build.XXXXXX")
trap 'rm -rf "$stage"' EXIT
mkdir "$stage/app"
cp -R components content lib types public "$stage/"
cp mdx-components.tsx tsconfig.json package.json next.config.mjs postcss.config.mjs "$stage/"
cp -R app/{about,blog,library,llms.txt,rss.xml} "$stage/app/"
cp app/{layout.tsx,page.tsx,not-found.tsx,loading.tsx,globals.css,icon.jpg,robots.ts,sitemap.ts} "$stage/app/"
cp pages-export/blog.tsx "$stage/app/blog/page.tsx"
echo "export const dynamic = 'force-static';" >> "$stage/app/sitemap.ts"
# The Pages build uses the stylesheet's system font stack and works offline.
echo "export const inter = { variable: '' };" > "$stage/lib/site-font.ts"
ln -s "$PWD/node_modules" "$stage/node_modules"
export PAGES_EXPORT=true
export NEXT_PUBLIC_BASE_PATH="${NEXT_PUBLIC_BASE_PATH-/Blogs}"
export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://axshatt.github.io${NEXT_PUBLIC_BASE_PATH}}"
(cd "$stage" && ../node_modules/.bin/next build --webpack)
rm -rf out
mv "$stage/out" out
touch out/.nojekyll
