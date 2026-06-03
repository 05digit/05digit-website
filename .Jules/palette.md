## 2024-06-03 - Missing ARIA Labels on Icon-only Playback Controls
**Learning:** Found that custom media player controls (SkipBack, SkipForward) implemented as icon-only buttons lacked accessible names, making them invisible or unclear to screen reader users.
**Action:** Always ensure icon-only interactive elements have descriptive `aria-label` attributes.
