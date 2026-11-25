# DevTube

A focused, distraction-free "YouTube" for learning tech: the best AI/ML, software engineering and computer science
videos, **sorted by topic and difficulty**, with **learning paths** that tell you what to watch next.

## What's inside

- **1,141 videos.** 1,067 are YouTube videos that got ≥50 points on Hacker News (2007–2026), collected through the HN
  Algolia API. 74 are hand-picked beginner classics (3Blue1Brown, Karpathy's Zero to Hero, CS50, freeCodeCamp, MIT
  OCW, Missing Semester…).
- Every video was checked against YouTube oEmbed when the dataset was built. Deleted, private and embed-blocked videos
  were dropped.
- **19 categories** in 4 groups (Foundations, Building Software, Under the Hood, Beyond Code), and **3 levels**
  (Beginner / Intermediate / Advanced).
- **9 learning paths** (Neural Networks from Zero, Understanding LLMs, Math for ML, Programming from Scratch, Web Dev,
  How Computers Work, Developer Toolbox, Systems at Scale, Think Like a Great Engineer).
- **"My level"** setting: home shelves and category pages adapt to it. Videos far above your level are hidden.
- "Up next" recommendations favor the same topic at the same level or one step up, plus a **"Ready to level up?"** pick.
- Watched / watch-later / path progress is stored in `localStorage`. There are no accounts and no tracking.
- No YouTube API key. Videos play through the `youtube-nocookie.com` embed player.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # all ~1,180 pages are prerendered
```

## Data

`src/data/videos.json` and `src/data/paths.json`. Each video looks like:

```json
{ "id": "aircAruvnKk", "title": "...", "channel": "3Blue1Brown", "category": "ai-ml",
  "tags": ["ai-ml"], "level": "beginner", "points": 136, "comments": 9, "hnId": "...", "hnYear": 2017, "curated": true }
```

Categories and levels come from keyword rules over the HN and YouTube titles and channel names, followed by a manual
review pass (off-topic videos removed, wrong categories fixed, key videos given a level by hand). To add or recategorize
a video, edit the JSON. Category metadata lives in `src/lib/meta.ts`.

## Structure

```
src/app/            page (home), browse, c/[slug], watch/[id], paths, paths/[slug], library
src/components/     AppShell, Sidebar, Shelf, VideoCard, VideoGrid, PathCard, PathNav, ...
src/lib/meta.ts     types, categories, levels, sorting (client-safe, no data)
src/lib/data.ts     video/path data + recommendation logic (server)
src/lib/store.ts    localStorage-backed progress store (useSyncExternalStore)
```
