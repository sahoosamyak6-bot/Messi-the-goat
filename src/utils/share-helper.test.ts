import { test, type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import {
  getSectionShareMetadata,
  getAllShareableSections,
  buildSectionDirectUrl,
  generateSocialPostSnippet,
  generateSocialIntentUrls,
  SHAREABLE_SECTIONS,
  SECTION_ORDER,
  copyTextToClipboard,
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

test('getAllShareableSections returns all 11 sections in precise visual order', () => {
  const all = getAllShareableSections();
  assert.strictEqual(all.length, 11);
  assert.deepEqual(SECTION_ORDER, [
    'hero', 'news', 'achievement-timeline', 'career-timeline', 'biography',
    'statistics', 'gallery', 'lab', 'pitch-visualizer', 'trophies', 'trivia-quotes',
  ]);
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

test('unknown and inherited property names cannot become share metadata or anchors', () => {
  for (const sectionId of ['unknown', 'toString', '__proto__', 'constructor', '<script>']) {
    assert.equal(getSectionShareMetadata(sectionId).sectionId, 'hero');
    assert.equal(buildSectionDirectUrl(sectionId, 'https://messi.example.com'), 'https://messi.example.com/#hero');
  }
});

test('server-side URLs use the canonical deployed site', () => {
  assert.equal(buildSectionDirectUrl('news'), 'https://messi-the-goat.vercel.app/#news');
  assert.equal(buildSectionDirectUrl(), 'https://messi-the-goat.vercel.app/#hero');
});

test('deep links preserve nested paths and query parameters while replacing the hash', () => {
  assert.equal(buildSectionDirectUrl('lab', 'https://messi.example.com/archive?view=compact#old'), 'https://messi.example.com/archive?view=compact#lab');
  assert.equal(buildSectionDirectUrl('lab', 'https://messi.example.com/archive/#old'), 'https://messi.example.com/archive/#lab');
});

test('shared statistics and trophy totals are explicitly historical, not live claims', () => {
  for (const sectionId of ['statistics', 'trophies', 'career-timeline']) {
    const meta = getSectionShareMetadata(sectionId);
    assert.match(meta.badge, /historical/i);
    for (const style of ['compact', 'detailed', 'quote'] as const) {
      assert.match(generateSocialPostSnippet({ sectionId, style }), /historical/i);
    }
  }
  assert.match(getSectionShareMetadata('lab').description, /not measured/i);
  assert.match(getSectionShareMetadata('pitch-visualizer').description, /illustrative/i);
});

test('all social intents encode the selected deep link and contain no live placeholder URL', () => {
  for (const sectionId of ['news', 'lab']) {
    const intents = generateSocialIntentUrls({ sectionId });
    const expectedUrl = `https://messi-the-goat.vercel.app/#${sectionId}`;
    for (const intent of Object.values(intents)) {
      assert.ok(decodeURIComponent(intent).includes(expectedUrl));
      assert.ok(!intent.includes('lionel-messi-archive.web.app'));
    }
  }
});

interface ClipboardHarnessOptions {
  legacyResult?: boolean;
  legacyError?: boolean;
  appendError?: boolean;
  restoreError?: boolean;
  writeText?: (text: string) => Promise<void>;
  modal?: boolean;
}

/** A minimal DOM fixture keeps clipboard regression tests independent of a browser or new dependencies. */
function clipboardHarness(t: TestContext, options: ClipboardHarnessOptions = {}) {
  const calls = { created: 0, removed: 0, legacy: 0, copiedText: '', restoredFocus: 0, restoredSelection: 0, bodyAppends: 0, modalAppends: 0, clearedRanges: 0 };
  const ranges = [{ cloneRange() { return this; } }];
  let activeElement: FakeElement;
  class FakeElement {
    isConnected = true;
    focus() { activeElement = this; }
  }
  class FakeInput extends FakeElement {
    selectionStart = 2;
    selectionEnd = 5;
    selectionDirection = 'backward';
    setSelectionRange(start: number, end: number, direction: string) {
      calls.restoredSelection++;
      assert.deepEqual([start, end, direction], [2, 5, 'backward']);
      if (options.restoreError) throw new Error('selection changed');
    }
  }
  class FakeTextarea extends FakeInput {
    value = '';
    style = {};
    readOnly = false;
    tabIndex = 0;
    select() { calls.copiedText = this.value; }
    remove() { calls.removed++; this.isConnected = false; }
  }
  const previousFocus = new FakeInput();
  previousFocus.focus = () => {
    calls.restoredFocus++;
    if (options.restoreError) throw new Error('focus changed');
    activeElement = previousFocus;
  };
  activeElement = previousFocus;
  const body = { appendChild() { calls.bodyAppends++; if (options.appendError) throw new Error('append unavailable'); } };
  const modal = { appendChild() { calls.modalAppends++; } };
  const document = {
    get activeElement() { return activeElement; },
    body,
    createElement() { calls.created++; return new FakeTextarea(); },
    querySelector() { return options.modal ? modal : null; },
    execCommand(command: string) {
      assert.equal(command, 'copy');
      calls.legacy++;
      if (options.legacyError) throw new Error('copy blocked');
      return options.legacyResult ?? false;
    },
  };
  const globals = {
    HTMLElement: FakeElement,
    HTMLInputElement: FakeInput,
    HTMLTextAreaElement: FakeTextarea,
    document,
    navigator: options.writeText ? { clipboard: { writeText: options.writeText } } : {},
    window: {
      location: { origin: 'https://messi.example.com', pathname: '/archive/' },
      getSelection: () => ({ rangeCount: ranges.length, getRangeAt: (index: number) => ranges[index], removeAllRanges() { calls.clearedRanges++; }, addRange(range: unknown) { assert.equal(range, ranges[0]); } }),
    },
  };
  const descriptors = Object.fromEntries(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, value });
  t.after(() => {
    for (const [key, descriptor] of Object.entries(descriptors)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  });
  return { calls, previousFocus, getActiveElement: () => activeElement, modal };
}

test('clipboard helper returns false without a browser', async () => {
  assert.equal(await copyTextToClipboard('not copied'), false);
});

test('successful legacy copy restores focus and selection and removes its temporary textarea', async t => {
  let modernCalls = 0;
  const fixture = clipboardHarness(t, { legacyResult: true, writeText: async () => { modernCalls++; } });
  assert.equal(await copyTextToClipboard('archive link'), true);
  assert.equal(fixture.calls.copiedText, 'archive link');
  assert.equal(fixture.calls.removed, 1);
  assert.equal(fixture.calls.restoredFocus, 1);
  assert.equal(fixture.calls.restoredSelection, 1);
  assert.equal(fixture.calls.clearedRanges, 1);
  assert.equal(fixture.getActiveElement(), fixture.previousFocus);
  assert.equal(modernCalls, 0);
});

test('legacy copy inside an open native dialog does not append into the inert body', async t => {
  const fixture = clipboardHarness(t, { legacyResult: true, modal: true });
  assert.equal(await copyTextToClipboard('modal link'), true);
  assert.equal(fixture.calls.modalAppends, 1);
  assert.equal(fixture.calls.bodyAppends, 0);
});

test('an explicitly supplied clipboard container takes priority over the body', async t => {
  const fixture = clipboardHarness(t, { legacyResult: true });
  assert.equal(await copyTextToClipboard('modal link', { container: fixture.modal as unknown as HTMLElement }), true);
  assert.equal(fixture.calls.modalAppends, 1);
  assert.equal(fixture.calls.bodyAppends, 0);
});

test('modern clipboard succeeds after a false legacy result', async t => {
  const copied: string[] = [];
  const fixture = clipboardHarness(t, { writeText: async text => { copied.push(text); } });
  assert.equal(await copyTextToClipboard('post snippet'), true);
  assert.deepEqual(copied, ['post snippet']);
  assert.equal(fixture.calls.removed, 1);
});

test('legacy exceptions clean up the textarea and still allow a modern fallback', async t => {
  const fixture = clipboardHarness(t, { legacyError: true, writeText: async () => {} });
  assert.equal(await copyTextToClipboard('post snippet'), true);
  assert.equal(fixture.calls.removed, 1);
  assert.equal(fixture.calls.restoredFocus, 1);
});

test('failed attachment is cleaned up before the modern fallback', async t => {
  const fixture = clipboardHarness(t, { appendError: true, writeText: async () => {} });
  assert.equal(await copyTextToClipboard('post snippet'), true);
  assert.equal(fixture.calls.removed, 1);
  assert.equal(fixture.calls.legacy, 0);
});

test('focus or input restoration failures do not mask a successful copy', async t => {
  const fixture = clipboardHarness(t, { legacyResult: true, restoreError: true });
  assert.equal(await copyTextToClipboard('post snippet'), true);
  assert.equal(fixture.calls.removed, 1);
});

test('clipboard failure is reported truthfully when both APIs fail', async t => {
  const fixture = clipboardHarness(t, { legacyError: true, writeText: async () => { throw new Error('permission denied'); } });
  assert.equal(await copyTextToClipboard('not copied'), false);
  assert.equal(fixture.calls.removed, 1);
});

test('clipboard failure is reported truthfully when no modern API exists', async t => {
  clipboardHarness(t);
  assert.equal(await copyTextToClipboard('not copied'), false);
});

test('an aborted copy never creates a textarea or calls either clipboard API', async t => {
  let modernCalls = 0;
  const fixture = clipboardHarness(t, { writeText: async () => { modernCalls++; } });
  const controller = new AbortController();
  controller.abort();
  assert.equal(await copyTextToClipboard('not copied', { signal: controller.signal }), false);
  assert.equal(fixture.calls.created, 0);
  assert.equal(fixture.calls.legacy, 0);
  assert.equal(modernCalls, 0);
});

test('a late native copy result is invalidated after the dialog request is aborted', async t => {
  let resolve!: () => void;
  clipboardHarness(t, { writeText: () => new Promise<void>(done => { resolve = done; }) });
  const controller = new AbortController();
  const result = copyTextToClipboard('old section', { signal: controller.signal });
  controller.abort();
  resolve();
  assert.equal(await result, false);
});

test('browser deep links retain the current deployment path', t => {
  clipboardHarness(t);
  assert.equal(buildSectionDirectUrl('lab'), 'https://messi.example.com/archive/#lab');
});
