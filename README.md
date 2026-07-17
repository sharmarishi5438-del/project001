# project0111

A personal, interactive birthday website. Full concept, decisions, and design system live in `birthday-website-masterplan.md` (kept on Drive, not in this repo, per your call on privacy) — this repo is the build.

## Structure

```
project0111-site/
├── index.html              ← entry point / Chapter 1
├── css/
│   ├── main.css             ← design tokens (palette, fonts, base styles)
│   └── chapters/
│       └── chapter1.css
├── js/
│   ├── main.js               ← chapter state, gating/unlock logic
│   ├── audio.js               ← music + sound effect controller
│   └── chapters/
│       └── chapter1.js
├── chapters/                 ← chapters 2–9 go here as they're built
├── assets/
│   ├── fonts/                 ← self-hosted subsetted Gaegu + Patrick Hand
│   ├── images/
│   ├── audio/
│   ├── icons/
│   └── reference-art/          ← mood/style references, not shipped as final art
└── README.md
```

## Current status

- ✅ Repo scaffolded
- ✅ Chapter 1 mechanics built (starfield, portrait→landscape reveal) — starfield/orientation are placeholder-free, real and final
- ✅ **Real tree art integrated** — `assets/images/tree-color.webp` + `tree-lineart.webp`, pixel-matched layers with a working per-chapter bloom-reveal system (`js/tree.js`, `css/tree.css`). Node coordinates are approximate, tune visually once tested live.
- ✅ Chapter 1 (sapling) node is tappable and blooms correctly, revealing the opening line
- ⬜ Chapters 2–9 — not started (their tree nodes exist and will bloom once those chapters mark themselves visited)
- ⬜ Easter egg content (the swing hotspot exists but has no reveal yet — placeholder console log only)
- ⬜ Audio tracks — not sourced yet (`js/audio.js` is wired and ready, just needs files dropped into `assets/audio/`)

## About the tree art

`tree-color.webp` and `tree-lineart.webp` are pixel-matched (1774×887), optimized from your original PNGs (~4.4MB combined → ~460KB combined) for mobile load speed. Originals are kept in `assets/source-art/` for reference, not shipped to the live site. Each chapter node reveals a circular crop of the color image at its position when that chapter is visited — see `TREE_NODES` in `js/tree.js` for exact coordinates and the chapter → art-element mapping.

## Deploying to GitHub Pages

1. Push this folder as a repo to GitHub
2. Repo Settings → Pages → Deploy from branch → `main` → `/ (root)`
3. Live link will be `https://<your-username>.github.io/<repo-name>/`
4. Every push to `main` auto-updates the live site

## Notes on the fonts

`Gaegu` and `Patrick Hand` are self-hosted here as subsetted `.woff` files (~22KB and ~17KB) — subsetted from your original `.ttf` uploads to strip unused characters, per the Assets/Typography decisions in the master plan. `Caveat` is still loaded via Google Fonts CDN since no local file was provided for it yet — swap to a local `@font-face` in `css/main.css` the same way if you want it fully self-hosted too.
