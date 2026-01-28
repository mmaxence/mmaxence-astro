import { useState, useEffect, useRef } from 'react';

// SVG paths extracted from existing SVGs
const svgPaths = {
  p8b33500: 'M6 72L72 6L138 72L72 138L6 72Z', // Diamond
  p9320100: 'M72 4L130.89 38V106L72 140L13.1103 106L13.1103 38L72 4Z', // Hexagon
};

// Theme colors from all themes - extracted for cursor color randomization
const THEME_COLORS = [
  // Default theme colors
  '#000000', // accent
  '#1a1a1a', // text
  '#FBF1A9', // highlight
  // IDE theme colors
  '#7aa2f7', // accent
  '#c0caf5', // text
  '#2ac3de', // highlight
  // Pixel theme colors
  '#8b956d', // accent
  '#2d5016', // text
  '#c4d5a1', // highlight
];

// Generate a custom cursor SVG with a random color
const generateCursorSVG = (color: string): string => {
  // Create a visible colored circle cursor
  // The hotspot is at 12,12 (center of the 24x24 viewBox)
  const svg = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8" fill="${color}" opacity="0.85" stroke="white" stroke-width="1"/>
    <circle cx="12" cy="12" r="4" fill="white" opacity="0.5"/>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

// --- Components ---

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[144px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 144 144">
        {children}
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <Wrapper>
      <g id="Frame 11">
        <path d={svgPaths.p8b33500} fill="var(--theme-text, currentColor)" id="rectangle" />
      </g>
    </Wrapper>
  );
}

function Frame2() {
  return (
    <div className="relative shrink-0 size-[144px]">
      <div className="absolute bg-[var(--theme-text,currentColor)] left-[8px] rounded-[72px] size-[128px] top-[8px]" data-name="circle" />
    </div>
  );
}

function Frame1() {
  return (
    <Wrapper>
      <g id="Frame 12">
        <path d={svgPaths.p9320100} fill="var(--theme-text, currentColor)" id="polygon" />
      </g>
    </Wrapper>
  );
}

const SHAPES = [
  { id: 'diamond', component: Frame },
  { id: 'circle', component: Frame2 },
  { id: 'hexagon', component: Frame1 },
];

export function AnimatedPatterns() {
  // order stores the index of the shape at each slot position [slot0_shapeIndex, slot1_shapeIndex, slot2_shapeIndex]
  // BUT to keep DOM stable, we better map SHAPES and find their slot index.
  // So let's store `order` as an array where index = slot, value = shapeIndex.
  const [order, setOrder] = useState([0, 1, 2]);
  const [isMoving, setIsMoving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastCursorUpdateRef = useRef<number>(0);
  const CURSOR_UPDATE_THROTTLE = 100; // Update cursor color max once per 100ms

  // Shuffle logic function (reusable for both interval and hover)
  const shuffleShapes = () => {
    setOrder((currentOrder) => {
      const allPerms = [
        [0, 1, 2], [0, 2, 1],
        [1, 0, 2], [1, 2, 0],
        [2, 0, 1], [2, 1, 0]
      ];

      // Filter for derangements (where no element is in its original position)
      const candidates = allPerms.filter(perm => 
        perm[0] !== currentOrder[0] &&
        perm[1] !== currentOrder[1] &&
        perm[2] !== currentOrder[2]
      );

      const nextOrder = candidates[Math.floor(Math.random() * candidates.length)];
      return nextOrder;
    });
    
    // Trigger blur effect
    setIsMoving(true);
    setTimeout(() => setIsMoving(false), 400); // Remove blur shortly after start
  };

  useEffect(() => {
    const interval = setInterval(() => {
      shuffleShapes();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleShapeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Apply random theme when any shape is clicked
    if (typeof window !== 'undefined' && (window as any).applyRandomTheme) {
      (window as any).applyRandomTheme();
    }
  };

  const handleShapeHover = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Trigger shuffle on hover
    shuffleShapes();
  };

  // Update cursor color randomly on mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    const now = Date.now();
    // Throttle cursor updates to avoid performance issues
    if (now - lastCursorUpdateRef.current < CURSOR_UPDATE_THROTTLE) {
      return;
    }
    lastCursorUpdateRef.current = now;

    // Pick a random color from theme colors
    const randomColor = THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)];
    
    // Generate cursor SVG and apply it
    const cursorSVG = generateCursorSVG(randomColor);
    
    // Apply custom cursor to the container
    // The hotspot coordinates (12, 12) match the center of our 24x24 SVG
    if (containerRef.current) {
      containerRef.current.style.cursor = `url("${cursorSVG}") 12 12, pointer`;
    }
  };

  const handleMouseLeave = () => {
    // Reset cursor to default when leaving the shapes area
    if (containerRef.current) {
      containerRef.current.style.cursor = 'auto';
    }
  };

  return (
    <div className="flex items-center justify-center relative w-full" data-name="patterns" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', minHeight: '86.4px' }}>
      {/* Container that scales to fit available width while maintaining aspect ratio */}
      <div 
        ref={containerRef}
        className="relative origin-center shapes-container-responsive" 
        onMouseEnter={handleShapeHover}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
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
          
          .spring-move {
            transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.4s ease-out, opacity 0.3s ease, scale 0.4s ease-out;
          }
          .blur-active {
            filter: blur(1.5px);
            scale: 0.85;
          }
          .shape-clickable {
            cursor: inherit; /* Inherit the custom cursor from parent */
          }
          .shape-clickable:hover {
            opacity: 0.85;
          }
          .shape-clickable:hover > * {
            transform: scale(1.05) translateY(-2px);
            transition: transform 0.2s ease-out;
          }
          .shape-clickable:active > * {
            transform: scale(0.95) translateY(0);
            transition: transform 0.15s ease-out;
          }
        `}</style>
        
        <div className="shapes-inner-container" style={{ position: 'relative' }}>
          {SHAPES.map((shape, shapeIndex) => {
            // Find which slot (0, 1, or 2) this shape is currently assigned to
            const slotIndex = order.indexOf(shapeIndex);
            
            // Calculate X position: slotIndex * (144 + 8)
            const translateX = slotIndex * 152;
            
            const Component = shape.component;
            
            return (
              <div
                key={shape.id}
                className={`absolute top-0 left-0 spring-move shape-clickable ${isMoving ? 'blur-active' : ''}`}
                style={{
                  transform: `translateX(${translateX}px)`,
                }}
                onClick={handleShapeClick}
                title="Random Theme"
              >
                <Component />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

