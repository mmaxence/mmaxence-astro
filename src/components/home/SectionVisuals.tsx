import { useEffect, useMemo, useRef, useState } from 'react';
import timelineDataRaw from '../../data/timeline-visual.json';

// Type definition for timeline data
interface TimelineMilestone {
  year: number;
  label: string;
  period?: string;
  sublabel?: string;
}

interface TimelinePeriod {
  id: string;
  label: string;
  start: number;
  end: number;
  milestones: Array<{ year: number; label: string }>;
}

interface TimelineConfig {
  startYear: number;
  endYear: number;
  periods: TimelinePeriod[];
  majorMilestones: TimelineMilestone[];
}

const timelineData = timelineDataRaw as TimelineConfig;

// Shared visual constants
const STROKE_WIDTH = 1.5;
const ANIMATION_DURATION = 3000; // 3 seconds for slow motion

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
  const layers = [
    { label: 'Execution Systems', x: 50, y: 160, z: 2 },
    { label: 'Interaction Design', x: 55, y: 110, z: 1 },
    { label: 'Product Definition', x: 60, y: 60, z: 0 },
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
    <div ref={containerRef} className="w-full my-8" style={{ 
      width: '100%', 
      maxWidth: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
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
                style={{ cursor: 'pointer', transition: 'stroke 0.4s ease' }}
              />

              {/* Connection line */}
              <line
                x1="400"
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
                x="400"
                y={centerY + 5}
                fontSize="14"
                fill={isHovered ? accentColor : mutedColor}
                style={{
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

// 2. EXPERIENCE SNAPSHOT - Timeline with Inflection Nodes
export function ExperienceSnapshotVisual() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const animationRef = useRef<number>();
  const currentScrollOffset = useRef<number>(0);
  const targetScrollOffset = useRef<number>(0);
  
  // Touch/swipe support for mobile
  const touchStartX = useRef<number | null>(null);
  const touchStartScroll = useRef<number>(0);
  const isDragging = useRef(false);
  
  // Use refs for hover state to avoid closure issues in animation loop
  const isHoveredRef = useRef(false);
  const mouseXRef = useRef<number | null>(null);

  // Track if we just entered hover for smoother animation
  const justEnteredHoverRef = useRef(false);
  
  // Mouse event handlers
  const handleMouseEnter = () => {
    setIsHovered(true);
    isHoveredRef.current = true;
    justEnteredHoverRef.current = true;
    // Reset flag after a short delay
    setTimeout(() => {
      justEnteredHoverRef.current = false;
    }, 500);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseX(null);
    isHoveredRef.current = false;
    mouseXRef.current = null;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setMouseX(x);
    mouseXRef.current = x;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (svgRef.current) observer.observe(svgRef.current);
    return () => observer.disconnect();
  }, []);

  // Use theme colors hook that reacts to theme changes
  const { textColor, accentColor, mutedColor, isDark, getAdjustedOpacityValue } = useThemeColors({
    text: 0.8,
    accent: 1.0,
    muted: 0.4,
  });

  // Determine text color for period labels: use accent, but if accent is dark/black, use white
  const [periodLabelColor, setPeriodLabelColor] = useState('#ffffff');
  
  useEffect(() => {
    const getPeriodLabelColor = (): string => {
      if (typeof window === 'undefined') return '#ffffff';
      const root = document.documentElement;
      const accent = getComputedStyle(root).getPropertyValue('--theme-accent').trim();
      
      // If accent is black or very dark, use white
      if (accent.startsWith('#')) {
        const hex = accent.slice(1);
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness < 128 ? '#ffffff' : accentColor;
      }
      
      // For rgba colors, check if dark
      if (accent.startsWith('rgba')) {
        const match = accent.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
          const r = parseInt(match[1]);
          const g = parseInt(match[2]);
          const b = parseInt(match[3]);
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          return brightness < 128 ? '#ffffff' : accentColor;
        }
      }
      
      return accentColor;
    };
    
    setPeriodLabelColor(getPeriodLabelColor());
  }, [accentColor]);

  // Load timeline data from JSON
  const timelineConfig = useMemo(() => timelineData, []);

  // Buffer years configuration
  const bufferYearsBefore = 3;
  const bufferYearsAfter = 1; // Reduced from 3 to 1 after last active year

  // Content years (actual timeline data, no buffers)
  const contentStartYear = timelineConfig.startYear;
  const contentEndYear = timelineConfig.endYear;

  // Extract data from JSON with buffer years for smooth transitions
  const timelineStartYear = timelineConfig.startYear - bufferYearsBefore; // Add 3 years before
  const timelineEndYear = timelineConfig.endYear + bufferYearsAfter; // Add 1 year after (reduced from 3)
  const timelineDuration = timelineConfig.endYear - timelineConfig.startYear; // Duration of actual content
  const totalTimelineDuration = timelineEndYear - timelineStartYear; // Total including buffers

  // Year display range: show 1 year before and 1 year after active dates
  const yearDisplayStart = contentStartYear - 1; // 2004 (2005 - 1)
  const yearDisplayEnd = contentEndYear + 1; // 2027 (2026 + 1)

  // Generate all years for floor line - show 1 year before and 1 year after active dates
  // Show from contentStartYear - 1 to contentEndYear + 1 (e.g., 2004 to 2027)
  const allYears = useMemo(() => {
    const years = [];
    // Include years from 1 before to 1 after active content
    for (let year = yearDisplayStart; year <= yearDisplayEnd; year++) {
      years.push(year);
    }
    // Gap area has no years - this creates the visual breakpoint
    return years;
  }, [yearDisplayStart, yearDisplayEnd]);

  // Extract periods from JSON
  const majorPeriods = useMemo(() => {
    return timelineConfig.periods.map(period => ({
      start: period.start,
      end: period.end,
      period: period.id,
      label: period.label,
    }));
  }, [timelineConfig]);

  // Timeline configuration - Month precision: One year = 12 months
  // Use a flexible viewBox that scales - viewBox width should not constrain container
  // On mobile, use a more square ratio for better visibility
  const [viewportWidth, setViewportWidth] = useState(1400);
  const [viewportHeight, setViewportHeight] = useState(300);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const updateViewport = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        // Mobile: smaller, tighter viewBox so content fills more space
        // Reduced from 800x800 to 600x400 for better content density
        setViewportWidth(600);
        setViewportHeight(400);
      } else {
        // Desktop: wide landscape ratio
        setViewportWidth(1400);
        setViewportHeight(300);
      }
    };
    
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);
  
  // Scale factor for horizontal measurements and visual elements (fonts, strokes, etc.)
  // On mobile, use a much larger scale multiplier to make content bigger relative to viewBox
  const baseScale = viewportWidth / 900; // ≈ 1.556 on desktop, ≈ 0.667 on mobile (600/900)
  const scale = isMobile ? baseScale * 2.2 : baseScale; // 2.2x multiplier on mobile = ~1.47 scale (much bigger!)
  // Center timeline vertically on mobile (200 in 400px viewBox), keep desktop position
  const timelineY = isMobile ? 200 : 200; // Vertical position of timeline (floor level) - centered in smaller viewBox
  const yearWidth = Math.round(55 * scale); // Pixels per year - scaled horizontally
  const monthWidth = yearWidth / 12; // Pixels per month (12 sections per year)
  const gapBetweenPeriods = Math.round(8 * scale); // Small gap between consecutive periods - scaled
  const cycleDuration = 30000; // 30 seconds for full cycle
  // Scale fonts - use larger scale on mobile for better readability
  const fontScale = isMobile ? scale * 1.1 : scale; // Slightly larger font scale on mobile
  const fontSizeYear = Math.round(13 * fontScale);
  const fontSizePeriod = Math.round(14 * fontScale);
  const fontSizeMilestone = Math.round(12 * fontScale);
  
  // Helper: Convert year (with optional month fraction) to X position
  // year can be integer (2005) or fractional (2005.916 = Nov 2005)
  // Base position on yearDisplayStart (2004) instead of timelineStartYear (2002)
  const yearToX = useMemo(() => {
    return (year: number): number => {
      return (year - yearDisplayStart) * yearWidth;
    };
  }, [yearDisplayStart, yearWidth]);
  
  // Calculate year positions - FOUNDATION: Years are positioned at exact year positions
  const positionedYears = useMemo(() => {
    return allYears.map(year => {
      const x = yearToX(year);
      return { year, x };
    });
  }, [allYears, yearToX]);

  // Calculate month positions - 12 months per year as small indicators
  const positionedMonths = useMemo(() => {
    const months: Array<{ year: number; month: number; x: number }> = [];
    
    allYears.forEach(year => {
      // Add 12 month markers for each year
      for (let month = 0; month < 12; month++) {
        const fractionalYear = year + (month / 12);
        const x = yearToX(fractionalYear);
        months.push({ year, month, x });
      }
    });
    
    return months;
  }, [allYears, yearToX]);
  
  // Calculate period positions - Using precise month-level dates
  // Gaps added between consecutive periods for visual separation
  const positionedPeriods = useMemo(() => {
    let accumulatedGap = 0;
    
    return majorPeriods.map((period, index) => {
      // Start at precise date position (handles fractional years for months)
      const startX = yearToX(period.start) + accumulatedGap;
      // End at precise date position
      const endX = yearToX(period.end) + accumulatedGap;
      
      // Add small gap after this period if next period starts close (within 2 months)
      if (index < majorPeriods.length - 1) {
        const nextPeriod = majorPeriods[index + 1];
        const timeBetween = nextPeriod.start - period.end;
        // If periods are close (less than 0.2 years = ~2.4 months), add gap
        if (timeBetween < 0.2) {
          accumulatedGap += gapBetweenPeriods;
        }
      }
      
      return {
        ...period,
        startX,
        endX,
        centerX: (startX + endX) / 2,
      };
    });
  }, [majorPeriods, yearToX, gapBetweenPeriods]);
  
  // Calculate total timeline width (last period end)
  const timelineWidth = useMemo(() => {
    const lastPeriod = positionedPeriods[positionedPeriods.length - 1];
    return lastPeriod ? lastPeriod.endX : yearToX(contentEndYear + 1);
  }, [positionedPeriods, contentEndYear, yearToX]);
  
  // Calculate content width (from first period start to last period end) - for hover scroll optimization
  const contentWidth = useMemo(() => {
    if (positionedPeriods.length === 0) return timelineWidth;
    const firstPeriod = positionedPeriods[0];
    const lastPeriod = positionedPeriods[positionedPeriods.length - 1];
    return lastPeriod.endX - firstPeriod.startX;
  }, [positionedPeriods]);
  
  // Active timeline range (content only, no buffers) for hover scroll
  const activeStartX = useMemo(() => yearToX(contentStartYear), [yearToX, contentStartYear]); // 2005 (actual content start)
  const activeEndX = useMemo(() => yearToX(contentEndYear), [yearToX, contentEndYear]); // 2026 (actual content end)
  const activeRange = useMemo(() => activeEndX - activeStartX, [activeStartX, activeEndX]);
  
  // Full timeline range for rendering (year display range: 2004 to 2027)
  const hoverStartX = useMemo(() => yearToX(yearDisplayStart), [yearToX, yearDisplayStart]); // 2004 (2005 - 1)
  const hoverEndX = useMemo(() => yearToX(yearDisplayEnd), [yearToX, yearDisplayEnd]); // 2027 (2026 + 1)
  const hoverRange = useMemo(() => hoverEndX - hoverStartX, [hoverStartX, hoverEndX]);
  
  // Timeline scroll range: from start to end of displayed years
  const timelineScrollRange = hoverRange; // Full timeline range from yearDisplayStart to yearDisplayEnd
  
  // Extract milestones for hover display
  const periodMilestones = useMemo(() => {
    return timelineConfig.periods.map(period => ({
      periodId: period.id,
      periodLabel: period.label,
      milestones: period.milestones.map(m => ({
        year: m.year,
        label: m.label,
        x: yearToX(m.year),
      })),
    }));
  }, [timelineConfig, yearToX]);

  // Calculate initial offset: on mobile, start at beginning to show all content, desktop centers first year
  const initialOffset = useMemo(() => {
    const firstYearX = yearToX(contentStartYear);
    if (isMobile) {
      // On mobile: start at the very beginning (yearDisplayStart = 2004) positioned at left edge
      // This allows scrolling all the way to the end (2027)
      const startX = yearToX(yearDisplayStart);
      return 0 - startX; // Start at left edge (0) minus the start position
    } else {
      // Desktop: center first content year
      return viewportWidth / 2 - firstYearX;
    }
  }, [viewportWidth, contentStartYear, yearToX, isMobile, yearDisplayStart]);

  // Touch handlers for mobile swipe - defined after yearToX and other variables are available
  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    // Check mobile using window width directly to avoid stale closure
    if (typeof window === 'undefined') return;
    const mobile = window.innerWidth <= 768;
    if (!mobile) return;
    e.preventDefault(); // Prevent default scrolling
    const touch = e.touches[0];
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    touchStartX.current = touch.clientX - rect.left;
    touchStartScroll.current = currentScrollOffset.current;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    // Check mobile using window width directly
    if (typeof window === 'undefined') return;
    const mobile = window.innerWidth <= 768;
    if (!mobile || !isDragging.current || touchStartX.current === null) return;
    e.preventDefault(); // Prevent default scrolling
    const touch = e.touches[0];
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const currentX = touch.clientX - rect.left;
    const deltaX = currentX - touchStartX.current;
    
    // Use the latest yearToX function and values from the component scope
    const startX = yearToX(yearDisplayStart);
    const endX = yearToX(yearDisplayEnd);
    const newScroll = touchStartScroll.current - deltaX; // Invert: swipe left moves timeline right
    
    // Clamp to bounds - ensure we can scroll to show 2026
    const minScroll = 0 - startX;
    const maxScroll = viewportWidth - endX;
    currentScrollOffset.current = Math.max(minScroll, Math.min(maxScroll, newScroll));
  };

  const handleTouchEnd = () => {
    if (typeof window === 'undefined') return;
    const mobile = window.innerWidth <= 768;
    if (!mobile) return;
    isDragging.current = false;
    touchStartX.current = null;
  };
  
  // iOS-like bounce easing function
  const bounceEase = (t: number): number => {
    if (t < 0) {
      // Bounce at start - exponential decay
      const overshoot = -t;
      return -Math.pow(overshoot, 1.5) * 0.15;
    } else if (t > 1) {
      // Bounce at end - exponential decay
      const overshoot = t - 1;
      return 1 + Math.pow(overshoot, 1.5) * 0.15;
    }
    return t;
  };

  useEffect(() => {
    if (!isVisible || prefersReducedMotion()) return;

    let startTime = performance.now();
    let pausedTime = 0;
    const trailHistory: Array<{ x: number; y: number; time: number }> = [];
    const maxTrailLength = 20;
    const trailDuration = 1000;

    const animate = (currentTime: number) => {
      if (!svgRef.current) return;

      // Handle hover state - use refs to get latest values
      if (isHoveredRef.current && mouseXRef.current !== null) {
        const currentMouseX = mouseXRef.current;
        // Calculate target scroll based on mouse position
        // Constrain hover scroll to active timeline only (contentStartYear to contentEndYear)
        // REVERSED: Mouse at left edge (0) = scroll back (show earlier), mouse at right edge (viewportWidth) = scroll forward (show later)
        const mouseRatio = Math.max(0, Math.min(1, currentMouseX / viewportWidth)); // Clamp 0 to 1
        
        // Hover scroll: constrained to active timeline range only (2005 to 2026)
        // Map mouse position: left = start of active timeline, right = end of active timeline (REVERSED)
        const normalizedRatio = mouseRatio; // No inversion - left = back, right = forward
        const targetScroll = activeStartX + (normalizedRatio * activeRange);
        
        // Apply bounce at boundaries (when mouse is at edges) - REVERSED
        let boundedScroll = targetScroll;
        if (mouseRatio < 0.05) {
          // Near left edge - bounce back (but stay within active range) - REVERSED
          const overshoot = (0.05 - mouseRatio) / 0.05;
          boundedScroll = activeStartX - overshoot * overshoot * 5; // Reduced overshoot
        } else if (mouseRatio > 0.95) {
          // Near right edge - bounce forward (but stay within active range) - REVERSED
          const overshoot = (mouseRatio - 0.95) / 0.05;
          boundedScroll = activeEndX + overshoot * overshoot * 5; // Reduced overshoot
        }
        
        targetScrollOffset.current = viewportWidth / 2 - boundedScroll;
        
        // Smooth interpolation to target (iOS-like spring) - slower on mouse enter for smoother feel
        // Use slower smoothing when first entering hover state for smoother transition
        const smoothing = justEnteredHoverRef.current ? 0.03 : 0.05; // Even slower on initial hover entry
        const diff = targetScrollOffset.current - currentScrollOffset.current;
        currentScrollOffset.current += diff * smoothing;
      } else if (!isDragging.current) {
        // Auto-scroll when not hovered and not dragging - forward then rewind
        const elapsed = currentTime - startTime - pausedTime;
        const cycleProgress = elapsed % cycleDuration;
        const progress = cycleProgress / cycleDuration;
        
        // Create forward-then-rewind pattern: 0-0.8 forward, 0.8-1.0 rewind
        let scrollProgress;
        if (progress < 0.8) {
          // Forward scroll: 0 to 0.8 maps to 0 to 1
          scrollProgress = progress / 0.8;
        } else {
          // Rewind: 0.8 to 1.0 maps to 1 to 0 (smooth reverse)
          const rewindProgress = (progress - 0.8) / 0.2;
          // Use ease-out for smooth rewind
          const easeOut = 1 - Math.pow(1 - rewindProgress, 3);
          scrollProgress = 1 - easeOut;
        }
        
        // Calculate scroll: start at initial position, scroll through timeline range
        // On mobile, ensure we scroll through the full range to show all content including 2026
        if (isMobile) {
          // Mobile: scroll from start (yearDisplayStart) to end (yearDisplayEnd), ensuring 2026 is visible
          // Calculate the scroll range needed to show from start to end
          const startX = yearToX(yearDisplayStart);
          const endX = yearToX(yearDisplayEnd);
          const totalContentWidth = endX - startX;
          // Scroll distance: from initial position (showing start at left) to position showing end at right
          // We need to scroll enough so that the end (2027, which includes 2026) is visible at the right edge
          // Maximum scroll distance = total content width - viewport width (so end aligns with right edge)
          const maxScrollDistance = Math.max(0, totalContentWidth - viewportWidth);
          const scrollDistance = scrollProgress * maxScrollDistance;
          // Start at initialOffset (which positions startX at 0), then scroll right (negative offset)
          const scrollX = initialOffset - scrollDistance;
          currentScrollOffset.current = scrollX;
        } else {
          // Desktop: use normal scroll range
          const scrollDistance = scrollProgress * timelineScrollRange;
          const scrollX = initialOffset - scrollDistance;
          currentScrollOffset.current = scrollX;
        }
      }
      // If dragging, currentScrollOffset is already set by touch handlers

      // Dot animation
      const centerX = viewportWidth / 2;
      const elapsed = currentTime - startTime - pausedTime;
      const xDrift = Math.sin(elapsed * 0.0008) * 15 * scale + Math.cos(elapsed * 0.0012) * 8 * scale; // Scale horizontal drift
      const dotX = centerX + xDrift;
      const yOscillation = Math.sin(elapsed * 0.002) * 12 + Math.sin(elapsed * 0.0035) * 6; // Keep original vertical oscillation
      const dotY = timelineY - (isMobile ? 60 : 60) + yOscillation; // Dot position above timeline

      // Update trail
      trailHistory.push({ x: dotX, y: dotY, time: currentTime });
      while (trailHistory.length > 0 && currentTime - trailHistory[0].time > trailDuration) {
        trailHistory.shift();
      }
      while (trailHistory.length > maxTrailLength) {
        trailHistory.shift();
      }

      // Update dot position
      const dotGroup = svgRef.current.querySelector('.flying-dot-group') as SVGGElement;
      if (dotGroup) {
        // Ensure valid numeric values to prevent rendering issues
        const safeX = isNaN(dotX) ? viewportWidth / 2 : dotX;
        const safeY = isNaN(dotY) ? timelineY - 60 : dotY;
        dotGroup.setAttribute('transform', `translate(${safeX}, ${safeY})`);
      }

      // Update trail rendering
      const trailGroup = svgRef.current.querySelector('.bird-trail') as SVGGElement;
      if (trailGroup) {
        trailGroup.innerHTML = '';
        trailHistory.forEach((point) => {
          const age = currentTime - point.time;
          const opacity = Math.max(0, 1 - (age / trailDuration));
          const radius = (8 + (age / trailDuration) * 4) * scale; // Scale trail radius for visibility
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', String(point.x));
          circle.setAttribute('cy', String(point.y));
          circle.setAttribute('r', String(radius));
          circle.setAttribute('fill', accentColor);
          circle.setAttribute('opacity', String(opacity * 0.3));
          trailGroup.appendChild(circle);
        });
      }

      // Update timeline group transform (single timeline, no duplicates)
      const timelineGroup = svgRef.current.querySelector('.timeline-group') as SVGGElement;
      if (timelineGroup) {
        // Timeline starts at hoverStartX (which is 0 in timeline coordinates)
        let scrollX = currentScrollOffset.current + hoverStartX;
        if (isMobile) {
          // On mobile, clamp scroll to ensure all content is visible including 2026
          // Calculate bounds: start position and end position (ensuring 2026/2027 is visible)
          const startX = yearToX(yearDisplayStart);
          const endX = yearToX(yearDisplayEnd);
          // Minimum scroll: show start at left edge (startX should be at position 0)
          const minScroll = 0 - startX;
          // Maximum scroll: show end at right edge (endX should be at position viewportWidth)
          const maxScroll = viewportWidth - endX;
          scrollX = Math.max(minScroll, Math.min(maxScroll, scrollX));
        }
        timelineGroup.setAttribute('transform', `translate(${scrollX}, 0)`);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible, timelineY, cycleDuration, viewportWidth, viewportHeight, isMobile, timelineScrollRange, contentStartYear, accentColor, initialOffset, hoverStartX, hoverEndX, hoverRange, activeStartX, activeEndX, activeRange, yearDisplayStart, yearDisplayEnd, scale]);

  return (
    <div 
      className="w-full my-8 experience-visual-wrapper" 
      style={{ 
        width: '100%', 
        maxWidth: '100%', 
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
        boxSizing: 'border-box',
        // Force container to fill parent regardless of SVG size
        contain: 'layout style',
        // Center on mobile
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto cursor-pointer"
        style={{ 
          width: '100%', 
          maxWidth: '100%', 
          minWidth: 0,
          display: 'block', 
          height: 'auto',
          gridColumn: '1',
          // Force SVG to scale to container, not constrain it
          // Remove any intrinsic width that might constrain parent
          flexShrink: 1,
          flexGrow: 1
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <defs>
          {/* Gradient for timeline fade on left edge */}
          <linearGradient id="timelineFadeLeft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={textColor} stopOpacity="0" />
            <stop offset="30%" stopColor={textColor} stopOpacity={String(getAdjustedOpacityValue(0.4))} />
            <stop offset="100%" stopColor={textColor} stopOpacity={String(getAdjustedOpacityValue(0.4))} />
          </linearGradient>
          {/* Gradient for timeline fade on right edge */}
          <linearGradient id="timelineFadeRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={textColor} stopOpacity={String(getAdjustedOpacityValue(0.4))} />
            <stop offset="70%" stopColor={textColor} stopOpacity={String(getAdjustedOpacityValue(0.4))} />
            <stop offset="100%" stopColor={textColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Timeline line covering entire section with smooth fades */}
        <line
          className="timeline-line"
          x1="0"
          y1={timelineY}
          x2={viewportWidth}
          y2={timelineY}
          stroke={textColor}
          strokeWidth={STROKE_WIDTH * scale}
          opacity={isVisible ? getAdjustedOpacityValue(0.4) : 0}
          style={{ transition: 'opacity 0.6s ease' }}
        />

        {/* Gradient fade overlay at left edge */}
        <line
          x1="0"
          y1={timelineY}
          x2={Math.round(200 * scale)}
          y2={timelineY}
          stroke="url(#timelineFadeLeft)"
          strokeWidth={STROKE_WIDTH * 3 * scale}
          opacity={isVisible ? 1 : 0}
          style={{ transition: 'opacity 0.6s ease' }}
        />

        {/* Gradient fade overlay at right edge */}
        <line
          x1={viewportWidth - Math.round(200 * scale)}
          y1={timelineY}
          x2={viewportWidth}
          y2={timelineY}
          stroke="url(#timelineFadeRight)"
          strokeWidth={STROKE_WIDTH * 3 * scale}
          opacity={isVisible ? 1 : 0}
          style={{ transition: 'opacity 0.6s ease' }}
        />

        {/* Timeline group - original (all timeline elements animated together) */}
        <g className="timeline-group">
          {/* Month indicators - visible marks for each month */}
          {positionedMonths.map((monthData, index) => {
            // Make January (month 0) taller, others medium height
            const isYearStart = monthData.month === 0;
            const markerHeight = isYearStart ? 6 : 4; // Keep original vertical size
            const markerY1 = timelineY - markerHeight;
            const markerY2 = timelineY + markerHeight;
            const opacity = isYearStart ? 0.4 : 0.3;
            const strokeWidth = (isYearStart ? STROKE_WIDTH * 0.5 : STROKE_WIDTH * 0.4) * scale; // Scale stroke width
            
            return (
              <line
                key={`month-${monthData.year}-${monthData.month}`}
                x1={monthData.x}
                y1={markerY1}
                x2={monthData.x}
                y2={markerY2}
                stroke={mutedColor}
                strokeWidth={strokeWidth}
                opacity={opacity}
              />
            );
          })}

          {/* All years on floor line */}
          {positionedYears.map((yearData, index) => (
          <g
            key={`year-${yearData.year}`}
            className={`year-${index}`}
            opacity={isVisible ? 1 : 0}
            style={{ transition: 'opacity 0.6s ease' }}
          >
            {/* Year marker on floor (taller than month markers) */}
            <line
              x1={yearData.x}
              y1={timelineY - 8}
              x2={yearData.x}
              y2={timelineY + 8}
              stroke={mutedColor}
              strokeWidth={STROKE_WIDTH * 0.8 * scale}
              opacity={String(getAdjustedOpacityValue(0.5))}
            />
            {/* Year label on floor */}
            <text
              x={yearData.x}
              y={timelineY - (isMobile ? 18 : 12)}
              fontSize={fontSizeYear}
              fill={mutedColor}
              textAnchor="middle"
              opacity={String(getAdjustedOpacityValue(0.5))}
              style={{
                fontFamily: 'var(--theme-font-body, sans-serif)',
              }}
            >
              {yearData.year}
            </text>
          </g>
        ))}

        {/* Major period lines (below floor) - thicker with labels */}
        {positionedPeriods.map((period) => {
          // Adjust vertical spacing for mobile - use scaled spacing
          const periodLineY = timelineY + (isMobile ? 40 : 30); // More space on mobile for readability
          const isCurrentPeriod = period.period === 'buzzvil' && period.end >= contentEndYear; // Check if this is the current/ongoing period
          const dashedExtensionLength = Math.round(25 * scale); // Shorter, more subtle extension for current period
          
          return (
          <g key={`period-${period.period}`}>
            {/* Solid period line */}
            <line
              x1={period.startX}
              y1={periodLineY}
              x2={period.endX}
              y2={periodLineY}
              stroke={accentColor}
              strokeWidth={STROKE_WIDTH * 12 * scale}
              opacity={isVisible ? 1 : 0}
              style={{ transition: 'opacity 0.6s ease' }}
            />
            {/* Dashed extension for current period (ongoing work) */}
            {isCurrentPeriod && (
              <line
                x1={period.endX}
                y1={periodLineY}
                x2={period.endX + dashedExtensionLength}
                y2={periodLineY}
                stroke={accentColor}
                strokeWidth={STROKE_WIDTH * 12 * scale}
                strokeDasharray={`${Math.round(6 * scale)} ${Math.round(3 * scale)}`}
                opacity={isVisible ? getAdjustedOpacityValue(0.3) : 0}
                style={{ transition: 'opacity 0.6s ease' }}
              />
            )}
            {/* Period label inside the line - vertically centered */}
            <text
              x={period.centerX}
              y={periodLineY}
              fontSize={fontSizePeriod}
              fill={periodLabelColor}
              textAnchor="middle"
              dominantBaseline="middle"
              opacity={isVisible ? 1 : 0}
              style={{
                fontFamily: 'var(--theme-font-body, sans-serif)',
                fontWeight: '500',
              }}
            >
              {period.label}
            </text>
            
            {/* Milestones shown on hover */}
            {(() => {
              const periodData = periodMilestones.find(p => p.periodId === period.period);
              if (!periodData || periodData.milestones.length === 0) return null;
              
              return (
                <g className="period-milestones">
                  {periodData.milestones.map((milestone, idx) => {
                    const milestoneX = milestone.x;
                    // Position system: odd-numbered milestones (1st, 3rd, 5th = idx 0, 2, 4) are higher
                    // Even-numbered milestones (2nd, 4th, 6th = idx 1, 3, 5) are lower
                    const isOddNumbered = idx % 2 === 0; // 0-indexed: 0=1st (odd), 1=2nd (even), 2=3rd (odd)...
                    
                    // Timeline line position - period line is at timelineY + spacing with stroke width STROKE_WIDTH * 12
                    const timelineLineY = timelineY + (isMobile ? 40 : 30); // Match period line Y
                    const periodLineStrokeWidth = STROKE_WIDTH * 12 * scale; // Thick period line - scale stroke width
                    const periodLineBottom = timelineLineY + (periodLineStrokeWidth / 2); // Bottom edge of period line
                    // Markers start just below the period line with a gap - scaled for mobile
                    const markerStartY = periodLineBottom + (isMobile ? 6 : 4); // More space on mobile
                    
                    // Both extend downward, but odd-numbered are positioned higher (shorter line) - scaled for mobile
                    const lineLength = isOddNumbered ? (isMobile ? 18 : 12) : (isMobile ? 60 : 50); // Longer lines on mobile
                    
                    // Label Y position relative to marker start (since we translate to markerStartY) - scaled for mobile
                    const labelYRelative = lineLength + (isMobile ? 16 : 12); // More space on mobile
                    
                    // Animation: fade in/out and grow from just below timeline line downward
                    const opacity = isHovered ? 1 : 0;
                    const scaleY = isHovered ? 1 : 0; // Start collapsed, expand on hover
                    
                    return (
                      <g 
                        key={`milestone-${period.period}-${idx}`}
                        opacity={opacity}
                        transform={`translate(${milestoneX}, ${markerStartY}) scale(1, ${scaleY})`}
                        style={{
                          transition: 'opacity 0.4s ease, transform 0.4s ease',
                          transitionDelay: `${idx * 0.06}s`, // Stagger animation
                          transformOrigin: 'center top', // Always grow downward from marker start
                        }}
                      >
                        {/* Milestone marker - animates from just below period line downward */}
                        <line
                          x1="0"
                          y1="0"
                          x2="0"
                          y2={lineLength}
                          stroke={accentColor}
                          strokeWidth={STROKE_WIDTH * 0.6 * scale}
                          opacity="0.15"
                        />
                        {/* Milestone label - placed to the right of the indicator line */}
                        <text
                          x={Math.round(8 * scale)}
                          y={labelYRelative}
                          fontSize={fontSizeMilestone}
                          fill={textColor}
                          textAnchor="start"
                          dominantBaseline="middle"
                          opacity="0.8"
                          style={{
                            fontFamily: 'var(--theme-font-body, sans-serif)',
                            transition: 'opacity 0.3s ease',
                            transitionDelay: `${idx * 0.06 + 0.1}s`, // Slightly delayed after line
                          }}
                        >
                          {milestone.label}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })()}
          </g>
          );
        })}
        </g>
        
        {/* Bird trail/halo (fading circles behind bird) */}
        <g className="bird-trail" opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.6s ease' }} />

        {/* Flying dot (above floor, in sky) - camera follows it */}
        <g className="flying-dot-group" opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.6s ease' }}>
          <circle
            className="flying-dot"
            cx="0"
            cy="0"
            r={8 * scale}
            fill={accentColor || '#000000'}
            stroke="none"
            style={{ pointerEvents: 'none' }}
          />
        </g>
      </svg>
    </div>
  );
}

// 3. HOW I WORK - Product Discovery Circle
export function HowIWorkVisual() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<number>();

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

    const centerX = 200;
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
    <div className="w-full my-8" style={{ 
      width: '100%', 
      maxWidth: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <svg
        ref={svgRef}
        viewBox="0 0 600 300"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto"
        style={{ minHeight: '300px', width: '100%', maxWidth: '100%', display: 'block' }}
      >
        {/* Large circle with thick stroke */}
        <circle
          cx="200"
          cy="150"
          r="80"
          fill="none"
          stroke={circleStrokeColor}
          strokeWidth={circleStrokeWidth}
        />

        {/* Connection line from "Product Discovery" text to dot */}
        <line
          className="discovery-line"
          x1="320"
          y1="70"
          x2="200"
          y2="70"
          stroke={mutedColor}
          strokeWidth={STROKE_WIDTH * 0.5}
          strokeDasharray="2 3"
          opacity={isVisible ? 0.5 : 0}
          style={{ transition: 'opacity 0.6s ease' }}
        />

        {/* Connection line from "Product Delivery" text to circle - horizontal */}
        <line
          x1="320"
          y1="150"
          x2="280"
          y2="150"
          stroke={mutedColor}
          strokeWidth={STROKE_WIDTH * 0.5}
          strokeDasharray="2 3"
          opacity={isVisible ? 0.5 : 0}
          style={{ transition: 'opacity 0.6s ease' }}
        />

        {/* Text labels - positioned close to visual, matching first section spacing */}
        <text
          x="320"
          y="75"
          fontSize="14"
          fill={mutedColor}
          style={{
            fontFamily: 'var(--theme-font-body, sans-serif)',
            opacity: isVisible ? 0.9 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          Product Discovery
        </text>

        <text
          x="320"
          y="155"
          fontSize="14"
          fill={mutedColor}
          style={{
            fontFamily: 'var(--theme-font-body, sans-serif)',
            opacity: isVisible ? 0.9 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          Product Delivery
        </text>

        {/* Discovery dot - animated */}
        <g className="discovery-dot-group" transform="translate(200, 20)">
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

// 4. LEADERSHIP THAT SCALES - Exponential Growth Circles
export function LeadershipScalesVisual() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<number>();

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
  const centerX = 250;
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

  // State sizes - increased scale differences for more dramatic growth
  const states = {
    4: { inner: 20, middle: 40, outer: 65 },
    5: { inner: 28, middle: 65, outer: 110 },
    6: { inner: 38, middle: 95, outer: 165 },
    7: { inner: 50, middle: 135, outer: 240 }
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
    <div className="w-full my-8" style={{ 
      width: '100%', 
      maxWidth: '100%', 
      overflow: 'visible',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <svg
        ref={svgRef}
        viewBox="0 0 500 180"
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
            fontSize="24"
            fill={numberTextColor}
            textAnchor="middle"
            dominantBaseline="middle"
            fontWeight="600"
            opacity={isVisible ? 1 : 0}
            style={{
              fontFamily: 'var(--theme-font-body, sans-serif)',
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

// 5. BEYOND THE ROLE - Newton's Cradle
export function BeyondTheRoleVisual() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<number>();
  const [isMobile, setIsMobile] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(600);
  const [viewportHeight, setViewportHeight] = useState(200);
  
  // 4 balls for Newton's Cradle
  const numBalls = 4;
  const anglesRef = useRef<number[]>(new Array(numBalls).fill(0));
  const velocitiesRef = useRef<number[]>(new Array(numBalls).fill(0));

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
        
        // Base positions (initial x positions) - responsive to viewport
        const workBaseX = isMobile ? 100 : 80;
        const lifeBaseX = isMobile ? viewportWidth - 100 : 320;
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
    <div className="w-full my-8" style={{ 
      width: '100%', 
      maxWidth: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
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
        
        {/* Work label - left side */}
        <text
          className="work-label"
          x={isMobile ? 100 : 80}
          y={isMobile ? 54 + 144 + 40 : 36 + 96 + 30}
          fontSize={isMobile ? "18" : "14"}
          fill={textColor}
          textAnchor="start"
          dominantBaseline="middle"
          opacity="0.4"
          style={{
            fontFamily: 'var(--theme-font-body, sans-serif)',
            transition: 'opacity 0.3s ease, font-weight 0.3s ease',
          }}
        >
          Work
        </text>
        
        {/* Life label - right side */}
        <text
          className="life-label"
          x={isMobile ? viewportWidth - 100 : 320}
          y={isMobile ? 54 + 144 + 40 : 36 + 96 + 30}
          fontSize={isMobile ? "18" : "14"}
          fill={textColor}
          textAnchor="end"
          dominantBaseline="middle"
          opacity="0.4"
          style={{
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
