import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Gamepad2,
  Code2,
  Menu,
  Moon,
  Send,
  Settings2,
  Sun,
  X,
} from 'lucide-react';

const GITHUB_URL = 'https://github.com/evorez';
const TELEGRAM_URL = 'https://t.me/evorez';

function readPreference(key, allowed, fallback) {
  try {
    const value = localStorage.getItem(key);
    return allowed.includes(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <path d="M7 7h19v4H11v3h12v4H11v3h15v4H7V7Z" fill="currentColor" />
      </svg>
    </span>
  );
}

function Appearance({ theme, setTheme, accent, setAccent }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const dismiss = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="appearance" ref={containerRef}>
      <button
        className="icon-button appearance-trigger"
        ref={buttonRef}
        type="button"
        aria-label="Appearance settings"
        aria-expanded={open}
        aria-controls="appearance-options"
        onClick={() => setOpen((value) => !value)}
      >
        <Settings2 size={17} strokeWidth={1.7} />
      </button>
      {open && (
        <div className="appearance-panel" id="appearance-options">
          <div className="appearance-title">
            <div><span className="mono">MAKE IT YOURS</span><strong>Appearance</strong></div>
            <button className="bare-button panel-close" type="button" aria-label="Close appearance settings" onClick={() => { setOpen(false); buttonRef.current?.focus(); }}><X size={16} /></button>
          </div>
          <fieldset>
            <legend>MODE</legend>
            <div className="theme-options">
              <label>
                <input type="radio" name="theme" value="dark" checked={theme === 'dark'} onChange={() => setTheme('dark')} />
                <span><Moon size={14} /> Dark</span>
              </label>
              <label>
                <input type="radio" name="theme" value="light" checked={theme === 'light'} onChange={() => setTheme('light')} />
                <span><Sun size={14} /> Light</span>
              </label>
            </div>
          </fieldset>
          <fieldset>
            <legend>ACCENT</legend>
            <div className="accent-options">
              {[
                ['matrix', 'Matrix'],
                ['crimson', 'Crimson'],
                ['gold', 'Gold'],
              ].map(([value, label]) => (
                <label key={value}>
                  <input type="radio" name="accent" value={value} checked={accent === value} onChange={() => setAccent(value)} />
                  <span className={`swatch swatch-${value}`}>{accent === value && <Check size={13} strokeWidth={2.5} />}</span>
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <p className="appearance-note">A little more you, a little less default.</p>
        </div>
      )}
    </div>
  );
}

function Header({ theme, setTheme, accent, setAccent }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const updateActiveSection = () => {
      let current = 'top';
      for (const id of ['queue', 'about', 'arcade', 'connect']) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= 160) current = id;
      }
      setActiveSection(current);
    };
    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    return () => window.removeEventListener('scroll', updateActiveSection);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#top" onClick={() => setMenuOpen(false)}>
          <BrandMark />
          <span className="brand-type"><strong>evorez<span>.</span></strong><small>AN INDEPENDENT SPACE</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a className={activeSection === 'top' ? 'nav-active' : undefined} aria-current={activeSection === 'top' ? 'location' : undefined} href="#top">Home</a>
          <a className={activeSection === 'queue' ? 'nav-active' : undefined} aria-current={activeSection === 'queue' ? 'location' : undefined} href="#queue">The queue</a>
          <a className={activeSection === 'about' ? 'nav-active' : undefined} aria-current={activeSection === 'about' ? 'location' : undefined} href="#about">About</a>
          <a className={activeSection === 'arcade' ? 'nav-active' : undefined} aria-current={activeSection === 'arcade' ? 'location' : undefined} href="#arcade">Arcade <span className="nav-dot" /></a>
        </nav>
        <div className="header-actions">
          <Appearance theme={theme} setTheme={setTheme} accent={accent} setAccent={setAccent} />
          <a className="header-contact" href={TELEGRAM_URL} target="_blank" rel="noreferrer">LET'S CONNECT <ArrowUpRight size={15} /></a>
          <button
            className="icon-button menu-toggle"
            ref={menuButtonRef}
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <nav className="mobile-nav container" id="mobile-menu" aria-label="Mobile navigation" hidden={!menuOpen}>
        <a href="#top" onClick={() => setMenuOpen(false)}>Home <span>01</span></a>
        <a href="#queue" onClick={() => setMenuOpen(false)}>The queue <span>02</span></a>
        <a href="#about" onClick={() => setMenuOpen(false)}>About <span>03</span></a>
        <a href="#arcade" onClick={() => setMenuOpen(false)}>Arcade <span>04</span></a>
        <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>Let's connect <ArrowUpRight size={18} /></a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero container" aria-labelledby="hero-heading">
      <div className="hero-topline mono">
        <span><span className="status-dot" /> A PERSONAL SPACE ON THE INTERNET</span>
        <span className="hero-topline-right">INDEPENDENT BY NATURE <span className="topline-slash">/</span> ALWAYS IN PROGRESS</span>
      </div>
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-eyebrow mono"><span className="eyebrow-line" /> HEY, I'M EVOREZ <span className="eyebrow-number">/ 001</span></p>
          <h1 id="hero-heading">Still here.<br /><span>Still <em>building.</em></span></h1>
          <p className="hero-description">Welcome to my little corner of the internet — a space for ideas, experiments, and whatever comes next.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#queue">EXPLORE THE QUEUE <ArrowDown size={17} /></a>
            <a className="text-link" href="#about">A LITTLE ABOUT ME <ArrowUpRight size={15} /></a>
          </div>
          <div className="hero-signoff">
            <span className="signoff-mark" aria-hidden="true">✳</span>
            <p><strong>MADE TO KEEP EVOLVING</strong><br /><span>GOOD THINGS TAKE THEIR TIME.</span></p>
          </div>
        </div>
        <figure className="hero-visual" aria-label="Abstract orbital sculpture representing an evolving signal">
          <img src="/images/signal-orb.webp" alt="" fetchPriority="high" />
          <div className="visual-overlay" />
          <div className="visual-top mono"><span>FIG. 01 <span className="visual-separator">/</span> THE SIGNAL</span><span>EVZ—001</span></div>
          <div className="visual-side mono">NOISE: LOW &nbsp; / &nbsp; SIGNAL: ON</div>
          <figcaption className="visual-bottom">
            <div className="visual-caption-left"><span className="visual-spark" aria-hidden="true">✳</span><span><strong>ALL EYES<br />ON YOU.</strong><small>STILL HERE. STILL BUILDING.</small></span></div>
            <span className="visual-live mono"><span className="status-dot" /> LIVE SIGNAL</span>
          </figcaption>
          <span className="visual-corner visual-corner-top" aria-hidden="true" />
          <span className="visual-corner visual-corner-bottom" aria-hidden="true" />
        </figure>
      </div>
      <div className="status-strip" aria-label="Current status">
        <div className="status-item">
          <span className="status-label mono">01 / STATUS</span>
          <p><span className="status-dot" /> alive <small>&amp; online</small></p>
        </div>
        <div className="status-item">
          <span className="status-label mono">02 / PROJECTS</span>
          <p>00 <small>— not yet</small></p>
        </div>
        <div className="status-item">
          <span className="status-label mono">03 / NEXT DROP</span>
          <p>soon<sup>™</sup> <small>when it's ready</small></p>
        </div>
        <div className="status-item status-mood">
          <span className="status-label mono">04 / CURRENT MOOD</span>
          <p>( ◡‿◡ ) <small>calm &amp; curious</small></p>
        </div>
      </div>
    </section>
  );
}

const projects = [
  {
    number: '01',
    type: 'EXPERIMENT / AI',
    status: 'BUILDING',
    title: 'Agent runtime',
    description: 'An idea in development, coming together one piece at a time.',
    progress: 12,
    kind: 'runtime',
  },
  {
    number: '02',
    type: 'IDEA / TOOLING',
    status: 'THINKING',
    title: 'Eval suite for diffs',
    description: 'An early idea exploring a better way to evaluate changes.',
    progress: null,
    kind: 'eval',
  },
  {
    number: '03',
    type: 'PERSONAL / THE WEB',
    status: 'IN PROGRESS',
    title: 'This site, version 2',
    description: 'A fresh chapter for this little corner of the internet.',
    progress: null,
    kind: 'site',
  },
];

function ProjectVisual({ kind }) {
  if (kind === 'runtime') {
    return (
      <svg className="project-svg" viewBox="0 0 360 150" fill="none" aria-hidden="true">
        <circle cx="180" cy="75" r="50" />
        <circle cx="180" cy="75" r="33" strokeDasharray="2 5" />
        <ellipse cx="180" cy="75" rx="100" ry="34" transform="rotate(-22 180 75)" />
        <path d="M58 75h42M260 75h42M180 9v15M180 126v15" />
        <circle className="svg-accent-fill" cx="180" cy="75" r="7" />
        <circle className="svg-accent-fill" cx="266" cy="42" r="4" />
        <circle className="svg-accent-fill" cx="94" cy="108" r="3" />
      </svg>
    );
  }
  if (kind === 'eval') {
    return (
      <svg className="project-svg" viewBox="0 0 360 150" fill="none" aria-hidden="true">
        <rect x="85" y="30" width="78" height="90" rx="2" />
        <rect x="197" y="30" width="78" height="90" rx="2" />
        <path d="M100 50h32M100 63h46M100 76h37M100 89h43M100 102h26M212 50h37M212 63h45M212 76h28M212 89h45M212 102h34" />
        <path d="M163 75h34" strokeDasharray="3 4" />
        <path className="svg-accent" d="M115 18v16M107 26h16M230 127h16" />
        <circle className="svg-accent-fill" cx="180" cy="75" r="3" />
      </svg>
    );
  }
  return (
    <svg className="project-svg" viewBox="0 0 360 150" fill="none" aria-hidden="true">
      <rect x="91" y="28" width="146" height="92" rx="3" />
      <rect x="123" y="43" width="146" height="92" rx="3" className="svg-site-front" />
      <path d="M123 60h146M135 51h2M143 51h2M151 51h2M142 78h43M142 88h65M142 98h55M142 115h29" />
      <path className="svg-accent" d="M223 78h23v5h-17v5h14v5h-14v5h17v5h-23V78Z" />
      <path d="M76 37h8M80 33v8M278 117h8M282 113v8" />
    </svg>
  );
}

function Queue() {
  return (
    <section className="queue-section section container" id="queue" aria-labelledby="queue-heading">
      <div className="section-topline mono"><span>01 <span>/</span> THE QUEUE</span><span className="topline-note">A LITTLE LOOK BEHIND THE SCENES</span></div>
      <div className="section-heading-row">
        <div>
          <h2 id="queue-heading">Things in <em>motion.</em></h2>
        </div>
        <p>Not a roadmap. Just a few ideas taking shape, at their own pace.</p>
      </div>
      <div className="project-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.number}>
            <div className="project-card-top mono"><span>{project.type}</span><span>0{project.number} / EVZ</span></div>
            <div className={`project-art project-art-${project.kind}`}><ProjectVisual kind={project.kind} /></div>
            <div className="project-content">
              <div className="project-status mono"><span className="tiny-square" /> {project.status}</div>
              <h3>{project.title}<span>.</span></h3>
              <p>{project.description}</p>
              <div className="project-progress-label mono"><span>{project.progress !== null ? 'BUILD PROGRESS' : 'STATUS'}</span><span>{project.progress !== null ? `${project.progress}%` : '— — —'}</span></div>
              {project.progress !== null ? (
                <div className="progress-track" role="progressbar" aria-label={`${project.title} build progress`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={project.progress}>
                  <span style={{ width: `${project.progress}%` }} />
                </div>
              ) : <div className="progress-track" aria-hidden="true" />}
            </div>
          </article>
        ))}
      </div>
      <div className="queue-footnote mono"><span><span className="footnote-star">✳</span> NOTHING HERE IS A PROMISE. IT'S A DIRECTION.</span><span>03 ITEMS &nbsp; / &nbsp; NO DEADLINES</span></div>
    </section>
  );
}

function About() {
  return (
    <section className="about-section section container" id="about" aria-labelledby="about-heading">
      <div className="section-topline mono"><span>02 <span>/</span> A LITTLE ABOUT THIS SPACE</span><span className="topline-note">MADE WITH CURIOSITY</span></div>
      <div className="about-grid">
        <div className="about-copy">
          <h2 id="about-heading">No rush.<br /><em>Just curiosity.</em></h2>
          <p>This page exists because I'm alive. It's a quiet place to make things, follow ideas, and see where they lead.</p>
          <p>No big promises. Just a work in progress, made one step at a time.</p>
          <a className="underlined-link" href={GITHUB_URL} target="_blank" rel="noreferrer">FIND ME ON GITHUB <ArrowUpRight size={17} /></a>
        </div>
        <blockquote className="quote-card">
          <div className="quote-top mono"><span>A NOTE TO SELF</span><span>EVZ / 002</span></div>
          <span className="quote-symbol" aria-hidden="true">“</span>
          <p>everything takes time.<br /><em>this one is taking its time.</em></p>
          <div className="quote-bottom mono"><span>END OF LINE_</span><span>✳</span></div>
        </blockquote>
      </div>
    </section>
  );
}

function Arcade({ onOpen }) {
  return (
    <section className="arcade-section section container" id="arcade" aria-labelledby="arcade-heading">
      <div className="arcade-card">
        <div className="arcade-icon-wrap" aria-hidden="true">
          <span className="arcade-icon-corner arcade-icon-corner-one">+</span>
          <Gamepad2 className="arcade-icon" strokeWidth={0.85} />
          <span className="arcade-icon-corner arcade-icon-corner-two">✳</span>
          <span className="arcade-icon-label mono">PLAYER 01 / STANDBY</span>
        </div>
        <div className="arcade-copy">
          <span className="arcade-kicker mono">03 / AFTER HOURS &nbsp; ✳ &nbsp; ARCADE.EXE</span>
          <h2 id="arcade-heading">A little room<br />for <em>play.</em></h2>
          <p>The arcade is being rebuilt from scratch. No games just yet, but the first drop will land right here.</p>
          <button className="button arcade-button" type="button" onClick={onOpen}>CHECK THE ARCADE <ArrowUpRight size={17} /></button>
        </div>
        <span className="arcade-side mono">GOOD THINGS TAKE TIME &nbsp; / &nbsp; EVZ ARCADE</span>
      </div>
    </section>
  );
}

function ArcadeDialog({ open, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      className="arcade-dialog"
      ref={dialogRef}
      aria-labelledby="arcade-dialog-title"
      aria-describedby="arcade-dialog-description"
      onClose={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="dialog-top mono"><span>ARCADE.EXE <span>/</span> PLAYER 01</span><button className="dialog-close" type="button" aria-label="Close arcade" onClick={onClose}><X size={19} /></button></div>
      <div className="dialog-art" aria-hidden="true"><span className="dialog-orbit dialog-orbit-one" /><span className="dialog-orbit dialog-orbit-two" /><Gamepad2 size={56} strokeWidth={1} /><span className="dialog-art-dot" /></div>
      <p className="dialog-kicker mono"><span className="status-dot" /> REBUILD IN PROGRESS</p>
      <h2 id="arcade-dialog-title">No games yet<span>.</span></h2>
      <p id="arcade-dialog-description">Everything was taken down — the arcade is being rebuilt from scratch. The first drop lands right here.</p>
      <button className="button button-primary dialog-back" type="button" onClick={onClose}>BACK TO THE SITE <ArrowRight size={17} /></button>
      <p className="dialog-bottom mono">GOOD THINGS TAKE TIME &nbsp; / &nbsp; END OF LINE_</p>
    </dialog>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer" id="connect">
      <div className="container">
        <div className="footer-top">
          <div className="footer-heading">
            <p className="section-topline mono"><span>04 <span>/</span> SAY HELLO</span></p>
            <h2>Until the <em>next thing.</em></h2>
            <p>Have a thought, an idea, or just want to say hello? My little corner of the internet is always open.</p>
          </div>
          <div className="footer-links">
            <a href={GITHUB_URL} target="_blank" rel="noreferrer"><span><Code2 size={19} /> GitHub <small>@evorez</small></span><ArrowUpRight size={19} /></a>
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer"><span><Send size={19} /> Telegram <small>@evorez</small></span><ArrowUpRight size={19} /></a>
          </div>
        </div>
        <div className="footer-wordmark" aria-hidden="true">evorez<span>.</span></div>
        <div className="footer-bottom mono"><span>© {year} EVOREZ <span className="footer-divider">/</span> MADE TO KEEP EVOLVING</span><a href="#top">BACK TO THE TOP ↑</a><span><span className="status-dot" /> STILL ALIVE, STILL BUILDING</span></div>
      </div>
    </footer>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => readPreference('evorez-theme', ['dark', 'light'], 'dark'));
  const [accent, setAccent] = useState(() => readPreference('evorez-accent', ['matrix', 'crimson', 'gold'], 'matrix'));
  const [arcadeOpen, setArcadeOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('evorez-theme', theme);
      localStorage.setItem('evorez-accent', accent);
    } catch {
      // The site works without saved preferences when storage is unavailable.
    }
    document.documentElement.style.colorScheme = theme;
  }, [theme, accent]);

  return (
    <div className="site" data-theme={theme} data-accent={accent} id="top">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header theme={theme} setTheme={setTheme} accent={accent} setAccent={setAccent} />
      <main id="main-content">
        <Hero />
        <Queue />
        <About />
        <Arcade onOpen={() => setArcadeOpen(true)} />
      </main>
      <Footer />
      <ArcadeDialog open={arcadeOpen} onClose={() => setArcadeOpen(false)} />
    </div>
  );
}
