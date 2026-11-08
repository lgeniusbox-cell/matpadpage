# PulseTV - Fitness & Games Platform for Cobalt & Smart TVs

PulseTV is a high-performance, TV-first interactive fitness and games platform built specifically for **Cobalt** (the lightweight HTML5/CSS/JS engine powering YouTube TV and Android TV web apps) as well as modern desktop browsers via **GitHub Pages**.

---

## 1. Architecture Summary & File Tree

The application is built with **zero external dependencies, zero frameworks, zero build step, and no remote CDNs**. Every component, style, and module is implemented in modular vanilla JavaScript and pure CSS with explicit fallbacks for Cobalt constraints.

```
/
├── index.html                   # TV entry point with strict Cobalt CSP meta tag
├── README.md                    # Deployment guide, Cobalt checklist & compatibility notes
├── css/
│   ├── base.css                 # Reset, 1080p scale, 5% TV-safe margins, focus rings, low-perf mode
│   ├── theme-kids.css           # Playful palette, large 20px radii, warm contrast
│   ├── theme-adult.css          # Obsidian performance dark UI, electric accents, compact metrics
│   └── components.css           # Sidebar rail, hero billboard, 16:9 rows, modals, keyboard, HUD
├── js/
│   ├── compat.js                # Feature detection matrix & storage/RAF polyfills
│   ├── storage.js               # profiles_v1 & settings_v1 with in-memory fallback
│   ├── audio.js                 # Web Audio synthesizer, UI chimes, procedural workout music
│   ├── profiles.js              # 12 Kid & 12 Adult illustrated SVG avatars, validation, theme switch
│   ├── input.js                 # TV D-pad spatial focus engine, key codes, long-press handler
│   ├── router.js                # Screen manager, sub-routes, modal stack, remote Back key handler
│   ├── ui/
│   │   ├── keyboard.js          # On-screen TV keyboard with A-Z, 0-9, Space, Backspace, Clear, Done
│   │   ├── number-picker.js     # Number stepper for Age (4-99) & Weight (15-200kg)
│   │   ├── diagnostics.js       # Live FPS telemetry, Cobalt detection, viewport metrics
│   │   ├── sidebar.js           # YouTube TV-style collapsible left rail (96px -> 300px)
│   │   ├── hero.js              # Cinematic featured billboard with dynamic workout actions
│   │   ├── rows.js              # Horizontal 16:9 banner rows with translate3d hardware scrolling
│   │   ├── music-player.js      # Slide-in workout music playlist drawer & controls
│   │   ├── toast.js             # Non-intrusive TV notification alerts
│   │   ├── profiles-view.js     # Profile grid & 5-step creation wizard
│   │   ├── game-modal.js        # Game detail & interactive live workout minigame
│   │   └── main-content.js      # Sub-routes (Games, Virtual Run, Relaxing, Cardio, Coaches, AI Coach, Settings)
│   └── app.js                   # Master bootstrap, splash fade, 30s clock timer
└── assets/
    ├── logo.png                 # Standalone binary PNG logo
    ├── avatars/                 # Standalone SVG avatar assets
    ├── banners/                 # Standalone SVG banner artwork
    └── audio/                   # Directory for optional MP3/OGG music files
```

---

## 2. GitHub Pages Deployment Guide

Deploying PulseTV on GitHub Pages takes under 60 seconds because all assets, styles, and scripts use **clean relative paths (`./`)** with zero build requirements:

### Step-by-Step GitHub Pages Deployment:
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy PulseTV for Cobalt and GitHub Pages"
   git push origin main
   ```
2. **Enable GitHub Pages**:
   - Navigate to your repository on GitHub.
   - Click **Settings** → **Pages** (under Code and automation).
   - Under **Build and deployment**:
     - **Source**: Select `Deploy from a branch`.
     - **Branch**: Select `main` (or your default branch) and `/ (root)`.
     - Click **Save**.
3. **Open Your Live Site**:
   - GitHub Pages will publish your site to `https://<username>.github.io/<repo-name>/`.
   - Open this URL directly on your desktop, mobile browser, or smart TV browser.

---

## 3. Cobalt & Android TV Testing Checklist

Cobalt runs inside Android TV APK packages (such as Starboard/Cobalt runtime). Follow this checklist to test and validate on hardware:

### Testing Checklist:
- [ ] **Remote D-Pad Navigation**:
  - `ArrowUp` (38), `ArrowDown` (40), `ArrowLeft` (37), `ArrowRight` (39).
  - Test spatial navigation across cards and verify focus transitions seamlessly from the leftmost card into the Left Sidebar.
  - Test that moving Right from the Left Sidebar seamlessly focuses the content billboard/cards.
- [ ] **OK / Enter Key**:
  - `Enter` (13) or `Space` (32) activates the focused button or card.
  - Hold `OK` for 700ms on any profile card to open the **Profile Options / Delete** dialog.
- [ ] **Back Key Handling**:
  - `Escape` (27), `Backspace` (8), or TV Key Code `461` / `10009`.
  - Pressing Back dismisses active modals first, closes the music overlay, returns from sub-pages (e.g. Settings or Virtual Run) back to Games, and navigates from Main back to Profile Selection.
- [ ] **Diagnostics HUD**:
  - Press **Up, Up, Down, Down** on the remote D-pad, or press key **D**, or press the TV **Red Key** (403), or open URL with `?debug=1`.
  - Verify live FPS meter (targets 30–60 fps).
  - Verify API detection matrix indicates green for all available features.
- [ ] **Low-Performance Mode**:
  - In **Settings** → **Cobalt TV Performance**, toggle **Low-Performance Mode**.
  - Confirms all transforms and animations are suspended to prevent dropped frames on low-power quad-core ARM chips.
- [ ] **Audio Autoplay Resilience**:
  - Ensure splash screen shows "Press OK to Start" prompt if browser blocks unmuted audio.
  - Verify UI sound effects and procedural workout music synthesize smoothly without external MP3 dependencies.

---

## 4. Compatibility Notes

| Feature / API | Detection Method | Fallback Strategy on Cobalt |
| :--- | :--- | :--- |
| **LocalStorage** | Wrapped test `setItem`/`getItem` in `try/catch` | Memory-based key/value dictionary (`PulseTV.compat.safeStorage`) |
| **Web Audio API** | `window.AudioContext \|\| window.webkitAudioContext` | HTML5 Audio element fallback; silent fallback if neither exists |
| **requestAnimationFrame** | `typeof window.requestAnimationFrame === 'function'` | `setTimeout(callback, 16)` polyfill with `clearTimeout` |
| **CSS Custom Properties** | `CSS.supports('color', 'var(--test, #000)')` | Dual CSS declarations: hardcoded fallback property immediately preceding variable property |
| **CSS 3D Transforms** | `CSS.supports('transform', 'translate3d(0,0,0)')` | 2D `translateX/translateY` or relative position offsets |
| **CSS Flexbox** | `CSS.supports('display', 'flex')` | Block-level margins and inline-block table elements |
| **File API (Upload)** | `'FileReader' in window && 'FileList' in window` | Custom photo button is hidden automatically on TV hardware lacking file picker |
| **TV Overscan Safe Area** | CSS padding `5vh 5vw` with explicit px fallback | Protects all UI controls from edge clipping on 720p, 1080p, and 4K TV monitors |
| **Content Security Policy** | Strict `<meta>` tag | `default-src 'self' data: blob:; script-src 'self' 'unsafe-inline'; ...` ensures zero remote script leakage |
