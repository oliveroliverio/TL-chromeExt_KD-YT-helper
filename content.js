(() => {
  const DEFAULTS = {
    stepSeconds: 1.0,       // Left/Right
    fineStepSeconds: 0.5,   // Alt + Left/Right
    fineModifier: "Alt",    // "Alt" | "Shift" | "Ctrl" (Control) | "Meta"
    enableOnInputs: false   // if true, works even while typing in inputs
  };

  let settings = { ...DEFAULTS };
  let lastActiveVideo = null;

  // Load settings
  chrome.storage?.sync?.get(DEFAULTS, (res) => {
    settings = { ...DEFAULTS, ...res };
  });

  // Observe video interactions to set active
  function attachVideoClickTracking() {
    const setActive = (v) => (lastActiveVideo = v);
    const seen = new WeakSet();

    const scan = () => {
      document.querySelectorAll('video').forEach(v => {
        if (seen.has(v)) return;
        seen.add(v);
        v.addEventListener('click', () => setActive(v), { capture: true });
        v.addEventListener('play', () => setActive(v));
      });
    };

    // Initial & periodic rescans for dynamically loaded players
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.documentElement, { childList: true, subtree: true });
    setInterval(scan, 2000);
  }

  attachVideoClickTracking();

  // Utility: choose best video
  function getBestVideo() {
    // Prefer explicitly active
    if (lastActiveVideo && !lastActiveVideo.paused) return lastActiveVideo;

    const videos = Array.from(document.querySelectorAll('video'));
    if (videos.length === 0) return null;

    // Prefer currently playing
    const playing = videos.filter(v => !v.paused && !v.ended && v.readyState >= 2);
    if (playing.length > 0) {
      // If multiple, choose the one most visible / largest area in viewport
      return bestVisible(playing) || playing[0];
    }

    // Else choose the most visible/largest
    return bestVisible(videos) || videos[0];
  }

  function bestVisible(list) {
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    let best = null;
    let bestScore = -1;

    for (const v of list) {
      const r = v.getBoundingClientRect();
      const visibleW = Math.max(0, Math.min(r.right, viewportW) - Math.max(r.left, 0));
      const visibleH = Math.max(0, Math.min(r.bottom, viewportH) - Math.max(r.top, 0));
      const visibleArea = visibleW * visibleH;
      if (visibleArea > bestScore) {
        bestScore = visibleArea;
        best = v;
      }
    }
    return best;
  }

  function inEditableContext(target) {
    if (!target) return false;
    const tag = (target.tagName || '').toLowerCase();
    if (['input', 'textarea', 'select'].includes(tag)) return true;
    if (target.isContentEditable) return true;
    return false;
  }

  function seek(video, deltaSeconds) {
    if (!video) return;
    try {
      const newTime = Math.max(0, Math.min((video.currentTime || 0) + deltaSeconds, video.duration || Infinity));
      video.currentTime = newTime;
    } catch (_) {}
  }

  function matchesModifier(e, wanted) {
    if (wanted === 'Alt') return e.altKey;
    if (wanted === 'Shift') return e.shiftKey;
    if (wanted === 'Ctrl') return e.ctrlKey || e.key === 'Control';
    if (wanted === 'Meta') return e.metaKey; // Cmd on macOS
    return false;
  }

  window.addEventListener('keydown', (e) => {
    // Ignore if inside input/textarea/contenteditable unless user opts in
    if (!settings.enableOnInputs && inEditableContext(e.target)) return;

    const key = e.key;
    let handled = false;

    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      const useFine = matchesModifier(e, settings.fineModifier);
      const step = useFine ? settings.fineStepSeconds : settings.stepSeconds;
      const sign = (key === 'ArrowLeft') ? -1 : 1;
      const video = getBestVideo();
      if (video) {
        seek(video, sign * step);
        handled = true;
      }
    }

    if (handled) {
      // Prevent site/default arrow behavior (like page scroll or native player seek)
      e.preventDefault();
      e.stopPropagation();
    }
  }, { capture: true });

  // Hot‑reload settings when changed via options
  chrome.storage?.onChanged?.addListener((changes, area) => {
    if (area !== 'sync') return;
    for (const [k, { newValue }] of Object.entries(changes)) {
      settings[k] = newValue;
    }
  });
})();
