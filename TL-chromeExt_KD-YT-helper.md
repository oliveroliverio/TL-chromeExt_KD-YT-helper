# Dance Skip Keys — Chrome Extension

Control any HTML5 video with ultra‑fine arrow‑key nudges: 1.0s and 0.5s steps. Ideal for learning choreography.

---

## Features

* **Left / Right**: jump **±1.0s**
* **Alt + Left/Right** (⌥ on macOS): jump **±0.5s**
* Works on most sites with `<video>` elements (YouTube, Vimeo embeds, web players).
* Picks the **currently playing** video or the **largest/most visible** one. Click any video to set it active.
* **Options page** to customize step sizes and modifier.
* Designed to avoid conflicts in text inputs and editable fields.

> Tip: If a site already binds arrow keys, this extension captures the key first (use of **capture** phase) and prevents double‑seeking.

---

## File Tree

```
DanceSkipKeys/
  ├─ manifest.json
  ├─ content.js
  ├─ options.html
  ├─ options.js
  └─ icons/
      └─ icon128.png   (optional placeholder)
```

---

## `manifest.json`

```json
{
  "manifest_version": 3,
  "name": "Dance Skip Keys",
  "version": "1.0.0",
  "description": "Use arrow keys to nudge video: ±1.0s (Left/Right) and ±0.5s with Alt.",
  "icons": {
    "128": "icons/icon128.png"
  },
  "permissions": ["storage"],
  "host_permissions": ["<all_urls>"],
  "content_scripts": [
    {
      "matches": ["http://*/*", "https://*/*", "file://*/*"],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ],
  "options_page": "options.html"
}
```

---

## `content.js`

```javascript
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
```

---

## `options.html`

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Dance Skip Keys – Options</title>
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: 24px; max-width: 720px; }
    label { display: block; margin: 12px 0 4px; }
    input[type="number"] { width: 120px; padding: 6px; }
    select { padding: 6px; }
    .row { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
    .card { border: 1px solid #ddd; border-radius: 12px; padding: 16px; margin-top: 16px; }
    .muted { color: #666; font-size: 0.95em; }
    button { padding: 8px 14px; border-radius: 8px; border: 1px solid #ccc; cursor: pointer; }
  </style>
</head>
<body>
  <h1>Dance Skip Keys – Options</h1>
  <p class="muted">Configure your step sizes and the modifier for fine nudges.</p>

  <div class="card">
    <div class="row">
      <label for="stepSeconds"><strong>Normal step (Left/Right):</strong></label>
      <input id="stepSeconds" type="number" step="0.1" min="0.1" value="1.0"> <span>seconds</span>
    </div>

    <div class="row">
      <label for="fineStepSeconds"><strong>Fine step (with modifier):</strong></label>
      <input id="fineStepSeconds" type="number" step="0.1" min="0.1" value="0.5"> <span>seconds</span>
    </div>

    <div class="row">
      <label for="fineModifier"><strong>Fine modifier key:</strong></label>
      <select id="fineModifier">
        <option>Alt</option>
        <option>Shift</option>
        <option>Ctrl</option>
        <option>Meta</option>
      </select>
    </div>

    <div class="row">
      <label for="enableOnInputs"><strong>Enable inside inputs/textareas:</strong></label>
      <input id="enableOnInputs" type="checkbox">
    </div>

    <div class="row" style="margin-top:12px;">
      <button id="saveBtn">Save</button>
      <span id="status" class="muted"></span>
    </div>
  </div>

  <p class="muted" style="margin-top:24px;">Shortcuts:
    <br>• <kbd>Left</kbd>/<kbd>Right</kbd> = normal step
    <br>• <kbd><span id="modLabel">Alt</span> + Left/Right</kbd> = fine step
  </p>

  <script src="options.js"></script>
</body>
</html>
```

---

## `options.js`

```javascript
const DEFAULTS = {
  stepSeconds: 1.0,
  fineStepSeconds: 0.5,
  fineModifier: 'Alt',
  enableOnInputs: false
};

function restore() {
  chrome.storage.sync.get(DEFAULTS, (res) => {
    document.getElementById('stepSeconds').value = res.stepSeconds;
    document.getElementById('fineStepSeconds').value = res.fineStepSeconds;
    document.getElementById('fineModifier').value = res.fineModifier;
    document.getElementById('enableOnInputs').checked = !!res.enableOnInputs;
    document.getElementById('modLabel').textContent = res.fineModifier;
  });
}

function save() {
  const stepSeconds = parseFloat(document.getElementById('stepSeconds').value) || 1.0;
  const fineStepSeconds = parseFloat(document.getElementById('fineStepSeconds').value) || 0.5;
  const fineModifier = document.getElementById('fineModifier').value;
  const enableOnInputs = document.getElementById('enableOnInputs').checked;

  chrome.storage.sync.set({ stepSeconds, fineStepSeconds, fineModifier, enableOnInputs }, () => {
    const s = document.getElementById('status');
    s.textContent = 'Saved';
    setTimeout(() => (s.textContent = ''), 1200);
    document.getElementById('modLabel').textContent = fineModifier;
  });
}

document.getElementById('saveBtn').addEventListener('click', save);

document.getElementById('fineModifier').addEventListener('change', (e) => {
  document.getElementById('modLabel').textContent = e.target.value;
});

document.addEventListener('DOMContentLoaded', restore);
```

---

## Install (Load Unpacked)

1. Save the folder as **`DanceSkipKeys`** with the files above.
2. Open **Chrome** → **chrome://extensions**.
3. Toggle **Developer mode** (top right).
4. Click **Load unpacked** and select the `DanceSkipKeys` folder.
5. (Optional) Open **Extension Options** to tweak step sizes.

---

## Usage

* Focus the page with a video. Click the video once to ensure it’s the active target.
* Use **Left/Right** for ±1.0s, and **Alt + Left/Right** for ±0.5s.
* Hold the key to repeat small nudges while you loop tricky moves.

---

## Notes & Tweaks

* To avoid interfering with form typing, keys are **disabled in inputs** by default. Enable inside options if you want control even while a search box is focused.
* If a site swallows the keys, this script listens in the **capture** phase and calls `preventDefault()` on handled keys to avoid double‑seeks or scrolling.
* If you need **different mappings** (e.g., Up/Down for 0.5s), we can add more bindings.
* Works with multiple videos on a page. The extension picks the **playing** or **largest visible** video; clicking any video makes it the active one.

---

## Troubleshooting

* **No effect?** Ensure there is an actual `<video>` element (some custom players are canvas‑based).
* **Conflicts on specific sites?** Tell me which site; we can add site‑specific guards.
* **Local files**: If you want to use this on `file://` videos, enable “Allow access to file URLs” on the extension card at `chrome://extensions`.

---

## License

MIT
