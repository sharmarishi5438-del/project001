/* ============================================
   Ambient life system — foliage sway, fireflies,
   occasional falling petals. Purely decorative,
   always active regardless of chapter progress —
   this is what's running at rest, before any tap.
   ============================================ */

// Rough leafy spots along the canopy (deliberately not the same points
// as the chapter nodes/flowers/lanterns — this is general foliage
// texture, not a specific named element).
const FOLIAGE_SWAY_SPOTS = [
  { x: 13, y: 48, size: 12 },
  { x: 27, y: 34, size: 10 },
  { x: 52, y: 44, size: 11 },
  { x: 63, y: 30, size: 9  },
  { x: 71, y: 42, size: 10 },
  { x: 85, y: 36, size: 9  },
];

function hashStrAmbient(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function buildFoliageSway() {
  const nodesContainer = document.getElementById('tree-nodes');

  FOLIAGE_SWAY_SPOTS.forEach((spot, i) => {
    const el = document.createElement('div');
    el.className = 'foliage-sway';
    el.style.left = `${spot.x}%`;
    el.style.top = `${spot.y}%`;
    el.style.width = `${spot.size}%`;
    el.style.aspectRatio = '1 / 1';
    // Uses the LINE-ART image, not color — this adds motion to the
    // base/unvisited state itself, without prematurely revealing color
    // that's supposed to be earned by visiting that chapter.
    el.style.backgroundImage = "url('tree-lineart.webp')";

    const seed = hashStrAmbient(`sway${i}`);
    el.style.animationDuration = `${4 + (seed % 3)}s`;
    el.style.animationDelay = `-${(seed % 4000) / 1000}s`;

    nodesContainer.appendChild(el);
  });

  layoutFoliageBackgrounds();
}

function layoutFoliageBackgrounds() {
  const wrap = document.getElementById('tree-wrap');
  if (!wrap) return;
  const rect = wrap.getBoundingClientRect();

  document.querySelectorAll('.foliage-sway').forEach(el => {
    const xPct = parseFloat(el.style.left);
    const yPct = parseFloat(el.style.top);
    const size = el.offsetWidth;

    el.style.backgroundSize = `${rect.width}px ${rect.height}px`;
    const nodeX = (xPct / 100) * rect.width;
    const nodeY = (yPct / 100) * rect.height;
    el.style.backgroundPosition = `${-(nodeX - size / 2)}px ${-(nodeY - size / 2)}px`;
  });
}

function buildFireflies(count = 9) {
  const container = document.getElementById('tree-nodes');
  for (let i = 0; i < count; i++) {
    const f = document.createElement('div');
    f.className = 'firefly';
    const x = 8 + Math.random() * 84;
    const y = 15 + Math.random() * 45;
    f.style.left = `${x}%`;
    f.style.top = `${y}%`;
    f.style.setProperty('--fx', `${(Math.random() - 0.5) * 70}px`);
    f.style.setProperty('--fy', `${(Math.random() - 0.5) * 70 - 20}px`);
    f.style.animationDuration = `${8 + Math.random() * 6}s`;
    f.style.animationDelay = `-${Math.random() * 10}s`;
    container.appendChild(f);
  }
}

function spawnFallingLeaf() {
  const container = document.getElementById('tree-nodes');
  if (!container) return;
  const spot = FOLIAGE_SWAY_SPOTS[Math.floor(Math.random() * FOLIAGE_SWAY_SPOTS.length)];
  const leaf = document.createElement('div');
  leaf.className = 'falling-leaf';
  leaf.style.left = `${spot.x + (Math.random() * 6 - 3)}%`;
  leaf.style.top = `${spot.y}%`;
  leaf.style.setProperty('--lx', `${(Math.random() - 0.5) * 60}px`);
  container.appendChild(leaf);
  leaf.addEventListener('animationend', () => leaf.remove(), { once: true });
}

document.addEventListener('DOMContentLoaded', () => {
  // Wait a beat so tree-wrap has real layout dimensions before measuring it
  requestAnimationFrame(() => {
    buildFoliageSway();
    buildFireflies();
  });

  setInterval(spawnFallingLeaf, 5000 + Math.random() * 4000);
});

window.addEventListener('resize', layoutFoliageBackgrounds);
