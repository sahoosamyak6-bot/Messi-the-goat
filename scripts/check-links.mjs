import { createServer } from 'vite';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { checkLocalLinks, checkExternal, allowedExternal } from './link-check-lib.mjs';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx');
  const html = renderToStaticMarkup(React.createElement(App));
  const errors = [];
  // Also inspect all literal photo references, including initially closed dialogs.
  const urls = new Set();
  async function scan(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const name = path.join(dir, entry.name);
      if (entry.isDirectory()) await scan(name);
      else if (/\.(tsx?|css)$/.test(name) && !/\.test\./.test(name)) {
        const content = await readFile(name, 'utf8');
        for (const [, photo] of content.matchAll(/["'`](\/photos\/[^"'`\s{}]+)["'`]/g)) errors.push(...checkLocalLinks(`<img src="${photo}">`, path.resolve('public')));
        for (const [, url] of content.matchAll(/["'`](https:\/\/[^"'`\s{}]+)["'`]/g)) urls.add(url);
      }
    }
  }
  await scan('src');
  errors.push(...checkLocalLinks(html, path.resolve('public')));
  if (errors.length) { errors.forEach(error => console.error(error)); process.exitCode = 1; }
  else console.log('Local link check passed: rendered fragment targets, local assets, srcsets and literal photo references.');
  if (process.argv.includes('--external')) {
    const results = [];
    // At most three public requests at once. No credentials or unchecked redirects.
    const queue = [...urls].sort();
    await Promise.all(Array.from({ length: 3 }, async () => {
      while (queue.length) { const result = await checkExternal(queue.shift()); results.push(result); console.log(`${result.status.toUpperCase()} ${result.url} (${result.detail})`); }
    }));
    const counts = results.reduce((acc, result) => ({ ...acc, [result.status]: (acc[result.status] || 0) + 1 }), {});
    console.log('External link audit:', JSON.stringify(counts));
    console.log('Inconclusive is not a pass. Dynamic news/share URLs and video playback require browser QA.');
    if (results.some(result => result.status === 'broken')) process.exitCode = 1;
    if (results.some(result => result.status === 'inconclusive')) console.log('::warning::Some external links could not be verified; review the audit log.');
  }
} finally { await server.close(); }
