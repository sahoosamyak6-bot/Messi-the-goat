import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  getSectionShareMetadata,
  getAllShareableSections,
  buildSectionDirectUrl,
  generateSocialPostSnippet,
  generateSocialIntentUrls,
  SHAREABLE_SECTIONS,
  SECTION_ORDER,
} from './share-helper';

test('getSectionShareMetadata returns accurate metadata for every known section', () => {
  for (const sectionId of SECTION_ORDER) {
    const meta = getSectionShareMetadata(sectionId);
    assert.strictEqual(meta.sectionId, sectionId);
    assert.ok(meta.previewTitle.length > 10, `Preview title should be substantial for ${sectionId}`);
    assert.ok(meta.description.length > 20, `Description should be detailed for ${sectionId}`);
    assert.ok(meta.badge.length > 0, `Badge should exist for ${sectionId}`);
    assert.ok(meta.highlightStat.length > 0, `Highlight stat should exist for ${sectionId}`);
    assert.ok(meta.hashtags.length >= 2, `Hashtags should have at least 2 tags for ${sectionId}`);
  }
});

test('getSectionShareMetadata safely falls back to hero for unknown section IDs', () => {
  const fallbackEmpty = getSectionShareMetadata('');
  assert.strictEqual(fallbackEmpty.sectionId, 'hero');

  const fallbackUnknown = getSectionShareMetadata('random-unknown-section');
  assert.strictEqual(fallbackUnknown.sectionId, 'hero');
  assert.strictEqual(fallbackUnknown.previewTitle, SHAREABLE_SECTIONS.hero.previewTitle);
});

test('getAllShareableSections returns all 9 sections in precise visual order', () => {
  const all = getAllShareableSections();
  assert.strictEqual(all.length, 9);
  assert.deepStrictEqual(
    all.map((s) => s.sectionId),
    SECTION_ORDER
  );
});

test('buildSectionDirectUrl constructs clean deep-link URL with custom baseUrl', () => {
  const urlStats = buildSectionDirectUrl('statistics', 'https://messi-chronicle.app');
  assert.strictEqual(urlStats, 'https://messi-chronicle.app/#statistics');

  const urlPitch = buildSectionDirectUrl('pitch-visualizer', 'https://messi-chronicle.app/');
  assert.strictEqual(urlPitch, 'https://messi-chronicle.app/#pitch-visualizer');

  // Strips existing hash in baseUrl
  const urlCleaned = buildSectionDirectUrl('trophies', 'https://messi-chronicle.app/#biography');
  assert.strictEqual(urlCleaned, 'https://messi-chronicle.app/#trophies');
});

test('generateSocialPostSnippet generates detailed snippet with preview title, highlights, and URL', () => {
  const snippet = generateSocialPostSnippet({
    sectionId: 'pitch-visualizer',
    baseUrl: 'https://messi.example.com',
    style: 'detailed',
  });

  assert.ok(snippet.includes('Tactical Pitch Visualizer'), 'Contains preview title');
  assert.ok(snippet.includes('Goal Lab'), 'Contains goal lab mention');
  assert.ok(snippet.includes('https://messi.example.com/#pitch-visualizer'), 'Contains direct link');
  assert.ok(snippet.includes('#GoalLab') || snippet.includes('#FootballTactics'), 'Contains relevant hashtags');
});

test('generateSocialPostSnippet supports compact and quote styles', () => {
  const compact = generateSocialPostSnippet({
    sectionId: 'trophies',
    baseUrl: 'https://messi.example.com',
    style: 'compact',
  });
  assert.ok(compact.startsWith('🐐'), 'Compact starts with GOAT emoji');
  assert.ok(compact.includes('46 Major Honors'), 'Includes highlight stat');
  assert.ok(compact.includes('https://messi.example.com/#trophies'), 'Includes direct link');

  const quote = generateSocialPostSnippet({
    sectionId: 'biography',
    baseUrl: 'https://messi.example.com',
    style: 'quote',
  });
  assert.ok(quote.includes('The Legend’s Odyssey'), 'Quote includes chapter title');
  assert.ok(quote.includes('https://messi.example.com/#biography'), 'Quote includes direct link');
});

test('generateSocialIntentUrls generates valid web share URLs for Twitter, WhatsApp, Telegram, etc.', () => {
  const intents = generateSocialIntentUrls({
    sectionId: 'achievement-timeline',
    baseUrl: 'https://messi.example.com',
  });

  assert.ok(intents.twitter.startsWith('https://twitter.com/intent/tweet?'));
  assert.ok(intents.twitter.includes(encodeURIComponent('https://messi.example.com/#achievement-timeline')));

  assert.ok(intents.whatsapp.startsWith('https://api.whatsapp.com/send?text='));
  assert.ok(intents.whatsapp.includes(encodeURIComponent('The 6 Crown Achievements')));

  assert.ok(intents.telegram.startsWith('https://t.me/share/url?'));
  assert.ok(intents.linkedin.startsWith('https://www.linkedin.com/sharing/share-offsite/?url='));
  assert.ok(intents.facebook.startsWith('https://www.facebook.com/sharer/sharer.php?u='));
  assert.ok(intents.email.startsWith('mailto:?subject='));
});
