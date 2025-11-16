# Dance Skip Keys — Chrome Extension

Control HTML5 videos with precise keyboard shortcuts for stepping and (planned) loop points. Ideal for practicing choreography and scrubbing through tutorials.

---

## What This Extension Does

- **Arrow key stepping**
  - **Left / Right Arrow**: jump backward / forward by a configurable number of seconds (default `1.0s`).
  - **Modifier + Left/Right** (e.g. `Alt` by default): jump by a smaller, fine-grained step (default `0.5s` or `1.0s`, configurable).
- **Video selection**
  - Works with most pages that use standard `<video>` elements (YouTube, embedded players, etc.).
  - Automatically targets the **currently playing** or **largest / most visible** video, and you can click a video to make it active.
- **Options page**
  - Configure:
    - Coarse step size (seconds).
    - Fine step size (seconds).
    - Modifier key for fine steps.
    - Whether controls should work inside inputs / editable fields.
- **Planned feature: A–B loop points**
  - Set A and B points to loop a specific section of a video (see `docs/FEAT_A-B-loopopoints.md`).

---

## Installation (Load Unpacked in Chrome)

1. **Clone or download the repository**

   ```bash
   git clone <your-repo-url> TL-chromeExt_KD-YT-helper
   cd TL-chromeExt_KD-YT-helper
   ```

2. **Open Chrome Extensions page**

   - In Chrome, go to: `chrome://extensions/`
   - Enable **Developer mode** (toggle in the top-right corner).

3. **Load the extension**

   - Click **"Load unpacked"**.
   - Select the folder: `TL-chromeExt_KD-YT-helper` (the folder containing `manifest.json`).
   - The extension should now appear in your extensions list.

4. **Pin the extension (optional)**

   - Click the puzzle-piece icon in the toolbar.
   - Pin the extension for quick access.

---

## Using the Extension

1. **Go to a site with video**
   - Example: YouTube or any page with a standard HTML5 `<video>` element.

2. **Keyboard controls**
   - Use **Left / Right Arrow** keys to nudge the video backward / forward.
   - Use the **configured modifier + arrows** for finer steps.

3. **Configure options**
   - Right-click the extension icon → **Options**
     or open the options page from `chrome://extensions/` → this extension → **Extension options**.
   - Adjust step sizes, modifier key, and input behavior to your liking.

---

## Project Structure

- `manifest.json` — Chrome extension manifest and permissions.
- `content.js` — Content script that hooks into pages and controls videos.
- `options.html` / `options.js` — Options UI and persistence via `chrome.storage.sync`.
- `icons/` — Extension icons.
- `docs/` — Documentation for specific features, including A/B loop planning.

---

## Development Notes

- This repo uses a simple, content-script-based architecture following common Chrome extension patterns.
- Aim to keep behaviors consistent across sites and avoid injecting heavy UI.
- For details on the A/B loop feature design and implementation, see:
  - `docs/FEAT_A-B-loopopoints.md`

---

## Contributing

1. Create a feature branch (example):

   ```bash
   git checkout -b feat/ab-loop-points
   ```

2. Make your changes and add tests or manual test cases as relevant.

3. Stage and commit:

   ```bash
   git add .
   git commit -m "feat: brief description of change"
   ```

4. Push and open a pull request if using a remote:

   ```bash
   git push -u origin feat/ab-loop-points
   ```
