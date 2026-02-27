'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTheme } from 'next-themes';
import PixelCharacter, { OutfitType } from './PixelCharacter';
import { Briefcase, GraduationCap, Play, Pause, RotateCcw } from 'lucide-react';

export interface TimelineExperience {
  id: string;
  title: string;
  organization: string;
  period: string;
  startYear: number;
  endYear: number;
  type: 'education' | 'work';
  description?: string;
  outfit: OutfitType;
  tools: string[];
}

interface InteractiveTimelineProps {
  experiences: TimelineExperience[];
}

const START_YEAR = 2006;
const END_YEAR = 2030;
const TOTAL_YEARS = END_YEAR - START_YEAR;
const ANIMATION_DURATION = 40000;

/* ─── Building definitions ─── */
interface BuildingDef {
  yearPos: number;
  label: string;
  subLabel?: string;
  color: string;
  colorDark: string;
  roofColor: string;
  height: number;
  width: number;
  windows: number;
  type: 'industrial' | 'government' | 'university' | 'lab' | 'radio' | 'tech' | 'academic';
}

const BUILDINGS: BuildingDef[] = [
  { yearPos: 2007.5, label: 'CEFET/RJ', subLabel: 'Mecânica Industrial', color: '#8B4513', colorDark: '#5D2E0A', roofColor: '#A0522D', height: 3, width: 2, windows: 2, type: 'industrial' },
  { yearPos: 2011.5, label: 'Chemtech', subLabel: 'Projeto RENEST', color: '#2F4F4F', colorDark: '#1A2F2F', roofColor: '#4A7A7A', height: 3, width: 2, windows: 2, type: 'industrial' },
  { yearPos: 2015, label: 'Câmara Niterói', color: '#4A6FA5', colorDark: '#2A4F85', roofColor: '#3A5F95', height: 3, width: 2, windows: 2, type: 'government' },
  { yearPos: 2018, label: 'UFF', subLabel: 'Administração', color: '#1B3A5C', colorDark: '#0E2240', roofColor: '#2A4F7A', height: 4, width: 3, windows: 3, type: 'university' },
  { yearPos: 2019.2, label: 'FAPERJ', color: '#2C6B4F', colorDark: '#1A4030', roofColor: '#3A8B6F', height: 2, width: 2, windows: 1, type: 'lab' },
  { yearPos: 2020.5, label: 'CL Web Rádio', color: '#8B2252', colorDark: '#5B1232', roofColor: '#AB3272', height: 2, width: 2, windows: 1, type: 'radio' },
  { yearPos: 2023, label: 'UFF', subLabel: 'Mestrado Finance & DS', color: '#1B3A5C', colorDark: '#0E2240', roofColor: '#2A4F7A', height: 4, width: 3, windows: 3, type: 'university' },
  { yearPos: 2025, label: 'CID – UFF', subLabel: 'AI Engineer', color: '#1A1A2E', colorDark: '#0D0D1A', roofColor: '#2E2E4E', height: 4, width: 3, windows: 3, type: 'tech' },
  { yearPos: 2028, label: 'COPPEAD/UFRJ', subLabel: 'Ph.D. AI Governance', color: '#800020', colorDark: '#500010', roofColor: '#A03040', height: 4, width: 3, windows: 3, type: 'academic' },
];

const TREE_POSITIONS = [2008.5, 2010, 2013, 2014, 2016.5, 2017, 2019.7, 2021.5, 2022, 2024, 2026.5, 2029];

/* ─── Helpers ─── */
function getOutfitForYear(year: number, experiences: TimelineExperience[]): OutfitType {
  const active = experiences.filter(e => e.startYear <= year && e.endYear >= year);
  if (active.length === 0) return 'casual';
  const sorted = [...active].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'work' ? -1 : 1;
    return b.startYear - a.startYear;
  });
  return sorted[0].outfit;
}

function getActiveExperiences(year: number, experiences: TimelineExperience[]): TimelineExperience[] {
  return experiences.filter(e => e.startYear <= year && e.endYear >= year);
}

/* ─── Pixel Building SVG ─── */
const PixelBuilding: React.FC<{ bld: BuildingDef; isDark: boolean }> = React.memo(({ bld, isDark }) => {
  const bColor = isDark ? bld.colorDark : bld.color;
  const unitH = 24;
  const unitW = 28;
  const bH = bld.height * unitH;
  const bW = bld.width * unitW;
  const totalH = bH + 28;
  const totalW = bW + 14;
  const windowColor = isDark ? '#FFE066' : '#FFF9C4';
  const windowDark = isDark ? '#111' : '#2A3040';

  // Deterministic "random" for windows
  const windowLit = (r: number, c: number) => ((r * 7 + c * 13 + bld.yearPos * 3) % 5) > 1;

  const BSCALE = 1.75;

  return (
    <svg width={totalW * BSCALE} height={(totalH + 8) * BSCALE} viewBox={`0 0 ${totalW} ${totalH + 8}`} style={{ imageRendering: 'pixelated' } as React.CSSProperties}>
      {/* Label */}
      <text x={totalW / 2} y={10} textAnchor="middle" fontSize="7" fontWeight="bold" fill={isDark ? '#d1d5db' : '#374151'} fontFamily="monospace">
        {bld.label}
      </text>
      {bld.subLabel && (
        <text x={totalW / 2} y={18} textAnchor="middle" fontSize="5" fill={isDark ? '#9ca3af' : '#6b7280'} fontFamily="monospace">
          {bld.subLabel}
        </text>
      )}

      {/* Roof */}
      {bld.type === 'university' || bld.type === 'academic' ? (
        <g>
          <polygon points={`${totalW / 2 - bW / 2},${26} ${totalW / 2},${16} ${totalW / 2 + bW / 2},${26}`} fill={bld.roofColor} />
          <polygon points={`${totalW / 2 - bW / 2},${26} ${totalW / 2},${17} ${totalW / 2 + bW / 2},${26}`} fill={bld.roofColor} opacity="0.7" />
          {/* Flag pole */}
          <rect x={totalW / 2 - 0.5} y={10} width={1} height={7} fill={isDark ? '#ddd' : '#555'} />
          <rect x={totalW / 2} y={10} width={5} height={3} fill="#E74C3C" />
        </g>
      ) : bld.type === 'industrial' ? (
        <g>
          <rect x={(totalW - bW) / 2} y={23} width={bW} height={4} fill={bld.roofColor} />
          {/* Chimney */}
          <rect x={totalW / 2 + bW / 3} y={10} width={6} height={17} fill={bld.roofColor} />
          <rect x={totalW / 2 + bW / 3 - 1} y={9} width={8} height={3} fill={isDark ? '#666' : '#888'} />
        </g>
      ) : bld.type === 'tech' ? (
        <g>
          <rect x={(totalW - bW) / 2} y={23} width={bW} height={4} fill={bld.roofColor} />
          {/* Antenna with signal */}
          <rect x={totalW / 2 - 0.5} y={4} width={1.5} height={23} fill={isDark ? '#00E5FF' : '#4A90E2'} />
          <circle cx={totalW / 2} cy={4} r={2.5} fill={isDark ? '#00E5FF' : '#4A90E2'} opacity={0.8} />
          <circle cx={totalW / 2} cy={4} r={5} fill="none" stroke={isDark ? '#00E5FF' : '#4A90E2'} strokeWidth={0.5} opacity={0.4} />
        </g>
      ) : bld.type === 'radio' ? (
        <g>
          <rect x={(totalW - bW) / 2} y={23} width={bW} height={4} fill={bld.roofColor} />
          {/* Radio tower */}
          <rect x={totalW / 2 - 0.5} y={6} width={1.5} height={20} fill={isDark ? '#FF69B4' : '#C2185B'} />
          <rect x={totalW / 2 - 4} y={6} width={8} height={1.5} fill={isDark ? '#FF69B4' : '#C2185B'} />
        </g>
      ) : (
        <rect x={(totalW - bW) / 2} y={23} width={bW} height={4} fill={bld.roofColor} />
      )}

      {/* Main body */}
      <rect x={(totalW - bW) / 2} y={27} width={bW} height={bH} fill={bColor} rx={1} />
      {/* Body edge highlight */}
      <rect x={(totalW - bW) / 2} y={27} width={2} height={bH} fill="rgba(255,255,255,0.08)" />

      {/* Windows grid */}
      {Array.from({ length: bld.windows }).map((_, row) =>
        Array.from({ length: Math.max(2, bld.width) }).map((_, col) => {
          const margin = 6;
          const gap = (bW - margin * 2) / Math.max(2, bld.width);
          const wX = (totalW - bW) / 2 + margin + col * gap + (gap - 7) / 2;
          const wY = 27 + 6 + row * ((bH - 14) / bld.windows);
          return (
            <g key={`w-${row}-${col}`}>
              <rect x={wX} y={wY} width={7} height={7} fill={windowLit(row, col) ? windowColor : windowDark} rx={0.4} />
              {/* Window frame */}
              <rect x={wX} y={wY} width={7} height={7} fill="none" stroke={isDark ? '#555' : '#8899AA'} strokeWidth={0.4} rx={0.4} />
              {/* Window cross */}
              <line x1={wX + 3.5} y1={wY} x2={wX + 3.5} y2={wY + 7} stroke={isDark ? '#444' : '#7788'} strokeWidth={0.3} />
              <line x1={wX} y1={wY + 3.5} x2={wX + 7} y2={wY + 3.5} stroke={isDark ? '#444' : '#7788'} strokeWidth={0.3} />
            </g>
          );
        })
      )}

      {/* Door */}
      <rect x={totalW / 2 - 4} y={27 + bH - 12} width={8} height={12} fill={isDark ? '#3a2a1a' : '#5D4037'} rx={0.5} />
      <circle cx={totalW / 2 + 2} cy={27 + bH - 6} r={0.8} fill={isDark ? '#FFD700' : '#FFC107'} />
    </svg>
  );
});
PixelBuilding.displayName = 'PixelBuilding';

/* ─── Pixel Tree SVG ─── */
const PixelTree: React.FC<{ variant: number; isDark: boolean }> = React.memo(({ variant, isDark }) => {
  const trunkColor = isDark ? '#5D4037' : '#795548';
  const lc = isDark
    ? ['#1B5E20', '#2E7D32', '#388E3C'][variant % 3]
    : ['#2E7D32', '#43A047', '#66BB6A'][variant % 3];
  const lc2 = isDark
    ? ['#2E7D32', '#388E3C', '#1B5E20'][(variant + 1) % 3]
    : ['#43A047', '#66BB6A', '#2E7D32'][(variant + 1) % 3];

  const isTall = variant % 3 === 0;
  const vb = isTall ? '0 0 12 20' : '0 0 10 16';
  const TSCALE = 1.25;
  const svgW = isTall ? 12 * TSCALE : 10 * TSCALE;
  const svgH = isTall ? 20 * TSCALE : 16 * TSCALE;

  if (isTall) {
    return (
      <svg width={svgW * 3} height={svgH * 3} viewBox={vb} style={{ imageRendering: 'pixelated' } as React.CSSProperties}>
        <rect x={5} y={13} width={2} height={6} fill={trunkColor} />
        <rect x={4} y={18} width={4} height={1.5} fill={isDark ? '#3E2723' : '#4E342E'} rx={0.5} />
        <ellipse cx={6} cy={8} rx={5} ry={6} fill={lc} />
        <ellipse cx={6} cy={10} rx={4.5} ry={4} fill={lc2} />
        <ellipse cx={6} cy={6} rx={3.5} ry={4} fill={lc} opacity={0.8} />
        <ellipse cx={5} cy={5} rx={2} ry={2.5} fill={lc2} opacity={0.6} />
      </svg>
    );
  }

  return (
    <svg width={svgW * 3} height={svgH * 3} viewBox={vb} style={{ imageRendering: 'pixelated' } as React.CSSProperties}>
      <rect x={4} y={10} width={2} height={5} fill={trunkColor} />
      <rect x={3} y={14} width={4} height={1.5} fill={isDark ? '#3E2723' : '#4E342E'} rx={0.5} />
      <ellipse cx={5} cy={7} rx={4} ry={4.5} fill={lc} />
      <ellipse cx={5} cy={8.5} rx={3.5} ry={3} fill={lc2} />
      <ellipse cx={5} cy={5.5} rx={2.5} ry={3} fill={lc} opacity={0.8} />
    </svg>
  );
});
PixelTree.displayName = 'PixelTree';

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({ experiences }) => {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);
  const isDark = mounted ? resolvedTheme === 'dark' : false;

  const currentYear = START_YEAR + progress * TOTAL_YEARS;
  const hasMask = currentYear >= 2020 && currentYear <= 2023;
  const activeExperiences = getActiveExperiences(currentYear, experiences);
  const currentOutfit = getOutfitForYear(currentYear, experiences);

  // CEFET is at yearToX(2007.5)=6.25% of the scenery div, which is 3.5× the viewport
  // So on screen at progress=0, CEFET appears at 6.25% × 3.5 = 21.875% of viewport
  const SCENERY_MULT = 3.5;
  const CEFET_INIT_SCREEN = ((2007.5 - START_YEAR) / TOTAL_YEARS) * 100 * SCENERY_MULT; // ~21.875%
  const CENTER_POS = 42;
  const WALK_IN_PHASE = 0.05; // character walks from CEFET to center in first 5%

  const isWalkingIn = progress < WALK_IN_PHASE;
  const characterScreenPercent = isWalkingIn
    ? CEFET_INIT_SCREEN + (progress / WALK_IN_PHASE) * (CENTER_POS - CEFET_INIT_SCREEN)
    : CENTER_POS;

  // Scenery stays still during walk-in, then scrolls normally
  const sceneryProgress = isWalkingIn
    ? 0
    : (progress - WALK_IN_PHASE) / (1 - WALK_IN_PHASE);
  const sceneryTranslate = sceneryProgress * (SCENERY_MULT - 1) * 100 / SCENERY_MULT;

  const yearToX = (year: number) => ((year - START_YEAR) / TOTAL_YEARS) * 100;

  // Auto-start
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !hasStarted) { setHasStarted(true); setIsPlaying(true); } },
      { threshold: 0.3 }
    );
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [hasStarted]);

  // Animation loop – uses a ref-based approach to avoid stale closures
  const progressRef = useRef(0);

  const animate = useCallback((ts: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = ts - pausedAtRef.current * ANIMATION_DURATION;
    }
    const p = Math.min((ts - startTimeRef.current) / ANIMATION_DURATION, 1);
    progressRef.current = p;
    setProgress(p);
    if (p < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      // Only reset startTime when starting fresh
      startTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      pausedAtRef.current = progressRef.current;
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  const handleRestart = () => {
    setProgress(0);
    progressRef.current = 0;
    pausedAtRef.current = 0;
    startTimeRef.current = 0;
    setIsPlaying(true);
  };
  const togglePlay = () => {
    if (progress >= 1) handleRestart();
    else setIsPlaying(!isPlaying);
  };

  const yearMarkers = [];
  for (let y = START_YEAR; y <= END_YEAR; y += 2) yearMarkers.push(y);

  return (
    <div ref={containerRef} className="w-full space-y-4 select-none">
      {/* Year Display */}
      <div className="text-center">
        <span className="font-display text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tabular-nums">
          {Math.floor(currentYear)}
        </span>
      </div>

      {/* Progress Bar - synced with years */}
      <div className="relative">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" style={{ width: `${((currentYear - START_YEAR) / TOTAL_YEARS) * 100}%` }} />
        </div>
        <div className="flex justify-between mt-1">
          {yearMarkers.map(y => {
            const isActive = currentYear >= y;
            return <span key={y} className={`text-[10px] font-mono ${isActive ? 'text-blue-500 dark:text-blue-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}>{y}</span>;
          })}
        </div>
      </div>

      {/* ═══ STAGE ═══ */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-white dark:bg-slate-900" style={{ height: '640px' }}>
        {/* Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-50 dark:from-indigo-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-1000" />

        {/* Sun / Moon */}
        {isDark ? (
          <div className="absolute top-5 right-10">
            <div className="w-7 h-7 rounded-full bg-gray-200 shadow-[0_0_15px_rgba(200,200,200,0.3)]" />
            <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-indigo-950" />
          </div>
        ) : (
          <div className="absolute top-5 right-10 w-8 h-8 rounded-full bg-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
        )}

        {/* Stars (dark mode) */}
        {isDark && (
          <div className="absolute inset-0 pointer-events-none">
            {[10, 25, 40, 55, 70, 85, 15, 60, 80, 35].map((l, i) => (
              <div key={i} className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-60" style={{ left: `${l}%`, top: `${5 + (i * 3) % 20}%` }} />
            ))}
          </div>
        )}

        {/* Clouds (parallax) */}
        <div className="absolute top-8 pointer-events-none transition-[left] duration-200" style={{ left: `${75 - sceneryProgress * 25}%` }}>
          <div className="w-20 h-5 bg-white/40 dark:bg-white/5 rounded-full" />
          <div className="w-14 h-4 bg-white/60 dark:bg-white/8 rounded-full -mt-2 ml-3" />
        </div>
        <div className="absolute top-16 pointer-events-none transition-[left] duration-200" style={{ left: `${30 - sceneryProgress * 15}%` }}>
          <div className="w-16 h-4 bg-white/30 dark:bg-white/5 rounded-full" />
        </div>
        <div className="absolute top-24 pointer-events-none transition-[left] duration-200" style={{ left: `${90 - sceneryProgress * 30}%` }}>
          <div className="w-24 h-5 bg-white/25 dark:bg-white/4 rounded-full" />
        </div>

        {/* COVID */}
        {hasMask && (
          <div className="absolute top-2 right-3 px-2 py-1 bg-red-100 dark:bg-red-900/50 rounded text-[10px] font-bold text-red-600 dark:text-red-400 animate-pulse-subtle z-30">
            🦠 COVID-19
          </div>
        )}

        {/* ═══ SCROLLING SCENERY ═══ */}
        <div
          className="absolute bottom-0 left-0 transition-transform duration-150 ease-linear"
          style={{
            width: `${SCENERY_MULT * 100}%`,
            height: '100%',
            transform: `translateX(-${sceneryTranslate}%)`,
          }}
        >
          {/* Mountains – far background */}
          <svg className="absolute bottom-[44px] left-0 w-full opacity-30" height="60" preserveAspectRatio="none" viewBox="0 0 3000 60">
            <polygon points="0,60 80,20 200,40 350,10 500,35 700,8 900,30 1100,15 1300,35 1500,5 1700,25 1900,12 2100,30 2300,8 2500,20 2700,40 3000,15 3000,60" fill={isDark ? '#1e293b' : '#94a3b8'} />
          </svg>

          {/* Hills – mid background */}
          <svg className="absolute bottom-[42px] left-0 w-full opacity-20" height="40" preserveAspectRatio="none" viewBox="0 0 3000 40">
            <path d="M0,40 Q150,10 300,30 Q500,5 700,25 Q900,8 1100,28 Q1300,5 1500,20 Q1700,8 1900,30 Q2100,5 2300,22 Q2500,10 2700,28 Q2850,12 3000,25 L3000,40 Z" fill={isDark ? '#0f172a' : '#cbd5e1'} />
          </svg>

          {/* Trees */}
          {TREE_POSITIONS.map((yearPos, i) => (
            <div key={`tree-${i}`} className="absolute" style={{ left: `${yearToX(yearPos)}%`, bottom: '32px' }}>
              <PixelTree variant={i} isDark={isDark} />
            </div>
          ))}

          {/* Buildings */}
          {BUILDINGS.map((bld, i) => (
            <div key={`bld-${i}`} className="absolute" style={{ left: `${yearToX(bld.yearPos)}%`, bottom: '28px', transform: 'translateX(-50%)' }}>
              <PixelBuilding bld={bld} isDark={isDark} />
            </div>
          ))}

          {/* Ground layers */}
          <div className="absolute bottom-0 left-0 w-full">
            {/* Grass top */}
            <div className="h-1.5 bg-gradient-to-r from-green-400 via-green-500 to-green-400 dark:from-green-700 dark:via-green-800 dark:to-green-700" />
            {/* Grass body */}
            <div className="h-4 bg-gradient-to-b from-green-500 to-green-600 dark:from-green-800 dark:to-green-900" />
            {/* Path / sidewalk */}
            <div className="h-2 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.05) 8px, rgba(0,0,0,0.05) 10px)' }} />
            {/* Earth */}
            <div className="h-5 bg-gradient-to-b from-amber-700 to-amber-800 dark:from-amber-900 dark:to-amber-950" />
          </div>

          {/* Milestone markers */}
          {experiences.map(exp => (
            <div key={`mk-${exp.id}`} className="absolute" style={{ left: `${yearToX(exp.startYear)}%`, bottom: '34px' }}>
              <div className={`w-1 h-4 rounded-full ${exp.type === 'education' ? 'bg-purple-500' : 'bg-blue-500'} opacity-50`} />
            </div>
          ))}
        </div>

        {/* ═══ CHARACTER ═══ */}
        <div
          className="absolute z-20 pointer-events-none transition-[left] duration-100 ease-linear"
          style={{ left: `${characterScreenPercent}%`, bottom: '34px', transform: 'translateX(-50%)' }}
        >
          <PixelCharacter
            outfit={currentOutfit}
            isWalking={isPlaying}
            hasMask={hasMask}
            scale={4}
          />
        </div>

        {/* ═══ EXPERIENCE CARD ═══ */}
        <div className="absolute top-3 left-0 right-0 flex flex-col items-center gap-2 px-4 z-20">
          {activeExperiences.length === 0 && progress > 0.01 && progress < 0.99 && (
            <div className="px-4 py-2 rounded-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-border text-sm text-muted-foreground italic">
              Caminhando...
            </div>
          )}
          {activeExperiences.map(exp => (
            <div key={exp.id} className="w-full max-w-md px-4 py-3 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-border shadow-lg animate-fade-in-up">
              <div className="flex items-center gap-2 mb-1">
                {exp.type === 'education' ? (
                  <GraduationCap size={14} className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
                ) : (
                  <Briefcase size={14} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                )}
                <span className={`text-[10px] font-bold uppercase tracking-wider ${exp.type === 'education' ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'}`}>
                  {exp.type === 'education' ? 'Educação' : 'Trabalho'}
                </span>
                <span className="ml-auto text-[10px] text-muted-foreground">{exp.period}</span>
              </div>
              <h4 className="font-bold text-sm text-foreground leading-tight">{exp.title}</h4>
              <p className="text-xs text-muted-foreground">{exp.organization}</p>
              {exp.description && (
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed line-clamp-2">{exp.description}</p>
              )}
              {exp.tools.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {exp.tools.map(tool => (
                    <span key={tool} className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {tool}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button onClick={togglePlay} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors">
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          {isPlaying ? 'Pausar' : progress >= 1 ? 'Replay' : 'Play'}
        </button>
        <button onClick={handleRestart} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-foreground text-sm transition-colors">
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
};

export default InteractiveTimeline;
