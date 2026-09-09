import { useEffect, useMemo, useRef, useState } from 'react';

// Shared visual constants
const STROKE_WIDTH = 1.5;

// All five visuals share a ~480-unit-wide viewBox: they render inside the
// half-width .visual-frame panels, so squarer compositions fill the frame and
// labels keep a legible on-screen size (13 viewBox units ≈ 11px at 416px wide).

// Common text style to prevent selection
const textNoSelectStyle: React.CSSProperties = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  pointerEvents: 'none',
};

// Utility: Check for reduced motion preference
const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Utility: Get theme color as a LIVE CSS expression.
// Returning `var(...)` / `color-mix(...)` lets the browser re-resolve the color
// on every theme swap (and on SSR'd markup before hydration). Snapshotting was
// the root cause of "SVGs don't follow the theme".
const getThemeColor = (property: string, opacity: number = 1): string => {
  if (opacity >= 1) return `var(${property}, #1a1a1a)`;
  const pct = Math.max(0, Math.min(100, Math.round(opacity * 100)));
  return `color-mix(in srgb, var(${property}) ${pct}%, transparent)`;
};

// Utility: Detect if current theme is dark
const isDarkTheme = (): boolean => {
  if (typeof window === 'undefined') return false;
  const root = document.documentElement;
  const bgColor = getComputedStyle(root).getPropertyValue('--theme-bg').trim();

  if (!bgColor) return false;

  let r = 0, g = 0, b = 0;

  if (bgColor.startsWith('#')) {
    const hex = bgColor.slice(1);
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else if (bgColor.startsWith('rgb')) {
    const match = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      r = parseInt(match[1]);
      g = parseInt(match[2]);
      b = parseInt(match[3]);
    }
  }

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
};

// Hook: Listen for theme changes and update colors
// Automatically adjusts opacity for dark themes to ensure readability
const useThemeColors = (opacities?: {
  text?: number;
  accent?: number;
  muted?: number;
  bg?: number;
}) => {
  const baseTextOpacity = opacities?.text ?? 0.8;
  const baseAccentOpacity = opacities?.accent ?? 0.6;
  const baseMutedOpacity = opacities?.muted ?? 1.0;
  const baseBgOpacity = opacities?.bg ?? 0.9;

  const getAdjustedOpacity = (baseOpacity: number, isDark: boolean): number => {
    if (!isDark) return baseOpacity;
    if (baseOpacity <= 0.3) {
      return Math.min(1.0, baseOpacity + 0.4);
    } else if (baseOpacity <= 0.5) {
      return Math.min(1.0, baseOpacity + 0.3);
    } else {
      return Math.min(1.0, baseOpacity + 0.2);
    }
  };

  const [isDark, setIsDark] = useState(() => isDarkTheme());
  const [textColor, setTextColor] = useState(() => {
    const dark = isDarkTheme();
    return getThemeColor('--theme-text', getAdjustedOpacity(baseTextOpacity, dark));
  });
  const [accentColor, setAccentColor] = useState(() => {
    const dark = isDarkTheme();
    return getThemeColor('--theme-accent', getAdjustedOpacity(baseAccentOpacity, dark));
  });
  const [mutedColor, setMutedColor] = useState(() => {
    const dark = isDarkTheme();
    return getThemeColor('--theme-text-muted', getAdjustedOpacity(baseMutedOpacity, dark));
  });
  const [bgColor, setBgColor] = useState(() => {
    const dark = isDarkTheme();
    return getThemeColor('--theme-bg', getAdjustedOpacity(baseBgOpacity, dark)) || getThemeColor('--theme-text', 0.05);
  });

  const updateColors = () => {
    const dark = isDarkTheme();
    setIsDark(dark);
    setTextColor(getThemeColor('--theme-text', getAdjustedOpacity(baseTextOpacity, dark)));
    setAccentColor(getThemeColor('--theme-accent', getAdjustedOpacity(baseAccentOpacity, dark)));
    setMutedColor(getThemeColor('--theme-text-muted', getAdjustedOpacity(baseMutedOpacity, dark)));
    setBgColor(getThemeColor('--theme-bg', getAdjustedOpacity(baseBgOpacity, dark)) || getThemeColor('--theme-text', 0.05));
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    updateColors();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && (mutation.attributeName === 'data-theme' || mutation.attributeName === 'style')) {
          updateColors();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'style'],
    });

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' || e.key === 'random-theme-data') {
        setTimeout(updateColors, 50);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const handleThemeChange = () => {
      setTimeout(updateColors, 50);
    };
    window.addEventListener('themechange', handleThemeChange);
    document.addEventListener('random-theme-applied', handleThemeChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themechange', handleThemeChange);
      document.removeEventListener('random-theme-applied', handleThemeChange);
    };
  }, [baseTextOpacity, baseAccentOpacity, baseMutedOpacity, baseBgOpacity]);

  return { textColor, accentColor, mutedColor, bgColor, isDark };
};

// Hook: viewport ≤768px. SVG labels are sized in viewBox units, so on phones the
// same unit count renders smaller — labels bump up when this is true.
const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return isMobile;
};

// Hook: visibility of an SVG element (animations pause off-screen)
const useSvgVisible = (svgRef: React.RefObject<SVGSVGElement | null>) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (svgRef.current) observer.observe(svgRef.current);
    return () => observer.disconnect();
  }, []);
  return isVisible;
};

export { WhatIDoVisual, TheCraftVisual } from './StudioVisuals';

// ===== HOW I WORK =====
// Product Discovery dot: grows deliberately at the top (thinking), then whips
// around the delivery ring in one fast, clean orbit — deliberate thinking,
// fast execution.
export function HowIWorkVisual() {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const isVisible = useSvgVisible(svgRef);
  const isMobile = useIsMobile();

  const { accentColor, mutedColor } = useThemeColors({ accent: 1.0 });
  const { accentColor: circleStrokeColor } = useThemeColors({ accent: 0.15 });

  const fs = isMobile ? 18 : 13;
  const CX = 240;
  const CY = 156;
  const R = 80;
  const circleStrokeWidth = STROKE_WIDTH * 16;

  useEffect(() => {
    if (!isVisible || prefersReducedMotion()) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const dotStartRadius = 6;
    const dotEndRadius = circleStrokeWidth * 0.8;

    const growDuration = 2500;
    const travelDuration = 600;
    const springDuration = 200;
    const deflateDuration = 300;
    const pauseDuration = 1500;
    const totalCycle = growDuration + travelDuration + springDuration + deflateDuration + pauseDuration;

    let startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) % totalCycle;

      if (svgRef.current) {
        const dot = svgRef.current.querySelector('.discovery-dot') as SVGCircleElement;
        const dotGroup = svgRef.current.querySelector('.discovery-dot-group') as SVGGElement;
        const discoveryLine = svgRef.current.querySelector('.discovery-line') as SVGLineElement;

        if (!dot || !dotGroup) return;

        let dotX = CX;
        let dotY = CY - R;
        let currentRadius = dotStartRadius;

        if (elapsed < growDuration) {
          // Phase 1: deliberate growth
          const growProgress = elapsed / growDuration;
          const eased = 0.5 - 0.5 * Math.cos(growProgress * Math.PI);
          currentRadius = dotStartRadius + (dotEndRadius - dotStartRadius) * eased;
        } else if (elapsed < growDuration + travelDuration) {
          // Phase 2: one fast orbit — matched ease-in-out cubic (no velocity jump)
          const travelProgress = (elapsed - growDuration) / travelDuration;
          const rotationEased = travelProgress < 0.5
            ? 4 * travelProgress * travelProgress * travelProgress
            : 1 - Math.pow(-2 * travelProgress + 2, 3) / 2;
          const angle = -Math.PI / 2 + rotationEased * 2 * Math.PI;
          dotX = CX + R * Math.cos(angle);
          dotY = CY + R * Math.sin(angle);
          currentRadius = dotEndRadius;
        } else if (elapsed < growDuration + travelDuration + springDuration) {
          // Phase 3: spring settle at the top
          const springProgress = (elapsed - growDuration - travelDuration) / springDuration;
          const spring = Math.sin(springProgress * Math.PI * 2.5) * Math.exp(-springProgress * 3);
          dotX = CX + spring * 3;
          currentRadius = dotEndRadius;
        } else if (elapsed < growDuration + travelDuration + springDuration + deflateDuration) {
          // Phase 4: deflate
          const deflateProgress = (elapsed - growDuration - travelDuration - springDuration) / deflateDuration;
          const deflateEased = 0.5 - 0.5 * Math.cos(deflateProgress * Math.PI);
          currentRadius = dotEndRadius - (dotEndRadius - dotStartRadius) * deflateEased;
        }
        // Phase 5: pause (defaults above)

        dot.setAttribute('r', String(currentRadius));
        dotGroup.setAttribute('transform', `translate(${dotX}, ${dotY})`);

        if (discoveryLine) {
          discoveryLine.setAttribute('x2', String(dotX));
          discoveryLine.setAttribute('y2', String(dotY - currentRadius - 4));
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible]);

  return (
    <div className="section-visual">
      <svg
        ref={svgRef}
        viewBox="0 18 480 268"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto"
        aria-hidden="true"
        style={{ overflow: 'visible' }}
      >
        {/* Delivery ring */}
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke={circleStrokeColor}
          strokeWidth={circleStrokeWidth}
        />

        {/* Discovery label above, leader following the dot */}
        <line
          className="discovery-line"
          x1={CX}
          y1={46}
          x2={CX}
          y2={CY - R - 10}
          stroke={mutedColor}
          strokeWidth={STROKE_WIDTH * 0.5}
          strokeDasharray="2 3"
          opacity={0.5}
        />
        <text
          x={CX}
          y={38}
          textAnchor="middle"
          fontSize={fs}
          fill={mutedColor}
          opacity={0.9}
          style={{ ...textNoSelectStyle, fontFamily: 'var(--theme-font-body, sans-serif)' }}
        >
          Product Discovery
        </text>

        {/* Delivery label below the ring */}
        <line
          x1={CX}
          y1={CY + R + 18}
          x2={CX}
          y2={CY + R + 30}
          stroke={mutedColor}
          strokeWidth={STROKE_WIDTH * 0.5}
          strokeDasharray="2 3"
          opacity={0.5}
        />
        <text
          x={CX}
          y={CY + R + 46}
          textAnchor="middle"
          fontSize={fs}
          fill={mutedColor}
          opacity={0.9}
          style={{ ...textNoSelectStyle, fontFamily: 'var(--theme-font-body, sans-serif)' }}
        >
          Product Delivery
        </text>

        {/* Discovery dot */}
        <g className="discovery-dot-group" transform={`translate(${CX}, ${CY - R})`}>
          <circle className="discovery-dot" cx="0" cy="0" r="6" fill={accentColor} stroke="none" />
        </g>
      </svg>
    </div>
  );
}

// ===== BEYOND THE ROLE =====
// Newton's cradle: energy passes cleanly between Work and Life — a calm,
// perpetual exchange rather than a collision.
export function BeyondTheRoleVisual() {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const isVisible = useSvgVisible(svgRef);
  const isMobile = useIsMobile();
  const { textColor, accentColor } = useThemeColors({ text: 1.0, accent: 1.0 });

  const fs = isMobile ? 18 : 13;

  // Geometry (480x240 canvas)
  const CX = 240;
  const PIVOT_Y = 50;
  const LEN = 100;
  const BALL_R = 12;
  const SPACING = BALL_R * 2;
  const BAR_HALF = 120;
  const LABEL_Y = PIVOT_Y + LEN + 36;
  const LABEL_OFFSET = 104;
  const numBalls = 4;

  const pivotPositions = useMemo(() => {
    const totalWidth = (numBalls - 1) * SPACING;
    const startX = CX - totalWidth / 2;
    return Array.from({ length: numBalls }, (_, i) => startX + i * SPACING);
  }, []);

  useEffect(() => {
    if (!isVisible || prefersReducedMotion()) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const maxAngle = 30 * Math.PI / 180;
    const cycleDuration = 4000; // calm, unhurried swing

    let startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) % cycleDuration;
      const t = elapsed / cycleDuration;

      const angles = new Array(numBalls).fill(0);

      if (t < 0.5) {
        // Ball 0 swings out and back, hits center at t=0.5
        const phaseT = t * 2;
        angles[0] = -maxAngle * Math.sin(phaseT * Math.PI);
        if (t >= 0.48 && t <= 0.52) {
          const collisionT = (t - 0.48) / 0.04;
          const easedT = 0.5 - 0.5 * Math.cos(collisionT * Math.PI);
          angles[1] = easedT * 0.02;
          angles[2] = easedT * 0.02;
        }
      } else {
        // Ball 3 swings out and back, hits center at t=1.0
        const phaseT = (t - 0.5) * 2;
        angles[3] = maxAngle * Math.sin(phaseT * Math.PI);
        if (t >= 0.98 || t <= 0.02) {
          const collisionT = t >= 0.98 ? (t - 0.98) / 0.04 : (t + 0.02) / 0.04;
          const easedT = 0.5 - 0.5 * Math.cos(collisionT * Math.PI);
          angles[1] = -easedT * 0.02;
          angles[2] = -easedT * 0.02;
        }
      }

      const isWorkActive = t < 0.5 && Math.abs(angles[0]) > 0.01;
      const isLifeActive = t >= 0.5 && Math.abs(angles[3]) > 0.01;
      const workIntensity = isWorkActive ? Math.abs(angles[0]) / maxAngle : 0;
      const lifeIntensity = isLifeActive ? Math.abs(angles[3]) / maxAngle : 0;

      if (svgRef.current) {
        for (let i = 0; i < numBalls; i++) {
          const pivotX = pivotPositions[i];
          const angle = angles[i];
          const bobX = pivotX + LEN * Math.sin(angle);
          const bobY = PIVOT_Y + LEN * Math.cos(angle);

          const string = svgRef.current.querySelector(`.cradle-string-${i}`) as SVGLineElement;
          if (string) {
            string.setAttribute('x2', String(bobX));
            string.setAttribute('y2', String(bobY));
          }

          const ball = svgRef.current.querySelector(`.cradle-ball-${i}`) as SVGCircleElement;
          if (ball) {
            ball.setAttribute('cx', String(bobX));
            ball.setAttribute('cy', String(bobY));
          }
        }

        const workLabel = svgRef.current.querySelector('.work-label') as SVGTextElement;
        const lifeLabel = svgRef.current.querySelector('.life-label') as SVGTextElement;
        const root = document.documentElement;
        const currentAccentColor = getComputedStyle(root).getPropertyValue('--theme-accent').trim() || textColor;
        const movementAmount = 4;

        if (workLabel) {
          workLabel.setAttribute('opacity', String(0.4 + 0.6 * workIntensity));
          workLabel.setAttribute('fill', workIntensity > 0.3 ? currentAccentColor : textColor);
          workLabel.setAttribute('x', String(CX - LABEL_OFFSET - movementAmount * workIntensity));
        }

        if (lifeLabel) {
          lifeLabel.setAttribute('opacity', String(0.4 + 0.6 * lifeIntensity));
          lifeLabel.setAttribute('fill', lifeIntensity > 0.3 ? currentAccentColor : textColor);
          lifeLabel.setAttribute('x', String(CX + LABEL_OFFSET + movementAmount * lifeIntensity));
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible, pivotPositions, textColor]);

  return (
    <div className="section-visual">
      <svg
        ref={svgRef}
        viewBox="0 26 480 190"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto"
        aria-hidden="true"
        style={{ overflow: 'visible' }}
      >
        {/* Pivot bar */}
        <line
          x1={CX - BAR_HALF}
          y1={PIVOT_Y}
          x2={CX + BAR_HALF}
          y2={PIVOT_Y}
          stroke={textColor}
          strokeWidth={STROKE_WIDTH}
        />

        {/* Strings and balls */}
        {Array.from({ length: numBalls }).map((_, i) => {
          const pivotX = pivotPositions[i];
          const restY = PIVOT_Y + LEN;
          return (
            <g key={i}>
              <line
                className={`cradle-string-${i}`}
                x1={pivotX}
                y1={PIVOT_Y}
                x2={pivotX}
                y2={restY}
                stroke={textColor}
                strokeWidth={STROKE_WIDTH}
              />
              <circle
                className={`cradle-ball-${i}`}
                cx={pivotX}
                cy={restY}
                r={BALL_R}
                fill={accentColor}
                stroke="none"
              />
            </g>
          );
        })}

        {/* Work / Life labels */}
        <text
          className="work-label"
          x={CX - LABEL_OFFSET}
          y={LABEL_Y}
          fontSize={fs}
          fill={textColor}
          textAnchor="start"
          dominantBaseline="middle"
          opacity="0.4"
          style={{ ...textNoSelectStyle, fontFamily: 'var(--theme-font-body, sans-serif)', transition: 'fill 0.3s ease' }}
        >
          Work
        </text>
        <text
          className="life-label"
          x={CX + LABEL_OFFSET}
          y={LABEL_Y}
          fontSize={fs}
          fill={textColor}
          textAnchor="end"
          dominantBaseline="middle"
          opacity="0.4"
          style={{ ...textNoSelectStyle, fontFamily: 'var(--theme-font-body, sans-serif)', transition: 'fill 0.3s ease' }}
        >
          Life
        </text>
      </svg>
    </div>
  );
}

// ===== EXPERIENCE SNAPSHOT =====
// Define → Systematize → Scale: a continuous loop, with the capabilities each
// stage produced floating around it. The orbiting dot speeds up through the
// stages it has already mastered.
export function ExperienceSnapshotVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);
  const [drawProgress, setDrawProgress] = useState(0);
  const isMobile = useIsMobile();

  const stages = [
    {
      label: 'Define',
      items: ['Product Discovery', 'Product Strategy', 'Monetization Design'],
    },
    {
      label: 'Systematize',
      items: ['Design Systems', 'Execution Culture', 'Platform Architecture'],
    },
    {
      label: 'Scale',
      items: ['Team Building', 'Mentorship', 'IPO Readiness'],
    },
  ];

  const { textColor, accentColor, mutedColor } = useThemeColors({
    text: 0.9,
    accent: 0.7,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Continuous animation phase
  useEffect(() => {
    if (!isVisible || prefersReducedMotion()) return;
    let frameId: number;
    const animate = () => {
      setDrawProgress(Date.now() / 1000);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isVisible]);

  // Layout (480-unit canvas)
  const cx = 240;
  const cy = 185;
  const ringRadius = 80;
  const numStages = stages.length;

  const kwFs = isMobile ? 18 : 13;
  const stageFs = isMobile ? 16 : 15; // >16 on mobile and the three ring labels start crowding

  const stageAngleOffset = -Math.PI / 2;
  const getStageAngle = (i: number) => stageAngleOffset + (2 * Math.PI * i) / numStages;
  const getStagePos = (i: number) => {
    const angle = getStageAngle(i);
    return { x: cx + Math.cos(angle) * ringRadius, y: cy + Math.sin(angle) * ringRadius };
  };

  // Smooth orbit with gentle speed variation (speed peaks at stage nodes)
  const orbitPeriod = 10;
  const linearT = (drawProgress % orbitPeriod) / orbitPeriod;
  const easeAmplitude = 0.052;
  const phaseNudge = -1.5;
  const easeAngle = (t: number) => t - easeAmplitude * Math.cos(t * numStages * 2 * Math.PI + phaseNudge);
  const easedT = easeAngle(linearT);
  const orbitAngle = stageAngleOffset + easedT * 2 * Math.PI;

  // Trail: time-based so it expands when fast and compresses when slow
  const trailCount = 8;
  const trailTimeStep = 0.01;
  const trailAngles = Array.from({ length: trailCount }, (_, i) => {
    const pastTime = ((drawProgress - (i + 1) * trailTimeStep) % orbitPeriod + orbitPeriod) % orbitPeriod;
    const pastLinearT = pastTime / orbitPeriod;
    const pastEased = easeAngle(pastLinearT);
    return stageAngleOffset + pastEased * 2 * Math.PI;
  });

  // Keyword positions — fanned around each stage
  const keywordLayout = useMemo(() => {
    const positions: Array<{ stageIndex: number; itemIndex: number; angle: number; radius: number }> = [];
    stages.forEach((stage, si) => {
      const stageAngle = getStageAngle(si);
      const count = stage.items.length;
      const fanSpread = 1.2;
      const startAngle = stageAngle - fanSpread / 2;
      stage.items.forEach((_, ii) => {
        const angle = startAngle + (fanSpread * ii) / (count - 1 || 1);
        const baseRadius = 143 + (ii % 2 === 0 ? 0 : 20) + (si * 6);
        positions.push({ stageIndex: si, itemIndex: ii, angle, radius: baseRadius });
      });
    });
    return positions;
  }, []);

  const getKeywordPos = (layoutIndex: number) => {
    const kw = keywordLayout[layoutIndex];
    const floatX = Math.sin(drawProgress * 0.3 + kw.stageIndex * 2.1 + kw.itemIndex * 1.7) * 3;
    const floatY = Math.cos(drawProgress * 0.25 + kw.stageIndex * 1.5 + kw.itemIndex * 2.3) * 3;
    return {
      x: cx + Math.cos(kw.angle) * kw.radius + floatX,
      y: cy + Math.sin(kw.angle) * kw.radius + floatY,
    };
  };

  // Hover sector paths
  const getStageArcPath = (si: number) => {
    const a1 = getStageAngle(si) - Math.PI / numStages;
    const a2 = getStageAngle(si) + Math.PI / numStages;
    const outerR = 180;
    const x1 = cx + Math.cos(a1) * outerR;
    const y1 = cy + Math.sin(a1) * outerR;
    const x2 = cx + Math.cos(a2) * outerR;
    const y2 = cy + Math.sin(a2) * outerR;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} Z`;
  };

  let kwIndex = 0;

  return (
    <div ref={containerRef} className="section-visual">
      <svg
        ref={svgRef}
        viewBox="0 -18 480 386"
        className="w-full h-auto"
        aria-hidden="true"
        style={{ overflow: 'visible' }}
      >
        {/* Invisible hover sectors */}
        {stages.map((_, si) => (
          <path
            key={`sector-${si}`}
            d={getStageArcPath(si)}
            fill="transparent"
            onMouseEnter={() => setHoveredStage(si)}
            onMouseLeave={() => setHoveredStage(null)}
            style={{ cursor: 'default', pointerEvents: 'auto' }}
          />
        ))}

        {/* Main ring */}
        <circle
          cx={cx}
          cy={cy}
          r={ringRadius}
          fill="none"
          stroke={mutedColor}
          strokeWidth={1}
          strokeOpacity={0.6}
        />

        {/* Keyword connection lines + floating labels */}
        {stages.map((stage, si) => {
          const stagePos = getStagePos(si);
          const isHovered = hoveredStage === si;

          return (
            <g key={`keywords-${si}`}>
              {stage.items.map((item, ii) => {
                const currentKwIndex = kwIndex++;
                const kwPos = getKeywordPos(currentKwIndex);
                return (
                  <g key={ii}>
                    <line
                      x1={stagePos.x}
                      y1={stagePos.y}
                      x2={kwPos.x}
                      y2={kwPos.y}
                      stroke={isHovered ? accentColor : mutedColor}
                      strokeWidth={0.5}
                      strokeDasharray="3 3"
                      opacity={isHovered ? 0.5 : 0.25}
                      style={{ transition: 'stroke 0.3s ease, opacity 0.3s ease' }}
                    />
                    <circle
                      cx={kwPos.x}
                      cy={kwPos.y}
                      r={isHovered ? 3.5 : 2.5}
                      fill={isHovered ? accentColor : mutedColor}
                      style={{ transition: 'fill 0.3s ease' }}
                    />
                    <text
                      x={kwPos.x}
                      y={kwPos.y - 10}
                      textAnchor="middle"
                      fill={isHovered ? textColor : mutedColor}
                      fontSize={kwFs}
                      style={{
                        ...textNoSelectStyle,
                        fontFamily: 'var(--theme-font-body, sans-serif)',
                        fontWeight: isHovered ? 500 : 400,
                        transition: 'fill 0.3s ease',
                      }}
                    >
                      {item}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Stage nodes + labels */}
        {stages.map((stage, si) => {
          const pos = getStagePos(si);
          const isHovered = hoveredStage === si;
          const labelAngle = getStageAngle(si);
          const labelR = ringRadius * 0.62;
          const labelPos = {
            x: cx + Math.cos(labelAngle) * labelR,
            y: cy + Math.sin(labelAngle) * labelR,
          };

          return (
            <g
              key={`stage-${si}`}
              onMouseEnter={() => setHoveredStage(si)}
              onMouseLeave={() => setHoveredStage(null)}
              style={{ cursor: 'default', pointerEvents: 'auto' }}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHovered ? 9 : 7}
                fill={isHovered ? accentColor : textColor}
                style={{ transition: 'fill 0.2s ease' }}
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isHovered ? accentColor : textColor}
                fontSize={stageFs}
                style={{
                  ...textNoSelectStyle,
                  fontFamily: 'var(--theme-font-heading)',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.1em',
                  fontWeight: 700,
                  transition: 'fill 0.2s ease',
                }}
              >
                {stage.label}
              </text>
            </g>
          );
        })}

        {/* Orbiting dot with time-based trail */}
        {trailAngles.map((a, i) => {
          const tx = cx + Math.cos(a) * ringRadius;
          const ty = cy + Math.sin(a) * ringRadius;
          const t = i / trailCount;
          const size = Math.max(0.5, 5 * (1 - t * t));
          const alpha = Math.max(0.02, 0.7 * (1 - t));
          return (
            <circle
              key={`trail-${i}`}
              cx={tx}
              cy={ty}
              r={size}
              fill={accentColor}
              opacity={alpha}
            />
          );
        })}
        <circle
          cx={cx + Math.cos(orbitAngle) * ringRadius}
          cy={cy + Math.sin(orbitAngle) * ringRadius}
          r={5.5}
          fill={accentColor}
          opacity={0.95}
        />
      </svg>
    </div>
  );
}
