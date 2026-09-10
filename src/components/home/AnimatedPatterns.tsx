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

// Keep almost the entire silhouette outside the portrait, including the largest
// click bloom. Using the same clearance at every depth avoids a jump at z-index changes.
const portraitClearance = (size: number, scale: number) => 90 + size * scale * 0.45 * 1.12;

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
  const bounded = Math.max(portraitClearance(orbit.size, scale), Math.min(outer, distance));
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
    const creatures = ORBITS.map((orbit, i) => ({
      ...projectOrbit(orbit, 0), vx: 0, vy: 0, away: false,
      readyAt: 3 + i * 1.7 + Math.random() * 2,
      decideAt: 0, speed: 0, bearing: 0, distance: 60, paused: false,
    }));
    let pointer: { x: number; y: number } | null = null;
    let previousPointer: { x: number; y: number; at: number } | null = null;
    let frame = 0;
    let last = 0;
    let time = 0;
    let visible = true;
    const animations = new Set<Animation>();

    const startle = () => {
      creatures.forEach(creature => {
        creature.readyAt = time + 5 + Math.random() * 6;
        creature.decideAt = 0;
      });
    };
    const move = (event: Event) => {
      const e = event as PointerEvent;
      if (!fine.matches || e.pointerType === 'touch') return;
      const at = performance.now();
      if (previousPointer) {
        const elapsed = at - previousPointer.at;
        const distance = Math.hypot(e.clientX - previousPointer.x, e.clientY - previousPointer.y);
        if (elapsed >= 24 && elapsed < 150 && distance > 14 && distance / elapsed > 1.05) startle();
      } else {
        creatures.forEach((creature, i) => {
          creature.readyAt = Math.max(creature.readyAt, time + 2.5 + i * 1.7);
        });
      }
      if (!previousPointer || at - previousPointer.at >= 24) {
        previousPointer = { x: e.clientX, y: e.clientY, at };
      }
      pointer = { x: e.clientX, y: e.clientY };
    };
    const leave = () => { pointer = null; previousPointer = null; };
    const tick = (now: number) => {
      frame = 0;
      const dt = Math.min((now - (last || now)) / 1000, 0.032);
      last = now;
      if (!reduced.matches) time += dt;
      const rect = zone.getBoundingClientRect();
      const bounds = hero.getBoundingClientRect();
      const curious = pointer && fine.matches && !reduced.matches && visible && !document.hidden
        && pointer.x >= bounds.left && pointer.x <= bounds.right
        && pointer.y >= bounds.top && pointer.y <= bounds.bottom;
      ORBITS.forEach((orbit, i) => {
        const el = orbitRefs.current[i];
        if (!el) return;
        const home = projectOrbit(orbit, time, 0, 0, seeds[i], wide.matches ? 156 : 112);
        const creature = creatures[i];
        const following = curious && time > creature.readyAt;
        if (following && pointer) {
          creature.away = true;
          // Decisions last seconds, not frames: each creature hesitates independently.
          if (time >= creature.decideAt) {
            creature.decideAt = time + 1.2 + Math.random() * 3.8;
            creature.paused = Math.random() < 0.28;
            creature.speed = 22 + Math.random() * 44;
            creature.bearing = Math.random() * Math.PI * 2;
            creature.distance = 38 + Math.random() * 66;
          }
          const targetX = Math.max(bounds.left + 42, Math.min(bounds.right - 42,
            pointer.x + Math.cos(creature.bearing) * creature.distance)) - rect.left;
          const targetY = Math.max(bounds.top + 42, Math.min(bounds.bottom - 42,
            pointer.y + Math.sin(creature.bearing) * creature.distance)) - rect.top;
          const dx = targetX - creature.x;
          const dy = targetY - creature.y;
          const distance = Math.max(1, Math.hypot(dx, dy));
          const courage = Math.min(1, (time - creature.readyAt) / 3);
          const speed = creature.paused ? 0 : Math.min(creature.speed, distance * 0.65) * courage;
          // Sideways meanders and soft momentum create uncertain, occasionally overshooting steps.
          const wobble = Math.sin(time * 1.3 + seeds[i]) * 0.8
            + Math.sin(time * 0.57 + seeds[i] * 2) * 0.45;
          const vx = (dx - dy * wobble) / distance * speed;
          const vy = (dy + dx * wobble) / distance * speed;
          const response = 1 - Math.exp(-dt * (creature.paused ? 2.8 : 1.3));
          creature.vx += (vx - creature.vx) * response;
          creature.vy += (vy - creature.vy) * response;
          creature.x += creature.vx * dt;
          creature.y += creature.vy * dt;
        } else if (creature.away && !reduced.matches) {
          // A startle sends them straight home; curiosity has a separate, slower clock.
          creature.vx += ((home.x - creature.x) * 22 - creature.vx * 9) * dt;
          creature.vy += ((home.y - creature.y) * 22 - creature.vy * 9) * dt;
          creature.x += creature.vx * dt;
          creature.y += creature.vy * dt;
          if (Math.hypot(home.x - creature.x, home.y - creature.y) < 2) creature.away = false;
        } else {
          creature.x = home.x;
          creature.y = home.y;
          creature.vx = creature.vy = 0;
          creature.away = false;
        }
        // Follow and retreat paths slide around the photo instead of disappearing behind it.
        const fromPhotoX = creature.x - 140;
        const fromPhotoY = creature.y - 132;
        const fromPhotoDistance = Math.hypot(fromPhotoX, fromPhotoY);
        const clearance = portraitClearance(orbit.size, home.scale);
        if (fromPhotoDistance < clearance) {
          const nx = fromPhotoDistance > 0.001 ? fromPhotoX / fromPhotoDistance : Math.cos(home.angle);
          const ny = fromPhotoDistance > 0.001 ? fromPhotoY / fromPhotoDistance : Math.sin(home.angle);
          creature.x = 140 + nx * clearance;
          creature.y = 132 + ny * clearance;
          const inwardSpeed = Math.min(0, creature.vx * nx + creature.vy * ny);
          creature.vx -= inwardSpeed * nx;
          creature.vy -= inwardSpeed * ny;
        }
        const position = { ...home, x: creature.x, y: creature.y };
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
      if (!visible) leave();
      resume();
    });
    observer.observe(hero);
    hero.addEventListener('pointermove', move, { passive: true });
    hero.addEventListener('pointerleave', leave);
    hero.addEventListener('click', startle);
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
      hero.removeEventListener('click', startle);
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
