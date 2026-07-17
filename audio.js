/* ============================================
   project0111 — Audio Controller
   ============================================
   Background music + sound effects, both optional
   per the Audio Plan (Section 5). Muted by default
   on load — she opts in, never forced. This matters:
   autoplaying audio is blocked by mobile browsers
   anyway, so muted-by-default is both the respectful
   choice AND the technically necessary one.
*/

const AudioController = {
  muted: true,
  bgMusic: null,

  init() {
    this.bgMusic = new Audio();
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.35;
    // this.bgMusic.src = 'assets/audio/ambient-base.mp3'; // set once a track is chosen

    this.renderToggle();
  },

  renderToggle() {
    const btn = document.createElement('button');
    btn.id = 'audio-toggle';
    btn.setAttribute('aria-label', 'Toggle sound');
    btn.textContent = '🔇';
    btn.addEventListener('click', () => this.toggle());
    document.body.appendChild(btn);
  },

  toggle() {
    this.muted = !this.muted;
    const btn = document.getElementById('audio-toggle');
    if (this.muted) {
      this.bgMusic.pause();
      btn.textContent = '🔇';
    } else {
      this.bgMusic.play().catch(() => {
        /* playback blocked — fine, stays muted, no error shown to her */
      });
      btn.textContent = '🔊';
    }
  },

  playEffect(name) {
    if (this.muted) return;
    const fx = new Audio(`assets/audio/${name}.mp3`);
    fx.volume = 0.5;
    fx.play().catch(() => {});
  }
};

document.addEventListener('DOMContentLoaded', () => AudioController.init());
