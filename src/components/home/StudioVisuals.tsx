import { useEffect, useRef, type ReactNode } from 'react';

const ink = 'var(--theme-text)';
const paper = 'var(--theme-bg)';

// Deterministic variation keeps server and client rendering identical.
const noise = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

function Study({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      el.style.setProperty('--study-play', entry.isIntersecting ? 'running' : 'paused');
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="material-study">
    <svg viewBox="0 0 480 400" role="img" aria-label={label} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>{children}</svg>
    <style>{`
      .material-study { --study-play: paused; width: 100%; }
      .material-study .resolve-mark {
        animation: resolve-material 20s cubic-bezier(.45,0,.2,1) infinite;
        animation-delay: var(--delay);
        animation-play-state: var(--study-play);
      }
      .material-study .discard-mark {
        animation: discard-material 20s cubic-bezier(.45,0,.2,1) infinite;
        animation-delay: var(--delay);
        animation-play-state: var(--study-play);
        opacity: 0;
      }
      .material-study .woven-unit {
        transform-box: fill-box;
        transform-origin: center;
        animation: breathe-material 20s cubic-bezier(.45,0,.2,1) infinite;
        animation-delay: var(--delay);
        animation-play-state: var(--study-play);
      }
      .material-study .resolved-surface {
        animation: finish-material 20s ease infinite;
        animation-play-state: var(--study-play);
      }
      @keyframes finish-material {
        0%, 24%, 100% { opacity: 0; }
        38%, 86% { opacity: 1; }
      }
      @keyframes resolve-material {
        0%, 7%, 100% { transform: translate(var(--dx), var(--dy)) rotate(var(--turn)); opacity: .3; }
        34% { transform: translate(0,0) rotate(0); opacity: 1; }
        40%, 86% { transform: translate(0,0) rotate(0); opacity: 0; }
      }
      @keyframes discard-material {
        0%, 7%, 100% { transform: translate(0,0); opacity: .28; }
        30%, 88% { transform: translate(var(--dx), var(--dy)); opacity: 0; }
      }
      @keyframes breathe-material {
        0%, 5%, 100% { transform: translate(var(--dx), var(--dy)) scale(.58) rotate(-18deg); opacity: .45; }
        32%, 86% { transform: translate(0,0) scale(1) rotate(0); opacity: 1; }
      }
      @media (prefers-reduced-motion: reduce) {
        .material-study .resolve-mark, .material-study .discard-mark, .material-study .woven-unit, .material-study .resolved-surface { animation: none; }
      }
    `}</style>
  </div>;
}

export function WhatIDoVisual() {
  // Judgment edits: competing marks recede; selected marks hold their place.
  // The final silhouette is defined as much by what is absent as what remains.
  const radius = 128;
  const marks = Array.from({ length: 43 }, (_, i) => {
    const y = (i - 21) * 6;
    const half = Math.sqrt(Math.max(0, radius * radius - y * y));
    return { y, half, i };
  });
  return <Study label="Judgment: competing possibilities fall away while chosen marks hold, revealing a deliberate form through what is kept and what is left out.">
    <g transform="translate(240 200) rotate(-24)">
      {Array.from({ length: 32 }, (_, i) => {
        const angle = noise(i + 303) * Math.PI * 2;
        const radius = 100 + noise(i + 403) * 65;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return <g key={`discard-${i}`} transform={`translate(${x} ${y}) rotate(${noise(i + 503) * 70 - 35})`}>
          <path className="discard-mark" d={`M-18 0h${24 + noise(i + 603) * 35}`} stroke={ink} strokeWidth="1.5" style={{
            '--dx': `${Math.cos(angle) * 20}px`,
            '--dy': `${Math.sin(angle) * 20}px`,
            '--delay': '0s',
          } as React.CSSProperties} />
        </g>;
      })}
      {marks.map(({ y, half, i }) => <g key={i} transform={`translate(0 ${y})`}>
        <g className="resolve-mark" style={{
          '--dx': `${(noise(i + 1) - .5) * 115}px`,
          '--dy': `${(noise(i + 51) - .5) * 38}px`,
          '--turn': `${(noise(i + 91) - .5) * 22}deg`,
          '--delay': '0s',
        } as React.CSSProperties}>
          <path d={`M${-half} 0 H${half}`} stroke={ink} strokeWidth="5.8" />
        </g>
      </g>)}
      <circle className="resolved-surface" r="128" fill={ink} />
      <path d="M0-52 52 0 0 52-52 0Z" fill={paper} />
    </g>
  </Study>;
}

export function TheCraftVisual() {
  // Shared tile edges meet exactly: the final state is one continuous surface,
  // rather than a collection of floating components. The hold makes it readable.
  const units = Array.from({ length: 64 }, (_, i) => {
    const row = Math.floor(i / 8);
    const col = i % 8;
    const x = col - 3.5;
    const y = row - 3.5;
    return { i, x, y, distance: Math.hypot(x, y), angle: noise(i + 901) > .5 ? 90 : 0 };
  });
  return <Study label="Craft systems: individual pieces assemble into a finished woven surface. Every curve meets its neighbor through a shared rule.">
    <defs>
      <g id="craft-rule-primitive">
        <rect x="-16.1" y="-16.1" width="32.2" height="32.2" fill={ink} />
        <path d="M-16 0A16 16 0 0 0 0-16M0 16A16 16 0 0 1 16 0" stroke={paper} strokeWidth="4" fill="none" />
      </g>
    </defs>
    <g transform="translate(240 200) rotate(-12)">
      {units.map(({ i, x, y, distance, angle }) => <g key={i} transform={`translate(${x * 32} ${y * 32})`}>
        <g className="woven-unit" style={{
          '--delay': `${distance * .16}s`,
          '--dx': `${x * 6}px`,
          '--dy': `${y * 6}px`,
        } as React.CSSProperties}>
          <use href="#craft-rule-primitive" transform={`rotate(${angle})`} />
        </g>
      </g>)}
      <rect className="resolved-surface" x="-132" y="-132" width="264" height="264" rx="2" fill="none" stroke={ink} strokeWidth="1.5" />
    </g>
  </Study>;
}
