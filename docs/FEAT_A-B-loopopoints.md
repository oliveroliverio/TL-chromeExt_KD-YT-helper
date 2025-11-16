# Feature: A–B Loop Points for YouTube

This document describes the plan and implementation details for adding A/B loop points to the Dance Skip Keys Chrome extension.

---

## Goal

Allow the user to:

- **Set point A**: the loop start time on the currently active YouTube video.
- **Set point B**: the loop end time.
- **Toggle looping**: automatically loop playback between A and B until disabled.

This should integrate with the existing keyboard control system and respect per-site video selection logic.

---

## UX & Controls

- **Key bindings (proposed)**
  - **`L`**: toggle A–B loop on/off (when A and B are already set).
  - **`Shift + [Left Arrow]`**: set **point A** at the current playback time.
  - **`Shift + [Right Arrow]`**: set **point B** at the current playback time.

- **Visual feedback (minimal)**
  - Brief text overlay near the video:
    - `Loop A set at 01:23`
    - `Loop B set at 01:45`
    - `Loop enabled 01:23–01:45`
    - `Loop cleared`

- **Persistence**
  - Loop A/B points live only for the **current tab + video URL**.
  - Reset when:
    - Page is reloaded
    - Video src changes
    - User explicitly clears loop (e.g., pressing `L` when loop is active).

---

## High-Level Design

### 1. Data model

For the active video element:

- `loopPoints = { a: number | null, b: number | null, enabled: boolean }`
- Bound to the **content script**, not stored in `chrome.storage`.

### 2. Event handling

Reuse the existing keyboard event pipeline in `content.js`:

- Extend the current keydown handler to:
  - Detect **Shift + Left Arrow** → set A.
  - Detect **Shift + Right Arrow** → set B.
  - Detect **L** (without modifiers) → toggle loop enabled/disabled.

Keep this logic consistent with the current `stepSeconds`, `fineStepSeconds`, and modifier behavior.

### 3. Loop enforcement

- Listen to the `timeupdate` event on the active `<video>` element.
- When `loopPoints.enabled` and both `a` and `b` are non-null:
  - If `video.currentTime > loopPoints.b`, then set `video.currentTime = loopPoints.a`.

Edge cases:

- If `b <= a`, treat as invalid:
  - Disable loop.
  - Show overlay: `Loop range invalid; B must be after A`.

### 4. Integration with active video selection

Use the existing logic that picks the active video (currently playing / largest, etc.):

- Attach listeners (`timeupdate`) when the active video is chosen.
- If the active video changes, clear prior listeners and reset `loopPoints`.

---

## Implementation Plan

1. **Branching**
   - Create feature branch from `main`:
     - `git checkout -b feat/ab-loop-points`

2. **Content script changes (`content.js`)**
   - Add `loopPoints` state and helper functions:
     - `setLoopPointA(video)`
     - `setLoopPointB(video)`
     - `toggleLoop(video)`
     - `clearLoop(video)` (optional helper)
   - Extend keyboard handler to recognize the new shortcuts.
   - On active video selection, attach `timeupdate` listener to enforce looping.

3. **UI feedback**
   - Implement a lightweight overlay mechanism:
     - Create or reuse a small DOM element injected into the page for status messages.
     - Functions like `showStatusMessage("Loop A set at 01:23")` with auto-fade.

4. **Options (optional future work)**
   - Add options page controls to configure A/B shortcut keys.
   - Persist user preferences in `chrome.storage.sync`.

5. **Testing**
   - Test on YouTube:
     - Short videos
     - Long videos
     - Changing playback speed (ensure loop still behaves).
   - Test on other sites (e.g., generic HTML5 players) to ensure no errors if loop keys are pressed.

---

## Git Workflow

Commands to create and work on the feature branch:

```bash
# Ensure main is up to date
git checkout main

# Create and switch to feature branch
git checkout -b feat/ab-loop-points

# After implementing changes
git status

# Stage changes
git add content.js manifest.json docs/FEAT_A-B-loopopoints.md README.md

# Commit
git commit -m "feat: add A/B loop points feature"

# Push (if remote exists)
git push -u origin feat/ab-loop-points
```

This document should be updated as decisions change during implementation.
