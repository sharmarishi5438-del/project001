/* ============================================
   The Living Memory Tree — node system (redesigned)
   ============================================
   Coordinates refined via image analysis + visual crop
   verification. If any still look off once live, add
   ?calibrate=1 to the URL, tap the actual flower/lantern,
   and read the exact x%/y% on-screen — no more guessing.
*/

const TREE_NODES = [
  { id: 'ch1', xPct: 7,  yPct: 68 },
  { id: 'ch2', xPct: 19, yPct: 38 },
  { id: 'ch3', xPct: 34, yPct: 39 },
  { id: 'ch4', xPct: 47, yPct: 37 },
  { id: 'ch5', xPct: 57, yPct: 38 },
  { id: 'ch6', xPct: 59, yPct: 49 },
  { id: 'ch7', xPct: 66, yPct: 36 },
  { id: 'ch8', xPct: 77, yPct: 39 },
  { id: 'ch9', xPct: 92, yPct: 23 },
];

const EASTER_EGGS = [
  { id: 'egg-swing', xPct: 40, yPct: 53 },
];

// Only chapters that actually exist get to be tappable.
const IMPLEMENTED_CHAPTERS = ['ch1'];
const IMPLEMENTED_EGGS = [];

const isCalibrating = new URLSearchParams(window.location.search).get('calibrate') === '1';
let fullscreenRequested = false;

// ============================================
// Deterministic per-node "organic" mask — replaces a single perfect
// circle (which reads as "photo filter") with 3 overlapping irregular
// blobs. Same node always gets the same shape (hashed from its id),
// so it's consistent across reloads, not randomly different each time.
// ============================================
function hashStr(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function buildOrganicMask(nodeId) {
  const h = hashStr(nodeId);
  const blobs = [0, 1, 2].map(i => {
    const seed = (h + i * 7919) >>> 0;
    const cx = 30 + (seed % 40);              // 30–70%
    const cy = 30 + ((seed >> 3) % 40);        // 30–70%
    const r  = 32 + ((seed >> 6) % 14);        // 32–46%
    return `radial-gradient(circle ${r}% at ${cx}% ${cy}%, black 0%, black 55%, transparent 100%)`;
  });
  return blobs.join(', ');
}

function buildTree() {
  const nodesContainer = document.getElementById('tree-nodes');

  TREE_NODES.forEach(n => {
    const mask = buildOrganicMask(n.id);

    const bloom = document.createElement('div');
    bloom.className = 'tree-node';
    bloom.dataset.chapter = n.id;
    bloom.style.left = `${n.xPct}%`;
    bloom.style.top = `${n.yPct}%`;
    bloom.style.maskImage = mask;
    bloom.style.webkitMaskImage = mask;
    nodesContainer.appendChild(bloom);

    if (IMPLEMENTED_CHAPTERS.includes(n.id)) {
      // Idle breathing glow — invites touch, removed once visited
      const idle = document.createElement('div');
      idle.className = 'tree-node-idle';
      idle.dataset.chapter = n.id;
      idle.style.left = `${n.xPct}%`;
      idle.style.top = `${n.yPct}%`;
      idle.style.animationDelay = `-${(hashStr(n.id + 'idle') % 4000) / 1000}s`;
      nodesContainer.appendChild(idle);

      const hit = document.createElement('div');
      hit.className = 'tree-node-hit';
      hit.style.left = `${n.xPct}%`;
      hit.style.top = `${n.yPct}%`;
      hit.setAttribute('role', 'button');
      hit.setAttribute('aria-label', `Open chapter: ${n.id}`);
      hit.addEventListener('touchstart', () => pressNode(hit), { passive: true });
      hit.addEventListener('mousedown', () => pressNode(hit));
      hit.addEventListener('click', () => onNodeTap(n.id, hit));
      nodesContainer.appendChild(hit);
    }
  });

  EASTER_EGGS.forEach(e => {
    if (!IMPLEMENTED_EGGS.includes(e.id)) return;
    const hit = document.createElement('div');
    hit.className = 'easter-egg-hit';
    hit.style.left = `${e.xPct}%`;
    hit.style.top = `${e.yPct}%`;
    hit.setAttribute('role', 'button');
    hit.setAttribute('aria-label', 'Hidden detail');
    hit.addEventListener('click', () => onEasterEggTap(e.id));
    nodesContainer.appendChild(hit);
  });

  layoutTreeBackgrounds();
  restoreBloomState();

  if (isCalibrating) initCalibrationMode();
}

function layoutTreeBackgrounds() {
  const wrap = document.getElementById('tree-wrap');
  const rect = wrap.getBoundingClientRect();

  document.querySelectorAll('.tree-node').forEach(el => {
    const xPct = parseFloat(el.style.left);
    const yPct = parseFloat(el.style.top);
    const size = el.offsetWidth;

    el.style.backgroundImage = "url('tree-color.webp')";
    el.style.backgroundSize = `${rect.width}px ${rect.height}px`;

    const nodeX = (xPct / 100) * rect.width;
    const nodeY = (yPct / 100) * rect.height;
    el.style.backgroundPosition = `${-(nodeX - size / 2)}px ${-(nodeY - size / 2)}px`;
  });
}

function tryEnterFullscreen() {
  if (fullscreenRequested) return;
  fullscreenRequested = true;
  const el = document.documentElement;
  const request = el.requestFullscreen || el.webkitRequestFullscreen
                || el.mozRequestFullScreen || el.msRequestFullscreen;
  if (request) {
    request.call(el).catch(() => {
      /* Blocked in some in-app browsers (WhatsApp/Instagram) — non-fatal. */
    });
  }
}

// ============================================
// The real tap sequence: press → ignite → particles → chime → settle
// ============================================
function pressNode(hitEl) {
  hitEl.classList.add('pressed');
  if (navigator.vibrate) {
    try { navigator.vibrate(12); } catch (e) { /* unsupported, ignore */ }
  }
  setTimeout(() => hitEl.classList.remove('pressed'), 100);
}

function onNodeTap(chapterId, hitEl) {
  tryEnterFullscreen();

  const bloomEl = document.querySelector(`.tree-node[data-chapter="${chapterId}"]`);
  const idleEl = document.querySelector(`.tree-node-idle[data-chapter="${chapterId}"]`);
  if (!bloomEl || bloomEl.classList.contains('settled')) return; // already bloomed, no re-trigger

  if (idleEl) idleEl.remove();

  bloomEl.classList.add('igniting');
  spawnParticles(bloomEl);

  if (window.AudioController) AudioController.playChime();
  if (window.ProjectState) ProjectState.markVisited(chapterId);

  bloomEl.addEventListener('animationend', function onEnd() {
    bloomEl.removeEventListener('animationend', onEnd);
    bloomEl.classList.remove('igniting');
    bloomEl.classList.add('settled');
  }, { once: true });
}

function spawnParticles(bloomEl) {
  const container = document.getElementById('tree-nodes');
  const left = bloomEl.style.left;
  const top = bloomEl.style.top;

  for (let i = 0; i < 6; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 18 + Math.random() * 26;
    const p = document.createElement('div');
    p.className = 'spark-particle';
    p.style.left = left;
    p.style.top = top;
    p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    p.style.setProperty('--dy', `${Math.sin(angle) * dist - 16}px`); // slight upward drift
    container.appendChild(p);
    p.addEventListener('animationend', () => p.remove(), { once: true });
  }
}

function restoreBloomState() {
  if (!window.ProjectState) return;
  TREE_NODES.forEach(n => {
    if (IMPLEMENTED_CHAPTERS.includes(n.id) && ProjectState.isVisited(n.id)) {
      // Returning visit — jump straight to the final resting state,
      // don't replay the whole ignite sequence every reload.
      const bloomEl = document.querySelector(`.tree-node[data-chapter="${n.id}"]`);
      const idleEl = document.querySelector(`.tree-node-idle[data-chapter="${n.id}"]`);
      if (idleEl) idleEl.remove();
      if (bloomEl) {
        bloomEl.style.opacity = '1';
        bloomEl.classList.add('settled');
      }
    }
  });
}

function onEasterEggTap(eggId) {
  console.log(`easter egg tapped: ${eggId}`); // placeholder until Ch.6 content exists
}

// ============================================
// Calibration mode — add ?calibrate=1 to the URL
// ============================================
function initCalibrationMode() {
  const wrap = document.getElementById('tree-wrap');

  const readout = document.createElement('div');
  readout.id = 'calibration-readout';
  readout.style.cssText = `
    position: fixed; top: 8px; left: 8px; z-index: 9999;
    background: rgba(0,0,0,0.75); color: #fff; font-family: monospace;
    font-size: 13px; padding: 8px 12px; border-radius: 8px;
    pointer-events: none; max-width: 90vw;
  `;
  readout.textContent = 'Calibration mode — tap any point on the tree';
  document.body.appendChild(readout);

  wrap.addEventListener('click', (e) => {
    const rect = wrap.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const yPct = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
    readout.textContent = `xPct: ${xPct}   yPct: ${yPct}`;

    const marker = document.createElement('div');
    marker.style.cssText = `
      position: absolute; left: ${xPct}%; top: ${yPct}%;
      width: 14px; height: 14px; margin: -7px 0 0 -7px;
      border-radius: 50%; background: red; z-index: 500;
      pointer-events: none;
    `;
    wrap.appendChild(marker);
  }, true);
}

document.addEventListener('DOMContentLoaded', buildTree);
window.addEventListener('resize', layoutTreeBackgrounds);
