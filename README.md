# DevTube

A focused, distraction-free "YouTube" for learning to build things: AI, software, computer science, electronics,
robotics, space and the physics underneath. Videos are **sorted by topic and difficulty**, with **learning paths** and
**full courses** that tell you what to watch next.

## What's inside

**5,977 videos**, from four kinds of sources:

| Source | Videos | How they were chosen |
| --- | ---: | --- |
| Hacker News | 1,436 | YouTube links with ≥50 points (2007–2026), plus 20–49 point posts from trusted channels only. Every one hand-reviewed. |
| Lobsters | 233 | YouTube links scoring ≥20 (or ≥8 from trusted channels), hand-reviewed. |
| Curated channels | 3,699 | The most-viewed uploads and deeper back catalogs of ~140 allowlisted channels (3Blue1Brown, Ben Eater, Veritasium, Practical Engineering, Brian Douglas, Everyday Astronaut, Asianometry, LiveOverflow…), hand-reviewed to remove off-topic, clickbait and filler. |
| Full courses | 542 | Complete lecture series in order (Harvard CS50, MIT 6.006 / 18.06 / 6.824, CMU 15-445, Stanford CS231n, Crash Course, Ben Eater's 8-bit computer, Control Bootcamp, Modern Robotics…). |
| Beginner classics | 67 | Hand-picked starting points. |

- **25 topics** in 5 groups: Foundations, Build the Future (Robotics, Electronics, Space & Aero, Physics & Energy,
  Engineering, Maker Projects), Building Software, Under the Hood, Beyond Code. Each topic has **sub-topics**
  (e.g. AI & ML → LLMs & transformers, Classic ML & statistics…), defined in `src/data/subcategories.json`.
- **Home** is a YouTube-style random feed of everything, tuned to your level, with search, a level filter, a topic
  filter and sort options (popular, most upvoted, most discussed, newest…) for when you want something specific.
  All of it lives in the URL (`/?q=kalman&sort=popular`), so any view can be shared. **Categories** shows every topic and
  sub-topic as a grid; each opens the same random feed filtered to it. Special views: Long watches, Short & sweet,
  Hidden gems, Inspiration.
- **3 levels** (Beginner / Intermediate / Advanced). "My level" makes home shelves and topic pages adapt.
- **15 learning paths** (e.g. Neural Networks from Zero, Electronics from Zero, How Rockets Work, Control Theory &
  Robotics, From Sand to Silicon) and **31 full courses**, all with progress tracking and a Next button. Paths hold only
  the essentials; each path page ends with **extras**: "Good to know" (same level) and "Go deeper" (harder), picked by
  how closely they relate to the path's videos.
- Spectacle videos (launches, robot demos) are tagged **Inspiration** and kept out of learning paths.
- Every video was checked against YouTube oEmbed (deleted, private and embed-blocked videos were dropped) and has its
  length.
- Watched / watch-later / progress is stored in `localStorage`. No accounts, no tracking, no YouTube API key.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # ~6,200 pages are prerendered
```

## Data

`src/data/videos.json` and `src/data/paths.json`. Each video looks like:

```json
{ "id": "aircAruvnKk", "title": "...", "ytTitle": null, "channel": "3Blue1Brown", "category": "ai-ml",
  "tags": ["ai-ml"], "level": "beginner", "points": 136, "comments": 9, "hnId": "...", "year": 2017,
  "curated": true, "duration": 1120, "source": "hn", "views": null,
  "lbScore": 12, "lbId": "abc123", "inspire": false, "course": "Neural networks", "sub": "neural-networks" }
```

- `source`: `hn`, `lobsters`, `channel`, `course` or `curated`.
- `points` / `comments` / `hnId` are Hacker News data; `lbScore` / `lbId` are Lobsters data (optional).
- `views` is the YouTube view count at build time (curated channels and courses only).
- `year` is the HN/Lobsters posting year, or the approximate upload year for curated videos.
- `duration` is the length in seconds, read from the public YouTube page.

Paths in `paths.json` have `"kind": "path"` (hand-built, across channels) or `"kind": "course"` (a lecture series in
its original order, with an `org`).

Categories and levels come from keyword rules over titles and channel names, followed by manual review passes. To add or
recategorize a video, edit the JSON. Category metadata lives in `src/lib/meta.ts`.

## Structure

```
src/app/            page (home feed), categories, c/[slug], c/[slug]/[sub], watch/[id], paths, paths/[slug],
                    library, feed.json (static data for the feeds)
src/components/     AppShell, Sidebar, Shelf, VideoCard, VideoGrid, PathCard, PathNav, UpNext, ...
src/lib/meta.ts     types, categories, levels, sorting (client-safe, no data)
src/lib/data.ts     video/path data + recommendation logic (server)
src/lib/store.ts    localStorage-backed progress store (useSyncExternalStore)
```
