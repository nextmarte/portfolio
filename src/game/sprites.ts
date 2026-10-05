import { EraOutfit } from './types';

// Helper to draw a pixel block
export function drawPixel(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number = 2) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), size, size);
}

// 16-bit Character Palette Definition
interface CharacterPalette {
  hair: string;
  hairShadow: string;
  skin: string;
  skinShadow: string;
  eyes: string;
  shirt: string;
  shirtShadow: string;
  pants: string;
  pantsShadow: string;
  shoes: string;
  accessory?: string;
}

const PALETTES: Record<EraOutfit, CharacterPalette> = {
  cefet: {
    hair: '#3E2723',
    hairShadow: '#271206',
    skin: '#F5D0A9',
    skinShadow: '#D4956A',
    eyes: '#2E7D32',
    shirt: '#D7CCC8', // Uniforme cinza claro
    shirtShadow: '#A1887F',
    pants: '#37474F', // Calça azul petróleo
    pantsShadow: '#212121',
    shoes: '#4E342E',
  },
  chemtech: {
    hair: '#3E2723',
    hairShadow: '#271206',
    skin: '#F5D0A9',
    skinShadow: '#D4956A',
    eyes: '#2E7D32',
    shirt: '#0288D1', // Azul Siemens / Chemtech
    shirtShadow: '#01579B',
    pants: '#263238',
    pantsShadow: '#191E20',
    shoes: '#212121',
    accessory: '#FFA000', // Crachá industrial
  },
  uff: {
    hair: '#3E2723',
    hairShadow: '#271206',
    skin: '#F5D0A9',
    skinShadow: '#D4956A',
    eyes: '#2E7D32',
    shirt: '#1976D2', // Azul UFF clássico
    shirtShadow: '#0D47A1',
    pants: '#455A64',
    pantsShadow: '#263238',
    shoes: '#5D4037',
  },
  cid: {
    hair: '#3E2723',
    hairShadow: '#271206',
    skin: '#F5D0A9',
    skinShadow: '#D4956A',
    eyes: '#2E7D32',
    shirt: '#311B92', // Púrpura / Data Tech
    shirtShadow: '#1A0C54',
    pants: '#1E293B',
    pantsShadow: '#0F172A',
    shoes: '#334155',
    accessory: '#00E676', // Detalhe verde bio/dados
  },
  baxijen: {
    hair: '#3E2723',
    hairShadow: '#271206',
    skin: '#F5D0A9',
    skinShadow: '#D4956A',
    eyes: '#2E7D32',
    shirt: '#0F172A', // Dark Slate AI Architect
    shirtShadow: '#020617',
    pants: '#1E293B',
    pantsShadow: '#0F172A',
    shoes: '#0EA5E9', // Sneaker com detalhe ciano
    accessory: '#38BDF8', // Cyan AI glow
  },
};

/**
 * Draws the 16-bit animated pixel-art character
 */
export function drawCharacter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  isJumping: boolean,
  isGrounded: boolean,
  facing: 'right' | 'left',
  outfit: EraOutfit
) {
  const p = PALETTES[outfit] || PALETTES.baxijen;
  const S = 2; // Pixel unit size (each retro pixel = 2x2 screen pixels)

  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  if (facing === 'left') {
    ctx.scale(-1, 1);
  }

  // Animation walk bounce offset
  const bounceY = !isGrounded ? -2 : (frame % 2 === 1 ? -1 : 0);

  // 1. CABELO & CABEÇA (Topo)
  // Base do cabelo
  ctx.fillStyle = p.hair;
  ctx.fillRect(-6 * S, (-28 + bounceY) * S, 12 * S, 5 * S);
  ctx.fillRect(-7 * S, (-27 + bounceY) * S, 14 * S, 3 * S);
  ctx.fillStyle = p.hairShadow;
  ctx.fillRect(-6 * S, (-29 + bounceY) * S, 11 * S, 1 * S);

  // Rosto / Pele
  ctx.fillStyle = p.skin;
  ctx.fillRect(-6 * S, (-23 + bounceY) * S, 12 * S, 8 * S);
  ctx.fillStyle = p.skinShadow;
  ctx.fillRect(-6 * S, (-16 + bounceY) * S, 12 * S, 1 * S); // Sombra do queixo

  // Olhos verdes expressivos estilo retrô
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(-1 * S, (-20 + bounceY) * S, 3 * S, 3 * S);
  ctx.fillRect(3 * S, (-20 + bounceY) * S, 3 * S, 3 * S);

  ctx.fillStyle = p.eyes;
  ctx.fillRect(0 * S, (-19 + bounceY) * S, 2 * S, 2 * S);
  ctx.fillRect(4 * S, (-19 + bounceY) * S, 2 * S, 2 * S);

  // Brilho dos olhos
  ctx.fillStyle = '#E8F5E9';
  ctx.fillRect(0 * S, (-20 + bounceY) * S, 1 * S, 1 * S);
  ctx.fillRect(4 * S, (-20 + bounceY) * S, 1 * S, 1 * S);

  // Sorriso discreto
  ctx.fillStyle = p.skinShadow;
  ctx.fillRect(0 * S, (-16 + bounceY) * S, 4 * S, 1 * S);

  // 2. TRONCO / CAMISA
  const torsoY = (-15 + bounceY) * S;
  ctx.fillStyle = p.shirt;
  ctx.fillRect(-5 * S, torsoY, 10 * S, 9 * S);
  ctx.fillStyle = p.shirtShadow;
  ctx.fillRect(-5 * S, torsoY + 7 * S, 10 * S, 2 * S);

  // Detalhe tecnológico do peito (AI glow para BaXiJen / Crachá)
  if (p.accessory) {
    ctx.fillStyle = p.accessory;
    ctx.fillRect(0 * S, torsoY + 2 * S, 2 * S, 3 * S);
  }

  // 3. BRAÇOS & MÃOS
  let armSwing = 0;
  if (!isGrounded) {
    armSwing = -4; // Braços para cima no pulo
  } else {
    // Balanço de corrida
    armSwing = Math.sin((frame / 4) * Math.PI * 2) * 3;
  }

  // Braço de trás
  ctx.fillStyle = p.shirtShadow;
  ctx.fillRect((-7 * S) - (armSwing * S * 0.3), torsoY + (1 * S), 2 * S, 7 * S);
  ctx.fillStyle = p.skin;
  ctx.fillRect((-7 * S) - (armSwing * S * 0.3), torsoY + (8 * S), 2 * S, 2 * S);

  // Braço da frente
  ctx.fillStyle = p.shirt;
  ctx.fillRect((5 * S) + (armSwing * S * 0.3), torsoY + (1 * S), 2 * S, 7 * S);
  ctx.fillStyle = p.skin;
  ctx.fillRect((5 * S) + (armSwing * S * 0.3), torsoY + (8 * S), 2 * S, 2 * S);

  // 4. PERNAS & PÉS
  const legY = torsoY + (9 * S);

  if (isJumping) {
    // Perna esquerda dobrada
    ctx.fillStyle = p.pants;
    ctx.fillRect(-5 * S, legY, 4 * S, 4 * S);
    ctx.fillStyle = p.shoes;
    ctx.fillRect(-6 * S, legY + 3 * S, 5 * S, 3 * S);

    // Perna direita esticada
    ctx.fillStyle = p.pants;
    ctx.fillRect(1 * S, legY, 4 * S, 6 * S);
    ctx.fillStyle = p.shoes;
    ctx.fillRect(1 * S, legY + 5 * S, 5 * S, 3 * S);
  } else {
    // Ciclo de corrida com 4 frames
    const legOffset1 = Math.sin((frame / 4) * Math.PI * 2) * 3;
    const legOffset2 = -legOffset1;

    // Perna de trás
    ctx.fillStyle = p.pantsShadow;
    ctx.fillRect(-5 * S + (legOffset2 * S * 0.5), legY, 4 * S, 6 * S);
    ctx.fillStyle = p.shoes;
    ctx.fillRect(-6 * S + (legOffset2 * S * 0.5), legY + 6 * S, 5 * S, 2 * S);

    // Perna da frente
    ctx.fillStyle = p.pants;
    ctx.fillRect(1 * S + (legOffset1 * S * 0.5), legY, 4 * S, 6 * S);
    ctx.fillStyle = p.shoes;
    ctx.fillRect(1 * S + (legOffset1 * S * 0.5), legY + 6 * S, 5 * S, 2 * S);
  }

  ctx.restore();
}

/**
 * Draws a detailed 16-bit landmark building
 */
export function drawBuilding(
  ctx: CanvasRenderingContext2D,
  x: number,
  groundY: number,
  label: string,
  subLabel: string,
  baseColor: string,
  roofColor: string,
  width: number,
  height: number,
  isDark: boolean
) {
  const S = 2; // Pixel unit
  const bX = Math.floor(x);
  const bY = Math.floor(groundY - height);

  // Sombra suave do prédio
  ctx.fillStyle = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.15)';
  ctx.fillRect(bX - 8, groundY - 2, width + 16, 6);

  // Fachada principal
  ctx.fillStyle = baseColor;
  ctx.fillRect(bX, bY, width, height);

  // Efeito tijolos / textura 16-bit
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
  for (let iy = bY + 12; iy < groundY - 10; iy += 16) {
    for (let ix = bX + 6; ix < bX + width - 6; ix += 24) {
      ctx.fillRect(ix, iy, 12, 1);
    }
  }

  // Telhado / Topo
  ctx.fillStyle = roofColor;
  ctx.fillRect(bX - 4, bY - 6, width + 8, 6);

  // Letreiro Retrô no topo
  ctx.fillStyle = isDark ? '#0F172A' : '#1E293B';
  ctx.fillRect(bX + 8, bY - 28, width - 16, 18);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1;
  ctx.strokeRect(bX + 8, bY - 28, width - 16, 18);

  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(label, bX + (width / 2), bY - 16);

  if (subLabel) {
    ctx.fillStyle = '#94A3B8';
    ctx.font = '8px monospace';
    ctx.fillText(subLabel, bX + (width / 2), bY - 8);
  }

  // Janelas pixeladas acesas
  const windowColor = isDark ? '#FEF08A' : '#E0F2FE';
  const frameColor = isDark ? '#854D0E' : '#38BDF8';

  const rows = Math.floor((height - 50) / 24);
  const cols = Math.floor((width - 24) / 20);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const wx = bX + 16 + (c * 20);
      const wy = bY + 16 + (r * 24);

      ctx.fillStyle = frameColor;
      ctx.fillRect(wx - S, wy - S, 12 + (2 * S), 14 + (2 * S));

      // Algumas janelas apagadas para realismo
      const isLit = (r + c + Math.floor(x / 100)) % 4 !== 0;
      ctx.fillStyle = isLit ? windowColor : (isDark ? '#1E293B' : '#94A3B8');
      ctx.fillRect(wx, wy, 12, 14);

      // Divisória da janela
      ctx.fillStyle = isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.4)';
      ctx.fillRect(wx + 5, wy, 2, 14);
      ctx.fillRect(wx, wy + 6, 12, 2);
    }
  }

  // Porta de entrada
  const doorW = 20;
  const doorH = 26;
  const doorX = bX + (width / 2) - (doorW / 2);
  const doorY = groundY - doorH;

  ctx.fillStyle = isDark ? '#020617' : '#334155';
  ctx.fillRect(doorX, doorY, doorW, doorH);
  ctx.strokeStyle = roofColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(doorX, doorY, doorW, doorH);

  // Maçaneta dourada
  ctx.fillStyle = '#F59E0B';
  ctx.fillRect(doorX + doorW - 5, doorY + (doorH / 2), 2, 3);
}

/**
 * Draws floating collectible Tech Orbs
 */
export function drawTechOrb(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  name: string,
  iconType: string,
  collected: boolean,
  time: number
) {
  if (collected) return;

  const floatY = y + Math.sin(time * 3 + x) * 5;
  const S = 2;

  // Glow halo
  ctx.save();
  ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.beginPath();
  ctx.arc(x, floatY, 14, 0, Math.PI * 2);
  ctx.fill();

  // Borda pixelada
  ctx.fillStyle = '#0284C7';
  ctx.fillRect(x - 9 * S / 2, floatY - 9 * S / 2, 9 * S, 9 * S);
  ctx.fillStyle = '#38BDF8';
  ctx.fillRect(x - 7 * S / 2, floatY - 7 * S / 2, 7 * S, 7 * S);

  // Mini ícone de pixel no centro
  ctx.fillStyle = '#FFFFFF';
  if (iconType === 'python') {
    ctx.fillStyle = '#FACC15';
    ctx.fillRect(x - 2, floatY - 3, 4, 3);
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(x - 2, floatY, 4, 3);
  } else if (iconType === 'mcp') {
    // Raio elétrico
    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(x - 1, floatY - 3, 2, 3);
    ctx.fillRect(x - 2, floatY, 3, 1);
    ctx.fillRect(x - 1, floatY + 1, 2, 3);
  } else if (iconType === 'claude') {
    ctx.fillStyle = '#D97706';
    ctx.fillRect(x - 2, floatY - 2, 5, 5);
  } else {
    // Chip / Core
    ctx.fillStyle = '#10B981';
    ctx.fillRect(x - 2, floatY - 2, 4, 4);
  }

  // Label flutuante abaixo
  ctx.fillStyle = '#E2E8F0';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(name, x, floatY + 16);

  ctx.restore();
}

/**
 * Draws retro parallax trees
 */
export function drawPixelTree(ctx: CanvasRenderingContext2D, x: number, groundY: number, isDark: boolean) {
  // Tronco
  ctx.fillStyle = isDark ? '#3E2723' : '#5D4037';
  ctx.fillRect(x + 6, groundY - 20, 6, 20);

  // Folhagem em camadas pixeladas
  ctx.fillStyle = isDark ? '#14532D' : '#16A34A';
  ctx.fillRect(x, groundY - 45, 18, 25);
  ctx.fillRect(x - 4, groundY - 38, 26, 18);
  ctx.fillStyle = isDark ? '#166534' : '#22C55E';
  ctx.fillRect(x + 2, groundY - 43, 14, 10);
}
