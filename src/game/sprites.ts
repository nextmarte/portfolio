import {
  BuildingInterior,
  EraOutfit,
  FurnitureItem,
  InteriorSkillItem,
  Milestone,
  Obstacle,
  Platform,
  SceneryProp,
  TechOrb,
  TopDownDirection,
} from './types';

// =========================================================================
// 1. PALETAS DE CORES & UTILITÁRIOS 16-BIT
// =========================================================================

export function drawPixel(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number = 2) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), size, size);
}

interface CharacterPalette {
  hair: string;
  hairHighlight: string;
  hairShadow: string;
  skin: string;
  skinHighlight: string;
  skinShadow: string;
  eyes: string;
  shirt: string;
  shirtHighlight: string;
  shirtShadow: string;
  pants: string;
  pantsShadow: string;
  shoes: string;
  shoesSole: string;
  accessory?: string;
  backpack?: string;
  hat?: string;
  outline: string;
}

const PALETTES: Record<EraOutfit, CharacterPalette> = {
  cefet: {
    hair: '#3E2723',
    hairHighlight: '#6D4C41',
    hairShadow: '#1B0000',
    skin: '#F5D0A9',
    skinHighlight: '#FFE0B2',
    skinShadow: '#C68A5E',
    eyes: '#2E7D32',
    shirt: '#CFD8DC',
    shirtHighlight: '#ECEFF1',
    shirtShadow: '#78909C',
    pants: '#37474F',
    pantsShadow: '#1C2833',
    shoes: '#4E342E',
    shoesSole: '#ECEFF1',
    backpack: '#B71C1C',
    outline: '#1A110B',
  },
  chemtech: {
    hair: '#3E2723',
    hairHighlight: '#6D4C41',
    hairShadow: '#1B0000',
    skin: '#F5D0A9',
    skinHighlight: '#FFE0B2',
    skinShadow: '#C68A5E',
    eyes: '#2E7D32',
    shirt: '#0288D1',
    shirtHighlight: '#38BDF8',
    shirtShadow: '#01579B',
    pants: '#263238',
    pantsShadow: '#10171A',
    shoes: '#212121',
    shoesSole: '#F59E0B',
    accessory: '#FBBF24',
    hat: '#F59E0B',
    outline: '#0B1317',
  },
  uff: {
    hair: '#3E2723',
    hairHighlight: '#6D4C41',
    hairShadow: '#1B0000',
    skin: '#F5D0A9',
    skinHighlight: '#FFE0B2',
    skinShadow: '#C68A5E',
    eyes: '#2E7D32',
    shirt: '#1565C0',
    shirtHighlight: '#42A5F5',
    shirtShadow: '#0D47A1',
    pants: '#455A64',
    pantsShadow: '#1E293B',
    shoes: '#5D4037',
    shoesSole: '#A1887F',
    backpack: '#37474F',
    outline: '#091A2E',
  },
  cid: {
    hair: '#3E2723',
    hairHighlight: '#6D4C41',
    hairShadow: '#1B0000',
    skin: '#F5D0A9',
    skinHighlight: '#FFE0B2',
    skinShadow: '#C68A5E',
    eyes: '#2E7D32',
    shirt: '#311B92',
    shirtHighlight: '#7C3AED',
    shirtShadow: '#1E1B4B',
    pants: '#0F172A',
    pantsShadow: '#020617',
    shoes: '#334155',
    shoesSole: '#10B981',
    accessory: '#10B981',
    outline: '#0A051D',
  },
  baxijen: {
    hair: '#3E2723',
    hairHighlight: '#6D4C41',
    hairShadow: '#1B0000',
    skin: '#F5D0A9',
    skinHighlight: '#FFE0B2',
    skinShadow: '#C68A5E',
    eyes: '#2E7D32',
    shirt: '#090D16',
    shirtHighlight: '#1E293B',
    shirtShadow: '#020617',
    pants: '#0F172A',
    pantsShadow: '#020617',
    shoes: '#0EA5E9',
    shoesSole: '#38BDF8',
    accessory: '#00F0FF',
    outline: '#020617',
  },
};

// =========================================================================
// 2. PERSONAGEM RUNNER (SPRITE COM CONTORNO RETRÔ E ANIMAÇÃO ARTICULADA)
// =========================================================================

export function drawCharacter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  isJumping: boolean,
  isGrounded: boolean,
  facing: 'right' | 'left',
  outfit: EraOutfit,
  stumbleTimer: number,
  invulnerableTimer: number,
  spriteImage?: HTMLImageElement | null
) {
  if (invulnerableTimer > 0 && Math.floor(invulnerableTimer * 20) % 2 === 0) {
    return;
  }

  const S = 2; // Pixel scale

  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  // Sombra suave sob os pés na calçada
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  const shadowW = isGrounded ? 18 : 12;
  const shadowOff = isGrounded ? 0 : 5;
  ctx.beginPath();
  ctx.ellipse(0, 2 + shadowOff, shadowW, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  if (facing === 'left') {
    ctx.scale(-1, 1);
  }

  const isStumbling = stumbleTimer > 0;
  if (isStumbling) {
    ctx.rotate(-0.2);
  }

  // Se o sprite de alta definição pixel-art estiver carregado, desenha-o com prioridade
  if (spriteImage && spriteImage.complete && spriteImage.naturalWidth > 0) {
    ctx.imageSmoothingEnabled = false;
    const targetH = 52;
    const targetW = targetH * (spriteImage.naturalWidth / spriteImage.naturalHeight);
    const bounceY = !isGrounded ? -6 : (frame % 2 === 1 ? -1.5 : 0);
    ctx.drawImage(spriteImage, Math.floor(-targetW / 2), Math.floor(-targetH + bounceY), Math.ceil(targetW), targetH);
    ctx.restore();
    return;
  }

  const p = PALETTES[outfit] || PALETTES.baxijen;
  const bounceY = !isGrounded ? -3 : (frame % 2 === 1 ? -1 : 0);

  // Contorno escuro corporal (Dark Outline Retro)
  ctx.fillStyle = p.outline;
  ctx.fillRect(-7 * S, (-32 + bounceY) * S, 14 * S, 32 * S);

  // 1. Mochila (se houver)
  if (p.backpack) {
    ctx.fillStyle = p.backpack;
    ctx.fillRect(-9 * S, (-21 + bounceY) * S, 4 * S, 10 * S);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(-9 * S, (-13 + bounceY) * S, 4 * S, 2 * S);
  }

  // 2. Cabelo com mechas e destaque
  ctx.fillStyle = isStumbling ? '#EF4444' : p.hair;
  ctx.fillRect(-6 * S, (-31 + bounceY) * S, 12 * S, 7 * S);
  ctx.fillRect(-7 * S, (-30 + bounceY) * S, 14 * S, 5 * S);

  ctx.fillStyle = p.hairHighlight;
  ctx.fillRect(-4 * S, (-32 + bounceY) * S, 7 * S, 1.5 * S);
  ctx.fillRect(-5 * S, (-30 + bounceY) * S, 4 * S, 1.5 * S);

  ctx.fillStyle = p.hairShadow;
  ctx.fillRect(-6 * S, (-25 + bounceY) * S, 12 * S, 1.5 * S);

  // Capacete industrial (Chemtech)
  if (p.hat) {
    ctx.fillStyle = p.hat;
    ctx.fillRect(-7 * S, (-34 + bounceY) * S, 14 * S, 5 * S);
    ctx.fillRect(-8 * S, (-30 + bounceY) * S, 16 * S, 2 * S);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-3 * S, (-33 + bounceY) * S, 6 * S, 2 * S);
  }

  // 3. Rosto com Shading
  ctx.fillStyle = p.skin;
  ctx.fillRect(-6 * S, (-25 + bounceY) * S, 12 * S, 9 * S);
  ctx.fillStyle = p.skinHighlight;
  ctx.fillRect(-5 * S, (-24 + bounceY) * S, 10 * S, 2 * S);
  ctx.fillStyle = p.skinShadow;
  ctx.fillRect(-6 * S, (-18 + bounceY) * S, 12 * S, 2 * S); // Sombra do queixo

  // Olhos verdes com brilho expressivo
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(-1 * S, (-23 + bounceY) * S, 3 * S, 3.5 * S);
  ctx.fillRect(3 * S, (-23 + bounceY) * S, 3 * S, 3.5 * S);

  ctx.fillStyle = p.eyes;
  ctx.fillRect(0 * S, (-22 + bounceY) * S, 2 * S, 2.5 * S);
  ctx.fillRect(4 * S, (-22 + bounceY) * S, 2 * S, 2.5 * S);

  ctx.fillStyle = '#BBF7D0';
  ctx.fillRect(0 * S, (-23 + bounceY) * S, 1 * S, 1 * S);
  ctx.fillRect(4 * S, (-23 + bounceY) * S, 1 * S, 1 * S);

  // Boca / Expressão
  if (isStumbling) {
    ctx.fillStyle = '#991B1B';
    ctx.fillRect(1 * S, (-19 + bounceY) * S, 3 * S, 2 * S);
  } else {
    ctx.fillStyle = p.skinShadow;
    ctx.fillRect(0 * S, (-18 + bounceY) * S, 4 * S, 1 * S);
    ctx.fillRect(3 * S, (-19 + bounceY) * S, 1 * S, 1 * S);
  }

  // 4. Tronco / Camisa com Dobras
  const torsoY = (-17 + bounceY) * S;
  ctx.fillStyle = p.shirt;
  ctx.fillRect(-5 * S, torsoY, 10 * S, 11 * S);

  ctx.fillStyle = p.shirtHighlight;
  ctx.fillRect(-5 * S, torsoY, 2 * S, 10 * S);
  ctx.fillStyle = p.shirtShadow;
  ctx.fillRect(3 * S, torsoY, 2 * S, 11 * S);
  ctx.fillRect(-5 * S, torsoY + 9 * S, 10 * S, 2 * S);

  // Acessório / Emblema neural
  if (p.accessory) {
    ctx.fillStyle = p.accessory;
    ctx.fillRect(0 * S, torsoY + 3 * S, 3 * S, 3 * S);
    if (outfit === 'baxijen') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(1 * S, torsoY + 4 * S, 1 * S, 1 * S);
    }
  }

  // 5. Braços com Articulação
  let armSwing = 0;
  if (!isGrounded) {
    armSwing = -4;
  } else if (isStumbling) {
    armSwing = 5;
  } else {
    armSwing = Math.sin((frame / 4) * Math.PI * 2) * 4;
  }

  // Braço traseiro
  ctx.fillStyle = p.shirtShadow;
  ctx.fillRect((-7 * S) - (armSwing * S * 0.3), torsoY + (1 * S), 2 * S, 8 * S);
  ctx.fillStyle = p.skin;
  ctx.fillRect((-7 * S) - (armSwing * S * 0.3), torsoY + (9 * S), 2 * S, 2 * S);

  // Braço dianteiro
  ctx.fillStyle = p.shirt;
  ctx.fillRect((5 * S) + (armSwing * S * 0.3), torsoY + (1 * S), 2 * S, 8 * S);
  ctx.fillStyle = p.skin;
  ctx.fillRect((5 * S) + (armSwing * S * 0.3), torsoY + (9 * S), 2 * S, 2 * S);

  // 6. Pernas & Tênis com Solado Reforçado
  const legY = torsoY + (11 * S);

  if (isJumping) {
    ctx.fillStyle = p.pants;
    ctx.fillRect(-5 * S, legY, 4 * S, 5 * S);
    ctx.fillStyle = p.shoes;
    ctx.fillRect(-6 * S, legY + 4 * S, 6 * S, 3.5 * S);
    ctx.fillStyle = p.shoesSole;
    ctx.fillRect(-6 * S, legY + 7.5 * S, 6 * S, 1.5 * S);

    ctx.fillStyle = p.pants;
    ctx.fillRect(1 * S, legY, 4 * S, 7 * S);
    ctx.fillStyle = p.shoes;
    ctx.fillRect(1 * S, legY + 6 * S, 6 * S, 3.5 * S);
    ctx.fillStyle = p.shoesSole;
    ctx.fillRect(1 * S, legY + 9.5 * S, 6 * S, 1.5 * S);
  } else {
    const legOffset1 = Math.sin((frame / 4) * Math.PI * 2) * 4;
    const legOffset2 = -legOffset1;

    // Perna de trás
    ctx.fillStyle = p.pantsShadow;
    ctx.fillRect(-5 * S + (legOffset2 * S * 0.6), legY, 4 * S, 7 * S);
    ctx.fillStyle = p.shoes;
    ctx.fillRect(-6 * S + (legOffset2 * S * 0.6), legY + 7 * S, 6 * S, 3 * S);
    ctx.fillStyle = p.shoesSole;
    ctx.fillRect(-6 * S + (legOffset2 * S * 0.6), legY + 9.5 * S, 6 * S, 1.5 * S);

    // Perna da frente
    ctx.fillStyle = p.pants;
    ctx.fillRect(1 * S + (legOffset1 * S * 0.6), legY, 4 * S, 7 * S);
    ctx.fillStyle = p.shoes;
    ctx.fillRect(1 * S + (legOffset1 * S * 0.6), legY + 7 * S, 6 * S, 3 * S);
    ctx.fillStyle = p.shoesSole;
    ctx.fillRect(1 * S + (legOffset1 * S * 0.6), legY + 9.5 * S, 6 * S, 1.5 * S);
  }

  ctx.restore();
}

// =========================================================================
// 3. JANELA RETRÔ COM REFLEXO SOLAR DIAGONAL DUPLO (45°)
// =========================================================================

function drawRetroWindow(
  ctx: CanvasRenderingContext2D,
  wx: number,
  wy: number,
  w: number,
  h: number,
  isLit: boolean,
  isDark: boolean
) {
  // Moldura chanfrada de janela
  ctx.fillStyle = isDark ? '#0F172A' : '#475569';
  ctx.fillRect(wx - 2, wy - 2, w + 4, h + 4);

  // Vidro base
  if (isLit) {
    ctx.fillStyle = isDark ? '#FDE047' : '#E0F2FE';
  } else {
    ctx.fillStyle = isDark ? '#1E293B' : '#64748B';
  }
  ctx.fillRect(wx, wy, w, h);

  // Dois reflexos clássicos em diagonal de 45°
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.beginPath();
  ctx.moveTo(wx + 2, wy);
  ctx.lineTo(wx + 6, wy);
  ctx.lineTo(wx, wy + 6);
  ctx.lineTo(wx, wy + 2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.beginPath();
  ctx.moveTo(wx + 8, wy);
  ctx.lineTo(wx + 13, wy);
  ctx.lineTo(wx, wy + 13);
  ctx.lineTo(wx, wy + 8);
  ctx.closePath();
  ctx.fill();

  // Cruzeta divisória da janela
  ctx.fillStyle = isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.35)';
  ctx.fillRect(wx + Math.floor(w / 2) - 1, wy, 2, h);
  ctx.fillRect(wx, wy + Math.floor(h / 2) - 1, w, 2);
}

// =========================================================================
// 4. EDIFÍCIOS HISTÓRICOS E MARCOS COM ARQUITETURA AUTORAL 16-BIT
// =========================================================================

export function drawDetailedBuilding(
  ctx: CanvasRenderingContext2D,
  m: Milestone,
  groundY: number,
  isDark: boolean,
  time: number,
  spriteImage?: HTMLImageElement | null
) {
  const bX = Math.floor(m.x);
  const bY = Math.floor(groundY - m.height);
  const W = m.width;
  const H = m.height;

  ctx.save();

  // 1. Sombra volumétrica projetada na calçada
  ctx.fillStyle = isDark ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.2)';
  ctx.fillRect(bX - 16, groundY - 4, W + 32, 9);

  // Se o sprite pixel-art de alta fidelidade estiver carregado, desenha-o com prioridade
  if (spriteImage && spriteImage.complete && spriteImage.naturalWidth > 0) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(spriteImage, bX, bY, W, H);

    // Letreiro iluminado com neon no topo
    const signH = 20;
    const signW = Math.min(220, W - 20);
    const signX = bX + (W / 2) - (signW / 2);
    const signY = bY - 26;

    ctx.fillStyle = isDark ? 'rgba(2, 6, 23, 0.95)' : 'rgba(15, 23, 42, 0.95)';
    ctx.fillRect(signX, signY, signW, signH);
    ctx.strokeStyle = m.neonColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(signX, signY, signW, signH);

    ctx.fillStyle = m.neonColor;
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${m.year} • ${m.label}`, bX + (W / 2), signY + 13);

    // Portal / Porta de entrada com beacon luminoso pulsante
    const doorW = 32;
    const doorH = 38;
    const doorX = bX + (W / 2) - (doorW / 2);
    const doorY = groundY - doorH;

    const pulse = Math.sin(time * 5) * 0.2 + 0.8;
    ctx.fillStyle = m.neonColor;
    ctx.globalAlpha = 0.28 * pulse;
    ctx.fillRect(doorX, doorY, doorW, doorH);
    ctx.globalAlpha = 1.0;

    ctx.strokeStyle = m.neonColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(doorX, doorY, doorW, doorH);

    // Seta indicativa sobre a porta
    const arrowBounce = Math.sin(time * 6) * 3;
    ctx.fillStyle = '#FEF08A';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('▼', bX + (W / 2), doorY - 6 + arrowBounce);

    ctx.restore();
    return;
  }

  // 2. Fachada principal com Chanfro 3D (Borda iluminada à esquerda e sombra à direita)
  ctx.fillStyle = m.color;
  ctx.fillRect(bX, bY, W, H);

  // Highlight vertical esquerdo
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.fillRect(bX, bY, 4, H);

  // Sombra vertical direita
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(bX + W - 6, bY, 6, H);

  // =======================================================================
  // DETALHES ESPECÍFICOS DE CADA ERA:
  // =======================================================================

  if (m.buildingStyle === 'cefet') {
    // ── CEFET/RJ: Tijolos artesanais, chaminé e torre de relógio ──
    // Textura de tijolos em 3 tonalidades mescladas (dithering)
    for (let iy = bY + 12; iy < groundY - 14; iy += 10) {
      const rowOffset = ((iy - bY) / 10) % 2 === 0 ? 0 : 8;
      for (let ix = bX + 6 + rowOffset; ix < bX + W - 10; ix += 18) {
        ctx.fillStyle = ((ix + iy) % 4 === 0) ? '#5D2E0A' : '#934818';
        ctx.fillRect(ix, iy, 14, 6);
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.fillRect(ix + 13, iy, 1, 6); // Rejunte
      }
    }

    // Chaminé com tijolos refratários
    ctx.fillStyle = '#451A03';
    ctx.fillRect(bX + W - 32, bY - 45, 20, 45);
    ctx.fillStyle = '#78350F';
    ctx.fillRect(bX + W - 34, bY - 49, 24, 5);

    // Fumaça em espiral translúcida
    for (let s = 0; s < 3; s++) {
      const smokeOffset = ((time * 18) + (s * 15)) % 45;
      const smokeAlpha = Math.max(0, 0.4 - (smokeOffset / 50));
      ctx.fillStyle = `rgba(220, 220, 220, ${smokeAlpha})`;
      ctx.beginPath();
      ctx.arc(bX + W - 22 + Math.sin(smokeOffset * 0.15) * 6, bY - 55 - smokeOffset, 6 + (smokeOffset * 0.2), 0, Math.PI * 2);
      ctx.fill();
    }

    // Torre do Relógio no Topo
    const towerW = 46;
    const towerH = 40;
    const towerX = bX + (W / 2) - (towerW / 2);
    const towerY = bY - towerH;

    ctx.fillStyle = '#5D2E0A';
    ctx.fillRect(towerX, towerY, towerW, towerH);
    ctx.fillStyle = '#78350F';
    ctx.fillRect(towerX - 4, towerY - 6, towerW + 8, 6);

    // Relógio analógico funcional em pixel art
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(towerX + (towerW / 2), towerY + 20, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#451A03';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Ponteiros do relógio
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(towerX + (towerW / 2) - 1, towerY + 13, 2, 8); // Ponteiro minutos
    ctx.fillRect(towerX + (towerW / 2) - 1, towerY + 19, 6, 2); // Ponteiro horas

  } else if (m.buildingStyle === 'chemtech') {
    // ── CHEMTECH / SIEMENS: Vidro corporativo, ar-condicionado & treliça ──
    // Painéis de vidro azul espelhado com gradiente
    ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.fillRect(bX + 8, bY + 12, W - 16, H - 28);

    // Vigas horizontais de aço escovado com rebites
    for (let vy = bY + 45; vy < groundY - 20; vy += 50) {
      ctx.fillStyle = '#334155';
      ctx.fillRect(bX + 4, vy, W - 8, 6);
      ctx.fillStyle = '#64748B';
      for (let rx = bX + 12; rx < bX + W - 12; rx += 16) {
        ctx.fillRect(rx, vy + 2, 2, 2);
      }
    }

    // Unidades condensadoras de Ar Condicionado no teto com hélice girando
    ctx.fillStyle = '#475569';
    ctx.fillRect(bX + 20, bY - 22, 34, 22);
    ctx.strokeStyle = '#64748B';
    ctx.strokeRect(bX + 20, bY - 22, 34, 22);

    // Hélice girando em tempo real
    const fanAngle = time * 20;
    ctx.save();
    ctx.translate(bX + 37, bY - 11);
    ctx.rotate(fanAngle);
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(-6, -1.5, 12, 3);
    ctx.fillRect(-1.5, -6, 3, 12);
    ctx.restore();

    // Antena de telecomunicações de treliça metálica
    const antX = bX + W - 40;
    ctx.fillStyle = '#475569';
    ctx.fillRect(antX + 4, bY - 55, 3, 55);
    ctx.fillRect(antX, bY - 40, 11, 2);
    ctx.fillRect(antX - 2, bY - 25, 15, 2);

    // Luz de navegação de aviação piscante
    const blink = Math.sin(time * 8) > 0;
    ctx.fillStyle = blink ? '#EF4444' : '#7F1D1D';
    ctx.beginPath();
    ctx.arc(antX + 5.5, bY - 58, 4, 0, Math.PI * 2);
    ctx.fill();

  } else if (m.buildingStyle === 'uff') {
    // ── UFF: Campus Neoclássico com 4 Colunas Caneladas & Frontão ──
    // Frontão triangular monumental
    ctx.fillStyle = '#1E3A8A';
    ctx.beginPath();
    ctx.moveTo(bX + (W / 2), bY - 36);
    ctx.lineTo(bX + W + 6, bY - 6);
    ctx.lineTo(bX - 6, bY - 6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#60A5FA';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Emblema do livro aberto no tímpano do frontão
    ctx.fillStyle = '#FEF08A';
    ctx.fillRect(bX + (W / 2) - 8, bY - 22, 16, 10);
    ctx.fillStyle = '#1E3A8A';
    ctx.fillRect(bX + (W / 2) - 1, bY - 22, 2, 10);

    // 4 Colunas clássicas caneladas
    for (let c = 0; c < 4; c++) {
      const colX = bX + 22 + (c * ((W - 56) / 3));
      // Base
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(colX - 3, groundY - 14, 16, 8);
      // Fuste com caneluras verticais
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(colX, bY + 12, 10, H - 26);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(colX + 7, bY + 12, 3, H - 26); // Sombra da coluna
      // Capitel
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(colX - 4, bY + 6, 18, 6);
    }

    // Escadaria de mármore com 3 degraus na entrada
    for (let st = 0; st < 3; st++) {
      ctx.fillStyle = st % 2 === 0 ? '#E2E8F0' : '#CBD5E1';
      ctx.fillRect(bX + 35 - (st * 4), groundY - (st * 4), W - 70 + (st * 8), 4);
    }

  } else if (m.buildingStyle === 'cid') {
    // ── CID-UFF: Painéis solares, sensores IoT e display de ondas Laguna ──
    // Painel solar inclinado
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(bX + 16, bY - 20, W - 32, 15);
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1;
    ctx.strokeRect(bX + 16, bY - 20, W - 32, 15);

    // Células solares brilhantes
    ctx.fillStyle = '#1E3A8A';
    for (let cx = bX + 22; cx < bX + W - 22; cx += 16) {
      ctx.fillRect(cx, bY - 17, 12, 10);
    }

    // Display LED oscilante do Projeto Laguna
    const dispW = W - 40;
    const dispH = 22;
    const dispX = bX + 20;
    const dispY = groundY - 60;

    ctx.fillStyle = '#022C22';
    ctx.fillRect(dispX, dispY, dispW, dispH);
    ctx.strokeStyle = '#34D399';
    ctx.strokeRect(dispX, dispY, dispW, dispH);

    // Onda hidrológica em tempo real
    ctx.strokeStyle = '#34D399';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let px = 0; px < dispW; px += 3) {
      const waveY = dispY + 11 + Math.sin((px * 0.15) + (time * 5)) * 6;
      if (px === 0) ctx.moveTo(dispX + px, waveY);
      else ctx.lineTo(dispX + px, waveY);
    }
    ctx.stroke();

    ctx.fillStyle = '#34D399';
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('LAGUNA IOT TELEMETRY', dispX + 4, dispY + 7);

  } else if (m.buildingStyle === 'coppead') {
    // ── COPPEAD / UFRJ: Mansão Acadêmica, Cúpula & Agulha Dourada ──
    // Grande cúpula de cobre oxidado nobre
    const domeR = 34;
    const domeCX = bX + (W / 2);
    const domeCY = bY;

    ctx.fillStyle = '#10B981'; // Cobre oxidado verde
    ctx.beginPath();
    ctx.arc(domeCX, domeCY, domeR, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Agulha dourada no ápice
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(domeCX - 2, bY - domeR - 22, 4, 22);
    ctx.beginPath();
    ctx.arc(domeCX, bY - domeR - 24, 4, 0, Math.PI * 2);
    ctx.fill();

    // Faixas de pedra calcária nas paredes
    ctx.fillStyle = 'rgba(254, 243, 199, 0.15)';
    for (let py = bY + 20; py < groundY - 20; py += 32) {
      ctx.fillRect(bX + 10, py, W - 20, 4);
    }

  } else if (m.buildingStyle === 'baxijen') {
    // ── BAXIJEN: Cyberpunk QG, Elevador Panorâmico & Neon AI Core ──
    // Linhas de circuito neon verticais que pulsam
    const pulse = 0.5 + Math.sin(time * 5) * 0.5;
    ctx.fillStyle = `rgba(0, 240, 255, ${0.4 + pulse * 0.5})`;
    ctx.fillRect(bX + 3, bY + 10, 3, H - 20);
    ctx.fillRect(bX + W - 6, bY + 10, 3, H - 20);

    // Elevador panorâmico de vidro externo que se move em tempo real
    const elevW = 16;
    const elevH = 26;
    const elevX = bX + W - 24;
    const elevTravel = H - 70;
    const elevY = bY + 20 + ((Math.sin(time * 1.5) + 1) / 2) * elevTravel;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(elevX - 2, bY + 15, elevW + 4, H - 30);
    ctx.strokeStyle = '#38BDF8';
    ctx.strokeRect(elevX, elevY, elevW, elevH);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.fillRect(elevX + 2, elevY + 2, elevW - 4, elevH - 4);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(elevX + 4, elevY + 6, 8, 4); // Silhueta da cabine

    // Núcleo de IA Holográfico no Topo
    const coreY = bY - 36 + Math.sin(time * 3) * 5;
    ctx.save();
    ctx.translate(bX + (W / 2), coreY);
    ctx.rotate(time * 2);
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 2;
    ctx.strokeRect(-12, -12, 24, 24);
    ctx.rotate(Math.PI / 4);
    ctx.strokeStyle = '#38BDF8';
    ctx.strokeRect(-10, -10, 20, 20);
    ctx.restore();

    ctx.fillStyle = '#00F0FF';
    ctx.beginPath();
    ctx.arc(bX + (W / 2), coreY, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Telhado / Beiral
  ctx.fillStyle = m.roofColor;
  ctx.fillRect(bX - 8, bY - 8, W + 16, 9);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(bX - 8, bY - 8, W + 16, 2);

  // 4. Letreiro Retrô Iluminado com Neon
  const signH = 24;
  const signW = W - 24;
  const signX = bX + 12;
  const signY = bY - 34;

  ctx.fillStyle = isDark ? '#020617' : '#0F172A';
  ctx.fillRect(signX, signY, signW, signH);
  ctx.strokeStyle = m.neonColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(signX, signY, signW, signH);

  // Texto neon iluminado
  ctx.fillStyle = m.neonColor;
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(m.label, bX + (W / 2), signY + 13);

  if (m.subLabel) {
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '8px monospace';
    ctx.fillText(m.subLabel, bX + (W / 2), signY + 21);
  }

  // 5. Janelas Retrô com Shading e Reflexos a 45°
  const winRows = Math.floor((H - 65) / 26);
  const winCols = Math.floor((W - 28) / 24);

  for (let r = 0; r < winRows; r++) {
    for (let c = 0; c < winCols; c++) {
      const wx = bX + 18 + (c * 24);
      const wy = bY + 20 + (r * 26);
      const isLit = (r + c + Math.floor(m.x / 40)) % 3 !== 0;
      drawRetroWindow(ctx, wx, wy, 14, 16, isLit, isDark);
    }
  }

  // 6. Porta de Entrada Clássica
  const doorW = 26;
  const doorH = 34;
  const doorX = bX + (W / 2) - (doorW / 2);
  const doorY = groundY - doorH;

  ctx.fillStyle = isDark ? '#020617' : '#1E293B';
  ctx.fillRect(doorX, doorY, doorW, doorH);
  ctx.strokeStyle = m.accentColor;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(doorX, doorY, doorW, doorH);

  // Tapete de entrada
  ctx.fillStyle = m.accentColor;
  ctx.fillRect(doorX - 6, groundY - 2, doorW + 12, 3);

  // Luminária sobre a porta
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.arc(doorX + (doorW / 2), doorY - 4, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// =========================================================================
// 5. CHÃO ARTÍSTICO (GRAMA CORTADA, CALÇADA PORTUGUESA & ASFALTO)
// =========================================================================

export function drawArtisticGround(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  groundY: number,
  cameraX: number,
  isDark: boolean
) {
  ctx.save();

  // 1. GRAMA COM TUFOS RECORTADOS INDIVIDUALMENTE
  const grassColors = isDark
    ? ['#064E3B', '#047857', '#059669', '#10B981']
    : ['#14532D', '#16A34A', '#22C55E', '#4ADE80'];

  // Faixa de grama base
  ctx.fillStyle = grassColors[1];
  ctx.fillRect(0, groundY - 2, width, 5);

  // Tufos de grama recortados para cima pixel a pixel
  for (let gx = 0; gx < width + 10; gx += 8) {
    const worldGx = gx + Math.floor(cameraX);
    const tuftH = 3 + ((worldGx % 5));
    const gColor = grassColors[(worldGx % grassColors.length)];

    ctx.fillStyle = gColor;
    ctx.fillRect(gx, groundY - tuftH, 2, tuftH);
    ctx.fillRect(gx + 2, groundY - (tuftH - 1), 2, tuftH - 1);

    // Flores ocasionais
    if (worldGx % 47 === 0) {
      ctx.fillStyle = '#F43F5E';
      ctx.fillRect(gx - 1, groundY - tuftH - 3, 3, 3);
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(gx, groundY - tuftH - 2, 1, 1);
    }
  }

  // 2. CALÇADA DE PEDRAS PORTUGUESAS (PADRÃO DE ONDAS CARIOCA / FLUMINENSE)
  const sidewalkY = groundY + 3;
  const sidewalkH = 14;

  ctx.fillStyle = isDark ? '#1E293B' : '#E2E8F0';
  ctx.fillRect(0, sidewalkY, width, sidewalkH);

  // Mosaico de pedras pretas e brancas em ondas
  const wavePatternColor = isDark ? '#0F172A' : '#94A3B8';
  ctx.fillStyle = wavePatternColor;
  for (let px = 0; px < width + 24; px += 12) {
    const worldPx = px + (Math.floor(cameraX) % 24);
    const waveOffset = Math.sin(worldPx * 0.25) * 3;
    ctx.fillRect(px, sidewalkY + 4 + waveOffset, 4, 3);
    ctx.fillRect(px + 6, sidewalkY + 8 - waveOffset, 4, 3);
  }

  // 3. GUIA DO MEIO-FIO (CONCRETO CHANFRADO COM LINHA DE SOMBRA)
  const curbY = sidewalkY + sidewalkH;
  ctx.fillStyle = isDark ? '#475569' : '#CBD5E1';
  ctx.fillRect(0, curbY, width, 3);
  ctx.fillStyle = isDark ? '#020617' : '#64748B';
  ctx.fillRect(0, curbY + 3, width, 2); // Sombra do meio-fio

  // Bueiros de ferro fundido a cada 400px
  for (let bx = 0; bx < width + 400; bx += 400) {
    const drainX = (bx - (Math.floor(cameraX) % 400));
    if (drainX >= -40 && drainX <= width + 40) {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(drainX, curbY, 26, 4);
      ctx.fillStyle = '#334155';
      for (let sl = drainX + 3; sl < drainX + 23; sl += 4) {
        ctx.fillRect(sl, curbY + 1, 2, 3);
      }
    }
  }

  // 4. ASFALTO DA RUA COM TEXTURA DE ALCATRÃO
  const roadY = curbY + 5;
  const roadH = height - roadY;
  ctx.fillStyle = isDark ? '#0F172A' : '#334155';
  ctx.fillRect(0, roadY, width, roadH);

  // Faixa amarela tracejada de trânsito
  ctx.fillStyle = '#F59E0B';
  for (let fx = 0; fx < width + 60; fx += 50) {
    const stripeX = fx - (Math.floor(cameraX) % 50);
    ctx.fillRect(stripeX, roadY + 8, 28, 3);
  }

  ctx.restore();
}

// =========================================================================
// 6. POSTES COM FIAÇÃO ELÉTRICA & CONES DE LUZ VOLUMÉTRICA REALISTA
// =========================================================================

export function drawSceneryProps(
  ctx: CanvasRenderingContext2D,
  prop: SceneryProp,
  groundY: number,
  isDark: boolean
) {
  const pX = Math.floor(prop.x);
  ctx.save();

  if (prop.type === 'lamp_classic' || prop.type === 'lamp_cyber') {
    const lampH = 75;
    const lampY = groundY - lampH;
    const isCyber = prop.type === 'lamp_cyber';

    // Poste de ferro forjado / fibra tech
    ctx.fillStyle = isCyber ? '#090D16' : '#1E293B';
    ctx.fillRect(pX + 3, lampY, 5, lampH);
    ctx.fillStyle = isCyber ? '#00F0FF' : '#475569';
    ctx.fillRect(pX - 2, lampY, 15, 4);
    ctx.fillRect(pX + 1, lampY + 4, 9, 3);

    // Lâmpada brilhante
    const bulbColor = isCyber ? '#00F0FF' : '#FEF08A';
    ctx.fillStyle = bulbColor;
    ctx.fillRect(pX + 2, lampY + 7, 7, 7);

    // Cone de Luz Volumétrica Realista (com Screen Blend Mode no Escuro)
    if (isDark) {
      const grad = ctx.createRadialGradient(
        pX + 5, lampY + 10, 4,
        pX + 5, groundY, 80
      );
      grad.addColorStop(0, isCyber ? 'rgba(0, 240, 255, 0.45)' : 'rgba(254, 240, 138, 0.45)');
      grad.addColorStop(0.5, isCyber ? 'rgba(0, 240, 255, 0.15)' : 'rgba(254, 240, 138, 0.15)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(pX + 5, lampY + 10);
      ctx.lineTo(pX - 55, groundY);
      ctx.lineTo(pX + 65, groundY);
      ctx.closePath();
      ctx.fill();

      // Poça de luz dourada/azul no asfalto
      ctx.beginPath();
      ctx.ellipse(pX + 5, groundY, 55, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (prop.type === 'bench') {
    // Banco de praça com réguas de madeira e pés de ferro
    ctx.fillStyle = '#78350F';
    ctx.fillRect(pX, groundY - 14, 30, 4);
    ctx.fillRect(pX + 2, groundY - 23, 26, 4);
    ctx.fillRect(pX + 2, groundY - 18, 26, 2);

    ctx.fillStyle = '#0F172A';
    ctx.fillRect(pX + 4, groundY - 14, 3, 14);
    ctx.fillRect(pX + 23, groundY - 14, 3, 14);
  } else if (prop.type === 'bush_flowers') {
    // Arbusto frondoso com florzinhas
    ctx.fillStyle = isDark ? '#064E3B' : '#15803D';
    ctx.beginPath();
    ctx.arc(pX + 10, groundY - 10, 12, 0, Math.PI * 2);
    ctx.arc(pX + 22, groundY - 14, 15, 0, Math.PI * 2);
    ctx.arc(pX + 32, groundY - 10, 11, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FB7185';
    ctx.fillRect(pX + 8, groundY - 15, 3, 3);
    ctx.fillRect(pX + 24, groundY - 18, 3, 3);
    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(pX + 16, groundY - 12, 3, 3);
  } else if (prop.type === 'hydrant') {
    // Hidrante com relevo e parafusos
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(pX, groundY - 18, 12, 18);
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(pX - 3, groundY - 14, 18, 4);
    ctx.fillStyle = '#991B1B';
    ctx.fillRect(pX + 3, groundY - 21, 6, 4);
  }

  ctx.restore();
}

// =========================================================================
// 7. ÁRVORES ORGÂNICAS & FLORA BRASILEIRA (IPÊ AMARELO & QUARESMEIRA)
// =========================================================================

export function drawPixelTree(
  ctx: CanvasRenderingContext2D,
  x: number,
  groundY: number,
  isDark: boolean,
  variant: number = 0
) {
  const pX = Math.floor(x);
  ctx.save();

  // Tronco com casca e galhos bifurcados
  ctx.fillStyle = isDark ? '#271206' : '#451A03';
  ctx.fillRect(pX + 9, groundY - 32, 8, 32);
  ctx.fillRect(pX + 5, groundY - 22, 5, 4);
  ctx.fillRect(pX + 16, groundY - 26, 6, 4);

  if (variant % 3 === 0) {
    // Árvore frondosa clássica verde
    const foliageDark = isDark ? '#064E3B' : '#15803D';
    const foliageMid = isDark ? '#047857' : '#16A34A';
    const foliageLight = isDark ? '#059669' : '#4ADE80';

    ctx.fillStyle = foliageDark;
    ctx.beginPath();
    ctx.arc(pX + 13, groundY - 52, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = foliageMid;
    ctx.beginPath();
    ctx.arc(pX + 11, groundY - 56, 19, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = foliageLight;
    ctx.beginPath();
    ctx.arc(pX + 8, groundY - 62, 11, 0, Math.PI * 2);
    ctx.fill();
  } else if (variant % 3 === 1) {
    // Ipê Amarelo (árvore clássica da paisagem da UFF / Rio)
    ctx.fillStyle = '#D97706';
    ctx.beginPath();
    ctx.arc(pX + 13, groundY - 54, 25, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(pX + 11, groundY - 58, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FDE047';
    ctx.beginPath();
    ctx.arc(pX + 8, groundY - 64, 12, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Quaresmeira Roxa / Florada Fluminense
    ctx.fillStyle = '#6B21A8';
    ctx.beginPath();
    ctx.arc(pX + 13, groundY - 52, 23, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#9333EA';
    ctx.beginPath();
    ctx.arc(pX + 10, groundY - 56, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#C084FC';
    ctx.beginPath();
    ctx.arc(pX + 7, groundY - 62, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// =========================================================================
// 8. OBSTÁCULOS & PLATAFORMAS RETRÔ
// =========================================================================

export function drawObstacle(
  ctx: CanvasRenderingContext2D,
  obs: Obstacle,
  groundY: number,
  isDark: boolean,
  time: number,
  spriteImage?: HTMLImageElement | null
) {
  const oX = Math.floor(obs.x);
  const oY = Math.floor(groundY - obs.height);

  ctx.save();

  // Se o sprite de alta definição estiver carregado, desenha o sprite oficial
  if (spriteImage && spriteImage.complete && spriteImage.naturalWidth > 0) {
    ctx.imageSmoothingEnabled = false;

    // Sombra suave sob o obstáculo
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(oX + (obs.width / 2), groundY - 2, obs.width * 0.45, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    if (obs.type === 'glitch_bug') {
      const bugHover = Math.sin(time * 12) * 3;
      ctx.drawImage(spriteImage, oX, oY + bugHover, obs.width, obs.height);

      // Balão "!BUG" pulsante retrô
      const pulse = Math.sin(time * 10) > 0;
      ctx.fillStyle = pulse ? '#EF4444' : '#F87171';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('!BUG', oX + (obs.width / 2), oY + bugHover - 8);
    } else if (obs.type === 'firewall') {
      const pulseAlpha = Math.sin(time * 10) * 0.2 + 0.8;
      ctx.globalAlpha = pulseAlpha;
      ctx.drawImage(spriteImage, oX, oY, obs.width, obs.height);
      ctx.globalAlpha = 1.0;
    } else if (obs.type === 'server_rack') {
      ctx.drawImage(spriteImage, oX, oY, obs.width, obs.height);
      // LEDs piscantes em tempo real
      const led1 = Math.sin(time * 8) > 0;
      const led2 = Math.cos(time * 12) > 0;
      ctx.fillStyle = led1 ? '#22C55E' : '#14532D';
      ctx.fillRect(oX + 7, oY + 12, 3, 3);
      ctx.fillStyle = led2 ? '#38BDF8' : '#0369A1';
      ctx.fillRect(oX + 13, oY + 12, 3, 3);
    } else {
      ctx.drawImage(spriteImage, oX, oY, obs.width, obs.height);
    }

    ctx.restore();
    return;
  }

  if (obs.type === 'glitch_bug') {
    const wingFlap = Math.sin(time * 20) * 4;
    const bugY = oY + Math.sin(time * 6) * 3;

    // Sombra do bug
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(oX + (obs.width / 2), groundY - 2, 10, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Asas translúcidas
    ctx.fillStyle = 'rgba(239, 68, 68, 0.75)';
    ctx.fillRect(oX + 1, bugY - 6 + wingFlap, 6, 8);
    ctx.fillRect(oX + 17, bugY - 6 - wingFlap, 6, 8);

    // Carapaça mecânica vermelha
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(oX + 5, bugY, 14, 15);
    ctx.fillStyle = '#991B1B';
    ctx.fillRect(oX + 7, bugY + 3, 10, 8);

    // Olhos digitais amarelos
    ctx.fillStyle = '#FEF08A';
    ctx.fillRect(oX + 8, bugY + 2, 3, 3);
    ctx.fillRect(oX + 13, bugY + 2, 3, 3);

    // Patinhas mecânicas
    ctx.fillStyle = '#450A0A';
    ctx.fillRect(oX + 3, bugY + 13, 3, 4);
    ctx.fillRect(oX + 18, bugY + 13, 3, 4);

    // Balão "!BUG"
    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('!BUG', oX + (obs.width / 2), bugY - 9);
  } else if (obs.type === 'server_rack') {
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(oX, oY, obs.width, obs.height);
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1;
    ctx.strokeRect(oX, oY, obs.width, obs.height);

    for (let by = oY + 4; by < oY + obs.height - 4; by += 8) {
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(oX + 3, by, obs.width - 6, 6);

      const ledOn1 = Math.sin(time * 10 + by) > 0;
      const ledOn2 = Math.cos(time * 8 + by) > 0;
      ctx.fillStyle = ledOn1 ? '#22C55E' : '#14532D';
      ctx.fillRect(oX + 5, by + 2, 2.5, 2.5);
      ctx.fillStyle = ledOn2 ? '#38BDF8' : '#0369A1';
      ctx.fillRect(oX + 9, by + 2, 2.5, 2.5);
    }
  } else if (obs.type === 'hazard_cone') {
    ctx.fillStyle = '#EA580C';
    ctx.beginPath();
    ctx.moveTo(oX + (obs.width / 2), oY);
    ctx.lineTo(oX + obs.width, groundY);
    ctx.lineTo(oX, groundY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(oX + 5, oY + 10, obs.width - 10, 4);
    ctx.fillRect(oX + 3, oY + 18, obs.width - 6, 4);

    ctx.fillStyle = '#0F172A';
    ctx.fillRect(oX - 2, groundY - 4, obs.width + 4, 4);
  } else if (obs.type === 'firewall') {
    const pulse = Math.sin(time * 14) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(239, 68, 68, ${0.35 * pulse})`;
    ctx.fillRect(oX - 4, oY, obs.width + 8, obs.height);

    ctx.fillStyle = '#DC2626';
    ctx.fillRect(oX, oY, obs.width, obs.height);

    ctx.fillStyle = '#FEF08A';
    for (let ly = oY; ly < groundY; ly += 6) {
      const jx = Math.sin(ly + time * 18) * 3;
      ctx.fillRect(oX + (obs.width / 2) + jx, ly, 2, 3);
    }
  }

  ctx.restore();
}

export function drawPlatform(
  ctx: CanvasRenderingContext2D,
  plat: Platform,
  isDark: boolean
) {
  const pX = Math.floor(plat.x);
  const pY = Math.floor(plat.y);
  const W = plat.width;
  const H = plat.height;

  ctx.save();

  if (plat.type === 'metal') {
    ctx.fillStyle = '#334155';
    ctx.fillRect(pX, pY, W, H);
    ctx.fillStyle = '#64748B';
    ctx.fillRect(pX, pY, W, 2.5);
    ctx.fillStyle = '#CBD5E1';
    for (let rx = pX + 6; rx < pX + W; rx += 14) {
      ctx.fillRect(rx, pY + 4, 2, 2);
    }
  } else if (plat.type === 'brick') {
    ctx.fillStyle = '#B45309';
    ctx.fillRect(pX, pY, W, H);
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(pX, pY, W, 2);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    for (let bx = pX + 16; bx < pX + W; bx += 16) {
      ctx.fillRect(bx, pY + 2, 2, H - 2);
    }
  } else if (plat.type === 'wood') {
    ctx.fillStyle = '#78350F';
    ctx.fillRect(pX, pY, W, H);
    ctx.fillStyle = '#92400E';
    ctx.fillRect(pX, pY, W, 2);
  } else if (plat.type === 'cyber') {
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(pX, pY, W, H);
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pX, pY, W, H);
    ctx.fillStyle = '#00F0FF';
    ctx.fillRect(pX, pY, W, 2);
  }

  ctx.restore();
}

// =========================================================================
// 9. TECH ORBS COLECIONÁVEIS
// =========================================================================

export function drawTechOrb(
  ctx: CanvasRenderingContext2D,
  orb: TechOrb,
  time: number
) {
  if (orb.collected) return;

  const floatY = orb.y + Math.sin(time * 3 + orb.floatOffset) * 6;
  const x = Math.floor(orb.x);

  ctx.save();

  // 1. Halo volumétrico pulsante com gradiente radial
  const haloR = 18 + Math.sin(time * 4 + orb.floatOffset) * 4;
  const grad = ctx.createRadialGradient(x, floatY, 2, x, floatY, haloR);
  grad.addColorStop(0, 'rgba(56, 189, 248, 0.65)');
  grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.25)');
  grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, floatY, haloR, 0, Math.PI * 2);
  ctx.fill();

  // 2. Anéis quânticos orbitais em perspectiva 3D
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(x, floatY, 15, 6, (time * 2 + orb.floatOffset), 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(250, 204, 21, 0.75)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(x, floatY, 15, 6, (-time * 1.6 + orb.floatOffset), 0, Math.PI * 2);
  ctx.stroke();

  // 3. Orbe / Cristal 16-bit com Chanfro e Facetas
  ctx.fillStyle = '#0284C7';
  ctx.fillRect(x - 10, floatY - 10, 20, 20);
  ctx.fillStyle = '#38BDF8';
  ctx.fillRect(x - 8, floatY - 8, 16, 16);
  ctx.fillStyle = '#BAE6FD';
  ctx.fillRect(x - 6, floatY - 6, 6, 6);

  // Brilho estelar cintilante (Star Specular Glint)
  const glint = Math.sin(time * 5 + orb.floatOffset) > 0.3;
  if (glint) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 2, floatY - 7, 3, 3);
    ctx.fillRect(x + 1, floatY - 8, 5, 1);
    ctx.fillRect(x + 3, floatY - 6, 1, 5);
  }

  // 4. Ícone pixel de alta definição
  ctx.fillStyle = '#FFFFFF';
  if (orb.iconType === 'python') {
    ctx.fillStyle = '#FACC15';
    ctx.fillRect(x - 4, floatY - 4, 8, 4);
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(x - 4, floatY, 8, 4);
  } else if (orb.iconType === 'docker') {
    ctx.fillStyle = '#0284C7';
    ctx.fillRect(x - 5, floatY - 2, 10, 4);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x - 3, floatY - 4, 6, 2);
  } else if (orb.iconType === 'mcp') {
    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(x - 3, floatY - 5, 6, 4);
    ctx.fillRect(x - 5, floatY - 1, 10, 3);
    ctx.fillRect(x - 2, floatY + 2, 4, 4);
  } else if (orb.iconType === 'claude') {
    ctx.fillStyle = '#D97706';
    ctx.fillRect(x - 4, floatY - 4, 8, 8);
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(x - 2, floatY - 2, 4, 4);
  } else if (orb.iconType === 'langgraph') {
    ctx.fillStyle = '#10B981';
    ctx.fillRect(x - 4, floatY - 4, 3, 3);
    ctx.fillRect(x + 1, floatY - 4, 3, 3);
    ctx.fillRect(x - 2, floatY + 1, 4, 4);
  } else {
    ctx.fillStyle = '#10B981';
    ctx.fillRect(x - 4, floatY - 4, 8, 8);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('>', x, floatY + 2);
  }

  // 5. Nome do orbe em cartucho retrô 16-bit
  const textW = ctx.measureText(orb.name).width + 16;
  ctx.fillStyle = '#020617';
  ctx.fillRect(x - (textW / 2), floatY + 13, textW, 13);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - (textW / 2), floatY + 13, textW, 13);

  ctx.fillStyle = '#F8FAFC';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(orb.name, x, floatY + 22);

  ctx.restore();
}

// =========================================================================
// 10. MODO INTERIOR POKÉMON TOP-DOWN (SALA DECORADA & PERSONAGEM RPG)
// =========================================================================

export function drawTopDownCharacter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  direction: TopDownDirection,
  frame: number,
  outfit: EraOutfit,
  spriteImage?: HTMLImageElement | null
) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  // Sombra suave sob os pés
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(0, 4, 11, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Se o sprite de alta definição estiver carregado, desenha o sprite oficial
  if (spriteImage && spriteImage.complete && spriteImage.naturalWidth > 0) {
    ctx.imageSmoothingEnabled = false;
    const targetH = 44;
    const targetW = targetH * (spriteImage.naturalWidth / spriteImage.naturalHeight);
    const stepBob = frame % 2 === 1 ? -1.5 : 0;
    ctx.drawImage(spriteImage, Math.floor(-targetW / 2), Math.floor(-targetH + 4 + stepBob), Math.ceil(targetW), targetH);
    ctx.restore();
    return;
  }

  const p = PALETTES[outfit] || PALETTES.baxijen;
  const S = 2;
  ctx.fill();

  const stepOffset = frame % 2 === 1 ? (Math.sin(frame * Math.PI) > 0 ? 2 : -2) : 0;

  if (direction === 'down') {
    ctx.fillStyle = p.hair;
    ctx.fillRect(-6 * S, -15 * S, 12 * S, 5 * S);
    ctx.fillRect(-7 * S, -14 * S, 14 * S, 4 * S);
    ctx.fillStyle = p.hairHighlight;
    ctx.fillRect(-4 * S, -15 * S, 6 * S, 1 * S);

    ctx.fillStyle = p.skin;
    ctx.fillRect(-5 * S, -10 * S, 10 * S, 6 * S);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-3 * S, -8 * S, 2 * S, 2 * S);
    ctx.fillRect(1 * S, -8 * S, 2 * S, 2 * S);
    ctx.fillStyle = p.eyes;
    ctx.fillRect(-2 * S, -8 * S, 1 * S, 2 * S);
    ctx.fillRect(2 * S, -8 * S, 1 * S, 2 * S);

    ctx.fillStyle = p.shirt;
    ctx.fillRect(-4 * S, -4 * S, 8 * S, 6 * S);
    ctx.fillStyle = p.shirtHighlight;
    ctx.fillRect(-4 * S, -4 * S, 2 * S, 5 * S);

    ctx.fillStyle = p.skin;
    ctx.fillRect(-6 * S, -3 * S + stepOffset, 2 * S, 4 * S);
    ctx.fillRect(4 * S, -3 * S - stepOffset, 2 * S, 4 * S);

    ctx.fillStyle = p.pants;
    ctx.fillRect(-4 * S, 2 * S, 3 * S, 2 * S);
    ctx.fillRect(1 * S, 2 * S, 3 * S, 2 * S);

    ctx.fillStyle = p.shoes;
    ctx.fillRect(-4 * S, 4 * S + stepOffset, 3 * S, 2 * S);
    ctx.fillRect(1 * S, 4 * S - stepOffset, 3 * S, 2 * S);
  } else if (direction === 'up') {
    ctx.fillStyle = p.hair;
    ctx.fillRect(-6 * S, -15 * S, 12 * S, 8 * S);
    ctx.fillRect(-7 * S, -14 * S, 14 * S, 6 * S);
    ctx.fillStyle = p.hairShadow;
    ctx.fillRect(-5 * S, -8 * S, 10 * S, 2 * S);

    ctx.fillStyle = p.shirt;
    ctx.fillRect(-4 * S, -5 * S, 8 * S, 6 * S);
    if (p.backpack) {
      ctx.fillStyle = p.backpack;
      ctx.fillRect(-3 * S, -5 * S, 6 * S, 5 * S);
    }

    ctx.fillStyle = p.shoes;
    ctx.fillRect(-4 * S, 4 * S - stepOffset, 3 * S, 2 * S);
    ctx.fillRect(1 * S, 4 * S + stepOffset, 3 * S, 2 * S);
  } else {
    if (direction === 'left') {
      ctx.scale(-1, 1);
    }

    ctx.fillStyle = p.hair;
    ctx.fillRect(-4 * S, -15 * S, 9 * S, 6 * S);
    ctx.fillRect(-5 * S, -13 * S, 10 * S, 4 * S);

    ctx.fillStyle = p.skin;
    ctx.fillRect(-3 * S, -10 * S, 7 * S, 5 * S);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(1 * S, -9 * S, 2 * S, 2 * S);
    ctx.fillStyle = p.eyes;
    ctx.fillRect(2 * S, -9 * S, 1 * S, 2 * S);

    ctx.fillStyle = p.shirt;
    ctx.fillRect(-3 * S, -5 * S, 6 * S, 6 * S);

    ctx.fillStyle = p.pants;
    ctx.fillRect(-2 * S, 1 * S, 4 * S, 3 * S);

    ctx.fillStyle = p.shoes;
    ctx.fillRect(-3 * S + stepOffset, 4 * S, 4 * S, 2 * S);
    ctx.fillRect(0 * S - stepOffset, 4 * S, 4 * S, 2 * S);
  }

  ctx.restore();
}

export function drawTopDownRoom(
  ctx: CanvasRenderingContext2D,
  interior: BuildingInterior,
  canvasW: number,
  canvasH: number,
  time: number
) {
  const roomW = interior.roomWidth;
  const roomH = interior.roomHeight;
  const originX = Math.floor((canvasW - roomW) / 2);
  const originY = Math.floor((canvasH - roomH) / 2);

  ctx.save();

  // Fundo externo à sala
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, canvasW, canvasH);

  // Chão da sala
  ctx.fillStyle = interior.floorColor;
  ctx.fillRect(originX, originY, roomW, roomH);

  // Textura quadriculada de tacos de madeira
  ctx.fillStyle = interior.floorTileColor;
  for (let ty = originY + 36; ty < originY + roomH - 10; ty += 24) {
    for (let tx = originX + 16; tx < originX + roomW - 16; tx += 24) {
      if ((Math.floor((tx - originX) / 24) + Math.floor((ty - originY) / 24)) % 2 === 0) {
        ctx.fillRect(tx, ty, 24, 24);
      }
    }
  }

  // Sombra superior da parede no chão (Ambience)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(originX, originY + 36, roomW, 16);

  // Parede de trás (Back wall)
  ctx.fillStyle = interior.wallColor;
  ctx.fillRect(originX, originY, roomW, 36);
  ctx.fillStyle = interior.wallBorderColor;
  ctx.fillRect(originX, originY + 32, roomW, 4);

  // Paredes laterais
  ctx.fillStyle = interior.wallColor;
  ctx.fillRect(originX, originY, 14, roomH);
  ctx.fillRect(originX + roomW - 14, originY, 14, roomH);
  ctx.fillStyle = interior.wallBorderColor;
  ctx.fillRect(originX + 12, originY, 2, roomH);
  ctx.fillRect(originX + roomW - 14, originY, 2, roomH);

  // Parede inferior com porta
  const doorW = 44;
  const doorLeft = originX + (roomW / 2) - (doorW / 2);
  ctx.fillStyle = interior.wallColor;
  ctx.fillRect(originX, originY + roomH - 12, doorLeft - originX, 12);
  ctx.fillRect(doorLeft + doorW, originY + roomH - 12, originX + roomW - (doorLeft + doorW), 12);

  // Tapete vermelho de saída
  ctx.fillStyle = '#DC2626';
  ctx.fillRect(doorLeft, originY + roomH - 24, doorW, 20);
  ctx.strokeStyle = '#FEE2E2';
  ctx.lineWidth = 1;
  ctx.strokeRect(doorLeft, originY + roomH - 24, doorW, 20);

  const arrowBlink = Math.sin(time * 6) > 0;
  ctx.fillStyle = arrowBlink ? '#FEF08A' : '#FFFFFF';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('▼ SAIR', doorLeft + (doorW / 2), originY + roomH - 11);

  // Placa institucional da sala
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(originX + (roomW / 2) - 110, originY + 4, 220, 22);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(originX + (roomW / 2) - 110, originY + 4, 220, 22);

  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(interior.name, originX + (roomW / 2), originY + 15);
  ctx.fillStyle = '#94A3B8';
  ctx.font = '8px monospace';
  ctx.fillText(interior.subtitle, originX + (roomW / 2), originY + 23);

  ctx.restore();
}

export function drawFurniture(
  ctx: CanvasRenderingContext2D,
  item: FurnitureItem,
  originX: number,
  originY: number,
  time: number
) {
  const fX = originX + item.x;
  const fY = originY + item.y;
  const W = item.width;
  const H = item.height;

  ctx.save();

  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(fX + 3, fY + 3, W, H);

  if (item.type === 'desk_computer') {
    ctx.fillStyle = '#78350F';
    ctx.fillRect(fX, fY, W, H);
    ctx.fillStyle = '#92400E';
    ctx.fillRect(fX, fY, W, 3);

    ctx.fillStyle = '#0F172A';
    ctx.fillRect(fX + (W / 2) - 12, fY + 4, 24, 14);

    const screenGlow = Math.sin(time * 4) > 0 ? '#22C55E' : '#10B981';
    ctx.fillStyle = screenGlow;
    ctx.fillRect(fX + (W / 2) - 10, fY + 6, 20, 10);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(fX + (W / 2) - 8, fY + 8, 4, 1);
    ctx.fillRect(fX + (W / 2) - 8, fY + 11, 8, 1);
  } else if (item.type === 'bookshelf') {
    ctx.fillStyle = '#451A03';
    ctx.fillRect(fX, fY, W, H);

    const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
    for (let sy = fY + 4; sy < fY + H - 6; sy += 12) {
      ctx.fillStyle = '#78350F';
      ctx.fillRect(fX + 2, sy + 8, W - 4, 2);
      for (let bx = fX + 4; bx < fX + W - 6; bx += 6) {
        ctx.fillStyle = colors[(bx + sy) % colors.length];
        ctx.fillRect(bx, sy, 5, 8);
      }
    }
  } else if (item.type === 'server_cabinet') {
    ctx.fillStyle = '#090D16';
    ctx.fillRect(fX, fY, W, H);
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 1;
    ctx.strokeRect(fX, fY, W, H);

    for (let ly = fY + 6; ly < fY + H - 6; ly += 8) {
      const led1 = Math.sin(time * 8 + ly) > 0;
      const led2 = Math.cos(time * 6 + ly) > 0;
      ctx.fillStyle = led1 ? '#22C55E' : '#14532D';
      ctx.fillRect(fX + 4, ly, 3, 3);
      ctx.fillStyle = led2 ? '#38BDF8' : '#0369A1';
      ctx.fillRect(fX + 10, ly, 3, 3);
    }
  } else if (item.type === 'whiteboard') {
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(fX, fY, W, H);
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.strokeRect(fX, fY, W, H);

    ctx.fillStyle = '#2563EB';
    ctx.fillRect(fX + 6, fY + 6, 12, 8);
    ctx.fillRect(fX + W - 18, fY + 6, 12, 8);
  } else if (item.type === 'plant') {
    ctx.fillStyle = '#B45309';
    ctx.fillRect(fX + (W / 2) - 6, fY + H - 10, 12, 10);
    ctx.fillStyle = '#16A34A';
    ctx.beginPath();
    ctx.arc(fX + (W / 2), fY + 8, 10, 0, Math.PI * 2);
    ctx.fill();
  } else if (item.type === 'ai_holo') {
    const floatY = fY + Math.sin(time * 3) * 4;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.beginPath();
    ctx.arc(fX + (W / 2), floatY + (H / 2), 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(fX + (W / 2), floatY + (H / 2), 8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function drawInteriorSkillItem(
  ctx: CanvasRenderingContext2D,
  skill: InteriorSkillItem,
  originX: number,
  originY: number,
  time: number
) {
  const sX = originX + skill.x;
  const sY = originY + skill.y;

  ctx.save();

  if (skill.collected) {
    ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.beginPath();
    ctx.ellipse(sX, sY, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('✓ ' + skill.name, sX, sY + 12);
    ctx.restore();
    return;
  }

  const floatY = sY + Math.sin(time * 4) * 4;

  // 1. Sombra suave no piso
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(sX, sY + 8, 14, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Feixe de luz volumétrica ascendente
  const beamGrad = ctx.createLinearGradient(sX, floatY + 10, sX, floatY - 40);
  beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
  beamGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.15)');
  beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = beamGrad;
  ctx.beginPath();
  ctx.moveTo(sX - 12, floatY + 8);
  ctx.lineTo(sX + 12, floatY + 8);
  ctx.lineTo(sX + 6, floatY - 35);
  ctx.lineTo(sX - 6, floatY - 35);
  ctx.closePath();
  ctx.fill();

  // 3. Halo radiante pulsante
  const glow = 16 + Math.sin(time * 5) * 3;
  ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.beginPath();
  ctx.arc(sX, floatY, glow, 0, Math.PI * 2);
  ctx.fill();

  // 4. Cartucho Holográfico 3D rotativo
  const rotScale = Math.cos(time * 3);
  const diskW = Math.max(3, Math.abs(rotScale) * 12);

  ctx.fillStyle = '#0284C7';
  ctx.fillRect(sX - diskW, floatY - 9, diskW * 2, 18);
  ctx.fillStyle = '#38BDF8';
  ctx.fillRect(sX - diskW + 2, floatY - 7, Math.max(2, (diskW - 2) * 2), 14);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(sX - 2, floatY - 5, 4, 10);

  // 5. Etiqueta com nome e categoria da skill
  ctx.fillStyle = '#020617';
  const textW = ctx.measureText(skill.name).width + 16;
  ctx.fillRect(sX - (textW / 2), floatY - 24, textW, 14);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(sX - (textW / 2), floatY - 24, textW, 14);

  ctx.fillStyle = '#FDE047';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(skill.name, sX, floatY - 14);

  ctx.restore();
}

export function drawNPC(
  ctx: CanvasRenderingContext2D,
  npc: { name: string; role: string; x: number; y: number; direction: TopDownDirection },
  originX: number,
  originY: number,
  time: number = 0
) {
  const nX = originX + npc.x;
  const nY = originY + npc.y;
  const S = 2;

  ctx.save();
  ctx.translate(Math.floor(nX), Math.floor(nY));

  // Sombra no chão
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 4, 12, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Balão de fala flutuante com animação suave
  const bubbleY = -34 * S + Math.sin(time * 4) * 2.5;
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(-14, bubbleY - 12, 28, 12);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1;
  ctx.strokeRect(-14, bubbleY - 12, 28, 12);

  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('💬 FALA', 0, bubbleY - 3);

  // Corpo do Mentor
  const isSiemens = npc.role.toLowerCase().includes('siemens') || npc.role.toLowerCase().includes('automação');
  const isDoc = npc.role.toLowerCase().includes('orientadora') || npc.role.toLowerCase().includes('dra');

  // Cabeça / Cabelo
  ctx.fillStyle = isSiemens ? '#F59E0B' : '#64748B'; // Capacete de segurança se Siemens
  ctx.fillRect(-6 * S, -15 * S, 12 * S, 5 * S);
  ctx.fillRect(-7 * S, -14 * S, 14 * S, 4 * S);

  // Rosto
  ctx.fillStyle = '#F5D0A9';
  ctx.fillRect(-5 * S, -10 * S, 10 * S, 6 * S);

  // Óculos se for Professora/Docente
  if (isDoc) {
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 1;
    ctx.strokeRect(-4 * S, -9 * S, 3 * S, 3 * S);
    ctx.strokeRect(1 * S, -9 * S, 3 * S, 3 * S);
  }

  // Olhos
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(-3 * S, -8 * S, 2 * S, 2 * S);
  ctx.fillRect(1 * S, -8 * S, 2 * S, 2 * S);

  // Jaleco / Uniforme corporativo
  ctx.fillStyle = isSiemens ? '#0369A1' : isDoc ? '#F8FAFC' : '#1E293B';
  ctx.fillRect(-5 * S, -4 * S, 10 * S, 7 * S);

  // Crachá ou gravata
  ctx.fillStyle = isSiemens ? '#FACC15' : '#2563EB';
  ctx.fillRect(-1 * S, -4 * S, 2 * S, 4 * S);

  // Calça e sapatos
  ctx.fillStyle = '#334155';
  ctx.fillRect(-4 * S, 3 * S, 3 * S, 2 * S);
  ctx.fillRect(1 * S, 3 * S, 3 * S, 2 * S);

  // Placa de papel/cargo com moldura dourada
  const roleW = Math.max(74, ctx.measureText(npc.role).width + 16);
  ctx.fillStyle = '#020617';
  ctx.fillRect(-roleW / 2, -26 * S, roleW, 12);
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-roleW / 2, -26 * S, roleW, 12);

  ctx.fillStyle = '#FBBF24';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(npc.role, 0, -26 * S + 9);

  ctx.restore();
}
