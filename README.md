# project0111

A personal, interactive birthday website. Full concept, decisions, and design system live in `birthday-website-masterplan.md` (kept on Drive, not in this repo) — this repo is the build.

## Structure — FLAT ON PURPOSE

Every file sits directly in the repo root. No folders.

```
index.html
main.css / main.js
tree.css / tree.js
ambient.css / ambient.js
chapter1.css / chapter1.js
Gaegu-Regular-subset.woff / Gaegu-Bold-subset.woff / PatrickHand-Regular-subset.woff
tree-color.webp / tree-lineart.webp
README.md
```

## ⚠️ Replacing the previous version

Delete everything currently in the repo, then upload every file in this package fresh.

## Latest fix: the line-art looked like a blank coloring page

The previous round fixed a critical bug: `tree-color.webp` and `tree-lineart.webp` had been swapped since early in the build, so the tree never actually showed its dim "unvisited" state — it always showed full color. Once that was corrected, the true unvisited state became visible for the first time — and it turned out to be a plain white background with black outlines, with zero night-sky atmosphere baked into the art itself.

Fixed with a CSS `filter: invert(1)` on both the base tree layer (`tree.css`) and the ambient foliage-sway patches (`ambient.css`) — verified the source art is essentially pure grayscale first (only 0.009% of pixels have any color tint at all), so this is a clean transform with no odd color shifts. Now it reads as glowing white/silver linework on black, like a constellation map, instead of a stark coloring-book page.

## Everything already built

- Real horizontal-scroll tree world, correct aspect ratio, edge-to-edge, no margins
- Node-bloom tap sequence: press + haptic → spark ignite → spring-overshoot bloom → drifting embers → synced chime → ambient settle
- Foliage sway, fireflies, occasional falling petals — ambient life at rest
- Synthesized chime via Web Audio API — no external audio file needed
- Opening reveal uses the same "light expanding from a point" language as every tap
- `?calibrate=1` on-screen coordinate tool

## Known limitation, still true

Fullscreen is blocked inside WhatsApp/Instagram's in-app browsers — test the real link there before sending. Sound is muted by default — unmute (speaker icon) before judging audio.

## Deploying to GitHub Pages

1. Delete any old files in the repo
2. Upload every file listed above directly to the repo root
3. Settings → Pages → Deploy from branch → `main` → `/ (root)`
4. Live link: `https://<your-username>.github.io/<repo-name>/`
