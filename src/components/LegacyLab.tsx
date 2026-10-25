import { useEffect, useId, useMemo, useReducer, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowDownRight, ArrowRight, ChevronLeft, ChevronRight, CircleHelp, Maximize2, Pause, Play, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { ICONIC_GOALS_TACTICAL } from '../data/messi-data';
import { INITIAL_LAB_PLAYBACK, LAB_PLAYBOOKS, labPlaybackReducer, phaseAtProgress, pitchPoint, pointAtProgress, stepProgress, waypointProgress } from '../utils/lab-model';
import './legacy-lab.css';

export function LegacyLab() {
  const [state, dispatch] = useReducer(labPlaybackReducer, INITIAL_LAB_PLAYBACK);
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [pauseReason, setPauseReason] = useState('');
  const container = useRef<HTMLElement>(null);
  const playingRef = useRef(false);
  playingRef.current = state.playing;
  const id = useId();
  const playbook = LAB_PLAYBOOKS[state.index];
  const source = ICONIC_GOALS_TACTICAL.find((goal) => goal.id === playbook.sourceId);
  const points = useMemo(() => playbook.points.map(pitchPoint), [playbook]);
  const ball = pointAtProgress(points, state.progress);
  const activePhase = phaseAtProgress(playbook, state.progress);
  const activeDetail = playbook.phases[activePhase];

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) {
        dispatch({ type: 'pause' });
        dispatch({ type: 'auto-next', enabled: false });
      }
    };
    updatePreference();
    preference.addEventListener('change', updatePreference);
    return () => preference.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    const pause = () => {
      if (!playingRef.current) return;
      dispatch({ type: 'pause' });
      setPauseReason('Paused when you left the lab. Press Play to continue.');
    };
    const onVisibility = () => { if (document.hidden) pause(); };
    document.addEventListener('visibilitychange', onVisibility);
    const observer = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) pause(); }, { threshold: 0 })
      : undefined;
    if (container.current) observer?.observe(container.current);
    return () => { document.removeEventListener('visibilitychange', onVisibility); observer?.disconnect(); };
  }, []);

  useEffect(() => {
    if (!state.playing || reducedMotion) return;
    let previous: number | undefined;
    let frame = 0;
    const tick = (now: number) => {
      if (document.hidden) { dispatch({ type: 'pause' }); return; }
      if (previous !== undefined) dispatch({ type: 'tick', elapsedMs: now - previous });
      previous = now;
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [state.playing, reducedMotion]);

  const seek = (progress: number) => { setPauseReason(''); dispatch({ type: 'seek', progress }); };
  const togglePlay = () => {
    setPauseReason('');
    if (reducedMotion) seek(state.progress >= 1 ? 0 : stepProgress(playbook, state.progress, 1));
    else dispatch({ type: 'toggle' });
  };
  const playbackLabel = reducedMotion ? (state.progress >= 1 ? 'Start again' : 'Next phase') : state.playing ? 'Pause' : state.progress >= 1 ? 'Replay' : 'Play the move';

  return (
    <section className="legacy-lab" id="lab" ref={container} aria-labelledby={`${id}-heading`}>
      <div className="ll-container">
        <div className="ll-heading">
          <div>
            <p className="ll-eyebrow"><span /> The Messi lab <span className="ll-eyebrow-number">Interactive / 03 plays</span></p>
            <h2 id={`${id}-heading`}>Genius, <em>in motion.</em></h2>
          </div>
          <p>Don’t just watch the magic. Follow the movement, find the space, and explore what makes a moment Messi.</p>
        </div>

        <div className={`ll-console ll-theme-${playbook.theme}`}>
          <div className="ll-console-bar"><span><SlidersHorizontal size={13} aria-hidden="true" /> THE PLAYBOOK</span><span>YOU CONTROL THE TEMPO <ArrowDownRight size={14} aria-hidden="true" /></span></div>
          <div className="ll-playbooks" role="group" aria-label="Choose a Messi play">
            {LAB_PLAYBOOKS.map((item, index) => (
              <button type="button" className={`ll-playbook ${index === state.index ? 'is-selected' : ''}`} key={item.sourceId} aria-pressed={index === state.index} onClick={() => { setPauseReason(''); dispatch({ type: 'select', index }); }}>
                <span className="ll-playbook-index">0{index + 1}</span>
                <span className="ll-playbook-copy"><strong>{item.shortTitle}</strong><small>{item.theme === 'argentina' ? 'ARGENTINA' : 'FC BARCELONA'} <span>·</span> {item.year}</small></span>
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className="ll-workspace">
            <div className="ll-main">
              <div className="ll-pitch-heading"><span>{playbook.venue} <span>/</span> {playbook.year}</span><span><Maximize2 size={12} aria-hidden="true" /> ATTACKING VIEW</span></div>
              <div className="ll-pitch">
                <svg viewBox="0 0 760 440" role="img" aria-labelledby={`${id}-pitch-title ${id}-pitch-description`}>
                  <title id={`${id}-pitch-title`}>{playbook.shortTitle}: illustrative ball route</title>
                  <desc id={`${id}-pitch-description`}>A schematic attacking view, not match tracking. {playbook.phases.map((phase, index) => `Phase ${index + 1}: ${phase.title}.`).join(' ')} Use the phase buttons and timeline below to explore.</desc>
                  <defs>
                    <pattern id={`${id}-grid`} width="38" height="38" patternUnits="userSpaceOnUse"><path d="M 38 0 L 0 0 0 38" fill="none" stroke="currentColor" strokeWidth=".55" /></pattern>
                    <linearGradient id={`${id}-field`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#132d47" /><stop offset="1" stopColor="#0b2034" /></linearGradient>
                  </defs>
                  <rect width="760" height="440" fill={`url(#${id}-field)`} />
                  <rect width="760" height="440" fill={`url(#${id}-grid)`} className="ll-grid-lines" />
                  <g className="ll-field-lines" fill="none" strokeWidth="1.3">
                    <rect x="44" y="40" width="652" height="358" />
                    <path d="M 44 40 V 398 M 44 156 A 63 63 0 0 1 44 282" />
                    <rect x="544" y="110" width="152" height="218" /><rect x="643" y="166" width="53" height="106" />
                    <path d="M 544 170 A 62 62 0 0 0 544 268" />
                    <circle cx="588" cy="219" r="2" fill="currentColor" />
                    <rect x="697" y="194" width="18" height="50" className="ll-goal-frame" />
                    <path d="M 703 194 V 244 M 709 194 V 244 M 697 204 H 715 M 697 214 H 715 M 697 224 H 715 M 697 234 H 715" className="ll-net" />
                  </g>
                  <g className="ll-pitch-label"><text x="65" y="72">SCHEMATIC / NOT TO SCALE</text><text x="65" y="377">ATTACKING DIRECTION</text><path d="M 211 373 H 257 M 252 368 L 258 373 252 378" fill="none" stroke="currentColor" /></g>
                  {points.slice(1).map((point, index) => {
                    const start = points[index];
                    const from = waypointProgress(points, index);
                    const to = waypointProgress(points, index + 1);
                    const portion = Math.max(0, Math.min(1, (state.progress - from) / (to - from || 1)));
                    const movement = playbook.movements[index];
                    const end = { x: start.x + (point.x - start.x) * portion, y: start.y + (point.y - start.y) * portion };
                    return <g key={`${playbook.sourceId}-${index}`} className={`ll-route ll-route-${movement}`}>
                      <path d={`M ${start.x} ${start.y} L ${point.x} ${point.y}`} className="ll-route-guide" fill="none" strokeWidth="2.5" strokeDasharray={movement === 'carry' ? undefined : '6 7'} />
                      {portion > 0 && <path d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`} className="ll-route-travelled" fill="none" strokeWidth="3" strokeDasharray={movement === 'carry' ? undefined : '6 7'} />}
                    </g>;
                  })}
                  {playbook.phases.map((phase, index) => {
                    const point = points[phase.pointIndex];
                    return <g key={phase.title} transform={`translate(${point.x}, ${point.y})`} className={`ll-phase-pin ${index === activePhase ? 'is-current' : ''}`}>
                      <path d="M 0 -15 V -26" stroke="currentColor" />
                      <circle cy="-40" r="14" /><text y="-36" textAnchor="middle">0{index + 1}</text>
                    </g>;
                  })}
                  <g transform={`translate(${ball.x}, ${ball.y})`} className="ll-ball"><circle r="17" className="ll-ball-halo" /><circle r="8" /><circle r="2.6" className="ll-ball-centre" /></g>
                  {state.progress >= 1 && <g className="ll-finish-label"><rect x="593" y="55" width="85" height="28" rx="14" /><text x="635.5" y="73" textAnchor="middle">GOAL</text></g>}
                </svg>
              </div>
              <div className="ll-pitch-caption"><span><i className="ll-legend-carry" /> Carry <i className="ll-legend-pass" /> Pass / shot</span><span>ILLUSTRATIVE RECONSTRUCTION</span></div>

              <div className="ll-timeline">
                <label htmlFor={`${id}-scrubber`}>Explore the move <span>{Math.round(state.progress * 100)}%</span></label>
                <input id={`${id}-scrubber`} type="range" min="0" max="1000" step="1" value={Math.round(state.progress * 1000)} onChange={(event) => seek(Number(event.target.value) / 1000)} aria-valuetext={`${Math.round(state.progress * 100)} percent. Phase ${activePhase + 1}: ${activeDetail.title}`} style={{ '--ll-progress': `${state.progress * 100}%` } as CSSProperties} />
                <div className="ll-timeline-labels"><span>THE OPENING</span><span>THE FINISH</span></div>
              </div>

              <div className="ll-controls">
                <button type="button" className="ll-play" onClick={togglePlay}>{state.playing ? <Pause size={15} aria-hidden="true" /> : state.progress >= 1 ? <RotateCcw size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />} {playbackLabel}</button>
                <div className="ll-step-controls">
                  <button type="button" onClick={() => seek(stepProgress(playbook, state.progress, -1))} disabled={state.progress <= 0} aria-label="Previous phase"><ChevronLeft size={18} aria-hidden="true" /></button>
                  <button type="button" onClick={() => seek(stepProgress(playbook, state.progress, 1))} disabled={state.progress >= 1} aria-label="Next phase"><ChevronRight size={18} aria-hidden="true" /></button>
                  <button type="button" onClick={() => { setPauseReason(''); dispatch({ type: 'reset' }); }} aria-label="Reset move to the beginning" title="Reset move"><RotateCcw size={15} aria-hidden="true" /></button>
                </div>
                <label className="ll-speed">Speed <select value={state.speed} disabled={reducedMotion} onChange={(event) => dispatch({ type: 'speed', speed: Number(event.target.value) })} aria-label="Playback speed"><option value="0.5">0.5×</option><option value="1">1×</option><option value="1.5">1.5×</option></select></label>
              </div>
            </div>

            <aside className="ll-insight" aria-label="Play breakdown">
              <div className="ll-match"><span className={`ll-team-marker ll-team-${playbook.theme}`} aria-hidden="true" />{source?.team ?? (playbook.theme === 'argentina' ? 'Argentina' : 'FC Barcelona')} <span>vs</span> {source?.opponent}</div>
              <h3>{playbook.title}</h3>
              <p className="ll-match-meta">{source?.competition}<br />{source?.date} <span>·</span> {source?.minute}</p>
              <div className="ll-phase-buttons" role="group" aria-label="Jump to a phase">
                {playbook.phases.map((phase, index) => <button type="button" key={phase.title} aria-pressed={activePhase === index} className={activePhase === index ? 'is-active' : ''} onClick={() => seek(waypointProgress(points, phase.pointIndex))}><span>0{index + 1}</span>{phase.title}<ArrowRight size={14} aria-hidden="true" /></button>)}
              </div>
              <div className="ll-phase-note" aria-live="polite" aria-atomic="true"><span>WHAT TO NOTICE / 0{activePhase + 1}</span><p>{activeDetail.detail}</p></div>
              <div className="ll-idea"><span>THE MESSI DETAIL</span><p>{playbook.idea}</p></div>
            </aside>
          </div>
          <div className="ll-bottom-bar">
            <label className="ll-auto"><input type="checkbox" checked={state.autoNext} disabled={reducedMotion} onChange={(event) => dispatch({ type: 'auto-next', enabled: event.target.checked })} /><span className="ll-switch" aria-hidden="true" /><span>Auto-next <small>{state.autoNext ? 'On, plays once through' : 'Off, take your time'}</small></span></label>
            <p><CircleHelp size={13} aria-hidden="true" /> {reducedMotion ? 'Reduced motion is on. Use the phase buttons or scrubber.' : pauseReason || (state.playing ? 'Playing. Leaving the lab pauses the move.' : state.progress >= 1 ? 'Move complete. Replay or choose another play.' : state.progress > 0 ? 'Paused. Pick up where you left off.' : 'Press Play to begin. Nothing moves until you do.')}</p>
          </div>
        </div>
        <p className="ll-disclaimer">A fan-made study of three iconic goals. Routes and playback timing are illustrative, not match footage, live data, or measured player tracking.</p>
      </div>
    </section>
  );
}

export default LegacyLab;
