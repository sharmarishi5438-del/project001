/* ============================================
   The Living Memory Tree — node system
   ============================================
   Coordinates below are APPROXIMATE (percentage of
   the tree image's width/height), eyeballed from the
   final art. Nudge xPct/yPct per node once viewed live
   in-browser against the real image — small adjustments
   are expected and easy, everything else references
   these by chapter id, not by position.
*/

const TREE_NODES = [
  { id: 'ch1', xPct: 6,  yPct: 66 },  // sapling, base of trunk — Chapter 1
  { id: 'ch2', xPct: 24, yPct: 37 },  // first lantern
  { id: 'ch3', xPct: 34, yPct: 30 },  // first flower
  { id: 'ch4', xPct: 52, yPct: 24 },  // center flower
  { id: 'ch5', xPct: 65, yPct: 34 },  // second lantern
  { id: 'ch6', xPct: 60, yPct: 52 },  // dreamcatcher — Hidden Easter Eggs chapter node
  { id: 'ch7', xPct: 76, yPct: 26 },  // flower
  { id: 'ch8', xPct: 81, yPct: 43 },  // third lantern
  { id: 'ch9', xPct: 91, yPct: 28 },  // big lotus, finale bloom
];

// Decorative / easter-egg only — does NOT count toward the 8-of-9 gating rule
const EASTER_EGGS = [
  { id: 'egg-swing', xPct: 41, yPct: 63 }, // the swing
];

function buildTree() {
  const nodesContainer = document.getElementById('tree-nodes');

  TREE_NODES.forEach(n => {
    const bloom = document.createElement('div');
    bloom.className = 'tree-node';
    bloom.dataset.chapter = n.id;
    bloom.style.left = `${n.xPct}%`;
    bloom.style.top = `${n.yPct}%`;
    nodesContainer.appendChild(bloom);

    const hit = document.createElement('div');
    hit.className = 'tree-node-hit';
    hit.style.left = `${n.xPct}%`;
    hit.style.top = `${n.yPct}%`;
    hit.setAttribute('role', 'button');
    hit.setAttribute('aria-label', `Open chapter: ${n.id}`);
    hit.addEventListener('click', () => onNodeTap(n.id));
    nodesContainer.appendChild(hit);
  });

  EASTER_EGGS.forEach(e => {
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
}

// Each bloom node shows a crop of the full color image at its own position —
// this requires the background-size/position to be computed against the
// CONTAINER's actual rendered pixel size, recalculated on resize.
function layoutTreeBackgrounds() {
  const wrap = document.getElementById('tree-wrap');
  const rect = wrap.getBoundingClientRect();

  document.querySelectorAll('.tree-node').forEach(el => {
    const xPct = parseFloat(el.style.left);
    const yPct = parseFloat(el.style.top);
    const size = el.offsetWidth;

    el.style.backgroundImage = "url('assets/images/tree-color.webp')";
    el.style.backgroundSize = `${rect.width}px ${rect.height}px`;

    const nodeX = (xPct / 100) * rect.width;
    const nodeY = (yPct / 100) * rect.height;
    el.style.backgroundPosition = `${-(nodeX - size / 2)}px ${-(nodeY - size / 2)}px`;
  });
}

function onNodeTap(chapterId) {
  if (window.ProjectState) {
    ProjectState.markVisited(chapterId);
  }
  bloomNode(chapterId);
}

function bloomNode(chapterId) {
  const el = document.querySelector(`.tree-node[data-chapter="${chapterId}"]`);
  if (el) el.classList.add('bloomed');
}

function restoreBloomState() {
  if (!window.ProjectState) return;
  TREE_NODES.forEach(n => {
    if (ProjectState.isVisited(n.id)) bloomNode(n.id);
  });
}

function onEasterEggTap(eggId) {
  // Placeholder hook — wire an actual reveal (joke/callback) once Ch.6 content is written
  console.log(`easter egg tapped: ${eggId}`);
}

document.addEventListener('DOMContentLoaded', buildTree);
window.addEventListener('resize', layoutTreeBackgrounds);

// Keep bloom in sync if a chapter is marked visited elsewhere (e.g. future chapter pages)
document.addEventListener('chapter:visited', (e) => bloomNode(e.detail.chapterId));
