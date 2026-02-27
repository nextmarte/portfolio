'use client';

import React from 'react';

export type OutfitType =
  | 'student'
  | 'it_advisor'
  | 'university'
  | 'researcher'
  | 'manager'
  | 'masters'
  | 'teacher'
  | 'engineer'
  | 'phd'
  | 'casual';

interface PixelCharacterProps {
  outfit: OutfitType;
  isWalking?: boolean;
  hasMask?: boolean;
  scale?: number;
}

// ─── Color Palette ───
const SKIN = '#E8A870';
const SKIN_S = '#C08050';
const SKIN_L = '#FFD5A5';
const HAIR = '#2A1A0A';
const HAIR_L = '#4A3420';
const EYE_W = '#FFFFFF';
const EYE_I = '#22C55E';
const EYE_P = '#166534'; // pupil
const BROW = '#1A1008';
const MOUTH = '#C07050';
const BEARD = '#3A2818'; // subtle beard
const MASK_W = '#E8F0F8';
const MASK_B = '#A8D4F0';
const MASK_S = '#98BCC8';
const SHADOW = 'rgba(0,0,0,0.12)';

interface OutfitColors {
  shirt: string;
  shirtS: string;
  shirtD?: string;
  pants: string;
  pantsS: string;
  shoes: string;
  shoesS?: string;
}

const OUTFITS: Record<OutfitType, OutfitColors> = {
  student: {
    shirt: '#4A90E2', shirtS: '#3670C0',
    pants: '#2C3E50', pantsS: '#1C2E3F',
    shoes: '#1A1A1A', shoesS: '#0A0A0A',
  },
  it_advisor: {
    shirt: '#6ABEEF', shirtS: '#4A9ED0', shirtD: '#FFFFFF',
    pants: '#C4A07A', pantsS: '#A4805A',
    shoes: '#6B3A1A', shoesS: '#4B2A0A',
  },
  university: {
    shirt: '#1A2744', shirtS: '#0E1830',
    pants: '#445E80', pantsS: '#2E4260',
    shoes: '#E0E0E0', shoesS: '#B0B0B0',
  },
  researcher: {
    shirt: '#F0F0F0', shirtS: '#D0D0D0', shirtD: '#2C3E50',
    pants: '#2C2C2C', pantsS: '#1A1A1A',
    shoes: '#1A1A1A', shoesS: '#0A0A0A',
  },
  manager: {
    shirt: '#363636', shirtS: '#242424', shirtD: '#E0E0E0',
    pants: '#2A2A2A', pantsS: '#1A1A1A',
    shoes: '#1A1A1A', shoesS: '#0A0A0A',
  },
  masters: {
    shirt: '#7B1818', shirtS: '#5B0808', shirtD: '#F0F0F0',
    pants: '#2C2C2C', pantsS: '#1A1A1A',
    shoes: '#1A1A1A', shoesS: '#0A0A0A',
  },
  teacher: {
    shirt: '#7B8FB5', shirtS: '#5B6F95', shirtD: '#C41E3A',
    pants: '#2C2C2C', pantsS: '#1A1A1A',
    shoes: '#1A1A1A', shoesS: '#0A0A0A',
  },
  engineer: {
    shirt: '#1A1A2E', shirtS: '#0A0A1E', shirtD: '#00E5FF',
    pants: '#0A0A0A', pantsS: '#050505',
    shoes: '#1A1A2E', shoesS: '#00E5FF',
  },
  phd: {
    shirt: '#800020', shirtS: '#600010', shirtD: '#FFD700',
    pants: '#1A1A1A', pantsS: '#0A0A0A',
    shoes: '#1A1A1A', shoesS: '#0A0A0A',
  },
  casual: {
    shirt: '#607D8B', shirtS: '#455A64',
    pants: '#37474F', pantsS: '#263238',
    shoes: '#1A1A1A', shoesS: '#0A0A0A',
  },
};

const r = (x: number, y: number, c: string) => (
  <rect key={`${x}_${y}`} x={x} y={y} width={1} height={1} fill={c} />
);

const PixelCharacter: React.FC<PixelCharacterProps> = ({
  outfit = 'student',
  isWalking = false,
  hasMask = false,
  scale = 4,
}) => {
  const c = OUTFITS[outfit] || OUTFITS.casual;
  const hasGlasses = outfit === 'researcher' || outfit === 'masters';
  const glassColor = outfit === 'researcher' ? '#D4AF37' : '#333333';

  return (
    <svg
      width={17 * scale}
      height={23 * scale}
      viewBox="0 0 17 23"
      style={{ imageRendering: 'pixelated' } as React.CSSProperties}
      className={isWalking ? 'pixel-walking' : ''}
    >
      {/* ═══ GROUND SHADOW ═══ */}
      <ellipse cx={8.5} cy={21.5} rx={5} ry={1} fill={SHADOW} />

      <g className="pixel-body-bounce">
        {/* ═══ HEAD GROUP (with head bob animation) ═══ */}
        <g className="pixel-head" style={{ transformOrigin: '8.5px 7px' }}>
          {/* ═══ HAIR ═══ */}
          {outfit === 'phd' ? (
            /* Mortarboard cap for PhD */
            <g>
              {r(5,0,HAIR)}{r(6,0,'#1A1A1A')}{r(7,0,'#1A1A1A')}{r(8,0,'#1A1A1A')}{r(9,0,'#1A1A1A')}{r(10,0,'#1A1A1A')}{r(11,0,HAIR)}
              {r(4,1,'#1A1A1A')}{r(5,1,'#1A1A1A')}{r(6,1,'#1A1A1A')}{r(7,1,'#1A1A1A')}{r(8,1,'#1A1A1A')}{r(9,1,'#1A1A1A')}{r(10,1,'#1A1A1A')}{r(11,1,'#1A1A1A')}{r(12,1,'#1A1A1A')}
              {r(12,2,'#FFD700')}{r(13,2,'#FFD700')}
              {r(5,2,HAIR)}{r(6,2,HAIR)}{r(7,2,HAIR_L)}{r(8,2,HAIR)}{r(9,2,HAIR)}{r(10,2,HAIR_L)}{r(11,2,HAIR)}
              {r(4,3,HAIR)}{r(5,3,HAIR)}{r(11,3,HAIR)}{r(12,3,HAIR)}
              {r(4,4,HAIR)}{r(12,4,HAIR)}
              {r(4,5,HAIR)}{r(12,5,HAIR)}
            </g>
          ) : (
            /* Normal hair for all other outfits */
            <g>
              {r(7,0,HAIR)}{r(8,0,HAIR_L)}{r(9,0,HAIR)}
              {r(6,1,HAIR)}{r(7,1,HAIR_L)}{r(8,1,HAIR)}{r(9,1,HAIR)}{r(10,1,HAIR)}
              {r(5,2,HAIR)}{r(6,2,HAIR)}{r(7,2,HAIR_L)}{r(8,2,HAIR)}{r(9,2,HAIR)}{r(10,2,HAIR_L)}{r(11,2,HAIR)}
              {r(4,3,HAIR)}{r(5,3,HAIR)}{r(11,3,HAIR)}{r(12,3,HAIR)}
              {r(4,4,HAIR)}{r(12,4,HAIR)}
              {r(4,5,HAIR)}{r(12,5,HAIR)}
              {/* University/Engineer hood detail */}
              {(outfit === 'university' || outfit === 'engineer') && (
                <>{r(4,3,c.shirt)}{r(12,3,c.shirt)}{r(5,3,c.shirt)}{r(11,3,c.shirt)}</>
              )}
            </g>
          )}

          {/* ═══ EARS ═══ */}
          {r(4,6,SKIN_S)}{r(12,6,SKIN_S)}

          {/* ═══ FACE ═══ */}
          {/* Forehead */}
          {r(6,3,SKIN_L)}{r(7,3,SKIN)}{r(8,3,SKIN)}{r(9,3,SKIN)}{r(10,3,SKIN_L)}
          {/* Eyebrows */}
          {r(5,4,SKIN)}{r(6,4,BROW)}{r(7,4,BROW)}{r(8,4,SKIN)}{r(9,4,BROW)}{r(10,4,BROW)}{r(11,4,SKIN)}
          {/* Eyes (with pupil highlight) */}
          {r(5,5,SKIN)}{r(6,5,EYE_W)}{r(7,5,EYE_I)}{r(8,5,SKIN)}{r(9,5,EYE_W)}{r(10,5,EYE_I)}{r(11,5,SKIN)}
          {/* Eye shine */}
          <rect x={6.1} y={4.9} width={0.4} height={0.4} fill="#fff" opacity={0.7} />
          <rect x={9.1} y={4.9} width={0.4} height={0.4} fill="#fff" opacity={0.7} />
          {/* Glasses overlay */}
          {hasGlasses && (
            <>{r(5,5,glassColor)}{r(8,5,glassColor)}{r(11,5,glassColor)}</>
          )}
          {/* Cheeks */}
          {r(5,6,SKIN)}{r(6,6,SKIN)}{r(7,6,SKIN_S)}{r(8,6,SKIN_S)}{r(9,6,SKIN)}{r(10,6,SKIN)}{r(11,6,SKIN_S)}

          {hasMask ? (
            /* ═══ MASK (COVID 2020-2023) ═══ */
            <g>
              {r(5,7,MASK_S)}{r(6,7,MASK_W)}{r(7,7,MASK_B)}{r(8,7,MASK_B)}{r(9,7,MASK_W)}{r(10,7,MASK_W)}{r(11,7,MASK_S)}
              {r(6,8,MASK_W)}{r(7,8,MASK_W)}{r(8,8,MASK_B)}{r(9,8,MASK_W)}{r(10,8,MASK_W)}
            </g>
          ) : (
            /* Normal nose + mouth + subtle stubble */
            <g>
              {r(5,7,SKIN)}{r(6,7,SKIN)}{r(7,7,SKIN_S)}{r(8,7,SKIN_S)}{r(9,7,SKIN)}{r(10,7,SKIN)}{r(11,7,SKIN)}
              {r(6,8,SKIN)}{r(7,8,MOUTH)}{r(8,8,MOUTH)}{r(9,8,MOUTH)}{r(10,8,SKIN)}
              {/* Subtle beard/stubble */}
              <rect x={6} y={8.6} width={1} height={0.5} fill={BEARD} opacity={0.25} />
              <rect x={7} y={9} width={1} height={0.4} fill={BEARD} opacity={0.2} />
              <rect x={9} y={9} width={1} height={0.4} fill={BEARD} opacity={0.2} />
              <rect x={10} y={8.6} width={1} height={0.5} fill={BEARD} opacity={0.25} />
            </g>
          )}
          {/* Chin */}
          {r(6,9,SKIN)}{r(7,9,SKIN)}{r(8,9,SKIN_S)}{r(9,9,SKIN)}{r(10,9,SKIN)}
        </g>
        {/* end head group */}

        {/* Neck */}
        {r(7,10,SKIN_S)}{r(8,10,SKIN)}{r(9,10,SKIN_S)}

        {/* ═══ TORSO ═══ */}
        {r(5,11,c.shirt)}{r(6,11,c.shirt)}{r(7,11,c.shirt)}{r(8,11,c.shirt)}{r(9,11,c.shirt)}{r(10,11,c.shirt)}{r(11,11,c.shirt)}
        {r(5,12,c.shirt)}{r(6,12,c.shirt)}{r(7,12,c.shirtS)}{r(8,12,c.shirt)}{r(9,12,c.shirt)}{r(10,12,c.shirtS)}{r(11,12,c.shirt)}
        {r(5,13,c.shirt)}{r(6,13,c.shirtS)}{r(7,13,c.shirt)}{r(8,13,c.shirt)}{r(9,13,c.shirtS)}{r(10,13,c.shirt)}{r(11,13,c.shirt)}
        {r(5,14,c.shirtS)}{r(6,14,c.shirt)}{r(7,14,c.shirtS)}{r(8,14,c.shirtS)}{r(9,14,c.shirt)}{r(10,14,c.shirtS)}{r(11,14,c.shirtS)}
        {/* Torso edge highlights */}
        <rect x={5} y={11} width={0.3} height={4} fill="rgba(255,255,255,0.1)" />
        <rect x={11.7} y={11} width={0.3} height={4} fill="rgba(0,0,0,0.08)" />

        {/* Outfit-specific torso details */}
        {outfit === 'it_advisor' && (<>{r(7,11,EYE_W)}{r(9,11,EYE_W)}</>)}
        {outfit === 'manager' && (<>{r(6,12,c.shirtD!)}{r(10,12,c.shirtD!)}{r(7,13,c.shirtD!)}{r(9,13,c.shirtD!)}</>)}
        {outfit === 'masters' && (<>{r(7,11,c.shirtD!)}{r(9,11,c.shirtD!)}{r(8,12,c.shirtD!)}</>)}
        {outfit === 'teacher' && (<>{r(7,11,EYE_W)}{r(9,11,EYE_W)}{r(8,11,c.shirtD!)}{r(8,12,c.shirtD!)}{r(8,13,c.shirtD!)}</>)}
        {outfit === 'engineer' && (<>{r(6,13,c.shirtD!)}{r(7,13,c.shirtD!)}{r(8,13,c.shirtD!)}{r(9,13,c.shirtD!)}{r(10,13,c.shirtD!)}</>)}
        {outfit === 'phd' && (
          <g>
            {r(4,12,c.shirt)}{r(12,12,c.shirt)}{r(4,13,c.shirt)}{r(12,13,c.shirt)}{r(4,14,c.shirtS)}{r(12,14,c.shirtS)}
            {r(5,11,c.shirtD!)}{r(11,11,c.shirtD!)}{r(8,12,c.shirtD!)}{r(8,13,c.shirtD!)}{r(8,14,c.shirtD!)}
          </g>
        )}
        {outfit === 'researcher' && (
          <g>{r(4,12,c.shirt)}{r(12,12,c.shirt)}{r(4,13,c.shirt)}{r(12,13,c.shirt)}{r(4,14,c.shirtS)}{r(12,14,c.shirtS)}{r(8,12,c.shirtD!)}{r(8,13,c.shirtD!)}</g>
        )}

        {/* ═══ BELT ═══ */}
        <rect x={5.5} y={14.6} width={6} height={0.5} fill="rgba(0,0,0,0.3)" rx={0.1} />
        {/* Belt buckle */}
        <rect x={7.8} y={14.5} width={1.4} height={0.7} fill={outfit === 'engineer' ? '#00E5FF' : '#B8860B'} rx={0.2} opacity={0.6} />

        {/* ═══ ARMS (CSS animated) ═══ */}
        <g className="pixel-left-arm" style={{ transformOrigin: '5px 11px' }}>
          {r(3,11,c.shirt)}{r(4,11,c.shirtS)}
          {r(3,12,c.shirt)}{r(4,12,c.shirtS)}
          {r(3,13,c.shirtS)}{r(4,13,c.shirt)}
          {r(3,14,SKIN)}{r(4,14,SKIN_S)}
          {/* Hand detail */}
          <rect x={3} y={14.5} width={0.6} height={0.5} fill={SKIN_L} opacity={0.6} />
        </g>
        <g className="pixel-right-arm" style={{ transformOrigin: '12px 11px' }}>
          {r(12,11,c.shirtS)}{r(13,11,c.shirt)}
          {r(12,12,c.shirtS)}{r(13,12,c.shirt)}
          {r(12,13,c.shirt)}{r(13,13,c.shirtS)}
          {r(12,14,SKIN_S)}{r(13,14,SKIN)}
          {/* Hand detail */}
          <rect x={13.4} y={14.5} width={0.6} height={0.5} fill={SKIN_L} opacity={0.6} />
        </g>

        {/* ═══ LEGS (CSS animated) ═══ */}
        <g className="pixel-left-leg" style={{ transformOrigin: '7px 15px' }}>
          {r(6,15,c.pants)}{r(7,15,c.pants)}
          {r(6,16,c.pants)}{r(7,16,c.pantsS)}
          {r(6,17,c.pantsS)}{r(7,17,c.pants)}
          {r(6,18,c.pants)}{r(7,18,c.pantsS)}
          {r(5,19,c.shoes)}{r(6,19,c.shoes)}{r(7,19,c.shoesS || c.shoes)}
          {/* Shoe sole */}
          <rect x={4.8} y={19.7} width={2.5} height={0.4} fill="rgba(0,0,0,0.3)" rx={0.1} />
        </g>
        <g className="pixel-right-leg" style={{ transformOrigin: '10px 15px' }}>
          {r(9,15,c.pants)}{r(10,15,c.pantsS)}
          {r(9,16,c.pantsS)}{r(10,16,c.pants)}
          {r(9,17,c.pants)}{r(10,17,c.pantsS)}
          {r(9,18,c.pantsS)}{r(10,18,c.pants)}
          {r(9,19,c.shoesS || c.shoes)}{r(10,19,c.shoes)}{r(11,19,c.shoes)}
          {/* Shoe sole */}
          <rect x={8.8} y={19.7} width={2.5} height={0.4} fill="rgba(0,0,0,0.3)" rx={0.1} />
        </g>
      </g>
    </svg>
  );
};

export default PixelCharacter;
