import test from 'node:test';
import assert from 'node:assert/strict';
import { ICONIC_GOALS_TACTICAL } from '../data/messi-data.ts';
import { INITIAL_LAB_PLAYBACK, LAB_PLAYBOOKS, clampProgress, labPlaybackReducer, phaseAtProgress, pitchPoint, pointAtProgress, routeLengths, stepProgress, waypointProgress } from './lab-model.ts';

const nearly = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} should equal ${expected}`);

test('playbooks use three real archive entries with complete bounded routes and phases', () => {
  assert.equal(LAB_PLAYBOOKS.length, 3);
  assert.equal(LAB_PLAYBOOKS[0].theme, 'argentina');
  for (const play of LAB_PLAYBOOKS) {
    assert.ok(ICONIC_GOALS_TACTICAL.some((goal) => goal.id === play.sourceId));
    assert.equal(play.movements.length, play.points.length - 1);
    assert.equal(play.phases.length, 3);
    assert.ok(play.durationMs > 0);
    for (const point of play.points) assert.ok(point.x >= 0 && point.x <= 100 && point.y >= 0 && point.y <= 100);
    assert.deepEqual(play.phases.map((phase) => phase.pointIndex), play.phases.map((phase) => phase.pointIndex).sort((a, b) => a - b));
    for (const phase of play.phases) assert.ok(phase.pointIndex >= 0 && phase.pointIndex < play.points.length);
  }
});

test('progress clamps at both ends and handles non-finite input safely', () => {
  assert.equal(clampProgress(-0.2), 0);
  assert.equal(clampProgress(1.2), 1);
  assert.equal(clampProgress(Number.NaN), 0);
  assert.equal(clampProgress(Infinity), 1);
  assert.equal(clampProgress(-Infinity), 0);
  assert.equal(clampProgress(0.4), 0.4);
});

test('pitch projection stays within the schematic pitch', () => {
  assert.deepEqual(pitchPoint({ x: -12, y: 300 }), { x: 44, y: 398 });
  assert.deepEqual(pitchPoint({ x: 100, y: 0 }), { x: 696, y: 40 });
});

test('route movement is distance-based, not waypoint-based', () => {
  const points = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 30 }];
  assert.deepEqual(routeLengths(points), [0, 10, 40]);
  assert.deepEqual(pointAtProgress(points, 0.5), { x: 10, y: 10 });
  assert.deepEqual(pointAtProgress(points, -2), points[0]);
  assert.deepEqual(pointAtProgress(points, 2), points[2]);
  nearly(waypointProgress(points, 1), 0.25);
});

test('empty, one-point and repeated-point routes never yield NaN', () => {
  assert.deepEqual(pointAtProgress([], 0.5), { x: 0, y: 0 });
  assert.deepEqual(pointAtProgress([{ x: 4, y: 7 }], 0.9), { x: 4, y: 7 });
  assert.deepEqual(pointAtProgress([{ x: 4, y: 7 }, { x: 4, y: 7 }], 0.5), { x: 4, y: 7 });
  assert.deepEqual(pointAtProgress([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 10, y: 0 }], 0.5), { x: 5, y: 0 });
  assert.equal(waypointProgress([], 2), 0);
});

test('every phase resolves exactly at its waypoint and manual steps reach both ends', () => {
  for (const play of LAB_PLAYBOOKS) {
    const points = play.points.map(pitchPoint);
    play.phases.forEach((phase, index) => assert.equal(phaseAtProgress(play, waypointProgress(points, phase.pointIndex)), index));
    let progress = 0;
    for (let step = 0; step < play.phases.length; step++) progress = stepProgress(play, progress, 1);
    assert.equal(progress, 1);
    assert.equal(stepProgress(play, 1, 1), 1);
    for (let step = 0; step < play.phases.length; step++) progress = stepProgress(play, progress, -1);
    assert.equal(progress, 0);
    assert.equal(stepProgress(play, 0, -1), 0);
  }
});

test('lab starts still with automation disabled and ignores ticks while paused', () => {
  assert.equal(INITIAL_LAB_PLAYBACK.playing, false);
  assert.equal(INITIAL_LAB_PLAYBACK.autoNext, false);
  assert.equal(labPlaybackReducer(INITIAL_LAB_PLAYBACK, { type: 'tick', elapsedMs: 200 }), INITIAL_LAB_PLAYBACK);
});

test('pause and resume retain position; reset and play selection stop motion', () => {
  let state = labPlaybackReducer(INITIAL_LAB_PLAYBACK, { type: 'toggle' });
  state = labPlaybackReducer(state, { type: 'tick', elapsedMs: 200 });
  const progress = state.progress;
  state = labPlaybackReducer(state, { type: 'pause' });
  assert.equal(state.playing, false);
  assert.equal(state.progress, progress);
  state = labPlaybackReducer(state, { type: 'toggle' });
  assert.equal(state.playing, true);
  assert.equal(state.progress, progress);
  state = labPlaybackReducer(state, { type: 'select', index: 2 });
  assert.equal(state.index, 2);
  assert.equal(state.progress, 0);
  assert.equal(state.playing, false);
  state = labPlaybackReducer({ ...state, progress: 0.6, playing: true }, { type: 'reset' });
  assert.equal(state.progress, 0);
  assert.equal(state.playing, false);
});

test('scrubbing pauses a running move and replay cleanly starts at the beginning', () => {
  let state = labPlaybackReducer({ ...INITIAL_LAB_PLAYBACK, playing: true }, { type: 'seek', progress: 0.7 });
  assert.equal(state.progress, 0.7);
  assert.equal(state.playing, false);
  state = labPlaybackReducer(state, { type: 'seek', progress: 1 });
  state = labPlaybackReducer(state, { type: 'toggle' });
  assert.equal(state.progress, 0);
  assert.equal(state.playing, true);
});

test('speed changes keep position; valid playback speeds change future progress', () => {
  const running = { ...INITIAL_LAB_PLAYBACK, playing: true, progress: 0.2 };
  const slow = labPlaybackReducer(running, { type: 'speed', speed: 0.5 });
  const fast = labPlaybackReducer(running, { type: 'speed', speed: 1.5 });
  assert.equal(slow.progress, 0.2);
  const slowDelta = labPlaybackReducer(slow, { type: 'tick', elapsedMs: 100 }).progress - 0.2;
  const fastDelta = labPlaybackReducer(fast, { type: 'tick', elapsedMs: 100 }).progress - 0.2;
  nearly(fastDelta, slowDelta * 3);
  assert.equal(labPlaybackReducer(running, { type: 'speed', speed: -100 }).speed, 1);
});

test('background-sized frames are bounded and invalid frame times are ignored', () => {
  const running = { ...INITIAL_LAB_PLAYBACK, playing: true };
  assert.equal(labPlaybackReducer(running, { type: 'tick', elapsedMs: Infinity }), running);
  assert.equal(labPlaybackReducer(running, { type: 'tick', elapsedMs: -100 }), running);
  nearly(labPlaybackReducer(running, { type: 'tick', elapsedMs: 50000 }).progress, 250 / LAB_PLAYBOOKS[0].durationMs);
});

test('playback stops on the completed frame by default', () => {
  const end = labPlaybackReducer({ ...INITIAL_LAB_PLAYBACK, playing: true, progress: 0.999 }, { type: 'tick', elapsedMs: 200 });
  assert.equal(end.progress, 1);
  assert.equal(end.playing, false);
  assert.equal(end.index, 0);
});

test('enabling auto-next does not itself begin playback', () => {
  const state = labPlaybackReducer(INITIAL_LAB_PLAYBACK, { type: 'auto-next', enabled: true });
  assert.equal(state.autoNext, true);
  assert.equal(state.playing, false);
});

test('auto-next holds the finish, advances once, and stops at the final play', () => {
  let state = { ...INITIAL_LAB_PLAYBACK, playing: true, autoNext: true, progress: 1 };
  for (let i = 0; i < 4; i++) state = labPlaybackReducer(state, { type: 'tick', elapsedMs: 250 });
  assert.equal(state.index, 0);
  assert.equal(state.progress, 1);
  state = labPlaybackReducer(state, { type: 'tick', elapsedMs: 250 });
  assert.equal(state.index, 1);
  assert.equal(state.progress, 0);
  assert.equal(state.playing, true);
  state = labPlaybackReducer({ ...state, index: LAB_PLAYBOOKS.length - 1, progress: 0.999 }, { type: 'tick', elapsedMs: 200 });
  assert.equal(state.index, LAB_PLAYBOOKS.length - 1);
  assert.equal(state.progress, 1);
  assert.equal(state.playing, false);
});

test('pausing or disabling auto-next cancels a pending next play', () => {
  const holding = { ...INITIAL_LAB_PLAYBACK, playing: true, autoNext: true, progress: 1, holdMs: 1000 };
  const paused = labPlaybackReducer(holding, { type: 'pause' });
  assert.equal(labPlaybackReducer(paused, { type: 'tick', elapsedMs: 250 }).index, 0);
  assert.equal(paused.holdMs, 0);
  const disabled = labPlaybackReducer(holding, { type: 'auto-next', enabled: false });
  assert.equal(disabled.playing, false);
  assert.equal(labPlaybackReducer(disabled, { type: 'tick', elapsedMs: 250 }).index, 0);
});
