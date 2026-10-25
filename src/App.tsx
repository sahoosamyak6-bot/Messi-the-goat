import { useMemo, useState } from 'react';
import {
  ArrowDown, ArrowUpRight, Award, ChevronDown, CirclePlay, Globe2,
  Menu, Shield, Sparkles, Trophy, X, Zap,
} from 'lucide-react';

const achievements = [
  { year: '2004', title: 'The beginning', detail: 'A first-team debut at FC Barcelona begins an era that changes football.', tag: 'BARCELONA' },
  { year: '2009', title: 'A new standard', detail: 'Wins the first Ballon d’Or of a career defined by consistency and invention.', tag: 'FIRST BALLON D’OR' },
  { year: '2012', title: 'A record-breaking year', detail: 'A landmark scoring year puts his extraordinary finishing in the history books.', tag: 'GOALSCORING' },
  { year: '2015', title: 'Another treble', detail: 'Barcelona complete a historic treble with Messi at the heart of the attack.', tag: 'TEAM HONOURS' },
  { year: '2021', title: 'A dream in blue and white', detail: 'Captains Argentina to the Copa América title, his first major senior international trophy.', tag: 'ARGENTINA' },
  { year: '2022', title: 'The ultimate moment', detail: 'Leads Argentina to the FIFA World Cup title in Qatar and wins the Golden Ball.', tag: 'WORLD CHAMPION' },
  { year: '2023', title: 'A new chapter', detail: 'Begins a new adventure in Miami, bringing global attention to football in the United States.', tag: 'INTER MIAMI' },
];

const trophies = [
  { name: 'FIFA World Cup', count: '1', year: '2022', note: 'Argentina' },
  { name: 'Copa América', count: '2', year: '2021 · 2024', note: 'Argentina' },
  { name: 'UEFA Champions League', count: '4', year: '2006 · 2009 · 2011 · 2015', note: 'Barcelona' },
  { name: 'Ballon d’Or', count: '8', year: '2009–2023', note: 'Individual honour' },
  { name: 'La Liga', count: '10', year: 'Barcelona era', note: 'Barcelona' },
  { name: 'Olympic Gold', count: '1', year: '2008', note: 'Argentina U23' },
];

const facts = [
  { value: '8', label: 'Ballon d’Or awards' },
  { value: '1', label: 'FIFA World Cup' },
  { value: '2', label: 'Copa América titles' },
  { value: '4', label: 'Champions League titles' },
];

const quiz = [
  { question: 'Which country did Messi captain to the 2022 World Cup title?', options: ['Spain', 'Argentina', 'Uruguay'], answer: 'Argentina' },
  { question: 'Which club did Messi make his senior debut for?', options: ['Barcelona', 'Inter Miami', 'Paris Saint-Germain'], answer: 'Barcelona' },
  { question: 'How many Ballon d’Or awards had Messi won through 2023?', options: ['6', '7', '8'], answer: '8' },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeEra, setActiveEra] = useState('All');
  const [quizIndex, setQuizIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const filteredTrophies = useMemo(() => trophies.filter((item) =>
    (item.name + ' ' + item.year + ' ' + item.note).toLowerCase().includes(search.toLowerCase())
  ), [search]);

  const eras = ['All', 'Barcelona', 'Argentina', 'Individual honour'];
  const filteredTimeline = achievements.filter((item) =>
    activeEra === 'All' ||
    (activeEra === 'Barcelona' && ['2004', '2009', '2012', '2015'].includes(item.year)) ||
    (activeEra === 'Argentina' && ['2021', '2022'].includes(item.year)) ||
    (activeEra === 'Individual honour' && item.tag.includes('BALLON'))
  );

  const answerQuiz = (option: string) => {
    if (chosen !== null) return;
    setChosen(option);
    if (option === quiz[quizIndex].answer) setScore((value) => value + 1);
  };
  const nextQuestion = () => {
    if (quizIndex === quiz.length - 1) setQuizDone(true);
    else { setQuizIndex((value) => value + 1); setChosen(null); }
  };
  const resetQuiz = () => { setQuizIndex(0); setChosen(null); setScore(0); setQuizDone(false); };

  const links = [['Story', '#story'], ['Timeline', '#timeline'], ['Honours', '#honours'], ['Moments', '#moments'], ['Quiz', '#quiz']];

  return (
    <div className="site-shell">
      <div className="topline"><span><span className="live-dot" /> THE MESSI LEGACY ARCHIVE</span><span>AN UNOFFICIAL FAN PROJECT · MADE FOR FOOTBALL LOVERS</span></div>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Messi Legacy home"><span className="brand-mark">M<span>10</span></span><span className="brand-copy">THE GOAT <small>LEGACY ARCHIVE</small></span></a>
        <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
          {links.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a className="nav-cta" href="#honours" onClick={() => setMenuOpen(false)}>Explore legacy <ArrowUpRight size={15} /></a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-grid" />
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> THE ART OF FOOTBALL <span className="eyebrow-year">1987 — ∞</span></div>
            <h1>ONE OF<br />A <em>KIND.</em></h1>
            <p className="hero-lead">Not just a player. A feeling. A legacy written in impossible dribbles, unforgettable goals, and a dream finally lifted above the world.</p>
            <div className="hero-actions"><a className="button button-gold" href="#story">Explore his story <ArrowUpRight size={17} /></a><a className="text-link" href="#timeline"><CirclePlay size={17} /> Relive the journey</a></div>
            <div className="hero-signature"><span className="signature-line" /> LIONEL ANDRÉS MESSI <span className="signature-muted">— THE NUMBER 10</span></div>
          </div>
          <div className="hero-art" aria-label="Stylized Argentina number 10 football tribute">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="hero-vertical">THE BEAUTIFUL GAME · THE BEAUTIFUL GAME ·</div>
            <div className="hero-number">10</div>
            <div className="hero-art-label"><span className="art-label-top">ARGENTINA</span><strong>THE DREAM<br />BECAME REAL.</strong><span className="art-label-bottom">QATAR · 2022 WORLD CHAMPIONS</span></div>
            <div className="star star-a">✳</div><div className="star star-b">✦</div>
          </div>
          <a className="scroll-cue" href="#story"><ArrowDown size={15} /> SCROLL TO DISCOVER</a>
        </section>

        <section className="stat-strip" aria-label="Career highlights">
          {facts.map((fact, i) => <div className="stat-item" key={fact.label}><span className="stat-index">0{i + 1}</span><strong>{fact.value}</strong><span>{fact.label}</span></div>)}
        </section>

        <section className="section story-section" id="story">
          <div className="section-kicker">01 / THE STORY</div>
          <div className="story-grid">
            <div><h2>Small in stature.<br /><em>Immense</em> in impact.</h2></div>
            <div className="story-text"><p className="large-copy">Rosario gave football a boy who saw the game differently. Barcelona gave him a stage. Argentina gave him a dream. And the world got to watch it all unfold.</p><p>From the first steps at La Masia to nights that stopped millions in their tracks, Messi’s story is about vision, resilience, teamwork and a left foot that seems to speak its own language.</p><a href="#timeline" className="inline-link">Follow the milestones <ArrowUpRight size={16} /></a></div>
          </div>
          <div className="quote-band"><span className="quote-mark">“</span><p>Some players play the game.<br /><em>Some players change how it is played.</em></p><span className="quote-credit">A TRIBUTE TO THE BEAUTIFUL GAME</span></div>
        </section>

        <section className="section timeline-section" id="timeline">
          <div className="section-heading"><div><div className="section-kicker">02 / THE JOURNEY</div><h2>Every era. <em>One legacy.</em></h2></div><p>From a young talent in Rosario to a world champion, every chapter added something unforgettable.</p></div>
          <div className="filter-row" role="group" aria-label="Filter timeline">{eras.map((era) => <button key={era} className={activeEra === era ? 'filter-chip selected' : 'filter-chip'} onClick={() => setActiveEra(era)}>{era}</button>)}</div>
          <div className="timeline-list">{filteredTimeline.map((item, i) => <article className="timeline-card" key={item.year}><div className="timeline-year">{item.year}</div><div className="timeline-marker"><span /></div><div className="timeline-content"><span className="mini-tag">{item.tag}</span><h3>{item.title}</h3><p>{item.detail}</p></div><span className="timeline-number">{String(i + 1).padStart(2, '0')}</span></article>)}</div>
        </section>

        <section className="honours-section" id="honours">
          <div className="section honours-inner">
            <div className="section-heading honours-heading"><div><div className="section-kicker">03 / THE HONOURS</div><h2>A cabinet of <em>greatness.</em></h2></div><p>A selection of defining team and individual honours. Counts reflect the listed competition, not a combined trophy total.</p></div>
            <label className="search-box"><span className="sr-only">Search honours</span><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search honours, club or year..." /></label>
            <div className="trophy-grid">{filteredTrophies.map((item, i) => <article className="trophy-card" key={item.name}><div className="trophy-card-top"><span className="trophy-icon"><Trophy size={21} /></span><span className="trophy-count">{item.count}<small>{item.count === '8' ? ' AWARDS' : ' TITLE' + (item.count === '1' ? '' : 'S')}</small></span></div><div><div className="trophy-year">{item.year}</div><h3>{item.name}</h3><p>{item.note}</p></div><span className="trophy-watermark">{String(i + 1).padStart(2, '0')}</span></article>)}</div>
            {filteredTrophies.length === 0 && <p className="empty-state">No honours match “{search}”. Try a club, competition or year.</p>}
            <p className="fine-print"><Shield size={14} /> Statistics are provided as a fan reference and may vary by competition definitions and updates.</p>
          </div>
        </section>

        <section className="section moments-section" id="moments">
          <div className="section-heading"><div><div className="section-kicker">04 / THE FEELING</div><h2>More than <em>moments.</em></h2></div><p>There are goals. Then there are the seconds when the whole world knows it has seen something special.</p></div>
          <div className="moment-grid">
            <article className="moment-card moment-world"><div className="moment-watermark">10</div><span className="moment-label">18 DECEMBER 2022</span><div><span className="moment-icon"><Globe2 size={20} /></span><h3>The world<br />in his hands.</h3><p>Argentina lift the World Cup after a final for the ages.</p></div><span className="moment-foot">QATAR · WORLD CUP FINAL</span></article>
            <article className="moment-card moment-barca"><div className="moment-watermark">FCB</div><span className="moment-label">THE BARCELONA YEARS</span><div><span className="moment-icon"><Zap size={20} /></span><h3>Impossible<br />made routine.</h3><p>Defenders set traps. Messi found a way through them.</p></div><span className="moment-foot">BARCELONA · AN ERA</span></article>
            <article className="moment-card moment-copa"><div className="moment-watermark">ARG</div><span className="moment-label">A DREAM REALISED</span><div><span className="moment-icon"><Award size={20} /></span><h3>For the<br />blue and white.</h3><p>A national-team journey crowned with continental and world glory.</p></div><span className="moment-foot">ARGENTINA · ALBICELESTE</span></article>
          </div>
        </section>

        <section className="quiz-section" id="quiz"><div className="quiz-glow" /><div className="section quiz-inner"><div className="section-kicker">05 / THE FAN TEST</div><div className="quiz-layout"><div><h2>Think you know<br /><em>the number 10?</em></h2><p>Three quick questions. No VAR needed.</p><div className="quiz-progress"><span style={{ width: quizDone ? '100%' : ((quizIndex + (chosen ? 1 : 0)) / quiz.length * 100) + '%' }} /></div><span className="quiz-progress-label">{quizDone ? 'FULL TIME' : 'QUESTION ' + (quizIndex + 1) + ' OF ' + quiz.length}</span></div><div className="quiz-panel">{quizDone ? <><Sparkles size={28} className="quiz-sparkle" /><span className="mini-tag">FINAL SCORE</span><h3>{score} / {quiz.length}</h3><p>{score === quiz.length ? 'Perfect score. A true Messi expert.' : score >= 2 ? 'Great effort. You know your football.' : 'Back to the highlights — another round awaits.'}</p><button className="button button-gold" onClick={resetQuiz}>Play again <ArrowUpRight size={16} /></button></> : <><span className="quiz-question-number">Q0{quizIndex + 1}</span><h3>{quiz[quizIndex].question}</h3><div className="quiz-options">{quiz[quizIndex].options.map((option) => <button key={option} className={'quiz-option' + (chosen ? option === quiz[quizIndex].answer ? ' correct' : option === chosen ? ' incorrect' : '' : '')} onClick={() => answerQuiz(option)} disabled={chosen !== null}>{option}<span>{chosen && option === quiz[quizIndex].answer ? '✓' : chosen === option ? '×' : '↗'}</span></button>)}</div>{chosen && <div className="quiz-feedback"><p>{chosen === quiz[quizIndex].answer ? 'Correct! Great knowledge.' : 'Not quite — the answer is ' + quiz[quizIndex].answer + '.'}</p><button className="inline-link" onClick={nextQuestion}>{quizIndex === quiz.length - 1 ? 'See result' : 'Next question'} <ArrowUpRight size={15} /></button></div>}</>}</div></div></div></section>
      </main>

      <footer className="site-footer"><a className="brand footer-brand" href="#home"><span className="brand-mark">M<span>10</span></span><span className="brand-copy">THE GOAT <small>LEGACY ARCHIVE</small></span></a><p>An independent fan-made tribute to Lionel Messi.<br />Not affiliated with Lionel Messi, his clubs, or any football association.</p><a className="back-top" href="#home">BACK TO TOP <ChevronDown size={14} /></a><span className="footer-bottom">BUILT FOR THE LOVE OF FOOTBALL <span>© {new Date().getFullYear()} MESSI LEGACY ARCHIVE</span></span></footer>
    </div>
  );
}
