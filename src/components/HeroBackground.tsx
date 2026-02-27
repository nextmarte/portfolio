'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTheme } from 'next-themes';
import PixelCharacter, { OutfitType } from './PixelCharacter';

/* ─── Constants ─── */
const START_YEAR = 2006;
const END_YEAR = 2030;
const TOTAL_YEARS = END_YEAR - START_YEAR;
const ANIMATION_DURATION = 55000; // 55s single play
const SCENERY_MULT = 3.5;

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
  { yearPos: 2008, label: 'CEFET/RJ', subLabel: 'Mecânica', color: '#8B4513', colorDark: '#5D2E0A', roofColor: '#A0522D', height: 3, width: 2, windows: 2, type: 'industrial' },
  { yearPos: 2011.5, label: 'Chemtech', subLabel: 'Siemens', color: '#2F4F4F', colorDark: '#1A2F2F', roofColor: '#4A7A7A', height: 3, width: 2, windows: 2, type: 'industrial' },
  { yearPos: 2016.5, label: 'UFF', subLabel: 'Administração', color: '#1B3A5C', colorDark: '#0E2240', roofColor: '#2A4F7A', height: 4, width: 3, windows: 3, type: 'university' },
  { yearPos: 2017.8, label: 'Águas do Brasil', color: '#2196F3', colorDark: '#1565C0', roofColor: '#42A5F5', height: 2, width: 2, windows: 1, type: 'government' },
  { yearPos: 2019, label: 'FAPERJ', color: '#2C6B4F', colorDark: '#1A4030', roofColor: '#3A8B6F', height: 2, width: 2, windows: 1, type: 'lab' },
  { yearPos: 2020, label: 'CL Web Rádio', color: '#8B2252', colorDark: '#5B1232', roofColor: '#AB3272', height: 2, width: 2, windows: 1, type: 'radio' },
  { yearPos: 2023, label: 'UFF', subLabel: 'Mestrado', color: '#1B3A5C', colorDark: '#0E2240', roofColor: '#2A4F7A', height: 4, width: 3, windows: 3, type: 'university' },
  { yearPos: 2025.5, label: 'CID – UFF', subLabel: 'Pesquisador', color: '#1A1A2E', colorDark: '#0D0D1A', roofColor: '#2E2E4E', height: 4, width: 3, windows: 3, type: 'tech' },
  { yearPos: 2028, label: 'COPPEAD', subLabel: 'Doutorado', color: '#800020', colorDark: '#500010', roofColor: '#A03040', height: 4, width: 3, windows: 3, type: 'academic' },
];

const TREE_POSITIONS = [2009.5, 2010, 2013, 2014.5, 2015.5, 2021, 2022, 2024, 2026.5, 2029];

/* ─── Outfit for year (simplified career mapping) ─── */
function getOutfitForYear(year: number): OutfitType {
  if (year < 2009) return 'student';
  if (year < 2015) return 'engineer';
  if (year < 2017) return 'university';
  if (year < 2018) return 'it_advisor';
  if (year < 2019.5) return 'researcher';
  if (year < 2021.5) return 'manager';
  if (year < 2023) return 'masters';
  if (year < 2024.5) return 'teacher';
  if (year < 2026) return 'engineer';
  return 'phd';
}

const yearToX = (year: number) => ((year - START_YEAR) / TOTAL_YEARS) * 100;

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
  const windowLit = (r: number, c: number) => ((r * 7 + c * 13 + bld.yearPos * 3) % 5) > 1;
  const BSCALE = 1.75;

  return (
    <svg width={totalW * BSCALE} height={(totalH + 8) * BSCALE} viewBox={`0 0 ${totalW} ${totalH + 8}`} style={{ imageRendering: 'pixelated' } as React.CSSProperties}>
      <text x={totalW / 2} y={10} textAnchor="middle" fontSize="7" fontWeight="bold" fill={isDark ? '#d1d5db' : '#374151'} fontFamily="monospace">{bld.label}</text>
      {bld.subLabel && <text x={totalW / 2} y={18} textAnchor="middle" fontSize="5" fill={isDark ? '#9ca3af' : '#6b7280'} fontFamily="monospace">{bld.subLabel}</text>}

      {/* Roof */}
      {bld.type === 'university' || bld.type === 'academic' ? (
        <g>
          <polygon points={`${totalW / 2 - bW / 2},${26} ${totalW / 2},${16} ${totalW / 2 + bW / 2},${26}`} fill={bld.roofColor} />
          <polygon points={`${totalW / 2 - bW / 2},${26} ${totalW / 2},${17} ${totalW / 2 + bW / 2},${26}`} fill={bld.roofColor} opacity="0.7" />
          <rect x={totalW / 2 - 0.5} y={10} width={1} height={7} fill={isDark ? '#ddd' : '#555'} />
          <rect x={totalW / 2} y={10} width={5} height={3} fill="#E74C3C" />
        </g>
      ) : bld.type === 'industrial' ? (
        <g>
          <rect x={(totalW - bW) / 2} y={23} width={bW} height={4} fill={bld.roofColor} />
          <rect x={totalW / 2 + bW / 3} y={10} width={6} height={17} fill={bld.roofColor} />
          <rect x={totalW / 2 + bW / 3 - 1} y={9} width={8} height={3} fill={isDark ? '#666' : '#888'} />
        </g>
      ) : bld.type === 'tech' ? (
        <g>
          <rect x={(totalW - bW) / 2} y={23} width={bW} height={4} fill={bld.roofColor} />
          <rect x={totalW / 2 - 0.5} y={4} width={1.5} height={23} fill={isDark ? '#00E5FF' : '#4A90E2'} />
          <circle cx={totalW / 2} cy={4} r={2.5} fill={isDark ? '#00E5FF' : '#4A90E2'} opacity={0.8} />
          <circle cx={totalW / 2} cy={4} r={5} fill="none" stroke={isDark ? '#00E5FF' : '#4A90E2'} strokeWidth={0.5} opacity={0.4} />
        </g>
      ) : bld.type === 'radio' ? (
        <g>
          <rect x={(totalW - bW) / 2} y={23} width={bW} height={4} fill={bld.roofColor} />
          <rect x={totalW / 2 - 0.5} y={6} width={1.5} height={20} fill={isDark ? '#FF69B4' : '#C2185B'} />
          <rect x={totalW / 2 - 4} y={6} width={8} height={1.5} fill={isDark ? '#FF69B4' : '#C2185B'} />
        </g>
      ) : (
        <rect x={(totalW - bW) / 2} y={23} width={bW} height={4} fill={bld.roofColor} />
      )}

      {/* Body */}
      <rect x={(totalW - bW) / 2} y={27} width={bW} height={bH} fill={bColor} rx={1} />
      <rect x={(totalW - bW) / 2} y={27} width={2} height={bH} fill="rgba(255,255,255,0.08)" />

      {/* Windows */}
      {Array.from({ length: bld.windows }).map((_, row) =>
        Array.from({ length: Math.max(2, bld.width) }).map((_, col) => {
          const margin = 6;
          const gap = (bW - margin * 2) / Math.max(2, bld.width);
          const wX = (totalW - bW) / 2 + margin + col * gap + (gap - 7) / 2;
          const wY = 27 + 6 + row * ((bH - 14) / bld.windows);
          return (
            <g key={`w-${row}-${col}`}>
              <rect x={wX} y={wY} width={7} height={7} fill={windowLit(row, col) ? windowColor : windowDark} rx={0.4} />
              <rect x={wX} y={wY} width={7} height={7} fill="none" stroke={isDark ? '#555' : '#8899AA'} strokeWidth={0.4} rx={0.4} />
              <line x1={wX + 3.5} y1={wY} x2={wX + 3.5} y2={wY + 7} stroke={isDark ? '#444' : '#778888'} strokeWidth={0.3} />
              <line x1={wX} y1={wY + 3.5} x2={wX + 7} y2={wY + 3.5} stroke={isDark ? '#444' : '#778888'} strokeWidth={0.3} />
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
PixelBuilding.displayName = 'HeroBG_PixelBuilding';

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
PixelTree.displayName = 'HeroBG_PixelTree';

/* ═══════════════════════════════════════════
   HERO BACKGROUND COMPONENT
   ═══════════════════════════════════════════ */
export default function HeroBackground() {
  const [progress, setProgress] = useState(0);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const progressRef = useRef(0);

  useEffect(() => { setMounted(true); }, []);
  const isDark = mounted ? resolvedTheme === 'dark' : false;

  const currentYear = START_YEAR + progress * TOTAL_YEARS;
  const hasMask = currentYear >= 2020 && currentYear <= 2023;
  const currentOutfit = getOutfitForYear(currentYear);

  /* ─── Character positioning (walk-in then fixed) ─── */
  const CEFET_INIT_SCREEN = ((2008 - START_YEAR) / TOTAL_YEARS) * 100 * SCENERY_MULT;
  const CENTER_POS = 42;
  const WALK_IN_PHASE = 0.05;

  const isWalkingIn = progress < WALK_IN_PHASE;
  const characterScreenPercent = isWalkingIn
    ? CEFET_INIT_SCREEN + (progress / WALK_IN_PHASE) * (CENTER_POS - CEFET_INIT_SCREEN)
    : CENTER_POS;

  const sceneryProgress = isWalkingIn
    ? 0
    : (progress - WALK_IN_PHASE) / (1 - WALK_IN_PHASE);
  const sceneryTranslate = sceneryProgress * (SCENERY_MULT - 1) * 100 / SCENERY_MULT;

  const isAnimating = progress < 1;

  /* ─── Animation loop (single play, auto-start on mount) ─── */
  const animate = useCallback((ts: number) => {
    if (!startTimeRef.current) startTimeRef.current = ts;
    const p = Math.min((ts - startTimeRef.current) / ANIMATION_DURATION, 1);
    progressRef.current = p;
    setProgress(p);
    if (p < 1) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, []);

  useEffect(() => {
    // Short delay so the page content renders first
    const timer = setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate);
    }, 800);
    return () => {
      clearTimeout(timer);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-100 to-sky-200/80 dark:from-indigo-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-1000" />

      {/* Sun / Moon */}
      {mounted && (isDark ? (
        <div className="absolute top-8 right-[12%]">
          <div className="w-8 h-8 rounded-full bg-gray-200 shadow-[0_0_15px_rgba(200,200,200,0.3)]" />
          <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-indigo-950" />
        </div>
      ) : (
        <div className="absolute top-8 right-[12%] w-10 h-10 rounded-full bg-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.4)]" />
      ))}

      {/* Stars (dark mode) */}
      {isDark && (
        <div className="absolute inset-0">
          {[8, 18, 32, 45, 58, 72, 85, 12, 40, 65, 90, 28, 55, 78].map((l, i) => (
            <div key={i} className="absolute w-0.5 h-0.5 bg-white rounded-full" style={{ left: `${l}%`, top: `${4 + (i * 3.7) % 25}%`, opacity: 0.3 + (i % 4) * 0.15 }} />
          ))}
        </div>
      )}

      {/* Clouds (parallax) */}
      <div className="absolute top-[8%] transition-[left] duration-200 ease-linear" style={{ left: `${75 - sceneryProgress * 25}%` }}>
        <div className="w-24 h-6 bg-white/30 dark:bg-white/5 rounded-full" />
        <div className="w-16 h-4 bg-white/40 dark:bg-white/7 rounded-full -mt-2 ml-4" />
      </div>
      <div className="absolute top-[15%] transition-[left] duration-200 ease-linear" style={{ left: `${30 - sceneryProgress * 15}%` }}>
        <div className="w-20 h-5 bg-white/25 dark:bg-white/4 rounded-full" />
      </div>
      <div className="absolute top-[22%] transition-[left] duration-200 ease-linear" style={{ left: `${90 - sceneryProgress * 30}%` }}>
        <div className="w-28 h-6 bg-white/20 dark:bg-white/3 rounded-full" />
      </div>

      {/* COVID badge */}
      {hasMask && (
        <div className="absolute top-3 right-3 px-2 py-1 bg-red-100 dark:bg-red-900/50 rounded text-[10px] font-bold text-red-600 dark:text-red-400 animate-pulse-subtle z-30">
          🦠 COVID-19
        </div>
      )}

      {/* ═══ SCROLLING SCENERY ═══ */}
      <div
        className="absolute bottom-0 left-0 will-change-transform"
        style={{
          width: `${SCENERY_MULT * 100}%`,
          height: '100%',
          transform: `translateX(-${sceneryTranslate}%)`,
          transition: 'transform 150ms linear',
        }}
      >
        {/* Mountains */}
        <svg className="absolute bottom-[44px] left-0 w-full opacity-20" height="60" preserveAspectRatio="none" viewBox="0 0 3000 60">
          <polygon points="0,60 80,20 200,40 350,10 500,35 700,8 900,30 1100,15 1300,35 1500,5 1700,25 1900,12 2100,30 2300,8 2500,20 2700,40 3000,15 3000,60" fill={isDark ? '#1e293b' : '#94a3b8'} />
        </svg>

        {/* Hills */}
        <svg className="absolute bottom-[42px] left-0 w-full opacity-15" height="40" preserveAspectRatio="none" viewBox="0 0 3000 40">
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
          <div className="h-1.5 bg-gradient-to-r from-green-400 via-green-500 to-green-400 dark:from-green-700 dark:via-green-800 dark:to-green-700" />
          <div className="h-4 bg-gradient-to-b from-green-500 to-green-600 dark:from-green-800 dark:to-green-900" />
          <div className="h-2 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.05) 8px, rgba(0,0,0,0.05) 10px)' }} />
          <div className="h-5 bg-gradient-to-b from-amber-700 to-amber-800 dark:from-amber-900 dark:to-amber-950" />
        </div>
      </div>

      {/* ═══ CHARACTER ═══ */}
      <div
        className="absolute z-20"
        style={{
          left: `${characterScreenPercent}%`,
          bottom: '34px',
          transform: 'translateX(-50%)',
          transition: 'left 100ms linear',
        }}
      >
        <PixelCharacter
          outfit={currentOutfit}
          isWalking={isAnimating}
          hasMask={hasMask}
          scale={4.8}
        />
      </div>

      {/* ═══ YEAR INDICATOR (subtle bottom-left) ═══ */}
      {progress > 0.005 && (
        <div className="absolute bottom-16 left-4 z-30">
          <span className="font-mono text-xs font-bold text-foreground/40 tabular-nums">
            {Math.floor(currentYear)}
          </span>
        </div>
      )}
    </div>
  );
}
