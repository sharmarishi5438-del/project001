/* ============================================
   project0111 — Core State & Navigation
   ============================================
   Handles: chapter visited-tracking, the "8 of 9 unlocks
   the finale" gating rule, and dispatching tree-growth
   events that other modules (tree animation, chapter
   loader) listen for.
*/

const CHAPTERS = [
  { id: 'ch1', title: 'Opening Gate',        finale: false },
  { id: 'ch2', title: 'Birthday Reveal',     finale: false },
  { id: 'ch3', title: 'Story / Journey Map', finale: false },
  { id: 'ch4', title: 'Memory Timeline',     finale: false },
  { id: 'ch5', title: 'Interactive Rooms',   finale: false },
  { id: 'ch6', title: 'Hidden Easter Eggs',  finale: false },
  { id: 'ch7', title: 'Appreciation',        finale: false },
  { id: 'ch8', title: 'Birthday Wish',       finale: false },
  { id: 'ch9', title: 'Soft Ending',         finale: true  }, // gated
];

const STORAGE_KEY = 'project0111_progress';
const REQUIRED_FOR_FINALE = 8; // any 8 of the non-finale chapters

const ProjectState = {
  visited: new Set(),

  load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      this.visited = new Set(saved);
    } catch (e) {
      this.visited = new Set();
    }
  },

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.visited]));
    } catch (e) {
      /* storage unavailable — progress just won't persist across visits, non-fatal */
    }
  },

  markVisited(chapterId) {
    const chapter = CHAPTERS.find(c => c.id === chapterId);
    if (!chapter || chapter.finale) return; // finale isn't "visited" to unlock itself
    if (this.visited.has(chapterId)) return;

    this.visited.add(chapterId);
    this.save();

    document.dispatchEvent(new CustomEvent('chapter:visited', {
      detail: { chapterId, totalVisited: this.visited.size }
    }));

    if (this.isFinaleUnlocked()) {
      document.dispatchEvent(new CustomEvent('finale:unlocked'));
    }
  },

  isFinaleUnlocked() {
    return this.visited.size >= REQUIRED_FOR_FINALE;
  },

  isVisited(chapterId) {
    return this.visited.has(chapterId);
  },

  progressCount() {
    return this.visited.size;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ProjectState.load();
  document.dispatchEvent(new CustomEvent('state:ready', {
    detail: { totalVisited: ProjectState.progressCount() }
  }));
});
