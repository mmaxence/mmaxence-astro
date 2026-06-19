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
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 144 144">
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
    <div className="relative shrink-0 size-[144px]">
      <div className="absolute bg-[var(--theme-text,currentColor)] left-[8px] rounded-[72px] size-[128px] top-[8px]" />
    </div>
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

// Horizontal fan-out per slot during the bloom (outer shapes spread, centre lifts straight)
const FAN_X = [-12, 0, 12];

export function AnimatedPatterns() {
  // refs to each shape's inner (choreography) element — animated on `hero-flip`,
  // always returning to its exact resting position.
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // The shapes "bloom": lift + fan out with a stagger, then settle back home,
    // timed to the photo spin. Pure accompaniment — they return exactly where they were.
    const onFlip = (e: Event) => {
      if (reduce) return;
      const detail = (e as CustomEvent).detail || {};
      const duration = Math.max(700, detail.duration || 1200);

      innerRefs.current.forEach((el, i) => {
        if (!el) return;
        const x = FAN_X[i] ?? 0;
        el.animate(
          [
            { transform: 'translate(0px, 0px) scale(1)', easing: 'cubic-bezier(0.3, 0, 0.35, 1)' },
            { transform: `translate(${x * 0.6}px, -16px) scale(0.92)`, offset: 0.3 },
            { transform: `translate(${x}px, -9px) scale(0.96)`, offset: 0.56, easing: 'cubic-bezier(0.18, 0.7, 0.3, 1)' },
            { transform: 'translate(0px, 0px) scale(1)', offset: 1 },
          ],
          { duration, delay: i * 55, easing: 'ease-out', fill: 'none' }
        );
      });
    };

    document.addEventListener('hero-flip', onFlip);
    return () => document.removeEventListener('hero-flip', onFlip);
  }, []);

  return (
    <div
      className="flex items-center justify-center relative w-full"
      data-name="patterns"
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', minHeight: '86.4px' }}
    >
      <div className="relative origin-center shapes-container-responsive">
        <style>{`
          .shapes-container-responsive {
            width: 268.8px;
            height: 86.4px;
            position: relative;
            margin: 0 auto;
          }
          @media (max-width: 768px) {
            .shapes-container-responsive {
              width: 179.2px;
              height: 57.6px;
            }
          }
          .shapes-inner-container {
            width: 448px;
            height: 144px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.6);
            transform-origin: center center;
          }
          @media (max-width: 768px) {
            .shapes-inner-container {
              transform: translate(-50%, -50%) scale(0.4);
            }
          }
        `}</style>

        <div className="shapes-inner-container" style={{ position: 'relative' }}>
          {SHAPES.map((shape, i) => {
            const Component = shape.component;
            const translateX = i * 152; // 144 shape + 8 gap
            return (
              <div key={shape.id} className="absolute top-0 left-0" style={{ transform: `translateX(${translateX}px)` }}>
                <div ref={(el) => (innerRefs.current[i] = el)} style={{ willChange: 'transform' }}>
                  <Component />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
