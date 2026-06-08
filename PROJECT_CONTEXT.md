# 📝 Project Context: 05dig.it

This document serves as a persistent context log for the official artist website `05dig.it`. It details the architecture, design decisions, current status, and active tasks. **Always refer to this file first when resuming work or onboarding new agents.**

---

## 🚀 Live Site Information
* **URL:** [https://05dig.it](https://05dig.it)
* **Hosting:** Vercel (`05digits-projects/05dig.it` in project settings)
* **DNS Manager:** Vercel DNS settings
* **Github Repository:** [https://github.com/05digit/05digit-website.git](https://github.com/05digit/05digit-website.git)
* **Primary Branch:** `main`

---

## 🎨 Layout & Architecture Summary

### 1. Multimedia Hub Design
* **3-Column Deck Layout (Symmetrical):**
  * **Left (25% width):** Vertically-centered Cover Art container & bigger colored streaming redirection links (Spotify, Apple Music, YouTube).
  * **Center (50% width):** YouTube frame embed with side vertical audio controls (Unmute & Custom volume slider) that scales dynamically to match the player height.
  * **Right (25% width):** Interactive Tracklist with direct audio controls.
* **Animated Collapsing Deck:** 
  * The site loads in a collapsed state showing only the official artist trailer in a larger centered layout.
  * Clicking `"MORE MUSIC"` triggers a symmetrical transition animating the Left (Cover Art) and Right (Tracklist) columns outwards.

### 2. Branding & Font Configuration
* **Font:** Standard monospace (`font-mono`) for details and control labels, and custom distressed font **`Sidewalk`** (`font-sidewalk` mapped to `/public/fonts/sidewalk.ttf` in global CSS) for headings and branding names.
* **Branding:** Changed lingo from edgy placeholders to standard branding (`// BIO`, `// CONNECT`, `NOW PLAYING`).

---

## 🛠️ Key Technical Implementations & Code Solutions

### 1. Nav Bar Text Fringing Fix (`page.tsx`)
* **Problem:** Changing the text color of the lowercase `digit` logo from `#f5f5f5` to `#ff003c` on hover left behind white subpixel antialiasing fringes against the black background.
* **Solution:** Used Tailwind arbitrary properties to transition a WebKit text stroke alongside the text color:
  ```tsx
  <span className="... text-[#f5f5f5] [-webkit-text-stroke:0.5px_#f5f5f5] hover:text-[#ff003c] hover:[-webkit-text-stroke:0.5px_#ff003c] transition-all duration-300">
    digit
  </span>
  ```

### 2. Custom Vertical Volume Dragging (`src/components/VolumeSlider.tsx`)
* Extracted the vertical volume slider dragging and mute state loop into a separate component to isolate local state, preventing 60+ full-page global React re-renders per second during active dragging.

### 3. Dynamic Sitemap & Robots Configuration
* Configured dynamic App Router sitemaps (`src/app/sitemap.ts`) and robots configurations (`src/app/robots.ts`) generating index maps live on production build:
  * Robots endpoint: `https://05dig.it/robots.txt`
  * Sitemap endpoint: `https://05dig.it/sitemap.xml`

### 4. Dynamic Album-Reactive Themes (`globals.css` & `page.tsx`)
* Dynamically sets inline CSS variable `--theme-color` on the root page container based on the selected track's theme configurations. Tailwind v4 color theme utility `theme-accent` maps to this variable, automatically adjusting selection borders, glow shadows, buttons, active track states, and logo glows on hover.

### 5. Scroll-Reveal Viewport Animations
* Implemented a lightweight `IntersectionObserver` hook inside `page.tsx` to automatically append a `.revealed` class to elements carrying `.reveal`. CSS properties transition elements smoothly via custom cubic-bezier curves for a premium visual flow as the page is scrolled.

---

## 🪵 Log of Major Decisions (Architectural History)

* **Canvas Visualizer Removal:** Completely deleted the simulated/fake audio canvas visualizer loop (and matching `createLinearGradient` calls) from the UI to optimize performance and prevent fake visuals from bloating the DOM.
* **HTML5 Audio Fallback Removal:** Removed native `<audio>` element pipelines entirely. Track controls (play, pause, next, select, volume) are now wired directly to the embedded YouTube Player IFrame API.
* **Cleaned Metadata:** Cleaned guest artists into a separate `feature` property and fixed the album metadata for `"perfect"` to render `"apakau x perfect (2024)"` instead of the filename stem `"perfect v4 (2024)"`.

---

## 📋 Pending Tasks & Optimization Roadmap

### 1. Code Quality Optimization (Playback Control Duplication)
* **Owner:** Refactoring/code quality agents
* **Goal:** Merge duplicate unmuting, volume adjustments, and iframe video-loading logic shared between `selectTrack` and `handleToggleTrailer` in `src/app/page.tsx` into a single helper method: `playVideoById(videoId: string)`.

### 2. Google Search Console & Indexing
* **Owner:** Project Owner / Developer
* **Status:** Site verified via Vercel TXT records.
* **Action Required:** Submit the `sitemap.xml` on Google Search Console, trigger a manual Inspection on `https://05dig.it/`, and request immediate indexation.
