# Messi the GOAT

An interactive Lionel Messi fan archive built with React, TypeScript, Vite, and Tailwind CSS. It includes career and achievement timelines, searchable season statistics, an iconic-moments gallery, a tactical pitch visualizer, a trophy cabinet, quotes, a quiz, and a local goal-voting demo.

## Run locally

Use Node.js 22.12+ (or a current Node.js 24 LTS release) and Bun 1.4+ (tested with 1.4.4). The repository's `bun.lock` uses lockfile format 2, which requires Bun 1.4 or newer.

```sh
bun install --frozen-lockfile
bun run dev
```

Open the local URL printed by Vite, normally `http://localhost:3000`.

The current interface is a client-side app. It does not need an API key, database, or `.env` file. Do not put secrets in client-side code or commit a populated environment file.

## Validate changes

```sh
bun run test    # Node test runner with TypeScript support
bun run lint    # TypeScript type-checking (tsc --noEmit)
bun run build  # Production bundle in dist/
```

`npm run check` runs all three checks once dependencies have been installed with Bun. `bun run preview` serves the production build locally.

Use the frozen Bun install for reproducibility. A fresh `npm install` is also supported, but it may select newer dependency versions within the ranges in `package.json`. Keep `bun.lock` as the repository's single committed lockfile.

## Vercel build settings

For this static app, use the Vite framework preset, the repository root, the `build` script, and `dist` as the output directory. No server runtime or environment secrets are required.

Vercel detects `bun.lock` and installs dependencies with Bun. Its Bun version must support lockfile format 2. Keep the verified-commit requirement enabled and use signed commits for deployment. Check deployment logs before changing project configuration; a canceled deployment is not necessarily a build error.

## Project layout

- `src/App.tsx`: page composition, section navigation, and gallery-dialog state.
- `src/components/`: the archive's visual sections and interactive controls.
- `src/data/messi-data.ts`: curated archive text, statistics, and sample poll counts.
- `src/types/messi.ts`: shared data types.
- `src/utils/`: calculation, animation, and sound helpers, with unit tests.
- `src/index.css`: shared styles, navigation offsets, and reduced-motion overrides.

## Goal vote behavior

The goal poll is a local demo, not a live global tally. Its starting counts are illustrative sample data. The app stores only the selected goal ID in this browser's local storage, then derives the displayed totals as the sample baseline plus at most one local vote.

Selecting the same goal again does not add another vote. Changing or clearing a choice preserves the baseline, and reloading restores a valid choice. Invalid or removed goal IDs are ignored. When browser storage is blocked, voting still works for the current visit and the interface explains that the choice cannot be saved.

A real shared poll would require a backend and server-side validation; this app does not send votes to a server.

## Navigation and accessibility

- A skip link moves keyboard focus to the main content.
- Section links can be bookmarked and opened in a new tab. The active navigation item follows scrolling, and section offsets account for the sticky header.
- The mobile menu supports Escape and restores focus to its toggle.
- Gallery details use a native modal dialog with initial focus, keyboard containment, Escape/backdrop dismissal, and focus restoration.
- Reduced-motion preferences disable smooth section scrolling and decorative CSS animation. Poll confetti also respects that preference.

For UI changes, manually check desktop and mobile navigation, browser Back/Forward, modal Tab/Shift+Tab and dismissal, plus repeated votes, reload, change, clear, and blocked-storage behavior. Unit tests and a successful build do not replace those browser checks.

## Content and assets

Statistics and editorial material are bundled snapshots, not a live feed. Verify new factual claims against reliable sources before updating them, and keep their dates and scope clear. Images, fonts, and highlight links may depend on external services. This is an unofficial fan project, not an official player, club, or competition site.
