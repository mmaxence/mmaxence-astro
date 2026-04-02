import { useEffect, useMemo, useRef, useState } from 'react';

// Shared visual constants
const STROKE_WIDTH = 1.5;
const ANIMATION_DURATION = 3000; // 3 seconds for slow motion

// Common wrapper styles for visual components
const visualWrapperStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

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

// Utility: Get theme color
const getThemeColor = (property: string, opacity: number = 1): string => {
  if (typeof window === 'undefined') return `rgba(31, 31, 31, ${opacity})`;
  const root = document.documentElement;
  const color = getComputedStyle(root).getPropertyValue(property).trim();
  
  if (!color) return `rgba(31, 31, 31, ${opacity})`;
  
  // Already has opacity
  if (color.startsWith('rgba(')) {
    if (opacity === 1) return color;
    // Extract RGB values and apply new opacity
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${opacity})`;
    }
  }
  
  // Hex color
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  // RGB color
  if (color.startsWith('rgb(')) {
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${opacity})`;
    }
  }
  
  return color;
};

// Utility: Detect if current theme is dark
const isDarkTheme = (): boolean => {
  if (typeof window === 'undefined') return false;
  const root = document.documentElement;
  const bgColor = getComputedStyle(root).getPropertyValue('--theme-bg').trim();
  
  if (!bgColor) return false;
  
  // Parse color and calculate brightness
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
  
  // Calculate relative luminance (brightness)
  // Using standard formula: 0.299*R + 0.587*G + 0.114*B
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Consider dark if brightness is less than 128 (midpoint of 0-255)
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
  // Base opacity values
  const baseTextOpacity = opacities?.text ?? 0.8;
  const baseAccentOpacity = opacities?.accent ?? 0.6;
  const baseMutedOpacity = opacities?.muted ?? 0.3;
  const baseBgOpacity = opacities?.bg ?? 0.9;

  // Adjust opacity for dark themes - increase for better readability
  const getAdjustedOpacity = (baseOpacity: number, isDark: boolean): number => {
    if (!isDark) return baseOpacity;
    // For dark themes, increase opacity significantly
    // Minimum opacity boost: +0.2, but ensure we don't go over 1.0
    // For very low opacities (0.3), boost more aggressively
    if (baseOpacity <= 0.3) {
      return Math.min(1.0, baseOpacity + 0.4); // 0.3 -> 0.7
    } else if (baseOpacity <= 0.5) {
      return Math.min(1.0, baseOpacity + 0.3); // 0.5 -> 0.8
    } else {
      return Math.min(1.0, baseOpacity + 0.2); // 0.8 -> 1.0
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

    // Initial color fetch
    updateColors();

    // Watch for data-theme attribute changes on document element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          updateColors();
        }
        // Also watch for CSS custom property changes
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          updateColors();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'style'],
    });

    // Listen for storage events (cross-tab theme changes)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' || e.key === 'random-theme-data') {
        // Small delay to ensure theme is applied
        setTimeout(updateColors, 50);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom theme change events (if dispatched elsewhere)
    const handleThemeChange = () => {
      setTimeout(updateColors, 50);
    };
    window.addEventListener('themechange', handleThemeChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themechange', handleThemeChange);
    };
  }, [baseTextOpacity, baseAccentOpacity, baseMutedOpacity, baseBgOpacity]);

  // Helper function to adjust opacity for dark themes (for inline use)
  const getAdjustedOpacityValue = (baseOpacity: number): number => {
    return getAdjustedOpacity(baseOpacity, isDark);
  };

  return { textColor, accentColor, mutedColor, bgColor, isDark, getAdjustedOpacityValue };
};

// 1. WHAT I DO - Simple Isometric Layered System Diagram
export function WhatIDoVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoverLayer, setHoverLayer] = useState<number | null>(null);
  const [waveProgresses, setWaveProgresses] = useState([0, 0, 0]);

  // Simple layer definitions: bottom first (renders behind), top last (renders on top)
  // Centered horizontally: viewBox is 600 wide, so center is 300. Layers start around 150-200 to center them
  const layers = [
    { label: 'Execution Systems', x: 150, y: 160, z: 2 },
    { label: 'Interaction Design', x: 155, y: 110, z: 1 },
    { label: 'Product Definition', x: 160, y: 60, z: 0 },
  ];

  const layerWidth = 300;
  const layerHeight = 65;
  const skew = (layerWidth * 85) / 388;

  // Simple isometric path
  const createPath = (x: number, y: number) => {
    const x1 = x + skew;
    const y1 = y;
    const x2 = x + layerWidth;
    const y2 = y;
    const x3 = x + layerWidth - skew;
    const y3 = y + layerHeight;
    const x4 = x;
    const y4 = y + layerHeight;
    return `M ${x2} ${y2} L ${x3} ${y3} H ${x4} L ${x1} ${y1} H ${x2} Z`;
  };

  // Wave animation - like boats on a wave: all move together, different intensities
  useEffect(() => {
    if (!isVisible || prefersReducedMotion()) return;

    const waveFunction = (t: number) => {
      if (t >= 1) return 0;
      // Smooth wave: up then back down
      return Math.exp(-t * 1.2) * Math.sin(2 * Math.PI * 0.8 * t) * Math.sin(t * Math.PI);
    };

    let waveStartTime = Date.now();
    let frameId: number;
    const waveDuration = 3000; // 3 seconds for the wave
    const waveInterval = 5000; // 5 seconds between waves

    const triggerWave = () => {
      waveStartTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - waveStartTime;
        const t = Math.min(elapsed / waveDuration, 1);
        
        // All layers use the same wave progress, but different intensities based on z-value
        const waveProgress = waveFunction(t);
        const progresses = layers.map(() => waveProgress);
        
        setWaveProgresses(progresses);

        if (elapsed < waveDuration) {
          frameId = requestAnimationFrame(animate);
        } else {
          // Wave complete, reset to 0
          setWaveProgresses([0, 0, 0]);
        }
      };
      
      animate();
    };

    // Initial delay, then trigger every 5 seconds
    const initialTimeout = setTimeout(triggerWave, 1000);
    const interval = setInterval(triggerWave, waveInterval);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isVisible]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Use theme colors hook that reacts to theme changes
  const { textColor, accentColor, mutedColor, bgColor } = useThemeColors();

  return (
    <div ref={containerRef} className="w-full my-8" style={visualWrapperStyle}>
      <svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet" className="w-full h-auto" style={{ minHeight: '300px', width: '100%', maxWidth: '100%', display: 'block' }}>
        {/* Render layers: bottom first (behind), top last (on top) */}
        {layers.map((layer, index) => {
          const waveProgress = waveProgresses[index] || 0;
          const offset = waveProgress * 8 * (1 + layer.z * 0.5);
          const rotation = waveProgress * (layer.z * 0.5 - 0.25) * Math.PI / 180;
          const centerX = layer.x + layerWidth / 2;
          const centerY = layer.y + layerHeight / 2;
          const isHovered = hoverLayer === index;

          // Always apply transform (even when 0) to prevent jumps
          const transform = `translate(${centerX}, ${centerY}) rotate(${rotation}) translate(${-centerX}, ${-centerY + offset})`;

          return (
            <g
              key={index}
              transform={transform}
              opacity={isVisible ? 1 : 0}
            >
              {/* Layer with theme background */}
              <path
                d={createPath(layer.x, layer.y)}
                fill={bgColor}
                fillOpacity="0.9"
                stroke={isHovered ? accentColor : textColor}
                strokeWidth={STROKE_WIDTH}
                onMouseEnter={() => setHoverLayer(index)}
                onMouseLeave={() => setHoverLayer(null)}
                style={{ transition: 'stroke 0.4s ease' }}
              />

              {/* Connection line */}
              <line
                x1="460"
                y1={centerY + 4}
                x2={layer.x + layerWidth - skew}
                y2={centerY}
                stroke={mutedColor}
                strokeWidth={STROKE_WIDTH * 0.5}
                strokeDasharray="2 3"
                opacity={isVisible ? 0.5 : 0}
              />

              {/* Label */}
              <text
                x="460"
                y={centerY + 5}
                fontSize="14"
                fill={isHovered ? accentColor : mutedColor}
                style={{
                  ...textNoSelectStyle,
                  fontFamily: 'var(--theme-font-body, sans-serif)',
                  opacity: isVisible ? 0.9 : 0,
                  transition: 'opacity 0.6s ease, fill 0.4s ease',
                }}
              >
                {layer.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}


// 2. HOW I WORK - Product Discovery Circle
export function HowIWorkVisual() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (svgRef.current) observer.observe(svgRef.current);
    return () => observer.disconnect();
  }, []);

  // Use theme colors hook that reacts to theme changes
  const { accentColor, mutedColor } = useThemeColors({
    accent: 1.0,
    muted: 0.3,
  });
  const { accentColor: circleStrokeColor } = useThemeColors({ accent: 0.1 });
  const circleStrokeWidth = STROKE_WIDTH * 16; // Bigger stroke

  useEffect(() => {
    if (!isVisible || prefersReducedMotion()) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const centerX = 300;
    const centerY = 150;
    const circleRadius = 80;
    const dotStartRadius = 6;
    const dotEndRadius = circleStrokeWidth * .8; // Grow 3-4 times the stroke width
    
    const growDuration = 5000; // 5 seconds to grow
    const travelDuration = 600; // Super fast rotation (0.6 seconds)
    const springDuration = 200; // Spring effect right after landing (0.2 seconds)
    const deflateDuration = 300; // Short deflation animation (0.3 seconds)
    const pauseDuration = 1000; // Pause at top (1 second)
    const totalCycle = growDuration + travelDuration + springDuration + deflateDuration + pauseDuration;
    
    let startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) % totalCycle;
      
      if (svgRef.current) {
        const dot = svgRef.current.querySelector('.discovery-dot') as SVGCircleElement;
        const dotGroup = svgRef.current.querySelector('.discovery-dot-group') as SVGGElement;
        const discoveryLine = svgRef.current.querySelector('.discovery-line') as SVGLineElement;
        
        if (!dot || !dotGroup) return;
        
        let dotX = centerX;
        let dotY = centerY - circleRadius;
        let currentRadius = dotStartRadius;
        
        if (elapsed < growDuration) {
          // Phase 1: Smooth growth
          const growProgress = elapsed / growDuration;
          const eased = 0.5 - 0.5 * Math.cos(growProgress * Math.PI); // Smooth ease-in-out
          
          currentRadius = dotStartRadius + (dotEndRadius - dotStartRadius) * eased;
          dotX = centerX;
          dotY = centerY - circleRadius;
          
          dot.setAttribute('r', String(currentRadius));
          dotGroup.setAttribute('transform', `translate(${dotX}, ${dotY})`);
          
        } else if (elapsed < growDuration + travelDuration) {
          // Phase 2: Super fast rotation (keep large size)
          const travelProgress = (elapsed - growDuration) / travelDuration;
          // Ease-both (ease-in-out) for rotation
          const rotationEased = travelProgress < 0.5
            ? 2 * travelProgress * travelProgress
            : 1 - Math.pow(-2 * travelProgress + 2, 3) / 2;
          
          const angle = -Math.PI / 2 + rotationEased * 2 * Math.PI; // Start at top, go clockwise
          
          dotX = centerX + circleRadius * Math.cos(angle);
          dotY = centerY + circleRadius * Math.sin(angle);
          
          // Keep large size during rotation
          currentRadius = dotEndRadius;
          
          dot.setAttribute('r', String(currentRadius));
          dotGroup.setAttribute('transform', `translate(${dotX}, ${dotY})`);
          
        } else if (elapsed < growDuration + travelDuration + springDuration) {
          // Phase 3: Spring effect right after landing (keep large size)
          const springProgress = (elapsed - growDuration - travelDuration) / springDuration;
          // Spring bounce: overshoot then settle
          const spring = Math.sin(springProgress * Math.PI * 2.5) * Math.exp(-springProgress * 3);
          
          // Spring moves slightly forward then back
          const springOffset = spring * 3;
          dotX = centerX + springOffset;
          dotY = centerY - circleRadius;
          
          // Keep large size during spring
          currentRadius = dotEndRadius;
          
          dot.setAttribute('r', String(currentRadius));
          dotGroup.setAttribute('transform', `translate(${dotX}, ${dotY})`);
          
        } else if (elapsed < growDuration + travelDuration + springDuration + deflateDuration) {
          // Phase 4: Deflate (animated shrink)
          const deflateProgress = (elapsed - growDuration - travelDuration - springDuration) / deflateDuration;
          // Smooth ease-in-out for deflation
          const deflateEased = 0.5 - 0.5 * Math.cos(deflateProgress * Math.PI);
          
          dotX = centerX;
          dotY = centerY - circleRadius;
          
          // Animate from large to small
          currentRadius = dotEndRadius - (dotEndRadius - dotStartRadius) * deflateEased;
          
          dot.setAttribute('r', String(currentRadius));
          dotGroup.setAttribute('transform', `translate(${dotX}, ${dotY})`);
          
        } else {
          // Phase 5: Pause at top (small size)
          dotX = centerX;
          dotY = centerY - circleRadius;
          currentRadius = dotStartRadius;
          
          dot.setAttribute('r', String(currentRadius));
          dotGroup.setAttribute('transform', `translate(${dotX}, ${dotY})`);
        }
        
        // Update connection line to follow dot position
        if (discoveryLine) {
          discoveryLine.setAttribute('x2', String(dotX));
          discoveryLine.setAttribute('y2', String(dotY));
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
    <div className="w-full my-8" style={visualWrapperStyle}>
      <svg
        ref={svgRef}
        viewBox="0 0 600 300"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto"
        style={{ minHeight: '300px', width: '100%', maxWidth: '100%', display: 'block' }}
      >
        {/* Large circle with thick stroke - centered horizontally */}
        <circle
          cx="300"
          cy="150"
          r="80"
          fill="none"
          stroke={circleStrokeColor}
          strokeWidth={circleStrokeWidth}
        />

        {/* Connection line from "Product Discovery" text to dot */}
        <line
          className="discovery-line"
          x1="420"
          y1="70"
          x2="300"
          y2="70"
          stroke={mutedColor}
          strokeWidth={STROKE_WIDTH * 0.5}
          strokeDasharray="2 3"
          opacity={isVisible ? 0.5 : 0}
          style={{ transition: 'opacity 0.6s ease' }}
        />

        {/* Connection line from "Product Delivery" text to circle - horizontal */}
        <line
          x1="420"
          y1="150"
          x2="380"
          y2="150"
          stroke={mutedColor}
          strokeWidth={STROKE_WIDTH * 0.5}
          strokeDasharray="2 3"
          opacity={isVisible ? 0.5 : 0}
          style={{ transition: 'opacity 0.6s ease' }}
        />

        {/* Text labels - positioned close to visual, matching first section spacing */}
        <text
          x="420"
          y="75"
          fontSize="14"
          fill={mutedColor}
          style={{
            ...textNoSelectStyle,
            fontFamily: 'var(--theme-font-body, sans-serif)',
            opacity: isVisible ? 0.9 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          Product Discovery
        </text>

        <text
          x="420"
          y="155"
          fontSize="14"
          fill={mutedColor}
          style={{
            ...textNoSelectStyle,
            fontFamily: 'var(--theme-font-body, sans-serif)',
            opacity: isVisible ? 0.9 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          Product Delivery
        </text>

        {/* Discovery dot - animated */}
        <g className="discovery-dot-group" transform="translate(300, 20)">
          <circle
            className="discovery-dot"
            cx="0"
            cy="0"
            r="4"
            fill={accentColor}
            stroke="none"
          />
        </g>
      </svg>
    </div>
  );
}

// 3. LEADERSHIP THAT SCALES - Exponential Growth Circles
export function LeadershipScalesVisual() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (svgRef.current) observer.observe(svgRef.current);
    return () => observer.disconnect();
  }, []);

  // Use theme colors hook that reacts to theme changes
  const { accentColor, mutedColor } = useThemeColors({
    accent: 1.0,
    muted: 0.3,
  });
  const numberTextColor = '#FFFFFF'; // White for contrast

  // Circle center position - centered in viewBox, allowing overflow
  const centerX = 300;
  const centerY = 90; // Match other visuals' center height

  // Label positions - positioned at different angles around circles for clearer connections
  // Headcount: top-right (45 degrees)
  // Capability: right (0 degrees)
  // Influence: bottom-right (315 degrees)
  const headcountAngle = Math.PI / 4; // 45 degrees
  const capabilityAngle = 0; // 0 degrees (right)
  const influenceAngle = -Math.PI / 4; // -45 degrees (bottom-right)

  // Smooth easing without overshoot - cubic ease-in-out
  const smoothEase = (t: number): number => {
    // Clamp t to [0, 1] to prevent overshoot
    const clamped = Math.max(0, Math.min(1, t));
    // Cubic ease-in-out for smooth transitions
    return clamped < 0.5
      ? 4 * clamped * clamped * clamped
      : 1 - Math.pow(-2 * clamped + 2, 3) / 2;
  };

  // State sizes - inner circle scales minimally, outer circles scale dramatically
  // This emphasizes that small team growth creates exponential capability/influence
  const states = {
    4: { inner: 18, middle: 40, outer: 65 },
    5: { inner: 20, middle: 65, outer: 110 },
    6: { inner: 22, middle: 95, outer: 165 },
    7: { inner: 24, middle: 135, outer: 240 }
  };

  useEffect(() => {
    if (!isVisible || prefersReducedMotion()) {
      if (svgRef.current && isVisible) {
        const state7 = states[7];
        const innerCircle = svgRef.current.querySelector('.inner-circle') as SVGCircleElement;
        const middleCircle = svgRef.current.querySelector('.middle-circle') as SVGCircleElement;
        const outerCircle = svgRef.current.querySelector('.outer-circle') as SVGCircleElement;
        const numberText = svgRef.current.querySelector('.number-text') as SVGTextElement;
        if (innerCircle) innerCircle.setAttribute('r', String(state7.inner));
        if (middleCircle) middleCircle.setAttribute('r', String(state7.middle));
        if (outerCircle) outerCircle.setAttribute('r', String(state7.outer));
        if (numberText) numberText.textContent = '7';
      }
      return;
    }

    let currentNumber = 4;
    let targetNumber = 5;
    let animationStart = performance.now();
    const stepDuration = 1500;
    const pauseDuration = 500;

    const animate = (time: number) => {
      if (!svgRef.current) return;

      const elapsed = time - animationStart;
      const progress = Math.min(elapsed / stepDuration, 1);
      const eased = smoothEase(progress);

      const fromState = states[currentNumber as keyof typeof states];
      const toState = states[targetNumber as keyof typeof states];

      // Interpolate circles from current to target, clamped between from and to values
      const innerMin = Math.min(fromState.inner, toState.inner);
      const innerMax = Math.max(fromState.inner, toState.inner);
      const innerR = Math.max(innerMin, Math.min(innerMax, fromState.inner + (toState.inner - fromState.inner) * eased));
      
      const middleMin = Math.min(fromState.middle, toState.middle);
      const middleMax = Math.max(fromState.middle, toState.middle);
      const middleR = Math.max(middleMin, Math.min(middleMax, fromState.middle + (toState.middle - fromState.middle) * eased));
      
      const outerMin = Math.min(fromState.outer, toState.outer);
      const outerMax = Math.max(fromState.outer, toState.outer);
      const outerR = Math.max(outerMin, Math.min(outerMax, fromState.outer + (toState.outer - fromState.outer) * eased));

      // Update circles
      const innerCircle = svgRef.current.querySelector('.inner-circle') as SVGCircleElement;
      const middleCircle = svgRef.current.querySelector('.middle-circle') as SVGCircleElement;
      const outerCircle = svgRef.current.querySelector('.outer-circle') as SVGCircleElement;
      const numberText = svgRef.current.querySelector('.number-text') as SVGTextElement;

      if (innerCircle) innerCircle.setAttribute('r', String(innerR));
      if (middleCircle) middleCircle.setAttribute('r', String(middleR));
      if (outerCircle) outerCircle.setAttribute('r', String(outerR));

      // Update connection lines and labels to follow circle edges at specific angles
      const headcountLine = svgRef.current.querySelector('.headcount-line') as SVGLineElement;
      const capabilityLine = svgRef.current.querySelector('.capability-line') as SVGLineElement;
      const influenceLine = svgRef.current.querySelector('.influence-line') as SVGLineElement;
      const headcountLabel = svgRef.current.querySelector('.headcount-label') as SVGTextElement;
      const capabilityLabel = svgRef.current.querySelector('.capability-label') as SVGTextElement;
      const influenceLabel = svgRef.current.querySelector('.influence-label') as SVGTextElement;
      
      const labelOffset = 30; // Distance from circle edge to label
      
      // Calculate connection points on circle edges
      const headcountX = centerX + innerR * Math.cos(headcountAngle);
      const headcountY = centerY + innerR * Math.sin(headcountAngle);
      const capabilityX = centerX + middleR * Math.cos(capabilityAngle);
      const capabilityY = centerY + middleR * Math.sin(capabilityAngle);
      const influenceX = centerX + outerR * Math.cos(influenceAngle);
      const influenceY = centerY + outerR * Math.sin(influenceAngle);
      
      // Calculate label positions
      const headcountLabelX = centerX + (innerR + labelOffset) * Math.cos(headcountAngle);
      const headcountLabelY = centerY + (innerR + labelOffset) * Math.sin(headcountAngle);
      const capabilityLabelX = centerX + (middleR + labelOffset) * Math.cos(capabilityAngle);
      const capabilityLabelY = centerY + (middleR + labelOffset) * Math.sin(capabilityAngle);
      const influenceLabelX = centerX + (outerR + labelOffset) * Math.cos(influenceAngle);
      const influenceLabelY = centerY + (outerR + labelOffset) * Math.sin(influenceAngle);
      
      if (headcountLine) {
        headcountLine.setAttribute('x1', String(headcountX));
        headcountLine.setAttribute('y1', String(headcountY));
        headcountLine.setAttribute('x2', String(headcountLabelX));
        headcountLine.setAttribute('y2', String(headcountLabelY));
      }
      if (capabilityLine) {
        capabilityLine.setAttribute('x1', String(capabilityX));
        capabilityLine.setAttribute('y1', String(capabilityY));
        capabilityLine.setAttribute('x2', String(capabilityLabelX));
        capabilityLine.setAttribute('y2', String(capabilityLabelY));
      }
      if (influenceLine) {
        influenceLine.setAttribute('x1', String(influenceX));
        influenceLine.setAttribute('y1', String(influenceY));
        influenceLine.setAttribute('x2', String(influenceLabelX));
        influenceLine.setAttribute('y2', String(influenceLabelY));
      }
      
      // Update label positions
      if (headcountLabel) {
        headcountLabel.setAttribute('x', String(headcountLabelX));
        headcountLabel.setAttribute('y', String(headcountLabelY));
      }
      if (capabilityLabel) {
        capabilityLabel.setAttribute('x', String(capabilityLabelX));
        capabilityLabel.setAttribute('y', String(capabilityLabelY));
      }
      if (influenceLabel) {
        influenceLabel.setAttribute('x', String(influenceLabelX));
        influenceLabel.setAttribute('y', String(influenceLabelY));
      }

      // Simple number transition - just fade and update
      if (numberText) {
        // Change number early in animation (at 30% progress)
        const numberChangePoint = 0.3;
        if (progress < numberChangePoint) {
          // Before change: show current number
          numberText.textContent = String(currentNumber);
          numberText.setAttribute('opacity', '1');
          numberText.setAttribute('transform', 'translate(0, 0)');
        } else {
          // After change: show target number with fade-in
          const fadeProgress = (progress - numberChangePoint) / (1 - numberChangePoint);
          const fadeEased = smoothEase(fadeProgress);
          numberText.textContent = String(targetNumber);
          numberText.setAttribute('opacity', String(fadeEased));
          numberText.setAttribute('transform', 'translate(0, 0)');
        }
        
        // Clean up any leftover new number element
        const newNum = svgRef.current.querySelector('.number-text-new');
        if (newNum) newNum.remove();
      }

      if (progress >= 1) {
        currentNumber = targetNumber;
        targetNumber = targetNumber < 7 ? targetNumber + 1 : 4;
        animationStart = time + pauseDuration;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    if (svgRef.current) {
      const state4 = states[4];
      const innerCircle = svgRef.current.querySelector('.inner-circle') as SVGCircleElement;
      const middleCircle = svgRef.current.querySelector('.middle-circle') as SVGCircleElement;
      const outerCircle = svgRef.current.querySelector('.outer-circle') as SVGCircleElement;
      if (innerCircle) innerCircle.setAttribute('r', String(state4.inner));
      if (middleCircle) middleCircle.setAttribute('r', String(state4.middle));
      if (outerCircle) outerCircle.setAttribute('r', String(state4.outer));
    }

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (svgRef.current) {
        const newNum = svgRef.current.querySelector('.number-text-new');
        if (newNum) newNum.remove();
      }
    };
  }, [isVisible, centerX, centerY, headcountAngle, capabilityAngle, influenceAngle]);

  // Calculate label positions based on angles and circle sizes
  const labelOffset = 30; // Distance from circle edge to label
  const headcountLabelX = centerX + (states[4].inner + labelOffset) * Math.cos(headcountAngle);
  const headcountLabelY = centerY + (states[4].inner + labelOffset) * Math.sin(headcountAngle);
  const capabilityLabelX = centerX + (states[4].middle + labelOffset) * Math.cos(capabilityAngle);
  const capabilityLabelY = centerY + (states[4].middle + labelOffset) * Math.sin(capabilityAngle);
  const influenceLabelX = centerX + (states[4].outer + labelOffset) * Math.cos(influenceAngle);
  const influenceLabelY = centerY + (states[4].outer + labelOffset) * Math.sin(influenceAngle);

  return (
    <div className="w-full my-8 mt-12" style={{ ...visualWrapperStyle, overflow: 'visible' }}>
      <svg
        ref={svgRef}
        viewBox="0 0 600 200"
        className="w-full h-auto"
        style={{ minHeight: '180px', width: '100%', maxWidth: '100%', overflow: 'visible' }}
      >
        <g transform={`translate(${centerX}, ${centerY})`}>
          {/* Outer circle - Influence (10% opacity) */}
          <circle
            className="outer-circle"
            cx="0"
            cy="0"
            r={states[4].outer}
            fill={accentColor}
            opacity="0.1"
          />
          
          {/* Middle circle - Capability (20% opacity) */}
          <circle
            className="middle-circle"
            cx="0"
            cy="0"
            r={states[4].middle}
            fill={accentColor}
            opacity="0.2"
          />
          
          {/* Inner circle - Headcount (100% opacity) */}
          <circle
            className="inner-circle"
            cx="0"
            cy="0"
            r={states[4].inner}
            fill={accentColor}
            opacity="1.0"
          />
          
          {/* Number text - white for contrast */}
          <text
            className="number-text"
            x="0"
            y="0"
            fontSize="14"
            fill={numberTextColor}
            textAnchor="middle"
            dominantBaseline="middle"
            fontWeight="600"
            opacity={isVisible ? 1 : 0}
            style={{
              ...textNoSelectStyle,
              fontFamily: 'var(--theme-font-body, sans-serif)',
              fontSize: '14px',
              transition: 'opacity 0.6s ease',
            }}
          >
            4
          </text>
        </g>

        {/* Connection lines and labels */}
        {/* Headcount label and connection - top-right */}
        <line
          className="headcount-line"
          x1={centerX + states[4].inner * Math.cos(headcountAngle)}
          y1={centerY + states[4].inner * Math.sin(headcountAngle)}
          x2={headcountLabelX}
          y2={headcountLabelY}
          stroke={mutedColor}
          strokeWidth={STROKE_WIDTH * 0.5}
          strokeDasharray="2 3"
          opacity={isVisible ? 0.5 : 0}
          style={{ transition: 'opacity 0.6s ease' }}
        />
        <text
          className="headcount-label"
          x={headcountLabelX}
          y={headcountLabelY}
          fontSize="14"
          fill={mutedColor}
          textAnchor="start"
          dominantBaseline="middle"
          opacity={isVisible ? 0.9 : 0}
          style={{
            ...textNoSelectStyle,
            fontFamily: 'var(--theme-font-body, sans-serif)',
            transition: 'opacity 0.6s ease',
          }}
        >
          Headcount
        </text>

        {/* Capability label and connection - right */}
        <line
          className="capability-line"
          x1={centerX + states[4].middle * Math.cos(capabilityAngle)}
          y1={centerY + states[4].middle * Math.sin(capabilityAngle)}
          x2={capabilityLabelX}
          y2={capabilityLabelY}
          stroke={mutedColor}
          strokeWidth={STROKE_WIDTH * 0.5}
          strokeDasharray="2 3"
          opacity={isVisible ? 0.5 : 0}
          style={{ transition: 'opacity 0.6s ease' }}
        />
        <text
          className="capability-label"
          x={capabilityLabelX}
          y={capabilityLabelY}
          fontSize="14"
          fill={mutedColor}
          textAnchor="start"
          dominantBaseline="middle"
          opacity={isVisible ? 0.9 : 0}
          style={{
            ...textNoSelectStyle,
            fontFamily: 'var(--theme-font-body, sans-serif)',
            transition: 'opacity 0.6s ease',
          }}
        >
          Capability
        </text>

        {/* Influence label and connection - bottom-right */}
        <line
          className="influence-line"
          x1={centerX + states[4].outer * Math.cos(influenceAngle)}
          y1={centerY + states[4].outer * Math.sin(influenceAngle)}
          x2={influenceLabelX}
          y2={influenceLabelY}
          stroke={mutedColor}
          strokeWidth={STROKE_WIDTH * 0.5}
          strokeDasharray="2 3"
          opacity={isVisible ? 0.5 : 0}
          style={{ transition: 'opacity 0.6s ease' }}
        />
        <text
          className="influence-label"
          x={influenceLabelX}
          y={influenceLabelY}
          fontSize="14"
          fill={mutedColor}
          textAnchor="start"
          dominantBaseline="middle"
          opacity={isVisible ? 0.9 : 0}
          style={{
            ...textNoSelectStyle,
            fontFamily: 'var(--theme-font-body, sans-serif)',
            transition: 'opacity 0.6s ease',
          }}
        >
          Influence
        </text>
      </svg>
    </div>
  );
}

// 4. BEYOND THE ROLE - Newton's Cradle
export function BeyondTheRoleVisual() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(600);
  const [viewportHeight, setViewportHeight] = useState(200);
  
  // 4 balls for Newton's Cradle
  const numBalls = 4;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (svgRef.current) observer.observe(svgRef.current);
    return () => observer.disconnect();
  }, []);

  // Responsive viewport for mobile
  useEffect(() => {
    const updateViewport = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        // Mobile: larger viewBox for bigger, more visible pendulum
        setViewportWidth(800);
        setViewportHeight(300);
      } else {
        // Desktop: original size
        setViewportWidth(600);
        setViewportHeight(200);
      }
    };
    
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // Use theme colors hook that reacts to theme changes
  const { textColor, accentColor, mutedColor } = useThemeColors({
    text: 1.0,
    accent: 1.0,
    muted: 0.3,
  });

  useEffect(() => {
    if (!isVisible || prefersReducedMotion()) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    // Newton's Cradle constants - deterministic animation
    // Scale up on mobile for better visibility
    const baseScale = isMobile ? 1.8 : 1.2; // Bigger on mobile
    const scale = baseScale;
    const pivotY = 30 * scale; // Scaled pivot height
    const length = 80 * scale; // Wire length in pixels
    const ballRadius = 10 * scale; // Ball radius
    const ballSpacing = ballRadius * 2; // Balls touch when at rest
    const centerX = viewportWidth / 2; // Center of viewBox (responsive)
    const maxAngle = 30 * Math.PI / 180; // Maximum swing angle (30 degrees)
    const cycleDuration = 2000; // Full cycle duration in ms (2 seconds)
    
    // Calculate pivot positions for each ball (centered, with balls touching)
    const pivotPositions: number[] = [];
    const totalWidth = (numBalls - 1) * ballSpacing;
    const startX = centerX - totalWidth / 2;
    for (let i = 0; i < numBalls; i++) {
      pivotPositions.push(startX + i * ballSpacing);
    }

    let startTime = performance.now();

    const animate = (currentTime: number) => {
      // Calculate normalized time in cycle (0 to 1, loops perfectly)
      const elapsed = (currentTime - startTime) % cycleDuration;
      const t = elapsed / cycleDuration; // 0 to 1
      
      // Calculate angles for each ball using deterministic motion
      // Pattern: ball 0 swings out → hits center → ball 3 swings out → hits center → repeat
      const angles = new Array(numBalls).fill(0);
      
      // Use smooth sine wave for pendulum motion (perfect loop)
      if (t < 0.5) {
        // Phase 1: Ball 0 swings out and back, hits center at t=0.5
        const phaseT = t * 2; // 0 to 1
        angles[0] = -maxAngle * Math.sin(phaseT * Math.PI);
        
        // Center balls (1, 2) briefly move during collision (reduced motion)
        if (t >= 0.48 && t <= 0.52) {
          const collisionT = (t - 0.48) / 0.04; // 0 to 1 over 4% of cycle
          // Smooth easing for transition, reduced intensity
          const easedT = 0.5 - 0.5 * Math.cos(collisionT * Math.PI); // Smooth ease-in-out
          const collisionIntensity = easedT * 0.02; // Reduced from 0.06 to 0.02
          angles[1] = collisionIntensity;
          angles[2] = collisionIntensity;
        }
      } else {
        // Phase 2: Ball 3 swings out and back, hits center at t=1.0 (loops to t=0)
        const phaseT = (t - 0.5) * 2; // 0 to 1
        angles[3] = maxAngle * Math.sin(phaseT * Math.PI);
        
        // Center balls (1, 2) briefly move during collision at t=1.0 (loops to t=0)
        if (t >= 0.98) {
          const collisionT = (t - 0.98) / 0.04; // 0 to 1
          // Smooth easing for transition, reduced intensity
          const easedT = 0.5 - 0.5 * Math.cos(collisionT * Math.PI); // Smooth ease-in-out
          const collisionIntensity = easedT * 0.02; // Reduced from 0.06 to 0.02
          angles[1] = -collisionIntensity;
          angles[2] = -collisionIntensity;
        } else if (t <= 0.02) {
          // Handle wrap-around at cycle boundary
          const collisionT = (t + 0.02) / 0.04; // 0 to 1
          // Smooth easing for transition, reduced intensity
          const easedT = 0.5 - 0.5 * Math.cos(collisionT * Math.PI); // Smooth ease-in-out
          const collisionIntensity = easedT * 0.02; // Reduced from 0.06 to 0.02
          angles[1] = -collisionIntensity;
          angles[2] = -collisionIntensity;
        }
      }

      // Determine which side is active for label emphasis
      // Ball 0 swings left (Work), Ball 3 swings right (Life)
      const isWorkActive = t < 0.5 && Math.abs(angles[0]) > 0.01;
      const isLifeActive = t >= 0.5 && Math.abs(angles[3]) > 0.01;
      
      // Calculate emphasis intensity based on swing angle
      const workIntensity = isWorkActive ? Math.abs(angles[0]) / maxAngle : 0;
      const lifeIntensity = isLifeActive ? Math.abs(angles[3]) / maxAngle : 0;

      // Update SVG
      if (svgRef.current) {
        for (let i = 0; i < numBalls; i++) {
          const pivotX = pivotPositions[i];
          const angle = angles[i];
          // Pendulum position: angle measured from vertical (0 = straight down)
          const bobX = pivotX + length * Math.sin(angle);
          const bobY = pivotY + length * Math.cos(angle);

          // Update string - always connects from pivot to ball
          const string = svgRef.current.querySelector(`.cradle-string-${i}`) as SVGLineElement;
          if (string) {
            string.setAttribute('x1', String(pivotX));
            string.setAttribute('y1', String(pivotY));
            string.setAttribute('x2', String(bobX));
            string.setAttribute('y2', String(bobY));
          }

          // Update ball
          const ball = svgRef.current.querySelector(`.cradle-ball-${i}`) as SVGCircleElement;
          if (ball) {
            ball.setAttribute('cx', String(bobX));
            ball.setAttribute('cy', String(bobY));
          }
        }
        
        // Update label emphasis with movement
        const workLabel = svgRef.current.querySelector('.work-label') as SVGTextElement;
        const lifeLabel = svgRef.current.querySelector('.life-label') as SVGTextElement;
        
        // Get current accent color from computed style
        const root = document.documentElement;
        const currentAccentColor = getComputedStyle(root).getPropertyValue('--theme-accent').trim() || textColor;
        
        // Base positions (initial x positions) - positioned relative to pendulum center
        // Pendulum center is viewportWidth / 2 (responsive)
        const pendulumCenterX = viewportWidth / 2;
        const labelOffset = isMobile ? 120 : 100; // Distance from center to labels
        const workBaseX = pendulumCenterX - labelOffset; // Left of center
        const lifeBaseX = pendulumCenterX + labelOffset; // Right of center
        const movementAmount = isMobile ? 12 : 8; // Maximum movement in pixels (bigger on mobile)
        
        if (workLabel) {
          const baseOpacity = 0.4;
          const emphasizedOpacity = 1.0;
          const currentOpacity = baseOpacity + (emphasizedOpacity - baseOpacity) * workIntensity;
          workLabel.setAttribute('opacity', String(currentOpacity));
          workLabel.setAttribute('font-weight', workIntensity > 0.5 ? '600' : '400');
          // Use accent color when emphasized, text color when not
          workLabel.setAttribute('fill', workIntensity > 0.3 ? currentAccentColor : textColor);
          // Move left when emphasized (negative offset)
          const offsetX = -movementAmount * workIntensity;
          workLabel.setAttribute('x', String(workBaseX + offsetX));
        }
        
        if (lifeLabel) {
          const baseOpacity = 0.4;
          const emphasizedOpacity = 1.0;
          const currentOpacity = baseOpacity + (emphasizedOpacity - baseOpacity) * lifeIntensity;
          lifeLabel.setAttribute('opacity', String(currentOpacity));
          lifeLabel.setAttribute('font-weight', lifeIntensity > 0.5 ? '600' : '400');
          // Use accent color when emphasized, text color when not
          lifeLabel.setAttribute('fill', lifeIntensity > 0.3 ? currentAccentColor : textColor);
          // Move right when emphasized (positive offset)
          const offsetX = movementAmount * lifeIntensity;
          lifeLabel.setAttribute('x', String(lifeBaseX + offsetX));
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible, numBalls, isMobile, viewportWidth, viewportHeight]);

  return (
    <div className="w-full my-8" style={visualWrapperStyle}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto"
        style={{ minHeight: isMobile ? '300px' : '200px', width: '100%', maxWidth: '100%', display: 'block' }}
      >
        {/* Pivot bar - centered in viewBox */}
        <line
          x1={viewportWidth / 2 - (isMobile ? 160 : 120)}
          y1={isMobile ? 54 : 36}
          x2={viewportWidth / 2 + (isMobile ? 160 : 120)}
          y2={isMobile ? 54 : 36}
          stroke={textColor}
          strokeWidth={STROKE_WIDTH * (isMobile ? 1.2 : 1)}
        />

        {/* Balls and strings */}
        {Array.from({ length: numBalls }).map((_, i) => {
          // Match physics calculations: scale up on mobile
          const baseScale = isMobile ? 1.8 : 1.2;
          const scale = baseScale;
          const ballRadius = 10 * scale;
          const ballSpacing = ballRadius * 2;
          const pivotY = 30 * scale;
          const length = 80 * scale;
          const centerX = viewportWidth / 2; // Center of viewBox
          const totalWidth = (numBalls - 1) * ballSpacing;
          const startX = centerX - totalWidth / 2;
          const pivotX = startX + i * ballSpacing;
          const restY = pivotY + length; // Ball hangs down from pivot
          const isCenterBall = i === 1 || i === 2;

          return (
            <g key={i}>
              {/* String - connects from pivot to ball center */}
              <line
                className={`cradle-string-${i}`}
                x1={pivotX}
                y1={pivotY}
                x2={pivotX}
                y2={restY}
                stroke={textColor}
                strokeWidth={STROKE_WIDTH}
              />

              {/* Ball - hangs from string */}
              <circle
                className={`cradle-ball-${i}`}
                cx={pivotX}
                cy={restY}
                r={ballRadius}
                fill={accentColor}
                stroke="none"
                style={{ 
                  transition: isCenterBall ? 'transform 0.15s ease-out' : 'none'
                }}
              />
            </g>
          );
        })}
        
        {/* Work label - left side, positioned relative to pendulum center */}
        <text
          className="work-label"
          x={isMobile ? viewportWidth / 2 - 120 : 200}
          y={isMobile ? 54 + 144 + 40 : 36 + 96 + 30}
          fontSize="14"
          fill={textColor}
          textAnchor="start"
          dominantBaseline="middle"
          opacity="0.4"
          style={{
            ...textNoSelectStyle,
            fontFamily: 'var(--theme-font-body, sans-serif)',
            transition: 'opacity 0.3s ease, font-weight 0.3s ease',
          }}
        >
          Work
        </text>
        
        {/* Life label - right side, positioned relative to pendulum center */}
        <text
          className="life-label"
          x={isMobile ? viewportWidth / 2 + 120 : 400}
          y={isMobile ? 54 + 144 + 40 : 36 + 96 + 30}
          fontSize="14"
          fill={textColor}
          textAnchor="end"
          dominantBaseline="middle"
          opacity="0.4"
          style={{
            ...textNoSelectStyle,
            fontFamily: 'var(--theme-font-body, sans-serif)',
            transition: 'opacity 0.3s ease, font-weight 0.3s ease',
          }}
        >
          Life
        </text>
      </svg>
    </div>
  );
}

// EXPERIENCE SNAPSHOT - Concentric Rings of Capability Layers
export function ExperienceSnapshotVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);
  const [drawProgress, setDrawProgress] = useState(0);

  // Define → Systematize → Scale — circular flow
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
    muted: 0.3,
  });

  // Visibility
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

  // Layout
  const cx = 300;
  const cy = 240;
  const ringRadius = 100;
  const viewW = 600;
  const viewH = 480;
  const numStages = stages.length;

  // Stage positions on the ring
  const stageAngleOffset = -Math.PI / 2;
  const getStageAngle = (i: number) => stageAngleOffset + (2 * Math.PI * i) / numStages;
  const getStagePos = (i: number) => {
    const angle = getStageAngle(i);
    return { x: cx + Math.cos(angle) * ringRadius, y: cy + Math.sin(angle) * ringRadius };
  };

  // Smooth orbit with gentle speed variation
  // Adds a subtle sine wobble so the dot speeds up slightly near stage nodes
  // and slows down between them — no hard stops, fully continuous
  const orbitPeriod = 10;
  const linearT = (drawProgress % orbitPeriod) / orbitPeriod;
  // Speed peaks AT stage nodes: derivative of sin is cos, cos(0)=1 at t=0,1/3,2/3
  // Nudge phase slightly forward so boost lands ON the dots, stronger amplitude
  const easeAmplitude = 0.052;
  const phaseNudge = -1.5;
  const easeAngle = (t: number) => t - easeAmplitude * Math.cos(t * numStages * 2 * Math.PI + phaseNudge);
  const easedT = easeAngle(linearT);
  const orbitAngle = stageAngleOffset + easedT * 2 * Math.PI;

  // Trail: time-based so it expands when fast (near nodes) and compresses when slow
  const trailCount = 12;
  const trailTimeStep = 0.01; // seconds back per trail dot — tighter for smoother trail
  const trailAngles = Array.from({ length: trailCount }, (_, i) => {
    const pastTime = ((drawProgress - (i + 1) * trailTimeStep) % orbitPeriod + orbitPeriod) % orbitPeriod;
    const pastLinearT = pastTime / orbitPeriod;
    const pastEased = easeAngle(pastLinearT);
    return stageAngleOffset + pastEased * 2 * Math.PI;
  });

  // Keyword positions — scattered wide around the circle
  const keywordLayout = useMemo(() => {
    const positions: Array<{ stageIndex: number; itemIndex: number; angle: number; radius: number }> = [];
    stages.forEach((stage, si) => {
      const stageAngle = getStageAngle(si);
      const count = stage.items.length;
      const fanSpread = 1.2;
      const startAngle = stageAngle - fanSpread / 2;
      stage.items.forEach((_, ii) => {
        const angle = startAngle + (fanSpread * ii) / (count - 1 || 1);
        const baseRadius = 185 + (ii % 2 === 0 ? 0 : 25) + (si * 7);
        positions.push({ stageIndex: si, itemIndex: ii, angle, radius: baseRadius });
      });
    });
    return positions;
  }, []);

  const getKeywordPos = (layoutIndex: number) => {
    const kw = keywordLayout[layoutIndex];
    const floatX = Math.sin(drawProgress * 0.3 + kw.stageIndex * 2.1 + kw.itemIndex * 1.7) * 5;
    const floatY = Math.cos(drawProgress * 0.25 + kw.stageIndex * 1.5 + kw.itemIndex * 2.3) * 5;
    const r = kw.radius;
    return {
      x: cx + Math.cos(kw.angle) * r + floatX,
      y: cy + Math.sin(kw.angle) * r + floatY,
    };
  };

  // Arrow chevrons between stages
  const getArrowPos = (stageIndex: number) => {
    const a1 = getStageAngle(stageIndex);
    const a2 = getStageAngle((stageIndex + 1) % numStages);
    let diff = a2 - a1;
    if (diff < 0) diff += 2 * Math.PI;
    const midAngle = a1 + diff / 2;
    return {
      x: cx + Math.cos(midAngle) * ringRadius,
      y: cy + Math.sin(midAngle) * ringRadius,
      angle: midAngle,
    };
  };

  // Hover sector paths
  const getStageArcPath = (si: number) => {
    const a1 = getStageAngle(si) - Math.PI / numStages;
    const a2 = getStageAngle(si) + Math.PI / numStages;
    const outerR = 230;
    const x1 = cx + Math.cos(a1) * outerR;
    const y1 = cy + Math.sin(a1) * outerR;
    const x2 = cx + Math.cos(a2) * outerR;
    const y2 = cy + Math.sin(a2) * outerR;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} Z`;
  };

  let kwIndex = 0;

  return (
    <div ref={containerRef} style={visualWrapperStyle} className="my-8">
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        style={{ width: '100%', height: 'auto', maxWidth: viewW, overflow: 'visible' }}
      >
        {/* Invisible hover sectors */}
        {stages.map((_, si) => (
          <path
            key={`sector-${si}`}
            d={getStageArcPath(si)}
            fill="transparent"
            onMouseEnter={() => setHoveredStage(si)}
            onMouseLeave={() => setHoveredStage(null)}
            style={{ cursor: 'default' }}
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
        />

        {/* Direction arrows on the ring */}
        {stages.map((_, si) => {
          const arrow = getArrowPos(si);
          const dir = arrow.angle + Math.PI / 2;
          const size = 5;
          return (
            <g key={`arrow-${si}`} opacity={0.35}>
              <line
                x1={arrow.x - Math.cos(dir) * size + Math.cos(dir + 2.5) * size}
                y1={arrow.y - Math.sin(dir) * size + Math.sin(dir + 2.5) * size}
                x2={arrow.x}
                y2={arrow.y}
                stroke={mutedColor}
                strokeWidth={1}
              />
              <line
                x1={arrow.x - Math.cos(dir) * size + Math.cos(dir - 2.5) * size}
                y1={arrow.y - Math.sin(dir) * size + Math.sin(dir - 2.5) * size}
                x2={arrow.x}
                y2={arrow.y}
                stroke={mutedColor}
                strokeWidth={1}
              />
            </g>
          );
        })}

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
                      opacity={isHovered ? 0.5 : 0.2}
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
                      fontSize={si === 0 ? 16 : 14}
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

        {/* Stage nodes on the ring */}
        {stages.map((stage, si) => {
          const pos = getStagePos(si);
          const isHovered = hoveredStage === si;
          const labelAngle = getStageAngle(si);
          const labelR = ringRadius - 34;
          const labelPos = {
            x: cx + Math.cos(labelAngle) * labelR,
            y: cy + Math.sin(labelAngle) * labelR,
          };

          return (
            <g key={`stage-${si}`}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHovered ? 10 : 8}
                fill={isHovered ? accentColor : textColor}
                style={{ transition: 'fill 0.2s ease' }}
              />
              <text
                x={labelPos.x}
                y={labelPos.y + 5}
                textAnchor="middle"
                fill={isHovered ? accentColor : textColor}
                fontSize={16}
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
        {/* Trail dots first (behind lead) */}
        {trailAngles.map((a, i) => {
          const tx = cx + Math.cos(a) * ringRadius;
          const ty = cy + Math.sin(a) * ringRadius;
          const t = i / trailCount; // 0 to ~1
          const size = Math.max(0.5, 5.5 * (1 - t * t)); // quadratic falloff
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
        {/* Lead dot */}
        <circle
          cx={cx + Math.cos(orbitAngle) * ringRadius}
          cy={cy + Math.sin(orbitAngle) * ringRadius}
          r={6}
          fill={accentColor}
          opacity={0.95}
        />
      </svg>
    </div>
  );
}
