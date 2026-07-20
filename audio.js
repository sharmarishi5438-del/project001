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
  },

  // Synthesized directly — no audio file needed. A soft 3-note bell chord
  // (C5/G5/C6) with a quick attack and slow decay, used for the node-bloom
  // tap. Real ambient music/effects (Section 5) are still a separate TODO,
  // but this piece doesn't need to wait on sourcing external files.
  playChime() {
    if (this.muted) return;
    try {
      if (!this._ctx) this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = this._ctx;
      const now = ctx.currentTime;
      const freqs = [523.25, 783.99, 1046.50];

      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.14 / (i + 1), now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.2);
      });
    } catch (e) {
      /* Web Audio unsupported/blocked — non-fatal, tap still works visually */
    }
  }
};

document.addEventListener('DOMContentLoaded', () => AudioController.init());
