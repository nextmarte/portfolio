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
    // Arbusto frondoso em autêntico Pixel Art 16-bit com tufos escalonados e flores
    const bColors = isDark
      ? { dark: '#064E3B', mid: '#047857', light: '#059669', high: '#10B981' }
      : { dark: '#14532D', mid: '#16A34A', light: '#22C55E', high: '#4ADE80' };

    // Sombra suave no chão
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(pX + 2, groundY - 2, 38, 3);

    // Tufo Esquerdo
    drawPixelFoliageCluster(ctx, pX + 9, groundY - 8, 18, 16, bColors.dark, bColors.mid, bColors.light, bColors.high);
    // Tufo Direito
    drawPixelFoliageCluster(ctx, pX + 31, groundY - 8, 18, 16, bColors.dark, bColors.mid, bColors.light, bColors.high);
    // Tufo Central Elevado
    drawPixelFoliageCluster(ctx, pX + 20, groundY - 12, 22, 20, bColors.dark, bColors.mid, bColors.light, bColors.high);

    // Flores tropicais em pixel art (Hibisco Vermelho e Estame Amarelo)
    const flowers = [
      { x: pX + 8, y: groundY - 12 },
      { x: pX + 22, y: groundY - 17 },
      { x: pX + 32, y: groundY - 11 },
    ];
    flowers.forEach(fl => {
      ctx.fillStyle = '#E11D48';
      ctx.fillRect(fl.x - 1, fl.y, 3, 2);
      ctx.fillRect(fl.x, fl.y - 1, 1, 4);
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(fl.x, fl.y, 1, 1);
    });
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

/**
 * Desenha um tufo orgânico de folhagem em estilo 16-bit com 4 tons de cor,
 * contornos escalonados pixel-a-pixel (sem círculos vetoriais lisos).
 */
export function drawPixelFoliageCluster(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  width: number,
  height: number,
  darkColor: string,
  midColor: string,
  lightColor: string,
  highlightColor?: string
) {
  const hw = Math.floor(width / 2);
  const hh = Math.floor(height / 2);

  // 1. Base / Sombra Inferior
  ctx.fillStyle = darkColor;
  ctx.fillRect(cx - hw + 2, cy - hh + 2, width - 4, height - 2);
  ctx.fillRect(cx - hw + 4, cy + hh - 3, width - 8, 4);

  // 2. Miolo / Cor Média
  ctx.fillStyle = midColor;
  ctx.fillRect(cx - hw + 3, cy - hh + 1, width - 6, height - 4);
  ctx.fillRect(cx - hw + 1, cy - hh + 3, width - 2, height - 7);

  // 3. Meia-luz / Brilho Solar Superior-Esquerdo
  ctx.fillStyle = lightColor;
  ctx.fillRect(cx - hw + 4, cy - hh, width - 10, Math.floor(height * 0.45));
  ctx.fillRect(cx - hw + 2, cy - hh + 2, Math.floor(width * 0.45), Math.floor(height * 0.4));

  // 4. Destaque Especular / Folhas Iluminadas no topo
  if (highlightColor) {
    ctx.fillStyle = highlightColor;
    ctx.fillRect(cx - hw + 6, cy - hh + 1, Math.floor(width * 0.28), 3);
    ctx.fillRect(cx - hw + 8, cy - hh - 1, Math.floor(width * 0.18), 2);
  }
}

export function drawPixelTree(
  ctx: CanvasRenderingContext2D,
  x: number,
  groundY: number,
  isDark: boolean,
  variant: number = 0
) {
  const pX = Math.floor(x);
  ctx.save();

  // Sombra suave sob a copa
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(pX - 4, groundY - 2, 46, 3);

  // Tronco com raízes e textura de casca
  const barkDark = isDark ? '#1C1008' : '#271206';
  const barkMid = isDark ? '#2E190D' : '#451A03';
  const barkLight = isDark ? '#4A2A17' : '#78350F';

  // Raízes laterais estendidas no solo
  ctx.fillStyle = barkDark;
  ctx.fillRect(pX + 8, groundY - 6, 4, 6);
  ctx.fillRect(pX + 22, groundY - 6, 5, 6);

  // Fuste do tronco
  ctx.fillStyle = barkMid;
  ctx.fillRect(pX + 12, groundY - 42, 10, 42);

  // Sombra da casca à direita
  ctx.fillStyle = barkDark;
  ctx.fillRect(pX + 19, groundY - 42, 3, 42);

  // Iluminação da casca à esquerda
  ctx.fillStyle = barkLight;
  ctx.fillRect(pX + 12, groundY - 40, 2, 38);

  // Galhos bifurcados para suportar a copa
  ctx.fillStyle = barkMid;
  ctx.fillRect(pX + 7, groundY - 46, 7, 5);
  ctx.fillRect(pX + 20, groundY - 48, 8, 6);

  if (variant % 3 === 0) {
    // ── 1. Mata Atlântica Frondosa (Verde Tropical Luxuoso) ──
    const d = isDark ? '#064E3B' : '#14532D';
    const m = isDark ? '#047857' : '#16A34A';
    const l = isDark ? '#059669' : '#22C55E';
    const h = isDark ? '#10B981' : '#4ADE80';

    // Agrupamento de 6 tufos de folhas formando a copa
    drawPixelFoliageCluster(ctx, pX + 5, groundY - 48, 22, 18, d, m, l, h);
    drawPixelFoliageCluster(ctx, pX + 29, groundY - 50, 24, 20, d, m, l, h);
    drawPixelFoliageCluster(ctx, pX + 17, groundY - 55, 30, 24, d, m, l, h);
    drawPixelFoliageCluster(ctx, pX + 9, groundY - 65, 24, 20, d, m, l, h);
    drawPixelFoliageCluster(ctx, pX + 25, groundY - 67, 24, 20, d, m, l, h);
    drawPixelFoliageCluster(ctx, pX + 17, groundY - 76, 26, 22, d, m, l, h);

    // Folhinhas salientes nas bordas da copa para silhueta orgânica
    ctx.fillStyle = h;
    ctx.fillRect(pX + 12, groundY - 88, 3, 3);
    ctx.fillRect(pX + 22, groundY - 86, 3, 2);
    ctx.fillRect(pX - 4, groundY - 53, 3, 3);
    ctx.fillRect(pX + 38, groundY - 55, 3, 3);

  } else if (variant % 3 === 1) {
    // ── 2. Ipê Amarelo (Árvore Emblemática Fluminense) ──
    const d = '#92400E';
    const m = '#D97706';
    const l = '#F59E0B';
    const h = '#FDE047';

    // Agrupamento dourado da copa do Ipê
    drawPixelFoliageCluster(ctx, pX + 4, groundY - 50, 24, 20, d, m, l, h);
    drawPixelFoliageCluster(ctx, pX + 30, groundY - 52, 26, 22, d, m, l, h);
    drawPixelFoliageCluster(ctx, pX + 17, groundY - 58, 32, 26, d, m, l, h);
    drawPixelFoliageCluster(ctx, pX + 8, groundY - 68, 26, 22, d, m, l, h);
    drawPixelFoliageCluster(ctx, pX + 26, groundY - 70, 26, 22, d, m, l, h);
    drawPixelFoliageCluster(ctx, pX + 17, groundY - 80, 28, 24, d, m, l, h);

    // Flores douradas salientes
    ctx.fillStyle = '#FEF08A';
    ctx.fillRect(pX + 14, groundY - 93, 4, 3);
    ctx.fillRect(pX + 23, groundY - 90, 3, 3);
    ctx.fillRect(pX - 5, groundY - 55, 3, 3);
    ctx.fillRect(pX + 39, groundY - 58, 3, 3);

    // Pétalas amarelas caindo suavemente ao vento
    const wind = (performance.now() / 1000) * 16;
    ctx.fillStyle = '#FDE047';
    for (let pt = 0; pt < 4; pt++) {
      const pY = (groundY - 75 + ((wind * 1.5 + pt * 22) % 75));
      const pXOff = Math.sin((pY * 0.08) + pt) * 12 + (pt * 8);
      ctx.fillRect(pX + 10 + pXOff, pY, 2, 2);
    }

  } else {
    // ── 3. Quaresmeira Roxa (Florada Radiante do Rio de Janeiro) ──
    const d = '#4A044E';
    const m = '#7E22CE';
    const l = '#A855F7';
    const h = '#E879F9';

    // Agrupamento roxo da copa da Quaresmeira
    drawPixelFoliageCluster(ctx, pX + 5, groundY - 48, 22, 18, d, m, l, h);
    drawPixelFoliageCluster(ctx, pX + 29, groundY - 50, 24, 20, d, m, l, h);
    drawPixelFoliageCluster(ctx, pX + 17, groundY - 56, 30, 24, d, m, l, h);
    drawPixelFoliageCluster(ctx, pX + 9, groundY - 66, 24, 20, d, m, l, h);
    drawPixelFoliageCluster(ctx, pX + 25, groundY - 68, 24, 20, d, m, l, h);
    drawPixelFoliageCluster(ctx, pX + 17, groundY - 78, 26, 22, d, m, l, h);

    // Pétalas lilases salientes
    ctx.fillStyle = '#F5D0FE';
    ctx.fillRect(pX + 13, groundY - 90, 3, 3);
    ctx.fillRect(pX + 21, groundY - 88, 3, 2);
    ctx.fillRect(pX - 4, groundY - 52, 3, 3);
    ctx.fillRect(pX + 38, groundY - 56, 3, 3);

    // Pétalas caindo suavemente
    const wind = (performance.now() / 1000) * 16;
    ctx.fillStyle = '#E879F9';
    for (let pt = 0; pt < 4; pt++) {
      const pY = (groundY - 75 + ((wind * 1.5 + pt * 22) % 75));
      const pXOff = Math.sin((pY * 0.08) + pt) * 10 + (pt * 9);
      ctx.fillRect(pX + 8 + pXOff, pY, 2, 2);
    }
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
    // ── 1. Plataforma de Viga de Aço Industrial com Rebites e Chapa Xadrez ──
    // Sombra projetada abaixo da viga
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(pX, pY + H, W, 4);

    // Corpo da viga I-Beam de aço
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(pX, pY, W, H);
    ctx.fillStyle = '#334155';
    ctx.fillRect(pX + 1, pY + 2, W - 2, H - 4);

    // Chapa Xadrez Antiderrapante no topo (Diamond Tread Plate 16-bit)
    ctx.fillStyle = '#64748B';
    ctx.fillRect(pX, pY, W, 3);
    ctx.fillStyle = '#94A3B8';
    for (let tx = pX + 2; tx < pX + W - 2; tx += 6) {
      ctx.fillRect(tx, pY, 2, 1);
      ctx.fillRect(tx + 3, pY + 1, 2, 1);
    }

    // Linha de reflexo metálico especular
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fillRect(pX + 2, pY + 2, W - 4, 1);

    // Rebites hexagonais industriais com relevo e sombra
    for (let rx = pX + 8; rx < pX + W - 4; rx += 14) {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(rx + 1, pY + 5, 3, 3); // Sombra do rebite
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(rx, pY + 4, 3, 3); // Cabeça do parafuso
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(rx, pY + 4, 1, 1); // Brilho especular
    }

    // Suportes / Mísulas de treliça angular nas pontas inferiores
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(pX + 2, pY + H, 6, 6);
    ctx.fillRect(pX + 4, pY + H + 6, 4, 3);
    ctx.fillRect(pX + W - 8, pY + H, 6, 6);
    ctx.fillRect(pX + W - 8, pY + H + 6, 4, 3);

  } else if (plat.type === 'brick') {
    // ── 2. Plataforma de Alvenaria Histórica / Tijolos Artesanais Coloniais ──
    // Sombra inferior
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(pX, pY + H, W, 4);

    // Peitoril / Capa superior de pedra arenito chanfrada
    ctx.fillStyle = '#D97706';
    ctx.fillRect(pX - 2, pY, W + 4, 3);
    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(pX - 2, pY, W + 4, 1);
    ctx.fillStyle = '#78350F';
    ctx.fillRect(pX - 2, pY + 3, W + 4, 1); // Linha de sombra do peitoril

    // Argamassa base de assentamento
    ctx.fillStyle = '#450A0A';
    ctx.fillRect(pX, pY + 4, W, H - 4);

    // Tijolos individuais com amarração intercalada
    const brickH = 4;
    for (let row = 0; row < 2; row++) {
      const by = pY + 4 + (row * (brickH + 1));
      const offset = (row % 2) * 8;
      for (let bx = pX + offset; bx < pX + W; bx += 16) {
        const bW = Math.min(14, pX + W - bx);
        if (bW > 2) {
          ctx.fillStyle = ((bx + row) % 3 === 0) ? '#DC2626' : ((bx + row) % 3 === 1) ? '#B91C1C' : '#991B1B';
          ctx.fillRect(bx, by, bW, brickH);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.fillRect(bx, by, bW, 1); // Borda superior do tijolo
        }
      }
    }

    // Tufo de musgo rasteiro pendendo na borda inferior
    ctx.fillStyle = '#15803D';
    ctx.fillRect(pX + 12, pY + H, 5, 2);
    ctx.fillRect(pX + 14, pY + H + 2, 2, 2);
    ctx.fillRect(pX + W - 18, pY + H, 6, 2);
    ctx.fillRect(pX + W - 16, pY + H + 2, 3, 2);

  } else if (plat.type === 'wood') {
    // ── 3. Viga de Madeira Maciça Nobre (Jacarandá / Peroba-Rosa) ──
    // Sombra inferior
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(pX, pY + H, W, 4);

    // Corpo de madeira entalhada
    ctx.fillStyle = '#451A03';
    ctx.fillRect(pX, pY, W, H);
    ctx.fillStyle = '#78350F';
    ctx.fillRect(pX + 1, pY + 2, W - 2, H - 3);

    // Tampo superior lixado com veio dourado
    ctx.fillStyle = '#92400E';
    ctx.fillRect(pX, pY, W, 2);
    ctx.fillStyle = '#B45309';
    ctx.fillRect(pX, pY, W, 1);

    // Linhas de veio natural da madeira
    ctx.fillStyle = '#451A03';
    ctx.fillRect(pX + 10, pY + 4, W - 20, 1);
    ctx.fillRect(pX + 22, pY + 7, W - 44, 1);
    // Nó da madeira
    ctx.fillRect(pX + Math.floor(W * 0.4), pY + 4, 4, 3);
    ctx.fillStyle = '#271206';
    ctx.fillRect(pX + Math.floor(W * 0.4) + 1, pY + 5, 2, 1);

    // Braçadeiras de ferro forjado nas extremidades
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(pX + 3, pY, 4, H);
    ctx.fillRect(pX + W - 7, pY, 4, H);
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(pX + 4, pY + 3, 2, 2); // Parafuso esquerdo
    ctx.fillRect(pX + 4, pY + H - 4, 2, 2);
    ctx.fillRect(pX + W - 6, pY + 3, 2, 2); // Parafuso direito
    ctx.fillRect(pX + W - 6, pY + H - 4, 2, 2);

  } else if (plat.type === 'cyber') {
    // ── 4. Plataforma Flutuante Cyberpunk com Circuitos Neon & Efeitos de Propulsão ──
    // Chassi de fibra de carbono escuro
    ctx.fillStyle = '#020617';
    ctx.fillRect(pX, pY, W, H);
    ctx.fillStyle = '#0B1528';
    ctx.fillRect(pX + 1, pY + 1, W - 2, H - 2);

    // Friso de neon ciano brilhante no topo
    ctx.fillStyle = '#00F0FF';
    ctx.fillRect(pX, pY, W, 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(pX + 4, pY, W - 8, 1); // Núcleo super-iluminado

    // Moldura tech chanfrada
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 1;
    ctx.strokeRect(pX, pY, W, H);

    // Trilhas de circuito impresso com nós de energia pulsantes
    const now = performance.now() / 1000;
    const pulseNode = Math.floor((now * 8) % (W - 16));
    ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.fillRect(pX + 8, pY + 5, W - 16, 2);

    // Pacote de dados correndo na trilha
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(pX + 8 + pulseNode, pY + 4, 4, 4);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(pX + 9 + pulseNode, pY + 5, 2, 2);

    // Ejetores de Íons de Levitação Antigravitacional embaixo
    const ionGlow = Math.sin(now * 12) * 0.2 + 0.8;
    ctx.fillStyle = '#0284C7';
    ctx.fillRect(pX + 8, pY + H, 8, 3);
    ctx.fillRect(pX + W - 16, pY + H, 8, 3);

    // Cone de plasma antigravidade ciano translúcido
    ctx.fillStyle = `rgba(0, 240, 255, ${0.4 * ionGlow})`;
    ctx.beginPath();
    ctx.moveTo(pX + 8, pY + H + 3);
    ctx.lineTo(pX + 4, pY + H + 9);
    ctx.lineTo(pX + 20, pY + H + 9);
    ctx.lineTo(pX + 16, pY + H + 3);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(pX + W - 16, pY + H + 3);
    ctx.lineTo(pX + W - 20, pY + H + 9);
    ctx.lineTo(pX + W - 4, pY + H + 9);
    ctx.lineTo(pX + W - 8, pY + H + 3);
    ctx.closePath();
    ctx.fill();
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
  roomW: number,
  roomH: number,
  time: number
) {
  const originX = 0;
  const originY = 0;

  ctx.save();

  // 1. Chão da sala com sombra de oclusão de ambiente
  ctx.fillStyle = interior.floorColor;
  ctx.fillRect(originX, originY, roomW, roomH);

  // Textura quadriculada de tacos de madeira nobres / piso cerâmico chanfrado
  ctx.fillStyle = interior.floorTileColor;
  for (let ty = originY + 38; ty < originY + roomH - 12; ty += 20) {
    for (let tx = originX + 14; tx < originX + roomW - 14; tx += 20) {
      if ((Math.floor(tx / 20) + Math.floor(ty / 20)) % 2 === 0) {
        ctx.fillRect(tx, ty, 20, 20);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.fillRect(tx, ty, 20, 1);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(tx, ty + 19, 20, 1);
        ctx.fillStyle = interior.floorTileColor;
      }
    }
  }

  // Sombra superior de oclusão ambiente da parede no chão
  const wallShadowGrad = ctx.createLinearGradient(0, originY + 38, 0, originY + 58);
  wallShadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
  wallShadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = wallShadowGrad;
  ctx.fillRect(originX + 14, originY + 38, roomW - 28, 20);

  // 2. Parede de trás (Back wall)
  ctx.fillStyle = interior.wallColor;
  ctx.fillRect(originX, originY, roomW, 38);

  // Moldura / Rodapé superior e friso de acabamento
  ctx.fillStyle = interior.wallBorderColor;
  ctx.fillRect(originX, originY + 34, roomW, 4);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fillRect(originX, originY, roomW, 2);

  // Decorações temáticas nas paredes da era
  if (interior.buildingId === 'cefet') {
    // Diploma técnico emoldurado com selo dourado
    ctx.fillStyle = '#451A03';
    ctx.fillRect(originX + 45, originY + 8, 24, 18);
    ctx.fillStyle = '#FEF3C7';
    ctx.fillRect(originX + 47, originY + 10, 20, 14);
    ctx.fillStyle = '#D97706';
    ctx.fillRect(originX + 55, originY + 18, 4, 4); // Selo
  } else if (interior.buildingId === 'chemtech') {
    // Fluxograma de processos industriais emoldurado
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(originX + 45, originY + 8, 28, 18);
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(originX + 47, originY + 10, 24, 14);
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(originX + 50, originY + 15, 8, 2);
    ctx.fillRect(originX + 60, originY + 13, 8, 2);
  } else if (interior.buildingId === 'uff') {
    // Certificado Neoclássico UFF com fita azul
    ctx.fillStyle = '#1E3A8A';
    ctx.fillRect(originX + 45, originY + 8, 26, 18);
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(originX + 47, originY + 10, 22, 14);
    ctx.fillStyle = '#3B82F6';
    ctx.fillRect(originX + 56, originY + 18, 4, 5);
  } else if (interior.buildingId === 'cid') {
    // Monitor de telemetria LAGUNA IoT na parede
    ctx.fillStyle = '#022C22';
    ctx.fillRect(originX + 40, originY + 7, 34, 20);
    ctx.strokeStyle = '#34D399';
    ctx.lineWidth = 1;
    ctx.strokeRect(originX + 40, originY + 7, 34, 20);
    ctx.strokeStyle = '#10B981';
    ctx.beginPath();
    for (let lx = 0; lx < 30; lx += 2) {
      const ly = originY + 17 + Math.sin((lx * 0.3) + time * 6) * 4;
      if (lx === 0) ctx.moveTo(originX + 42 + lx, ly);
      else ctx.lineTo(originX + 42 + lx, ly);
    }
    ctx.stroke();
  } else if (interior.buildingId === 'coppead') {
    // Tese de Doutorado & Governança de IA
    ctx.fillStyle = '#500724';
    ctx.fillRect(originX + 45, originY + 7, 28, 20);
    ctx.fillStyle = '#FFF1F2';
    ctx.fillRect(originX + 47, originY + 9, 24, 16);
    ctx.fillStyle = '#BE123C';
    ctx.fillRect(originX + 57, originY + 19, 4, 4);
  } else if (interior.buildingId === 'baxijen') {
    // Dashboard Holográfico de Agentes IA na parede
    ctx.fillStyle = '#020617';
    ctx.fillRect(originX + 35, originY + 6, 38, 22);
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 1;
    ctx.strokeRect(originX + 35, originY + 6, 38, 22);
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(originX + 38, originY + 10, 10, 4);
    ctx.fillRect(originX + 52, originY + 10, 16, 4);
    ctx.fillStyle = '#00F0FF';
    ctx.fillRect(originX + 38, originY + 16, 30, 8);
  }

  // 3. Paredes laterais com rodapé
  ctx.fillStyle = interior.wallColor;
  ctx.fillRect(originX, originY, 14, roomH);
  ctx.fillRect(originX + roomW - 14, originY, 14, roomH);

  ctx.fillStyle = interior.wallBorderColor;
  ctx.fillRect(originX + 11, originY + 34, 3, roomH - 34);
  ctx.fillRect(originX + roomW - 14, originY + 34, 3, roomH - 34);

  // 4. Parede inferior com portal de saída
  const doorW = 48;
  const doorLeft = originX + (roomW / 2) - (doorW / 2);
  ctx.fillStyle = interior.wallColor;
  ctx.fillRect(originX, originY + roomH - 14, doorLeft - originX, 14);
  ctx.fillRect(doorLeft + doorW, originY + roomH - 14, originX + roomW - (doorLeft + doorW), 14);

  // Rodapé inferior
  ctx.fillStyle = interior.wallBorderColor;
  ctx.fillRect(originX, originY + roomH - 14, doorLeft - originX, 2);
  ctx.fillRect(doorLeft + doorW, originY + roomH - 14, originX + roomW - (doorLeft + doorW), 2);

  // Tapete vermelho nobre de saída com borda dourada
  ctx.fillStyle = '#B91C1C';
  ctx.fillRect(doorLeft - 2, originY + roomH - 28, doorW + 4, 26);
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(doorLeft - 2, originY + roomH - 28, doorW + 4, 26);

  // Seta pulsante de saída
  const arrowBlink = Math.sin(time * 6) > 0;
  ctx.fillStyle = arrowBlink ? '#FEF08A' : '#FFFFFF';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('▼ SAIR [E]', doorLeft + (doorW / 2), originY + roomH - 12);

  // 5. Placa Institucional da Sala (Centro da Parede Superior)
  const plateW = 220;
  const plateH = 24;
  const plateX = originX + (roomW / 2) - (plateW / 2);
  const plateY = originY + 6;

  ctx.fillStyle = '#0F172A';
  ctx.fillRect(plateX, plateY, plateW, plateH);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(plateX, plateY, plateW, plateH);

  // Rebites dourados nos 4 cantos da placa
  ctx.fillStyle = '#F59E0B';
  ctx.fillRect(plateX + 2, plateY + 2, 2, 2);
  ctx.fillRect(plateX + plateW - 4, plateY + 2, 2, 2);
  ctx.fillRect(plateX + 2, plateY + plateH - 4, 2, 2);
  ctx.fillRect(plateX + plateW - 4, plateY + plateH - 4, 2, 2);

  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(interior.name, originX + (roomW / 2), plateY + 14);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '8px monospace';
  ctx.fillText(interior.subtitle, originX + (roomW / 2), plateY + 22);

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

  // Sombra suave do móvel projetada no piso
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(fX + 4, fY + 4, W, H);

  if (item.type === 'desk_computer') {
    // ── 1. Estação de Trabalho Dev: Mesa de Madeira, Monitores Duplos & PC Gamer ──
    // Tampo da mesa em carvalho escuro com borda chanfrada
    ctx.fillStyle = '#451A03';
    ctx.fillRect(fX, fY, W, H);
    ctx.fillStyle = '#78350F';
    ctx.fillRect(fX + 1, fY + 1, W - 2, H - 2);
    ctx.fillStyle = '#92400E';
    ctx.fillRect(fX + 1, fY + 1, W - 2, 2); // Borda iluminada superior

    // Gaveteiro lateral direito
    ctx.fillStyle = '#451A03';
    ctx.fillRect(fX + W - 18, fY + 2, 16, H - 4);
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(fX + W - 11, fY + 8, 4, 1); // Puxador da gaveta
    ctx.fillRect(fX + W - 11, fY + 20, 4, 1);

    // Mousepad estendido RGB
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(fX + 16, fY + 12, W - 42, H - 18);
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 1;
    ctx.strokeRect(fX + 16, fY + 12, W - 42, H - 18);

    // Teclado mecânico retroiluminado
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(fX + 22, fY + 18, 22, 10);
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(fX + 24, fY + 20, 18, 2); // Teclas iluminadas
    ctx.fillRect(fX + 26, fY + 24, 14, 2); // Barra de espaço

    // Mouse gamer
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(fX + 48, fY + 20, 5, 7);

    // Monitor Principal Widescreen (16:9) no centro
    const monW = 28;
    const monH = 14;
    const monX = fX + 18;
    const monY = fY + 2;

    ctx.fillStyle = '#020617';
    ctx.fillRect(monX, monY, monW, monH);
    ctx.fillStyle = '#334155';
    ctx.fillRect(monX + (monW / 2) - 3, monY + monH, 6, 2); // Suporte do monitor

    // Tela ligada exibindo código com syntax highlighting
    ctx.fillStyle = '#0B1528';
    ctx.fillRect(monX + 1, monY + 1, monW - 2, monH - 2);

    // Linhas de código coloridas
    ctx.fillStyle = '#38BDF8'; // Azul
    ctx.fillRect(monX + 3, monY + 3, 6, 1.5);
    ctx.fillStyle = '#FACC15'; // Amarelo
    ctx.fillRect(monX + 10, monY + 3, 8, 1.5);
    ctx.fillStyle = '#4ADE80'; // Verde
    ctx.fillRect(monX + 3, monY + 6, 12, 1.5);
    ctx.fillStyle = '#F472B6'; // Rosa
    ctx.fillRect(monX + 5, monY + 9, 14, 1.5);

    // Monitor Secundário Vertical (9:16) para Terminal / Logs
    const vMonW = 10;
    const vMonH = 18;
    const vMonX = fX + 48;
    const vMonY = fY + 1;

    ctx.fillStyle = '#020617';
    ctx.fillRect(vMonX, vMonY, vMonW, vMonH);
    ctx.fillStyle = '#064E3B';
    ctx.fillRect(vMonX + 1, vMonY + 1, vMonW - 2, vMonH - 2);

    // Linhas de log verde terminal
    ctx.fillStyle = '#34D399';
    for (let ly = vMonY + 3; ly < vMonY + vMonH - 2; ly += 3) {
      ctx.fillRect(vMonX + 2, ly, (ly % 2 === 0 ? 5 : 4), 1);
    }

    // Xícara de café fumegante ☕
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(fX + 8, fY + 16, 5, 5);
    ctx.fillStyle = '#78350F';
    ctx.fillRect(fX + 9, fY + 17, 3, 3);
    // Vapor subindo
    const steamY = Math.sin(time * 5) * 2;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(fX + 10, fY + 12 + steamY, 1, 2);

  } else if (item.type === 'bookshelf') {
    // ── 2. Estante de Livros Clássica: Madeira Maciça, Lombadas Coloridas & Troféu ──
    ctx.fillStyle = '#271206';
    ctx.fillRect(fX, fY, W, H);
    ctx.fillStyle = '#451A03';
    ctx.fillRect(fX + 2, fY + 2, W - 4, H - 4);

    // Cornija / Moldura do topo
    ctx.fillStyle = '#78350F';
    ctx.fillRect(fX - 2, fY, W + 4, 3);
    ctx.fillStyle = '#92400E';
    ctx.fillRect(fX - 2, fY, W + 4, 1);

    // Troféu acadêmico dourado na prateleira superior
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(fX + 8, fY + 4, 6, 6);
    ctx.fillStyle = '#FDE047';
    ctx.fillRect(fX + 9, fY + 5, 4, 3);
    ctx.fillStyle = '#78350F';
    ctx.fillRect(fX + 9, fY + 10, 4, 2);

    // Prateleiras com livros encadernados
    const bookColors = ['#DC2626', '#2563EB', '#16A34A', '#D97706', '#7C3AED', '#0284C7', '#EA580C'];
    const shelfYStarts = [fY + 14, fY + 28, fY + 42];

    shelfYStarts.forEach((sy, sIdx) => {
      // Régua da prateleira de madeira
      ctx.fillStyle = '#78350F';
      ctx.fillRect(fX + 2, sy + 10, W - 4, 2);

      let bx = fX + 4;
      while (bx < fX + W - 6) {
        const c = bookColors[(bx + sIdx * 3) % bookColors.length];
        const bW = 4;
        const bH = 8 + (bx % 3);

        ctx.fillStyle = c;
        ctx.fillRect(bx, sy + 10 - bH, bW, bH);

        // Fita dourada na lombada
        ctx.fillStyle = '#FEF08A';
        ctx.fillRect(bx, sy + 10 - bH + 2, bW, 1);

        bx += bW + 1;
      }
    });

  } else if (item.type === 'server_cabinet') {
    // ── 3. Rack de Servidores 42U Datacenter com LEDs Cascata & Cabos ──
    ctx.fillStyle = '#020617';
    ctx.fillRect(fX, fY, W, H);
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(fX + 2, fY + 2, W - 4, H - 4);

    // Moldura do rack com parafusos de trilho
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 1;
    ctx.strokeRect(fX, fY, W, H);

    // Portas perfuradas e lâminas de servidor
    for (let sy = fY + 4; sy < fY + H - 6; sy += 9) {
      // Chassis de servidor 1U/2U
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(fX + 4, sy, W - 8, 7);

      // Grade de ventilação frontal
      ctx.fillStyle = '#0F172A';
      for (let gx = fX + 6; gx < fX + W - 14; gx += 3) {
        ctx.fillRect(gx, sy + 2, 1.5, 3);
      }

      // LEDs de status (Power, Disk I/O, Network Activity)
      const blink1 = Math.sin(time * 8 + sy) > 0;
      const blink2 = Math.cos(time * 12 + sy) > 0;
      const blink3 = Math.sin(time * 15 + sy * 2) > 0.3;

      ctx.fillStyle = blink1 ? '#22C55E' : '#14532D'; // LED verde de energia
      ctx.fillRect(fX + W - 12, sy + 2, 2, 2);

      ctx.fillStyle = blink2 ? '#F59E0B' : '#78350F'; // LED âmbar de disco
      ctx.fillRect(fX + W - 9, sy + 2, 2, 2);

      ctx.fillStyle = blink3 ? '#00F0FF' : '#0369A1'; // LED ciano de rede
      ctx.fillRect(fX + W - 6, sy + 2, 2, 2);
    }

    // Calha de cabeamento lateral com feixe amarelo e ciano
    ctx.fillStyle = '#FACC15';
    ctx.fillRect(fX + 2, fY + 4, 1, H - 8);
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(fX + 3, fY + 4, 1, H - 8);

  } else if (item.type === 'whiteboard') {
    // ── 4. Quadro Branco de Engenharia: Moldura de Alumínio, Diagrama de IA & Post-its ──
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(fX, fY, W, H);
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.strokeRect(fX, fY, W, H);

    // Rebites nos cantos da moldura
    ctx.fillStyle = '#64748B';
    ctx.fillRect(fX + 1, fY + 1, 2, 2);
    ctx.fillRect(fX + W - 3, fY + 1, 2, 2);

    // Diagrama de arquitetura desenhado a caneta azul
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 1;
    ctx.strokeRect(fX + 6, fY + 6, 16, 10); // Caixa LLM
    ctx.strokeRect(fX + 32, fY + 6, 16, 10); // Caixa Agente
    ctx.strokeRect(fX + 58, fY + 6, 16, 10); // Caixa MCP
    // Setas conectando
    ctx.beginPath();
    ctx.moveTo(fX + 22, fY + 11);
    ctx.lineTo(fX + 32, fY + 11);
    ctx.moveTo(fX + 48, fY + 11);
    ctx.lineTo(fX + 58, fY + 11);
    ctx.stroke();

    // Post-its coloridos afixados
    ctx.fillStyle = '#FEF08A'; // Post-it amarelo
    ctx.fillRect(fX + 8, fY + 20, 8, 8);
    ctx.fillStyle = '#BAE6FD'; // Post-it ciano
    ctx.fillRect(fX + 20, fY + 20, 8, 8);
    ctx.fillStyle = '#FBCFE8'; // Post-it rosa
    ctx.fillRect(fX + 32, fY + 20, 8, 8);

    // Calha de marcadores na borda inferior
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(fX + (W / 2) - 16, fY + H - 3, 32, 3);
    // Canetas e apagador
    ctx.fillStyle = '#DC2626'; // Caneta vermelha
    ctx.fillRect(fX + (W / 2) - 14, fY + H - 4, 6, 1.5);
    ctx.fillStyle = '#2563EB'; // Caneta azul
    ctx.fillRect(fX + (W / 2) - 6, fY + H - 4, 6, 1.5);
    ctx.fillStyle = '#0F172A'; // Apagador
    ctx.fillRect(fX + (W / 2) + 2, fY + H - 4, 8, 2);

  } else if (item.type === 'plant') {
    // ── 5. Vaso de Planta Monstera / Costela-de-Adão em Pixel Art 16-bit ──
    // Vaso de cerâmica terracota com borda chanfrada
    const potW = 16;
    const potH = 12;
    const potX = fX + (W / 2) - (potW / 2);
    const potY = fY + H - potH;

    ctx.fillStyle = '#9A3412';
    ctx.fillRect(potX, potY, potW, potH);
    ctx.fillStyle = '#EA580C';
    ctx.fillRect(potX + 1, potY + 1, potW - 2, 2); // Borda iluminada
    ctx.fillStyle = '#7C2D12';
    ctx.fillRect(potX + potW - 3, potY, 3, potH); // Sombra do vaso

    // Terra preta orgânica
    ctx.fillStyle = '#1C1917';
    ctx.fillRect(potX + 2, potY, potW - 4, 3);

    // Folhagem exuberante da Monstera em camadas de pixel art
    // Folha esquerda
    drawPixelFoliageCluster(ctx, potX - 2, potY - 8, 14, 12, '#064E3B', '#15803D', '#22C55E', '#4ADE80');
    // Folha direita
    drawPixelFoliageCluster(ctx, potX + potW + 2, potY - 7, 14, 12, '#064E3B', '#15803D', '#22C55E', '#4ADE80');
    // Folha central erguida
    drawPixelFoliageCluster(ctx, potX + (potW / 2), potY - 14, 18, 14, '#064E3B', '#16A34A', '#22C55E', '#86EFAC');

  } else if (item.type === 'ai_holo') {
    // ── 6. Emitter Holográfico 3D de Inteligência Artificial ──
    const floatY = fY + Math.sin(time * 3) * 5;
    const centerX = fX + (W / 2);
    const centerY = floatY + (H / 2);

    // Base metálica emissora no piso
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(centerX - 12, fY + H - 6, 24, 6);
    ctx.fillStyle = '#00F0FF';
    ctx.fillRect(centerX - 8, fY + H - 5, 16, 2);

    // Feixe vertical de luz volumétrica translúcida
    const beamGrad = ctx.createLinearGradient(0, fY + H - 6, 0, centerY);
    beamGrad.addColorStop(0, 'rgba(0, 240, 255, 0.45)');
    beamGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.25)');
    beamGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(centerX - 8, fY + H - 6);
    ctx.lineTo(centerX - 16, centerY);
    ctx.lineTo(centerX + 16, centerY);
    ctx.lineTo(centerX + 8, fY + H - 6);
    ctx.closePath();
    ctx.fill();

    // Núcleo de IA Holográfico 3D Girando
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(time * 1.8);

    // Anel externo
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-10, -10, 20, 20);

    // Anel interno invertido
    ctx.rotate(Math.PI / 4 + time);
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 1;
    ctx.strokeRect(-7, -7, 14, 14);

    ctx.restore();

    // Ponto focal central super-brilhante
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(centerX - 2, centerY - 2, 4, 4);

    // Fagulhas holográficas flutuantes
    for (let sp = 0; sp < 4; sp++) {
      const spY = centerY - 10 + Math.sin(time * 4 + sp * 2) * 8;
      const spX = centerX + Math.cos(time * 3 + sp * 1.5) * 12;
      ctx.fillStyle = sp % 2 === 0 ? '#00F0FF' : '#FEF08A';
      ctx.fillRect(spX, spY, 2, 2);
    }
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
