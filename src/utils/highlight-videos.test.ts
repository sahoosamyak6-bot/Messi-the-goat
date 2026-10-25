import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { InlineHighlight } from '../components/InlineHighlight';
import { ICONIC_MOMENTS } from '../data/messi-data';
import { getHighlightEmbedUrl, getHighlightSourceUrl, getHighlightVideo, HIGHLIGHT_VIDEOS } from '../data/highlight-videos';

test('curated video mappings refer to real archive moments and valid IDs', () => {
  assert.equal(Object.keys(HIGHLIGHT_VIDEOS).length, 6);
  const momentIds = new Set(ICONIC_MOMENTS.map((moment) => moment.id));
  for (const [momentId, video] of Object.entries(HIGHLIGHT_VIDEOS)) {
    assert.ok(momentIds.has(momentId), momentId);
    assert.match(video.videoId, /^[A-Za-z0-9_-]{11}$/);
    assert.ok(video.publisher && video.title && video.context && video.verifiedOn);
  }
});

test('embed URLs use privacy-enhanced YouTube without autoplay', () => {
  for (const video of Object.values(HIGHLIGHT_VIDEOS)) {
    const url = new URL(getHighlightEmbedUrl(video.videoId));
    assert.equal(url.hostname, 'www.youtube-nocookie.com');
    assert.equal(url.pathname, `/embed/${video.videoId}`);
    assert.equal(url.searchParams.get('autoplay'), '0');
    assert.equal(url.searchParams.get('playsinline'), '1');
    assert.equal(getHighlightSourceUrl(video.videoId), `https://www.youtube.com/watch?v=${video.videoId}`);
  }
});

test('unknown moments and inherited properties do not receive invented clips', () => {
  for (const momentId of ['missing', 'toString', '__proto__', 'bernabeu-solo-2011', 'record-91-goals', 'bernabeu-shirt-500', 'maracana-2021']) {
    assert.equal(getHighlightVideo(momentId), undefined);
  }
});

test('URL builders reject malformed video IDs', () => {
  for (const id of ['', 'https://youtube.com/watch?v=IipmpVcISXE', 'IipmpVcISXE?autoplay=1', '../anything', 'short']) {
    assert.throws(() => getHighlightEmbedUrl(id), /Invalid YouTube video ID/);
    assert.throws(() => getHighlightSourceUrl(id), /Invalid YouTube video ID/);
  }
});

test('longer archival videos are labeled accurately', () => {
  assert.equal(getHighlightVideo('ronaldinho-piggyback')?.format, 'Full match archive');
  assert.equal(getHighlightVideo('ankara-messi')?.format, 'Goal retrospective');
  assert.equal(getHighlightVideo('lusail-world-cup-2022')?.format, 'Match highlights');
});

test('initial video presentation never loads a third-party player or thumbnail', () => {
  const html = renderToStaticMarkup(createElement(InlineHighlight, {
    momentId: 'miami-freekick-debut',
    momentTitle: 'Miami debut',
    fallbackUrl: 'https://www.youtube.com/results?search_query=messi+miami',
  }));
  assert.doesNotMatch(html, /<iframe|<img|youtube-nocookie\.com/);
  assert.match(html, /Load video here/);
  assert.match(html, /https:\/\/www\.youtube\.com\/watch\?v=K6fltq0dn_E/);
});

test('unmapped moments explain the fallback and do not offer a misleading play button', () => {
  const html = renderToStaticMarkup(createElement(InlineHighlight, {
    momentId: 'maracana-2021',
    momentTitle: 'Copa América 2021',
    fallbackUrl: 'https://www.youtube.com/results?search_query=messi+copa+america+2021',
  }));
  assert.match(html, /not available for this moment yet/);
  assert.match(html, /Search video archive/);
  assert.doesNotMatch(html, /<iframe|Load video here/);
});
