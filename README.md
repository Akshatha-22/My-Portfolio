# Akshatha Dungi — Developer Portfolio

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Built with React](https://img.shields.io/badge/built%20with-React%2018-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-r128-black?logo=three.js)](https://threejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-CDN-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

A modern, responsive developer portfolio with an interactive Three.js starfield background, radar skill graph, blog, and Web Audio click sounds. No build tools — runs directly in the browser.

🔗 **Live Demo:** https://akshatha-22.github.io/My-Portfolio/git

---

## Features

- **Three.js Starfield** — Deep-field parallax background with 8000+ stars and animated particles
- **Dark / Light Mode** — Persistent theme toggle with smooth CSS variable transitions
- **Radar Skill Graph** — Interactive SVG spider chart visualising technical proficiency across 8 skill axes
- **Project Cards** — Filterable project grid with measurable results, tech stack logos via Devicons, and GitHub/live links
- **Blog** — Read-only for visitors with per-card expand/collapse. Author mode unlocked via a 5-tap secret on the section heading (session only, no login needed)
- **Liquid Buttons** — Morphing hover effect on all interactive buttons sitewide
- **Click Sounds** — Web Audio API synthesised sounds on all button interactions (no audio files required)
- **Contact Inbox** — Visitor messages saved to localStorage; owner can view and delete via a hidden inbox
- **Fully Responsive** — Optimised for desktop, tablet, and mobile

---

## Tech Stack

| Category | Technology |
|---|---|
| UI Framework | React 18 (UMD, no build step) |
| Styling | Tailwind CSS (CDN) + custom CSS variables |
| 3D / Animation | Three.js r128 |
| Fonts | Orbitron, Share Tech Mono (Google Fonts) |
| Icons | Devicons CDN (tech stack logos) |
| Storage | localStorage via a thin `window.storage` wrapper |
| Audio | Web Audio API (synthesised, zero dependencies) |
| Deployment | Any static host — GitHub Pages, Netlify, Vercel |

---

## Project Structure

```
digital-portfolio/
├── index.html        # Entire React app — components, styles, and logic inline
├── style.css         # Global CSS, theme variables, animations, utility classes
├── three-bg.js       # Three.js scene factories (starfield, planet, solar system)
├── mei.jpeg          # Profile photo
└── README.md
```

> All React components live inside a single `<script type="text/babel">` block in `index.html`. No bundler, no node_modules — open the file and it runs.

---

## Sections

| Section | Description |
|---|---|
| Hero | Name, animated role ticker, CTA buttons, Three.js starfield |
| About | Bio, spinning planet animation, music player easter egg |
| Experience | Timeline of work history and achievements |
| Projects | Filterable cards with results metrics and tech logos |
| Skills | Radar/spider chart + categorised skill pills |
| Certifications | Certification cards with issuer and year |
| Blog | Owner-authored posts; visitors get truncated preview with read more |
| Contact | Message form saved to localStorage; owner inbox |

---

## Running Locally

No install required. Just serve the files over HTTP (required for audio and Three.js to initialise correctly):

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

Then open `http://localhost:8080` in your browser.

> Opening `index.html` directly via `file://` will work visually but may block the audio player due to browser autoplay policies.

---

## Blog — Author Mode

The blog is read-only for visitors. To write and publish posts from your own browser:

1. Click the **"Blog"** section heading **5 times within 2 seconds**
2. An "Add Post" form and delete icons appear
3. Author mode resets on page refresh — it is never visible to visitors

Posts are persisted to `localStorage` under the key `blog_posts`.

---

## Customisation

All personal content is defined as data objects near the top of the `<script type="text/babel">` block in `index.html`:

- **Projects** — edit the `projects` array (title, description, tags, results, github, live)
- **Experience** — edit the `experiences` array
- **Certifications** — edit the `certs` array
- **Skills** — edit the `categories` array and radar chart `skillData` values
- **Profile photo** — replace `mei.jpeg` (keep the same filename or update the `src` in the About component)
- **Music** — replace the `.mp3` file and update the `new Audio(...)` path in the About component

---

## Deployment

The portfolio is a static site — deploy by uploading the four files to any static host:

```
index.html
style.css
three-bg.js
mei.jpeg
```

**GitHub Pages:** push to a repo, enable Pages from the `main` branch root.  
**Netlify / Vercel:** drag-and-drop the folder in the dashboard.

---

## License

MIT — free to use and adapt with attribution.
