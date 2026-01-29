import { useEffect, useMemo, useRef, useState } from 'react';
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force';

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    updateMobile();
    window.addEventListener('resize', updateMobile);
    return () => window.removeEventListener('resize', updateMobile);
  }, []);

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
                fontSize={isMobile ? "24" : "14"}
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    updateMobile();
    window.addEventListener('resize', updateMobile);
    return () => window.removeEventListener('resize', updateMobile);
  }, []);

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
          fontSize={isMobile ? "24" : "14"}
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
          fontSize={isMobile ? "24" : "14"}
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    updateMobile();
    window.addEventListener('resize', updateMobile);
    return () => window.removeEventListener('resize', updateMobile);
  }, []);

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
          fontSize={isMobile ? "24" : "14"}
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
          fontSize={isMobile ? "24" : "14"}
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
          fontSize={isMobile ? "24" : "14"}
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
          fontSize={isMobile ? "24" : "14"}
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
          fontSize={isMobile ? "24" : "14"}
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

// EXPERIENCE SNAPSHOT - Network Graph of Connected Spheres
export function ExperienceSnapshotVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [draggedNode, setDraggedNode] = useState<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const dragPrevPosRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const dragVelocityRef = useRef<{ vx: number; vy: number } | null>(null);
  
  // Experience keywords
  const keywords = [
    'Product Strategy',
    'Platform Building',
    'Team Scaling',
    'Design Systems',
    'Product Discovery',
    'Monetization',
    'Execution',
    'Leadership',
    'Mentorship',
    'IPO Readiness'
  ];

  // Define network connections (edges) - create a connected graph
  // Each node connects to 2-3 other nodes for a web-like structure
  const connections: Array<[number, number]> = [
    [0, 3], [0, 2], [0, 4], // Product Strategy connects to Design Systems, Team Scaling, Product Discovery
    [3, 1], [3, 4], // Design Systems connects to Platform Building, Product Discovery
    [2, 6], [2, 7], // Team Scaling connects to Execution, Leadership
    [1, 4], [1, 5], // Platform Building connects to Product Discovery, Monetization
    [4, 5], [4, 8], // Product Discovery connects to Monetization, Mentorship
    [5, 6], [5, 9], // Monetization connects to Execution, IPO Readiness
    [6, 7], [6, 9], // Execution connects to Leadership, IPO Readiness
    [7, 8], // Leadership connects to Mentorship
    [8, 9], // Mentorship connects to IPO Readiness
  ];

  // Node state: each node has position, size, and velocity
  const [nodes, setNodes] = useState<Array<{
    id: number;
    keyword: string;
    x: number;
    y: number;
    size: number;
    opacity: number; // base opacity (0.8-1.0)
    vx?: number; // velocity x (optional for d3-force)
    vy?: number; // velocity y (optional for d3-force)
  }>>([]);
  
  // d3-force simulation
  const simulationRef = useRef<any>(null);
  const d3NodesRef = useRef<any[]>([]);

  useEffect(() => {
    const updateMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    updateMobile();
    window.addEventListener('resize', updateMobile);
    return () => window.removeEventListener('resize', updateMobile);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Handle mouse interactions: hover, drag, and magnetic attraction
  useEffect(() => {
    if (!svgRef.current || !isVisible) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const svg = svgRef.current;
      const viewBox = svg.viewBox.baseVal;
      
      // Convert mouse position to SVG coordinates
      const x = ((e.clientX - rect.left) / rect.width) * viewBox.width;
      const y = ((e.clientY - rect.top) / rect.height) * viewBox.height;
      
      setMousePos({ x, y });

      // Handle dragging
      if (draggedNode !== null && dragStartPosRef.current) {
        const dx = x - dragStartPosRef.current.x;
        const dy = y - dragStartPosRef.current.y;
        const now = performance.now();
        
        setNodes((prev) => {
          return prev.map((node) => {
            if (node.id === draggedNode) {
              const radius = node.size / 2;
              const padding = 60;
              const viewBoxWidth = 600;
              const viewBoxHeight = 400;
              
              // Update position, keeping within bounds
              const newX = Math.max(padding + radius, Math.min(viewBoxWidth - padding - radius, node.x + dx));
              const newY = Math.max(padding + radius, Math.min(viewBoxHeight - padding - radius, node.y + dy));
              
              // Update d3 node position for smooth transition
              const d3Node = d3NodesRef.current.find((n: any) => n.id === node.id);
              if (d3Node) {
                d3Node.fx = newX; // Keep fixed during drag
                d3Node.fy = newY;
                d3Node.vx = 0;
                d3Node.vy = 0;
              }
              
              // Track drag velocity for inertia (sampled from last update)
              const prevSample = dragPrevPosRef.current;
              if (prevSample) {
                const dt = Math.max(1, now - prevSample.time);
                dragVelocityRef.current = {
                  vx: (newX - prevSample.x) / dt, // px / ms
                  vy: (newY - prevSample.y) / dt,
                };
              }
              dragPrevPosRef.current = { x: newX, y: newY, time: now };
              dragStartPosRef.current = { x, y };
              
              return {
                ...node,
                x: newX,
                y: newY,
              };
            }
            return node;
          });
        });
      } else {
        // Check for hover (find closest node)
        let closestNode: number | null = null;
        let minDistance = Infinity;
        
        nodes.forEach((node) => {
          const dx = x - node.x;
          const dy = y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const radius = node.size / 2;
          
          if (distance < radius + 10 && distance < minDistance) {
            minDistance = distance;
            closestNode = node.id;
          }
        });
        
        setHoveredNode(closestNode);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const svg = svgRef.current;
      const viewBox = svg.viewBox.baseVal;
      
      const x = ((e.clientX - rect.left) / rect.width) * viewBox.width;
      const y = ((e.clientY - rect.top) / rect.height) * viewBox.height;
      
      // Find clicked node
      let clickedNode: number | null = null;
      let minDistance = Infinity;
      
      nodes.forEach((node) => {
        const dx = x - node.x;
        const dy = y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radius = node.size / 2;
        
        if (distance < radius && distance < minDistance) {
          minDistance = distance;
          clickedNode = node.id;
        }
      });
      
      if (clickedNode !== null) {
        setDraggedNode(clickedNode);
        dragStartPosRef.current = { x, y };
        dragVelocityRef.current = null;
        const clicked = nodes.find((n) => n.id === clickedNode);
        dragPrevPosRef.current = { x: clicked?.x ?? x, y: clicked?.y ?? y, time: performance.now() };
        
        // Stop the node's velocity in d3 simulation and fix position
        const d3Node = d3NodesRef.current.find((n: any) => n.id === clickedNode);
        if (d3Node) {
          d3Node.fx = d3Node.x; // Fix position
          d3Node.fy = d3Node.y;
          d3Node.vx = 0;
          d3Node.vy = 0;
        }
      }
    };

    const handleMouseUp = () => {
      if (draggedNode !== null) {
        // Calculate drag velocity for inertia
        const d3Node = d3NodesRef.current.find((n: any) => n.id === draggedNode);
        if (d3Node) {
          const v = dragVelocityRef.current;
          if (v) {
            // Convert px/ms to ~px/tick (16ms ≈ 1 frame at 60fps)
            const inertia = 0.9;
            d3Node.vx = v.vx * 16 * inertia;
            d3Node.vy = v.vy * 16 * inertia;
          }

          // Release the fixed position
          d3Node.fx = null;
          d3Node.fy = null;
        }
        
        setDraggedNode(null);
        dragStartPosRef.current = null;
        dragPrevPosRef.current = null;
        dragVelocityRef.current = null;
        
        // Nudge simulation so inertia is immediately visible
        if (simulationRef.current) {
          simulationRef.current.alpha(0.2).restart();
        }
      }
    };

    const handleMouseLeave = () => {
      setMousePos(null);
      setHoveredNode(null);
      if (draggedNode !== null) {
        handleMouseUp();
      }
    };

    const svg = svgRef.current;
    svg.addEventListener('mousemove', handleMouseMove);
    svg.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    svg.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      svg.removeEventListener('mousemove', handleMouseMove);
      svg.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      svg.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible, nodes, draggedNode]);

  // Initialize nodes with random positions
  useEffect(() => {
    if (!isVisible || nodes.length > 0) return;

    const viewBoxWidth = 600;
    const viewBoxHeight = 400; // Increased height for better spacing
    const minSize = isMobile ? 50 : 60;
    const maxSize = isMobile ? 90 : 110;
    const padding = 80;

    const initialNodes = keywords.map((keyword, index) => {
      // Random size
      const size = minSize + Math.random() * (maxSize - minSize);
      
      // Random opacity between 0.8 and 1.0
      const opacity = 0.8 + Math.random() * 0.2;

      // Distribute nodes in a wider circular/network pattern
      const angle = (index / keywords.length) * Math.PI * 2;
      const radius = Math.min(viewBoxWidth, viewBoxHeight) * 0.35; // Larger radius
      const x = viewBoxWidth / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 60;
      const y = viewBoxHeight / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 60;

      return {
        id: index,
        keyword,
        x: Math.max(padding, Math.min(viewBoxWidth - padding, x)),
        y: Math.max(padding, Math.min(viewBoxHeight - padding, y)),
        size,
        opacity,
        vx: 0,
        vy: 0,
      };
    });

    setNodes(initialNodes);
  }, [isVisible, isMobile]);

  // Initialize d3-force simulation for network graph
  useEffect(() => {
    if (!isVisible || nodes.length === 0 || prefersReducedMotion()) {
      if (simulationRef.current) {
        simulationRef.current.stop();
        simulationRef.current = null;
      }
      return;
    }

    const viewBoxWidth = 600;
    const viewBoxHeight = 400; // Increased height for better spacing

    // Initialize or update d3 nodes (reuse same objects for d3-force)
    if (d3NodesRef.current.length === 0 || d3NodesRef.current.length !== nodes.length) {
      d3NodesRef.current = nodes.map((node) => ({
        id: node.id,
        keyword: node.keyword,
        size: node.size,
        opacity: node.opacity,
        x: node.x,
        y: node.y,
        // Smooth "wander" parameters (stable per node)
        wanderPhaseX: Math.random() * Math.PI * 2,
        wanderPhaseY: Math.random() * Math.PI * 2,
        wanderFreqX: 0.35 + Math.random() * 0.35, // rad/s-ish
        wanderFreqY: 0.35 + Math.random() * 0.35,
      }));
    } else {
      // Update positions but keep same objects
      nodes.forEach((node, index) => {
        const d3Node = d3NodesRef.current[index];
        if (d3Node && d3Node.id === node.id) {
          // Only update if significantly different (to avoid jitter)
          if (Math.abs(d3Node.x - node.x) > 1 || Math.abs(d3Node.y - node.y) > 1) {
            d3Node.x = node.x;
            d3Node.y = node.y;
          }
        }
      });
    }

    const d3Links = connections.map(([source, target]) => ({
      source: d3NodesRef.current[source],
      target: d3NodesRef.current[target],
      // Calculate ideal distance based on node sizes
      distance: (nodes[source].size / 2 + nodes[target].size / 2) * 2.5,
    }));

    // Create or update force simulation
    let simulation = simulationRef.current;
    
    if (!simulation) {
      simulation = forceSimulation(d3NodesRef.current)
        .force('link', forceLink(d3Links).id((d: any) => d.id).distance((d: any) => d.distance).strength(0.4))
        .force('charge', forceManyBody().strength(-500)) // Stronger repulsion to spread nodes out
        .force('center', forceCenter(viewBoxWidth / 2, viewBoxHeight / 2).strength(0.05))
        .force('collide', forceCollide().radius((d: any) => d.size / 2 + 15).strength(0.8)) // More spacing between nodes
        .alphaDecay(0.02) // Slow decay for continuous movement
        .velocityDecay(0.4) // Damping
        .alphaTarget(0.06); // Keep a low, steady energy (prevents "bursty" motion)

      // Add smooth "wander" force for continuous gentle motion (no randomness spikes)
      const wanderForce = (alpha: number) => {
        const t = performance.now() / 1000;
        const strength = 0.10;
        const a = 0.35 + alpha; // keep it alive even when alpha is low

        d3NodesRef.current.forEach((node: any) => {
          if (node.id === draggedNode) return;

          const fx = Math.cos(t * (node.wanderFreqX || 0.5) + (node.wanderPhaseX || 0)) * strength * a;
          const fy = Math.sin(t * (node.wanderFreqY || 0.5) + (node.wanderPhaseY || 0)) * strength * a;
          node.vx = (node.vx || 0) + fx;
          node.vy = (node.vy || 0) + fy;
        });
      };

      simulation.force('wander', wanderForce as any);

      // Add mouse attraction force (custom force) - stronger interaction
      const mouseForce = (alpha: number) => {
        if (!mousePos || draggedNode !== null) return; // Don't apply force when dragging
        
        d3NodesRef.current.forEach((node: any) => {
          // Skip dragged node
          if (node.id === draggedNode) return;
          
          const dx = mousePos.x - (node.x || 0);
          const dy = mousePos.y - (node.y || 0);
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0 && distance < 200) {
            // Stronger attraction that increases as mouse gets closer
            const forceStrength = alpha * 0.8 * (1 - distance / 200);
            node.vx = (node.vx || 0) + (dx / distance) * forceStrength;
            node.vy = (node.vy || 0) + (dy / distance) * forceStrength;
          }
        });
      };

      simulation.force('mouse', mouseForce as any);

      // Update positions on each tick
      simulation.on('tick', () => {
        setNodes((prev) => {
          return prev.map((node) => {
            const d3Node = d3NodesRef.current.find((n: any) => n.id === node.id);
            if (!d3Node) return node;

            // Keep nodes within bounds
            const radius = node.size / 2;
            const padding = 60; // Increased padding for better spacing
            const minX = padding + radius;
            const maxX = viewBoxWidth - padding - radius;
            const minY = padding + radius;
            const maxY = viewBoxHeight - padding - radius;

            let x = d3Node.x ?? node.x;
            let y = d3Node.y ?? node.y;

            if (x < minX) {
              x = minX;
              d3Node.x = x;
              d3Node.vx = Math.abs(d3Node.vx || 0) * 0.6;
            } else if (x > maxX) {
              x = maxX;
              d3Node.x = x;
              d3Node.vx = -Math.abs(d3Node.vx || 0) * 0.6;
            }

            if (y < minY) {
              y = minY;
              d3Node.y = y;
              d3Node.vy = Math.abs(d3Node.vy || 0) * 0.6;
            } else if (y > maxY) {
              y = maxY;
              d3Node.y = y;
              d3Node.vy = -Math.abs(d3Node.vy || 0) * 0.6;
            }

            return {
              ...node,
              x,
              y,
            };
          });
        });
      });

      simulationRef.current = simulation;
    } else {
      // Update existing simulation
      simulation.nodes(d3NodesRef.current);
      simulation.force('link', forceLink(d3Links).id((d: any) => d.id).distance((d: any) => d.distance).strength(0.4));
      simulation.force('charge', forceManyBody().strength(-500)); // Stronger repulsion
      simulation.force('collide', forceCollide().radius((d: any) => d.size / 2 + 15).strength(0.8)); // More spacing
      simulation.alphaTarget(0.06);
      
      // Update smooth wander force for continuous gentle motion
      const wanderForce = (alpha: number) => {
        const t = performance.now() / 1000;
        const strength = 0.10;
        const a = 0.35 + alpha;

        d3NodesRef.current.forEach((node: any) => {
          if (node.id === draggedNode) return;

          const fx = Math.cos(t * (node.wanderFreqX || 0.5) + (node.wanderPhaseX || 0)) * strength * a;
          const fy = Math.sin(t * (node.wanderFreqY || 0.5) + (node.wanderPhaseY || 0)) * strength * a;
          node.vx = (node.vx || 0) + fx;
          node.vy = (node.vy || 0) + fy;
        });
      };
      simulation.force('wander', wanderForce as any);
      
      // Update mouse force - stronger interaction
      const mouseForce = (alpha: number) => {
        if (!mousePos || draggedNode !== null) return; // Don't apply force when dragging
        
        d3NodesRef.current.forEach((node: any) => {
          // Skip dragged node
          if (node.id === draggedNode) return;
          
          const dx = mousePos.x - (node.x || 0);
          const dy = mousePos.y - (node.y || 0);
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0 && distance < 200) {
            // Stronger attraction that increases as mouse gets closer
            const forceStrength = alpha * 0.8 * (1 - distance / 200);
            node.vx = (node.vx || 0) + (dx / distance) * forceStrength;
            node.vy = (node.vy || 0) + (dy / distance) * forceStrength;
          }
        });
      };
      simulation.force('mouse', mouseForce as any);
      
      // Restart simulation when mouse position changes for immediate response
      if (mousePos !== null) {
        // Avoid big "bursts" that feel laggy; keep interaction responsive but smooth
        simulation.alpha(0.2).restart();
      }
    }

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
        simulationRef.current = null;
      }
    };
  }, [isVisible, nodes.length, mousePos, draggedNode]);

  const { accentColor, bgColor, mutedColor } = useThemeColors({ accent: 1.0, bg: 1.0, muted: 0.3 });

  return (
    <div ref={containerRef} className="w-full my-8" style={visualWrapperStyle}>
      <svg
        ref={svgRef}
        viewBox="0 0 600 400"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto"
        style={{ minHeight: '400px', width: '100%', maxWidth: '100%', display: 'block' }}
      >
        {/* Render network edges (connections) */}
        {connections.map(([id1, id2], index) => {
          const node1 = nodes[id1];
          const node2 = nodes[id2];
          if (!node1 || !node2) return null;

          return (
            <line
              key={`edge-${id1}-${id2}`}
              x1={node1.x}
              y1={node1.y}
              x2={node2.x}
              y2={node2.y}
              stroke={mutedColor}
              strokeWidth={STROKE_WIDTH * 0.5}
              strokeDasharray="2 3"
              opacity={isVisible ? 0.4 : 0}
              style={{ transition: 'opacity 0.6s ease' }}
            />
          );
        })}

        {/* Render nodes (spheres) */}
        {nodes.map((node) => {
          const radius = node.size / 2;
          // Calculate font size to fit text within sphere
          const textLength = node.keyword.length;
          const maxTextWidth = radius * 1.3;
          const estimatedCharWidth = 0.55;
          const fontSize = Math.min(
            Math.max(9, (maxTextWidth / (textLength * estimatedCharWidth))),
            radius * 0.32
          );

          const isHovered = hoveredNode === node.id;
          const isDragged = draggedNode === node.id;
          const hoverScale = isHovered ? 1.1 : 1.0;
          const hoverStrokeWidth = isHovered ? STROKE_WIDTH * 2 : STROKE_WIDTH;
          const hoverStrokeOpacity = isHovered ? 0.6 : 0.3;

          return (
            <g
              key={node.id}
              style={{
                cursor: isHovered || isDragged ? 'grab' : 'default',
              }}
            >
              {/* Sphere circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={radius * hoverScale}
                fill={accentColor}
                fillOpacity={isVisible ? node.opacity : 0}
                stroke={accentColor}
                strokeWidth={hoverStrokeWidth}
                strokeOpacity={isVisible ? hoverStrokeOpacity : 0}
                style={{ 
                  transition: isDragged ? 'none' : 'opacity 0.6s ease, stroke-width 0.2s ease, stroke-opacity 0.2s ease',
                }}
              />
              
              {/* Keyword text */}
              <text
                x={node.x}
                y={node.y}
                fontSize={fontSize}
                fill={bgColor}
                fillOpacity={isVisible ? 0.95 : 0}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  ...textNoSelectStyle,
                  fontFamily: 'var(--theme-font-body, sans-serif)',
                  fontWeight: 500,
                  transition: 'opacity 0.6s ease',
                }}
              >
                {node.keyword}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
