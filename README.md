# Messi the GOAT

An interactive Lionel Messi fan archive built with React, TypeScript, Vite, and Tailwind CSS. It preserves the original career and achievement timelines, biography, searchable statistics, trophy cabinet, quotes, quiz, local goal poll, and archive-wide search. The visual experience uses Argentina white and sky blue, Barcelona accents, real licensed Messi photographs, and a new interactive playbook lab.

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

## Interactive lab and controls

The new Messi lab explores three historical plays through **illustrative**, not measured, SVG movement paths. Play, pause, replay, scrub, step between phases, and choose the playback speed. Optional auto-next runs through the remaining plays once and then stops. Nothing auto-starts on arrival.

Playback pauses when the lab leaves the screen or the browser tab is hidden. Reduced-motion preferences replace animation with manual phase controls and disable auto-next. Sound effects are off by default and can be enabled from the header. The original goal simulator is preserved in an expandable section under the new lab.

Archive-wide search opens with the header button, Command/Ctrl+K, or `/` outside an editable field. Search can navigate to a biography chapter, season, trophy, or gallery moment.

## Goal vote behavior

The goal poll is a local demo, not a live global tally. Its starting counts are illustrative sample data. The app stores only the selected goal ID in this browser's local storage, then derives the displayed totals as the sample baseline plus at most one local vote.

Selecting the same goal again does not add another vote. Changing or clearing a choice preserves the baseline, and reloading restores a valid choice. Invalid or removed goal IDs are ignored. When browser storage is blocked, voting still works for the current visit and the interface explains that the choice cannot be saved.

A real shared poll would require a backend and server-side validation; this app does not send votes to a server.

## Navigation and accessibility

- A skip link moves keyboard focus to the main content.
- Section links can be bookmarked and opened in a new tab. The active navigation item follows scrolling, and section offsets account for the sticky header.
- The mobile menu supports Escape and restores focus to its toggle.
- Gallery details use a native modal dialog with initial focus, keyboard containment, Escape/backdrop dismissal, and focus restoration.
- The section-sharing feature from the AI Studio project is preserved. Header, footer and original-lab actions open a native dialog with direct links, optional post snippets and user-initiated sharing. Copy feedback reflects whether the clipboard operation actually succeeded; closing or switching sections cancels stale feedback. Historical share text is labeled as an archive snapshot, not current totals.
- Reduced-motion preferences disable smooth section scrolling and decorative CSS animation. Poll confetti also respects that preference.

For UI changes, manually check desktop and mobile navigation, browser Back/Forward, global search, modal Tab/Shift+Tab and dismissal, image loading, lab play/pause/scrub/auto-next and interrupted playback, plus repeated votes, reload, change, clear, and blocked-storage behavior. Unit tests and a successful build do not replace those browser checks.

## Content and assets

Statistics and editorial archive material are bundled snapshots, not a live feed. Verify new factual claims against reliable sources before updating them, and keep their dates and scope clear. Five real photographs are hosted locally in `public/photos/` as optimized WebP files. Their source, creator, Creative Commons license, and adaptation notices are in `public/photos/CREDITS.md` and the visible site footer. Gallery photographs are explicitly labeled as contextual archive imagery when they do not depict the named event. Keep those notices when reusing the images; the CC BY-SA photograph retains its share-alike license. This is an unofficial fan project, not an official player, club, or competition site.

## On-site coverage and video

`/api/messi-news` is a Vercel Node function that fetches only the fixed [Guardian Messi RSS feed](https://www.theguardian.com/football/lionel-messi/rss). The site displays up to six headlines, preserving bylines, publication dates, source links and the required credit. Combined headline text stays below 100 words; descriptions, full articles and publisher images are not redistributed. This noncommercial fan-site use follows the [Guardian Open Licence](https://www.theguardian.com/info/2022/nov/01/open-licence-terms). Reassess the licence before adding advertising or commercial features.

Successful responses are cached; the visible page checks about every 30 minutes and offers a manual refresh. Article dates and the last successful feed retrieval time are separate. Coverage is not comprehensive breaking news or live scores. Source failures show an honest unavailable state, or keep previously loaded cards with a warning, without breaking the archive or lab. No API key, cron or database is required. Plain Vite development/preview serves only the frontend; use a Vercel preview deployment to exercise the function end-to-end.

Six selected moments have verified official-publisher or broadcaster YouTube embeds. Videos load on demand via `youtube-nocookie.com`, never autoplay audio, and unload when the player or moment closes. Each retains an original-source link because publisher and regional restrictions can prevent playback. Other moments clearly offer archive search, not an unrelated video. Video availability was checked on 25 October 2026 and may change.

Core photographs, archive content and lab assets are hosted with this app. Fresh news, embedded videos and web fonts still use external services; the site does not promise full offline operation.

## Search indexing

The canonical public URL is `https://messi-the-goat.vercel.app/`. `public/robots.txt` permits crawling and points to `public/sitemap.xml`, which lists the actual homepage, not fragment-only archive sections. Search Console ownership verification and indexing requests are separate actions; these files alone do not verify ownership or guarantee search inclusion.

## Editing from Google AI Studio and GitHub

The original AI Studio project is linked to this repository. Finish and preserve any running AI Studio work before pulling remote updates; inspect its GitHub sync status rather than overwriting either side. Re-fetch `main` and integrate concurrent changes before merging a preview branch. Keep Vercel's verified-commit requirement enabled: unsigned AI Studio pushes may be canceled by that gate, so publish the reviewed final tree through a supported signed GitHub commit or merge. Do not fix this by disabling security settings or force-pushing history.
