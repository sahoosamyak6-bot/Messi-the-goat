/** Schematic routes, not positional tracking or measured match telemetry. */
export type LabPoint = { x: number; y: number };
export type LabMovement = 'carry' | 'pass' | 'finish';
export type LabPhase = { title: string; detail: string; pointIndex: number };
export type LabPlaybook = {
  sourceId: string;
  title: string;
  shortTitle: string;
  year: string;
  venue: string;
  theme: 'argentina' | 'barcelona';
  idea: string;
  points: LabPoint[];
  movements: LabMovement[];
  phases: LabPhase[];
  durationMs: number;
};

export const LAB_PLAYBOOKS: LabPlaybook[] = [
  {
    sourceId: 'goal-world-cup-final-2022',
    title: 'A moment for a nation.',
    shortTitle: 'The world stage',
    year: '2022',
    venue: 'Lusail',
    theme: 'argentina',
    idea: 'The genius is not always the dribble. Sometimes it is being exactly where the next chance will fall.',
    points: [{ x: 17, y: 63 }, { x: 39, y: 49 }, { x: 65, y: 65 }, { x: 90, y: 51 }, { x: 84, y: 47 }, { x: 100, y: 50 }],
    movements: ['pass', 'pass', 'finish', 'pass', 'finish'],
    phases: [
      { title: 'Build the opening', detail: 'Quick combinations move the ball into the final third. Follow the idea of the move, not a measured player track.', pointIndex: 0 },
      { title: 'Follow the chance', detail: 'The attack reaches the box. A saved attempt creates a second opportunity instead of ending the move.', pointIndex: 2 },
      { title: 'Be there', detail: 'Messi meets the rebound and puts Argentina back in front in extra time. The story still has another twist to come.', pointIndex: 4 },
    ],
    durationMs: 10000,
  },
  {
    sourceId: 'goal-getafe-2007',
    title: 'One run. A thousand possibilities.',
    shortTitle: 'The solo run',
    year: '2007',
    venue: 'Camp Nou',
    theme: 'barcelona',
    idea: 'Change direction without surrendering momentum. Every touch opens a space that was not there a moment ago.',
    points: [{ x: 10, y: 83 }, { x: 26, y: 76 }, { x: 38, y: 56 }, { x: 57, y: 64 }, { x: 75, y: 47 }, { x: 88, y: 59 }, { x: 100, y: 46 }],
    movements: ['carry', 'carry', 'carry', 'carry', 'carry', 'finish'],
    phases: [
      { title: 'Escape the pressure', detail: 'Start wide, keep the ball close and turn the first challenge into forward momentum.', pointIndex: 0 },
      { title: 'Find the next gap', detail: 'The route bends towards goal. Small changes of angle keep the run alive through a crowded defence.', pointIndex: 2 },
      { title: 'Finish the journey', detail: 'One last change of direction takes the move around the goalkeeper before the finish.', pointIndex: 5 },
    ],
    durationMs: 11000,
  },
  {
    sourceId: 'goal-boateng-2015',
    title: 'A little change. Everything changes.',
    shortTitle: 'The perfect feint',
    year: '2015',
    venue: 'Camp Nou',
    theme: 'barcelona',
    idea: 'Sell one direction, take the other. Then trade power for the lightest possible touch.',
    points: [{ x: 23, y: 74 }, { x: 42, y: 66 }, { x: 57, y: 50 }, { x: 65, y: 66 }, { x: 80, y: 57 }, { x: 100, y: 48 }],
    movements: ['carry', 'carry', 'carry', 'carry', 'finish'],
    phases: [
      { title: 'Invite the challenge', detail: 'Approach the defender with the ball under control. A small movement can ask a very big question.', pointIndex: 0 },
      { title: 'Change the answer', detail: 'The sharp change of direction creates a new angle. It is the defining feint against Bayern.', pointIndex: 2 },
      { title: 'Choose the delicate finish', detail: 'With the opening made, a chipped finish takes the ball beyond the goalkeeper.', pointIndex: 4 },
    ],
    durationMs: 8500,
  },
];

export function clampProgress(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function pitchPoint(point: LabPoint): LabPoint {
  return { x: 44 + clampProgress(point.x / 100) * 652, y: 40 + clampProgress(point.y / 100) * 358 };
}

export function routeLengths(points: readonly LabPoint[]): number[] {
  let total = 0;
  return points.map((point, index) => {
    if (index > 0) total += Math.hypot(point.x - points[index - 1].x, point.y - points[index - 1].y);
    return total;
  });
}

/** Arc-length interpolation avoids jumping between unevenly spaced waypoints. */
export function pointAtProgress(points: readonly LabPoint[], progress: number): LabPoint {
  if (!points.length) return { x: 0, y: 0 };
  const lengths = routeLengths(points);
  const target = (lengths.at(-1) ?? 0) * clampProgress(progress);
  for (let i = 1; i < points.length; i += 1) {
    const segment = lengths[i] - lengths[i - 1];
    if (segment > 0 && lengths[i] >= target) {
      const ratio = (target - lengths[i - 1]) / segment;
      return { x: points[i - 1].x + (points[i].x - points[i - 1].x) * ratio, y: points[i - 1].y + (points[i].y - points[i - 1].y) * ratio };
    }
  }
  return { ...points[points.length - 1] };
}

export function waypointProgress(points: readonly LabPoint[], pointIndex: number): number {
  const lengths = routeLengths(points);
  const total = lengths.at(-1) ?? 0;
  return total ? (lengths[Math.max(0, Math.min(lengths.length - 1, pointIndex))] ?? 0) / total : 0;
}

export function phaseAtProgress(playbook: LabPlaybook, progress: number): number {
  const points = playbook.points.map(pitchPoint);
  let index = 0;
  playbook.phases.forEach((phase, candidate) => {
    if (clampProgress(progress) + 1e-8 >= waypointProgress(points, phase.pointIndex)) index = candidate;
  });
  return index;
}

export function stepProgress(playbook: LabPlaybook, progress: number, direction: -1 | 1): number {
  const points = playbook.points.map(pitchPoint);
  const stops = [...new Set([0, ...playbook.phases.map((phase) => waypointProgress(points, phase.pointIndex)), 1])].sort((a, b) => a - b);
  return direction > 0
    ? stops.find((stop) => stop > clampProgress(progress) + 1e-6) ?? 1
    : stops.slice().reverse().find((stop) => stop < clampProgress(progress) - 1e-6) ?? 0;
}

export type LabPlayback = { index: number; progress: number; playing: boolean; speed: number; autoNext: boolean; holdMs: number };
export const INITIAL_LAB_PLAYBACK: LabPlayback = { index: 0, progress: 0, playing: false, speed: 1, autoNext: false, holdMs: 0 };
export type LabAction =
  | { type: 'select'; index: number }
  | { type: 'toggle' }
  | { type: 'pause' }
  | { type: 'reset' }
  | { type: 'seek'; progress: number }
  | { type: 'speed'; speed: number }
  | { type: 'auto-next'; enabled: boolean }
  | { type: 'tick'; elapsedMs: number };

/** The finish is held briefly; auto-next visits each remaining play once, never loops. */
export function labPlaybackReducer(state: LabPlayback, action: LabAction): LabPlayback {
  switch (action.type) {
    case 'select':
      return { ...state, index: Math.max(0, Math.min(LAB_PLAYBOOKS.length - 1, Math.trunc(action.index) || 0)), progress: 0, playing: false, holdMs: 0 };
    case 'toggle':
      return { ...state, playing: !state.playing, progress: !state.playing && state.progress >= 1 ? 0 : state.progress, holdMs: 0 };
    case 'pause':
      return state.playing ? { ...state, playing: false, holdMs: 0 } : state;
    case 'reset':
      return { ...state, progress: 0, playing: false, holdMs: 0 };
    case 'seek':
      return { ...state, progress: clampProgress(action.progress), playing: false, holdMs: 0 };
    case 'speed':
      return { ...state, speed: [0.5, 1, 1.5].includes(action.speed) ? action.speed : 1 };
    case 'auto-next':
      return { ...state, autoNext: action.enabled, playing: !action.enabled && state.progress >= 1 ? false : state.playing };
    case 'tick': {
      if (!state.playing || !Number.isFinite(action.elapsedMs) || action.elapsedMs <= 0) return state;
      // A stalled/background frame must never leap across the whole play.
      const elapsed = Math.min(action.elapsedMs, 250);
      const canContinue = state.autoNext && state.index < LAB_PLAYBOOKS.length - 1;
      if (state.progress >= 1) {
        if (!canContinue) return { ...state, playing: false, holdMs: 0 };
        const holdMs = state.holdMs + elapsed;
        return holdMs >= 1200
          ? { ...state, index: state.index + 1, progress: 0, holdMs: 0 }
          : { ...state, holdMs };
      }
      const progress = clampProgress(state.progress + elapsed * state.speed / LAB_PLAYBOOKS[state.index].durationMs);
      return { ...state, progress, playing: progress < 1 || canContinue, holdMs: 0 };
    }
  }
}
