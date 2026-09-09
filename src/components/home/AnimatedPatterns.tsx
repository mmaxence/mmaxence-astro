import { useEffect, useRef } from 'react';

// SVG paths extracted from existing SVGs
const svgPaths = {
  p8b33500: 'M6 72L72 6L138 72L72 138L6 72Z', // Diamond
  p9320100: 'M72 4L130.89 38V106L72 140L13.1103 106L13.1103 38L72 4Z', // Hexagon
};

// --- Shape components ---

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[144px]">
      <svg
        className="block size-full"
        style={{ overflow: 'visible' }}
        fill="none"
        stroke="var(--theme-bg)"
        strokeWidth="8"
        strokeLinejoin="round"
        paintOrder="stroke fill"
        preserveAspectRatio="none"
        viewBox="0 0 144 144"
      >
        {children}
      </svg>
    </div>
  );
}

function Diamond() {
  return (
    <Wrapper>
      <g>
        <path d={svgPaths.p8b33500} fill="var(--theme-text, currentColor)" />
      </g>
    </Wrapper>
  );
}

function Circle() {
  return (
    <Wrapper>
      <circle cx="72" cy="72" r="64" fill="var(--theme-text, currentColor)" />
    </Wrapper>
  );
}

function Hexagon() {
  return (
    <Wrapper>
      <g>
        <path d={svgPaths.p9320100} fill="var(--theme-text, currentColor)" />
      </g>
    </Wrapper>
  );
}

const SHAPES = [
  { id: 'diamond', component: Diamond },
  { id: 'circle', component: Circle },
  { id: 'hexagon', component: Hexagon },
];

// Separate orbital and bloom layers keep cursor motion continuous during a flip.
const ORBITS = [
  { angle: -1.18, radius: 105, size: 40, phase: 0, speed: 0.095 },
  { angle: 1.02, radius: 102, size: 30, phase: 2.1, speed: 0.078 },
  { angle: 3.4, radius: 108, size: 50, phase: 4.3, speed: 0.086 },
];

// Layered, incommensurate waves give each orbit a wandering path without jitter.
// A per-mount seed varies the motion while the initial render stays stable.
function projectOrbit(orbit: typeof ORBITS[number], time: number, dx = 0, dy = 0, seed = 0, reach = 112) {
  const phase = orbit.phase + seed;
  const easeIn = Math.min(1, time / 4);
  const wander = (Math.sin(time * 0.19 + phase) * 0.48
    + Math.sin(time * 0.37 + phase * 1.7) * 0.22) * easeIn;
  const angle = orbit.angle + time * orbit.speed + wander;
  const depth = Math.sin(angle + 0.55 + orbit.phase * 0.12
    + Math.sin(time * 0.23 + phase) * 0.48 * easeIn);
  const scale = 1 + depth * 0.32;
  const breathing = (Math.sin(time * 0.27 + phase) * 20
    + Math.sin(time * 0.43 + phase * 2.3) * 11) * easeIn;
  const radius = orbit.radius * (1 + depth * 0.20) + breathing;
  const tilt = 0.83 + Math.sin(time * 0.17 + phase) * 0.13 * easeIn;
  let x = Math.cos(angle) * radius + dx;
  let y = Math.sin(angle) * radius * tilt + dy;
  const distance = Math.hypot(x, y);
  // More room sideways on desktop; preserve the headline and narrow-screen gutters.
  const outer = distance / Math.max(Math.hypot(x / reach, y / 112), 0.001);
  const bounded = Math.max(90 - orbit.size * scale * 0.12, Math.min(outer, distance));
  x *= bounded / Math.max(distance, 1);
  y *= bounded / Math.max(distance, 1);
  const tumble = Math.sin(time * 0.31 + phase) * 22 * easeIn;
  return { x: 140 + x, y: 132 + y, depth, scale, angle, tumble };
}

function orbitTransform(orbit: typeof ORBITS[number], position: ReturnType<typeof projectOrbit>) {
  const rotation = Math.sin(position.angle * 0.7 + orbit.phase) * 32 + position.tumble;
  return `translate(${position.x - orbit.size / 2}px, ${position.y - orbit.size / 2}px) rotate(${rotation}deg) scale(${position.scale})`;
}

export function AnimatedPatterns() {
  const rootRef = useRef<HTMLDivElement>(null);
  const orbitRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bloomRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const hero = root?.closest('.home-hero');
    const zone = root?.closest('.hero-profile-wrapper');
    if (!hero || !zone) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const seeds = ORBITS.map(() => Math.random() * Math.PI * 2);
    const wide = window.matchMedia('(min-width: 768px)');
    const springs = ORBITS.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }));
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;
    let last = 0;
    let time = 0;
    let visible = true;
    const animations = new Set<Animation>();

    const move = (event: Event) => {
      const e = event as PointerEvent;
      if (!fine.matches || e.pointerType === 'touch') return;
      const rect = zone.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const leave = () => { pointer = null; };
    const tick = (now: number) => {
      frame = 0;
      const dt = Math.min((now - (last || now)) / 1000, 0.032);
      last = now;
      if (!reduced.matches) time += dt;
      ORBITS.forEach((orbit, i) => {
        const el = orbitRefs.current[i];
        if (!el) return;
        const { x, y } = projectOrbit(orbit, time, 0, 0, seeds[i], wide.matches ? 156 : 112);
        let tx = 0;
        let ty = 0;
        if (pointer && !reduced.matches) {
          const dx = pointer.x - x;
          const dy = pointer.y - y;
          const distance = Math.hypot(dx, dy);
          // A small attraction from nearby, turning into a soft repulsion up close.
          const influence = Math.max(0, 1 - distance / 280);
          const force = 20 * influence - 38 * Math.exp(-Math.pow(distance / 65, 2));
          tx = dx / Math.max(distance, 1) * force;
          ty = dy / Math.max(distance, 1) * force;
        }
        const spring = springs[i];
        if (reduced.matches) spring.x = spring.y = spring.vx = spring.vy = 0;
        else {
          const stiffness = 38 + i * 7;
          spring.vx += ((tx - spring.x) * stiffness - spring.vx * 11) * dt;
          spring.vy += ((ty - spring.y) * stiffness - spring.vy * 11) * dt;
          spring.x += spring.vx * dt;
          spring.y += spring.vy * dt;
        }
        const position = projectOrbit(orbit, time, spring.x, spring.y, seeds[i], wide.matches ? 156 : 112);
        el.style.transform = orbitTransform(orbit, position);
        el.style.zIndex = position.depth >= 0 ? '2' : '0';
        el.style.opacity = String(0.88 + (position.depth + 1) * 0.06);

      });
      if (visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(tick);
    };
    const resume = () => {
      if (reduced.matches) {
        animations.forEach(a => a.cancel());
        animations.clear();
      }
      cancelAnimationFrame(frame);
      last = 0;
      tick(performance.now());
    };
    const onFlip = () => {
      if (reduced.matches) return;
      animations.forEach(a => a.cancel());
      animations.clear();
      bloomRefs.current.forEach((el, i) => {
        if (!el) return;
        const animation = el.animate([
          { transform: 'scale(1)' },
          { transform: 'scale(0.82)', offset: 0.22 },
          { transform: 'scale(1.12)', offset: 0.56 },
          { transform: 'scale(1)' },
        ], { duration: 1100, delay: i * 65, easing: 'cubic-bezier(.22,.61,.36,1)' });
        animations.add(animation);
        animation.finished.then(() => animations.delete(animation)).catch(() => {});
      });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      resume();
    });
    observer.observe(hero);
    hero.addEventListener('pointermove', move, { passive: true });
    hero.addEventListener('pointerleave', leave);
    document.addEventListener('hero-flip', onFlip);
    document.addEventListener('visibilitychange', resume);
    reduced.addEventListener('change', resume);
    resume();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      animations.forEach(a => a.cancel());
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', leave);
      document.removeEventListener('hero-flip', onFlip);
      document.removeEventListener('visibilitychange', resume);
      reduced.removeEventListener('change', resume);
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
      {SHAPES.map((shape, i) => {
        const Component = shape.component;
        const orbit = ORBITS[i];
        const position = projectOrbit(orbit, 0);
        return (
          <div key={shape.id} ref={el => { orbitRefs.current[i] = el; }} style={{
            position: 'absolute', top: 0, left: 0, width: orbit.size, height: orbit.size,
            transform: orbitTransform(orbit, position),
            zIndex: position.depth >= 0 ? 2 : 0,
            opacity: 0.88 + (position.depth + 1) * 0.06,
            willChange: 'transform',
          }}>
            <div ref={el => { bloomRefs.current[i] = el; }} style={{ width: '100%', height: '100%' }}>
              <div style={{ transform: `scale(${orbit.size / 144})`, transformOrigin: 'top left' }}><Component /></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
