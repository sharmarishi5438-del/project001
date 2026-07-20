/* ============================================
   Chapter 1 — Opening Gate logic
   ============================================
   NOTE: this is a working PROTOTYPE using placeholder
   visuals (CSS starfield, a simple div sapling) — the
   mechanics here (orientation handling, reveal timing,
   tap-to-awaken) are the real thing and won't need to
   change once real art replaces the placeholders.
*/

function buildStarfield(container, count = 80) {
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    // Independent timing per star — deliberately not synchronized (motion principle, Section 4a)
    star.style.animationDuration = `${2 + Math.random() * 4}s`;
    star.style.animationDelay = `${Math.random() * 4}s`;
    container.appendChild(star);
  }
}

let hasRevealedOnce = false;

function checkOrientation() {
  const isLandscape = window.innerWidth > window.innerHeight;
  const rotatePrompt = document.getElementById('rotate-prompt');

  if (isLandscape) {
    rotatePrompt.style.opacity = '0';
    setTimeout(() => { rotatePrompt.style.display = 'none'; }, 700);

    if (!hasRevealedOnce) {
      hasRevealedOnce = true;
      triggerBigReveal();
    }
  } else {
    rotatePrompt.style.display = 'flex';
    rotatePrompt.style.opacity = '1';
  }
}

// The whole-scene version of the same "ignite" language used on every
// node tap: snap to a pinpoint, then let it expand outward — replacing
// what used to be a flat opacity fade.
function triggerBigReveal() {
  const hole = document.getElementById('reveal-hole');
  hole.style.transition = 'none';
  hole.classList.add('closed');
  void hole.offsetWidth; // force reflow so the instant snap commits first
  hole.style.transition = '';
  requestAnimationFrame(() => {
    hole.classList.remove('closed');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  buildStarfield(document.getElementById('scene'));
  checkOrientation();

  window.addEventListener('resize', checkOrientation);
  window.addEventListener('orientationchange', checkOrientation);

  // The sapling node itself (ch1) is built and made tappable by tree.js.
  // Chapter 1's own job is just reacting when THAT specific chapter blooms —
  // fading in the opening line to accompany it.
  document.addEventListener('chapter:visited', (e) => {
    if (e.detail.chapterId === 'ch1') {
      document.getElementById('opening-line').classList.add('shown');
    }
  });
});
