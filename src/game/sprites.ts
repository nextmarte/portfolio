import { EraOutfit, Milestone, Obstacle, Platform, SceneryProp, TechOrb } from './types';

// Helper to draw a pixel block
export function drawPixel(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number = 2) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), size, size);
}

// 16-bit Character Palette Definition
interface CharacterPalette {
  hair: string;
  hairHighlight: string;
  hairShadow: string;
  skin: string;
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
}

const PALETTES: Record<EraOutfit, CharacterPalette> = {
  cefet: {
    hair: '#3E2723',
    hairHighlight: '#5D4037',
    hairShadow: '#24140E',
    skin: '#F5D0A9',
    skinShadow: '#D4956A',
    eyes: '#2E7D32',
    shirt: '#CFD8DC', // Uniforme cinza técnico
    shirtHighlight: '#ECEFF1',
    shirtShadow: '#90A4AE',
    pants: '#37474F',
    pantsShadow: '#212121',
    shoes: '#4E342E',
    shoesSole: '#D7CCC8',
    backpack: '#C62828', // Mochila de estudante vermelha
  },
  chemtech: {
    hair: '#3E2723',
    hairHighlight: '#5D4037',
    hairShadow: '#24140E',
    skin: '#F5D0A9',
    skinShadow: '#D4956A',
    eyes: '#2E7D32',
    shirt: '#0288D1', // Azul Siemens / Chemtech
    shirtHighlight: '#29B6F6',
    shirtShadow: '#01579B',
    pants: '#263238',
    pantsShadow: '#191E20',
    shoes: '#212121',
    shoesSole: '#FFA000',
    accessory: '#FFC107', // Crachá de segurança
    hat: '#F59E0B', // Capacete industrial
  },
  uff: {
    hair: '#3E2723',
    hairHighlight: '#5D4037',
    hairShadow: '#24140E',
    skin: '#F5D0A9',
    skinShadow: '#D4956A',
    eyes: '#2E7D32',
    shirt: '#1565C0', // Azul clássico universitário
    shirtHighlight: '#42A5F5',
    shirtShadow: '#0D47A1',
    pants: '#455A64',
    pantsShadow: '#263238',
    shoes: '#5D4037',
    shoesSole: '#8D6E63',
    backpack: '#424242', // Pasta acadêmica
  },
  cid: {
    hair: '#3E2723',
    hairHighlight: '#5D4037',
    hairShadow: '#24140E',
    skin: '#F5D0A9',
    skinShadow: '#D4956A',
    eyes: '#2E7D32',
    shirt: '#311B92', // Púrpura Data Scientist
    shirtHighlight: '#5E35B1',
    shirtShadow: '#1A0C54',
    pants: '#1E293B',
    pantsShadow: '#0F172A',
    shoes: '#334155',
    shoesSole: '#64748B',
    accessory: '#00E676', // Tablet / sensor Laguna
  },
  baxijen: {
    hair: '#3E2723',
    hairHighlight: '#5D4037',
    hairShadow: '#24140E',
    skin: '#F5D0A9',
    skinShadow: '#D4956A',
    eyes: '#2E7D32',
    shirt: '#090D16', // Dark Cyber AI Architect
    shirtHighlight: '#1E293B',
    shirtShadow: '#020617',
    pants: '#0F172A',
    pantsShadow: '#020617',
    shoes: '#0EA5E9',
    shoesSole: '#E0F2FE',
    accessory: '#38BDF8', // Emblema neural ciano brilhante
  },
};

/**
 * Renderiza o personagem com detalhes 16-bit autênticos
 */
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
  invulnerableTimer: number
) {
  // Efeito de piscar caso esteja invulnerável após dano
  if (invulnerableTimer > 0 && Math.floor(invulnerableTimer * 20) % 2 === 0) {
    return;
  }

  const p = PALETTES[outfit] || PALETTES.baxijen;
  const S = 2; // Pixel unit size (2x2)

  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  // Sombra dinâmica no chão
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  const shadowWidth = isGrounded ? 18 : 12;
  const shadowOffset = isGrounded ? 0 : 4;
  ctx.beginPath();
  ctx.ellipse(0, 2 + shadowOffset, shadowWidth, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  if (facing === 'left') {
    ctx.scale(-1, 1);
  }

  // Se estiver tropeçando, ligeira inclinação para trás e cor de alerta
  const isStumbling = stumbleTimer > 0;
  if (isStumbling) {
    ctx.rotate(-0.15);
  }

  // Animação de bounce
  const bounceY = !isGrounded ? -3 : (frame % 2 === 1 ? -1 : 0);

  // 1. MOCHILA / ACESSÓRIO NAS COSTAS
  if (p.backpack) {
    ctx.fillStyle = p.backpack;
    ctx.fillRect(-9 * S, (-20 + bounceY) * S, 4 * S, 9 * S);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(-9 * S, (-13 + bounceY) * S, 4 * S, 2 * S);
  }

  // 2. CABELO & CABEÇA
  // Topo do cabelo
  ctx.fillStyle = isStumbling ? '#EF4444' : p.hair;
  ctx.fillRect(-6 * S, (-30 + bounceY) * S, 12 * S, 6 * S);
  ctx.fillRect(-7 * S, (-29 + bounceY) * S, 14 * S, 4 * S);

  // Brilho do cabelo
  ctx.fillStyle = p.hairHighlight;
  ctx.fillRect(-4 * S, (-31 + bounceY) * S, 7 * S, 1 * S);
  ctx.fillRect(-5 * S, (-30 + bounceY) * S, 4 * S, 1 * S);

  // Sombra do cabelo
  ctx.fillStyle = p.hairShadow;
  ctx.fillRect(-6 * S, (-25 + bounceY) * S, 12 * S, 1 * S);

  // Capacete (se for Chemtech)
  if (p.hat) {
    ctx.fillStyle = p.hat;
    ctx.fillRect(-7 * S, (-33 + bounceY) * S, 14 * S, 4 * S);
    ctx.fillRect(-8 * S, (-29 + bounceY) * S, 16 * S, 2 * S); // Aba
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-2 * S, (-32 + bounceY) * S, 4 * S, 2 * S); // Faixa refletiva
  }

  // Rosto / Pele
  ctx.fillStyle = p.skin;
  ctx.fillRect(-6 * S, (-24 + bounceY) * S, 12 * S, 8 * S);
  ctx.fillStyle = p.skinShadow;
  ctx.fillRect(-6 * S, (-17 + bounceY) * S, 12 * S, 1 * S); // Sombra do queixo

  // Olhos verdes expressivos estilo 16-bit
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(-1 * S, (-22 + bounceY) * S, 3 * S, 3 * S);
  ctx.fillRect(3 * S, (-22 + bounceY) * S, 3 * S, 3 * S);

  ctx.fillStyle = p.eyes;
  ctx.fillRect(0 * S, (-21 + bounceY) * S, 2 * S, 2 * S);
  ctx.fillRect(4 * S, (-21 + bounceY) * S, 2 * S, 2 * S);

  // Brilho dos olhos
  ctx.fillStyle = '#BBF7D0';
  ctx.fillRect(0 * S, (-22 + bounceY) * S, 1 * S, 1 * S);
  ctx.fillRect(4 * S, (-22 + bounceY) * S, 1 * S, 1 * S);

  // Sorriso / Expressão
  if (isStumbling) {
    // Boca de "Ouch!"
    ctx.fillStyle = '#991B1B';
    ctx.fillRect(1 * S, (-18 + bounceY) * S, 3 * S, 2 * S);
  } else {
    // Sorriso confiante
    ctx.fillStyle = p.skinShadow;
    ctx.fillRect(0 * S, (-17 + bounceY) * S, 4 * S, 1 * S);
    ctx.fillRect(3 * S, (-18 + bounceY) * S, 1 * S, 1 * S);
  }

  // 3. TRONCO / CAMISA
  const torsoY = (-16 + bounceY) * S;
  ctx.fillStyle = p.shirt;
  ctx.fillRect(-5 * S, torsoY, 10 * S, 10 * S);

  // Brilho e Sombra da camisa
  ctx.fillStyle = p.shirtHighlight;
  ctx.fillRect(-5 * S, torsoY, 2 * S, 9 * S);
  ctx.fillStyle = p.shirtShadow;
  ctx.fillRect(3 * S, torsoY, 2 * S, 10 * S);
  ctx.fillRect(-5 * S, torsoY + 8 * S, 10 * S, 2 * S);

  // Detalhe de acessório (ex: crachá, tablet, logo neural da BaXiJen)
  if (p.accessory) {
    ctx.fillStyle = p.accessory;
    ctx.fillRect(0 * S, torsoY + 2 * S, 3 * S, 3 * S);
    if (outfit === 'baxijen') {
      // Glow neural pulsante
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(1 * S, torsoY + 3 * S, 1 * S, 1 * S);
    }
  }

  // 4. BRAÇOS & MÃOS
  let armSwing = 0;
  if (!isGrounded) {
    armSwing = -4; // Braços erguidos no salto
  } else if (isStumbling) {
    armSwing = 5; // Braços para trás no tropeço
  } else {
    armSwing = Math.sin((frame / 4) * Math.PI * 2) * 4;
  }

  // Braço de trás
  ctx.fillStyle = p.shirtShadow;
  ctx.fillRect((-7 * S) - (armSwing * S * 0.3), torsoY + (1 * S), 2 * S, 8 * S);
  ctx.fillStyle = p.skin;
  ctx.fillRect((-7 * S) - (armSwing * S * 0.3), torsoY + (9 * S), 2 * S, 2 * S);

  // Braço da frente
  ctx.fillStyle = p.shirt;
  ctx.fillRect((5 * S) + (armSwing * S * 0.3), torsoY + (1 * S), 2 * S, 8 * S);
  ctx.fillStyle = p.skin;
  ctx.fillRect((5 * S) + (armSwing * S * 0.3), torsoY + (9 * S), 2 * S, 2 * S);

  // 5. PERNAS & PÉS
  const legY = torsoY + (10 * S);

  if (isJumping) {
    // Perna esquerda dobrada
    ctx.fillStyle = p.pants;
    ctx.fillRect(-5 * S, legY, 4 * S, 5 * S);
    ctx.fillStyle = p.shoes;
    ctx.fillRect(-6 * S, legY + 4 * S, 6 * S, 3 * S);
    ctx.fillStyle = p.shoesSole;
    ctx.fillRect(-6 * S, legY + 7 * S, 6 * S, 1 * S);

    // Perna direita esticada
    ctx.fillStyle = p.pants;
    ctx.fillRect(1 * S, legY, 4 * S, 7 * S);
    ctx.fillStyle = p.shoes;
    ctx.fillRect(1 * S, legY + 6 * S, 6 * S, 3 * S);
    ctx.fillStyle = p.shoesSole;
    ctx.fillRect(1 * S, legY + 9 * S, 6 * S, 1 * S);
  } else {
    // Animação de corrida em 4 frames
    const legOffset1 = Math.sin((frame / 4) * Math.PI * 2) * 4;
    const legOffset2 = -legOffset1;

    // Perna traseira
    ctx.fillStyle = p.pantsShadow;
    ctx.fillRect(-5 * S + (legOffset2 * S * 0.6), legY, 4 * S, 7 * S);
    ctx.fillStyle = p.shoes;
    ctx.fillRect(-6 * S + (legOffset2 * S * 0.6), legY + 7 * S, 6 * S, 3 * S);
    ctx.fillStyle = p.shoesSole;
    ctx.fillRect(-6 * S + (legOffset2 * S * 0.6), legY + 9 * S, 6 * S, 1 * S);

    // Perna dianteira
    ctx.fillStyle = p.pants;
    ctx.fillRect(1 * S + (legOffset1 * S * 0.6), legY, 4 * S, 7 * S);
    ctx.fillStyle = p.shoes;
    ctx.fillRect(1 * S + (legOffset1 * S * 0.6), legY + 7 * S, 6 * S, 3 * S);
    ctx.fillStyle = p.shoesSole;
    ctx.fillRect(1 * S + (legOffset1 * S * 0.6), legY + 9 * S, 6 * S, 1 * S);
  }

  ctx.restore();
}

/**
 * Desenha os Prédios e Marcos com Arquitetura Realística 16-bit
 */
export function drawDetailedBuilding(
  ctx: CanvasRenderingContext2D,
  m: Milestone,
  groundY: number,
  isDark: boolean,
  time: number
) {
  const S = 2;
  const bX = Math.floor(m.x);
  const bY = Math.floor(groundY - m.height);
  const W = m.width;
  const H = m.height;

  ctx.save();

  // Sombra suave do edifício
  ctx.fillStyle = isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.18)';
  ctx.fillRect(bX - 12, groundY - 3, W + 24, 7);

  // 1. CORPO PRINCIPAL
  ctx.fillStyle = m.color;
  ctx.fillRect(bX, bY, W, H);

  // 2. DETALHES POR ESTILO
  if (m.buildingStyle === 'cefet') {
    // Estilo técnico industrial CEFET: Tijolos vermelhos e chaminé
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    for (let iy = bY + 16; iy < groundY - 12; iy += 12) {
      for (let ix = bX + 6; ix < bX + W - 6; ix += 20) {
        ctx.fillRect(ix, iy, 10, 1);
      }
    }
    // Chaminé lateral de laboratório
    ctx.fillStyle = '#5D2E0A';
    ctx.fillRect(bX + W - 24, bY - 30, 16, 30);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(bX + W - 26, bY - 34, 20, 5);

    // Fumacinha pixelada saindo
    const smokeOffset = (time * 20) % 40;
    ctx.fillStyle = 'rgba(200, 200, 200, 0.4)';
    ctx.fillRect(bX + W - 18, bY - 40 - smokeOffset, 8, 8);
    ctx.fillRect(bX + W - 14, bY - 55 - smokeOffset, 12, 10);
  } else if (m.buildingStyle === 'chemtech') {
    // Estilo Corporativo Siemens: Faixas de vidro e antena de rádio
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(bX + 8, bY + 10, W - 16, H - 30);

    // Antena no topo com luz vermelha piscante
    ctx.fillStyle = '#64748B';
    ctx.fillRect(bX + (W / 2) - 2, bY - 36, 4, 36);
    ctx.fillRect(bX + (W / 2) - 8, bY - 24, 16, 2);
    const blink = Math.sin(time * 6) > 0;
    ctx.fillStyle = blink ? '#EF4444' : '#7F1D1D';
    ctx.fillRect(bX + (W / 2) - 3, bY - 40, 6, 6);
  } else if (m.buildingStyle === 'uff') {
    // Estilo Campus Universitário: Colunas clássicas e frontão
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    // 4 colunas clássicas
    for (let c = 0; c < 4; c++) {
      const colX = bX + 16 + (c * ((W - 40) / 3));
      ctx.fillRect(colX, bY + 24, 10, H - 34);
      // Capitel da coluna
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(colX - 2, bY + 20, 14, 4);
    }
  } else if (m.buildingStyle === 'cid') {
    // CID - UFF: Painéis solares e sensores IoT
    // Painel solar no teto inclinado
    ctx.fillStyle = '#1E3A8A';
    ctx.fillRect(bX + 12, bY - 14, W - 24, 10);
    ctx.strokeStyle = '#60A5FA';
    ctx.strokeRect(bX + 12, bY - 14, W - 24, 10);

    // Letreiro do Projeto LAGUNA
    ctx.fillStyle = '#065F46';
    ctx.fillRect(bX + 16, groundY - 45, W - 32, 12);
    ctx.fillStyle = '#34D399';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PROJETO LAGUNA', bX + (W / 2), groundY - 36);
  } else if (m.buildingStyle === 'coppead') {
    // COPPEAD/UFRJ: Cúpula executiva acadêmica
    ctx.fillStyle = '#831843';
    ctx.beginPath();
    ctx.arc(bX + (W / 2), bY, 28, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(bX + (W / 2) - 2, bY - 36, 4, 10); // Agulha da cúpula
  } else if (m.buildingStyle === 'baxijen') {
    // BaXiJen: Sede Cyberpunk com holograma e neon
    // Faixas de neon laterais que pulsam
    const pulse = 0.5 + Math.sin(time * 4) * 0.5;
    ctx.fillStyle = `rgba(56, 189, 248, ${0.4 + pulse * 0.4})`;
    ctx.fillRect(bX + 2, bY + 8, 4, H - 16);
    ctx.fillRect(bX + W - 6, bY + 8, 4, H - 16);

    // Núcleo de IA no topo (Hexágono / Diamante flutuante)
    const floatY = bY - 32 + Math.sin(time * 3) * 4;
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(bX + (W / 2), floatY, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(bX + (W / 2), floatY, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. TELHADO & COROAMENTO
  ctx.fillStyle = m.roofColor;
  ctx.fillRect(bX - 6, bY - 8, W + 12, 9);

  // 4. LETREIRO DE NEON / PLACA INSTITUCIONAL
  const signH = 22;
  const signW = W - 20;
  const signX = bX + 10;
  const signY = bY - 32;

  ctx.fillStyle = isDark ? '#020617' : '#0F172A';
  ctx.fillRect(signX, signY, signW, signH);
  ctx.strokeStyle = m.neonColor;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(signX, signY, signW, signH);

  // Texto neon iluminado
  ctx.fillStyle = m.neonColor;
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(m.label, bX + (W / 2), signY + 12);

  if (m.subLabel) {
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '8px monospace';
    ctx.fillText(m.subLabel, bX + (W / 2), signY + 20);
  }

  // 5. JANELAS RETRÔ ILUMINADAS
  const winRows = Math.floor((H - 55) / 24);
  const winCols = Math.floor((W - 24) / 22);
  const winColor = isDark ? '#FEF08A' : '#E0F2FE';

  for (let r = 0; r < winRows; r++) {
    for (let c = 0; c < winCols; c++) {
      const wx = bX + 14 + (c * 22);
      const wy = bY + 16 + (r * 24);

      // Moldura da janela
      ctx.fillStyle = isDark ? 'rgba(0,0,0,0.5)' : '#94A3B8';
      ctx.fillRect(wx - 1, wy - 1, 14, 16);

      // Vidro
      const isLit = (r + c + Math.floor(m.x / 50)) % 3 !== 0;
      ctx.fillStyle = isLit ? winColor : (isDark ? '#1E293B' : '#64748B');
      ctx.fillRect(wx, wy, 12, 14);

      // Cruzeta da janela
      ctx.fillStyle = isDark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.4)';
      ctx.fillRect(wx + 5, wy, 2, 14);
      ctx.fillRect(wx, wy + 6, 12, 2);
    }
  }

  // 6. PORTA DE ENTRADA
  const doorW = 24;
  const doorH = 30;
  const doorX = bX + (W / 2) - (doorW / 2);
  const doorY = groundY - doorH;

  ctx.fillStyle = isDark ? '#020617' : '#1E293B';
  ctx.fillRect(doorX, doorY, doorW, doorH);
  ctx.strokeStyle = m.accentColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(doorX, doorY, doorW, doorH);

  // Tapete de entrada
  ctx.fillStyle = m.accentColor;
  ctx.fillRect(doorX - 4, groundY - 2, doorW + 8, 3);

  // Luz da porta
  ctx.fillStyle = '#F59E0B';
  ctx.fillRect(doorX + (doorW / 2) - 2, doorY - 4, 4, 4);

  ctx.restore();
}

/**
 * Desenha Obstáculos Retrô (Bugs de software, servidores, cones, firewalls)
 */
export function drawObstacle(
  ctx: CanvasRenderingContext2D,
  obs: Obstacle,
  groundY: number,
  isDark: boolean,
  time: number
) {
  const oX = Math.floor(obs.x);
  const oY = Math.floor(groundY - obs.height);
  const S = 2;

  ctx.save();

  if (obs.type === 'glitch_bug') {
    // Inseto de Bug de Software animado!
    const wingFlap = Math.sin(time * 18) * 4;
    const bugY = oY + Math.sin(time * 6) * 3;

    // Sombra do bug no chão
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(oX + (obs.width / 2), groundY - 2, 10, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Asas
    ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.fillRect(oX + 2, bugY - 6 + wingFlap, 6, 8);
    ctx.fillRect(oX + 16, bugY - 6 - wingFlap, 6, 8);

    // Corpo de besouro mecânico / Bug
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(oX + 6, bugY, 12, 14);
    ctx.fillStyle = '#991B1B';
    ctx.fillRect(oX + 8, bugY + 3, 8, 8);

    // Olhos digitais vermelhos incandescentes
    ctx.fillStyle = '#FEF08A';
    ctx.fillRect(oX + 8, bugY + 2, 3, 3);
    ctx.fillRect(oX + 13, bugY + 2, 3, 3);

    // Perninhas mecânicas
    ctx.fillStyle = '#450A0A';
    ctx.fillRect(oX + 3, bugY + 12, 3, 4);
    ctx.fillRect(oX + 18, bugY + 12, 3, 4);

    // Balãozinho de "BUG"
    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('!BUG', oX + (obs.width / 2), bugY - 10);
  } else if (obs.type === 'server_rack') {
    // Rack de servidor com LEDs piscando
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(oX, oY, obs.width, obs.height);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(oX, oY, obs.width, obs.height);

    // Blades do servidor
    for (let by = oY + 4; by < oY + obs.height - 4; by += 8) {
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(oX + 3, by, obs.width - 6, 6);

      // LEDs
      const ledOn1 = Math.sin(time * 10 + by) > 0;
      const ledOn2 = Math.cos(time * 8 + by) > 0;
      ctx.fillStyle = ledOn1 ? '#22C55E' : '#14532D';
      ctx.fillRect(oX + 6, by + 2, 2, 2);
      ctx.fillStyle = ledOn2 ? '#38BDF8' : '#0369A1';
      ctx.fillRect(oX + 10, by + 2, 2, 2);
    }
  } else if (obs.type === 'hazard_cone') {
    // Cone de atenção industrial
    ctx.fillStyle = '#EA580C';
    ctx.beginPath();
    ctx.moveTo(oX + (obs.width / 2), oY);
    ctx.lineTo(oX + obs.width, groundY);
    ctx.lineTo(oX, groundY);
    ctx.closePath();
    ctx.fill();

    // Faixas brancas refletivas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(oX + 5, oY + 10, obs.width - 10, 4);
    ctx.fillRect(oX + 3, oY + 18, obs.width - 6, 4);

    // Base preta
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(oX - 2, groundY - 4, obs.width + 4, 4);
  } else if (obs.type === 'firewall') {
    // Firewall / Barreira de energia digital
    const pulse = Math.sin(time * 12) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(239, 68, 68, ${0.3 * pulse})`;
    ctx.fillRect(oX - 4, oY, obs.width + 8, obs.height);

    ctx.fillStyle = '#EF4444';
    ctx.fillRect(oX, oY, obs.width, obs.height);

    // Feixes de eletricidade/código
    ctx.fillStyle = '#FDE047';
    for (let ly = oY; ly < groundY; ly += 6) {
      const jx = Math.sin(ly + time * 15) * 3;
      ctx.fillRect(oX + (obs.width / 2) + jx, ly, 2, 3);
    }
  }

  ctx.restore();
}

/**
 * Desenha Plataformas Elevadas para Pulos Verticais
 */
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
    // Viga metálica de engenharia
    ctx.fillStyle = '#475569';
    ctx.fillRect(pX, pY, W, H);
    ctx.fillStyle = '#64748B';
    ctx.fillRect(pX, pY, W, 3);
    // Parafusos / rebites
    ctx.fillStyle = '#CBD5E1';
    for (let rx = pX + 4; rx < pX + W; rx += 14) {
      ctx.fillRect(rx, pY + (H / 2) - 1, 2, 2);
    }
  } else if (plat.type === 'brick') {
    // Tijolos clássicos estilo Mario / Retrô
    ctx.fillStyle = '#B45309';
    ctx.fillRect(pX, pY, W, H);
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(pX, pY, W, 2);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    for (let bx = pX + 16; bx < pX + W; bx += 16) {
      ctx.fillRect(bx, pY, 2, H);
    }
  } else if (plat.type === 'wood') {
    // Pranchas de madeira do campus
    ctx.fillStyle = '#78350F';
    ctx.fillRect(pX, pY, W, H);
    ctx.fillStyle = '#92400E';
    ctx.fillRect(pX, pY, W, 2);
  } else if (plat.type === 'cyber') {
    // Plataforma cibernética futurista com borda neon
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(pX, pY, W, H);
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pX, pY, W, H);
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(pX, pY, W, 2);
  }

  ctx.restore();
}

/**
 * Desenha Elementos de Cenário (Postes com Cone de Luz Realista, Bancos, Flores)
 */
export function drawSceneryProps(
  ctx: CanvasRenderingContext2D,
  prop: SceneryProp,
  groundY: number,
  isDark: boolean
) {
  const pX = Math.floor(prop.x);
  ctx.save();

  if (prop.type === 'lamp_classic' || prop.type === 'lamp_cyber') {
    const lampH = 65;
    const lampY = groundY - lampH;
    const isCyber = prop.type === 'lamp_cyber';

    // Poste
    ctx.fillStyle = isCyber ? '#0F172A' : '#334155';
    ctx.fillRect(pX + 3, lampY, 4, lampH);
    ctx.fillStyle = isCyber ? '#38BDF8' : '#64748B';
    ctx.fillRect(pX, lampY, 10, 4);

    // Lâmpada
    const lightColor = isCyber ? '#38BDF8' : '#FEF08A';
    ctx.fillStyle = lightColor;
    ctx.fillRect(pX + 2, lampY + 4, 6, 6);

    // Cone de Luz Iluminado no chão (Modo Noite)
    if (isDark) {
      const grad = ctx.createRadialGradient(
        pX + 5, lampY + 7, 2,
        pX + 5, groundY, 70
      );
      grad.addColorStop(0, isCyber ? 'rgba(56, 189, 248, 0.45)' : 'rgba(254, 240, 138, 0.4)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(pX + 5, lampY + 7);
      ctx.lineTo(pX - 45, groundY);
      ctx.lineTo(pX + 55, groundY);
      ctx.closePath();
      ctx.fill();
    }
  } else if (prop.type === 'bench') {
    // Banco de praça
    ctx.fillStyle = '#854D0E';
    ctx.fillRect(pX, groundY - 14, 28, 4); // Assento
    ctx.fillRect(pX + 2, groundY - 22, 24, 4); // Encosto
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(pX + 4, groundY - 14, 3, 14); // Pés
    ctx.fillRect(pX + 21, groundY - 14, 3, 14);
  } else if (prop.type === 'bush_flowers') {
    // Arbusto com flores coloridas
    ctx.fillStyle = isDark ? '#14532D' : '#16A34A';
    ctx.beginPath();
    ctx.arc(pX + 10, groundY - 8, 12, 0, Math.PI * 2);
    ctx.arc(pX + 20, groundY - 12, 14, 0, Math.PI * 2);
    ctx.arc(pX + 30, groundY - 8, 11, 0, Math.PI * 2);
    ctx.fill();

    // Florzinhas pixeladas
    ctx.fillStyle = '#F43F5E';
    ctx.fillRect(pX + 8, groundY - 14, 3, 3);
    ctx.fillRect(pX + 22, groundY - 18, 3, 3);
    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(pX + 16, groundY - 10, 3, 3);
    ctx.fillRect(pX + 28, groundY - 12, 3, 3);
  } else if (prop.type === 'hydrant') {
    // Hidrante vermelho
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(pX, groundY - 16, 10, 16);
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(pX - 2, groundY - 12, 14, 4);
    ctx.fillStyle = '#B91C1C';
    ctx.fillRect(pX + 2, groundY - 19, 6, 4);
  }

  ctx.restore();
}

/**
 * Desenha Orbes Colecionáveis com Ícones Específicos
 */
export function drawTechOrb(
  ctx: CanvasRenderingContext2D,
  orb: TechOrb,
  time: number
) {
  if (orb.collected) return;

  const floatY = orb.y + Math.sin(time * 3 + orb.floatOffset) * 6;
  const x = Math.floor(orb.x);
  const S = 2;

  ctx.save();

  // Glow halo pulsante
  const haloRadius = 14 + Math.sin(time * 4 + orb.floatOffset) * 3;
  ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.beginPath();
  ctx.arc(x, floatY, haloRadius, 0, Math.PI * 2);
  ctx.fill();

  // Orbe / Cristais 16-bit
  ctx.fillStyle = '#0284C7';
  ctx.fillRect(x - 9, floatY - 9, 18, 18);
  ctx.fillStyle = '#38BDF8';
  ctx.fillRect(x - 7, floatY - 7, 14, 14);

  // Ícones específicos desenhados em pixel
  ctx.fillStyle = '#FFFFFF';
  if (orb.iconType === 'python') {
    ctx.fillStyle = '#FACC15';
    ctx.fillRect(x - 3, floatY - 4, 6, 4);
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(x - 3, floatY, 6, 4);
  } else if (orb.iconType === 'docker') {
    ctx.fillStyle = '#0284C7';
    ctx.fillRect(x - 4, floatY - 2, 8, 4);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x - 2, floatY - 4, 4, 2);
  } else if (orb.iconType === 'mcp') {
    // Raio elétrico / Conexão MCP
    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(x - 2, floatY - 5, 4, 3);
    ctx.fillRect(x - 4, floatY - 2, 5, 2);
    ctx.fillRect(x - 1, floatY, 3, 5);
  } else if (orb.iconType === 'claude') {
    // Estrela Anthropic
    ctx.fillStyle = '#D97706';
    ctx.fillRect(x - 4, floatY - 4, 8, 8);
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(x - 2, floatY - 2, 4, 4);
  } else if (orb.iconType === 'langgraph') {
    // Grafo com nós interligados
    ctx.fillStyle = '#10B981';
    ctx.fillRect(x - 4, floatY - 4, 3, 3);
    ctx.fillRect(x + 2, floatY - 4, 3, 3);
    ctx.fillRect(x - 1, floatY + 2, 3, 3);
    ctx.fillStyle = '#6EE7B7';
    ctx.fillRect(x - 2, floatY - 2, 4, 2);
  } else {
    // Terminal / Code prompt
    ctx.fillStyle = '#10B981';
    ctx.fillRect(x - 4, floatY - 4, 8, 8);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('>', x, floatY + 2);
  }

  // Nome do orbe em cartucho retrô
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(x - 22, floatY + 12, 44, 12);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 22, floatY + 12, 44, 12);

  ctx.fillStyle = '#F8FAFC';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(orb.name, x, floatY + 21);

  ctx.restore();
}

/**
 * Desenha Árvores Retrô com Variações de Espécie
 */
export function drawPixelTree(
  ctx: CanvasRenderingContext2D,
  x: number,
  groundY: number,
  isDark: boolean,
  variant: number = 0
) {
  const pX = Math.floor(x);
  ctx.save();

  // Tronco com galhos
  ctx.fillStyle = isDark ? '#3E2723' : '#5D4037';
  ctx.fillRect(pX + 8, groundY - 26, 8, 26);
  ctx.fillRect(pX + 5, groundY - 18, 4, 3);
  ctx.fillRect(pX + 15, groundY - 22, 4, 3);

  // Folhagem
  if (variant % 2 === 0) {
    // Árvore frondosa clássica
    ctx.fillStyle = isDark ? '#14532D' : '#16A34A';
    ctx.fillRect(pX, groundY - 60, 24, 38);
    ctx.fillRect(pX - 6, groundY - 50, 36, 24);
    ctx.fillStyle = isDark ? '#166534' : '#22C55E';
    ctx.fillRect(pX + 3, groundY - 56, 18, 16);
  } else {
    // Pinheiro / Cipreste
    ctx.fillStyle = isDark ? '#064E3B' : '#047857';
    ctx.beginPath();
    ctx.moveTo(pX + 12, groundY - 70);
    ctx.lineTo(pX + 28, groundY - 24);
    ctx.lineTo(pX - 4, groundY - 24);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = isDark ? '#047857' : '#10B981';
    ctx.beginPath();
    ctx.moveTo(pX + 12, groundY - 70);
    ctx.lineTo(pX + 22, groundY - 40);
    ctx.lineTo(pX + 2, groundY - 40);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

/**
 * =========================================================================
 * TOP-DOWN POKÉMON-STYLE INTERIOR SPRITES
 * =========================================================================
 */

import { BuildingInterior, FurnitureItem, InteriorSkillItem, TopDownDirection } from './types';

/**
 * Desenha o personagem em visão Top-Down (Estilo Pokémon GBA)
 */
export function drawTopDownCharacter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  direction: TopDownDirection,
  frame: number,
  outfit: EraOutfit
) {
  const p = PALETTES[outfit] || PALETTES.baxijen;
  const S = 2; // Pixel scale

  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  // Sombra suave sob os pés
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 4, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  const stepOffset = frame % 2 === 1 ? (Math.sin(frame * Math.PI) > 0 ? 2 : -2) : 0;

  if (direction === 'down') {
    // 1. VISÃO DE FRENTE (Andando para baixo)
    // Cabelo
    ctx.fillStyle = p.hair;
    ctx.fillRect(-6 * S, -15 * S, 12 * S, 5 * S);
    ctx.fillRect(-7 * S, -14 * S, 14 * S, 4 * S);
    ctx.fillStyle = p.hairHighlight;
    ctx.fillRect(-4 * S, -15 * S, 6 * S, 1 * S);

    // Rosto
    ctx.fillStyle = p.skin;
    ctx.fillRect(-5 * S, -10 * S, 10 * S, 6 * S);

    // Olhos verdes brilhantes
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-3 * S, -8 * S, 2 * S, 2 * S);
    ctx.fillRect(1 * S, -8 * S, 2 * S, 2 * S);
    ctx.fillStyle = p.eyes;
    ctx.fillRect(-2 * S, -8 * S, 1 * S, 2 * S);
    ctx.fillRect(2 * S, -8 * S, 1 * S, 2 * S);

    // Camisa / Tronco
    ctx.fillStyle = p.shirt;
    ctx.fillRect(-4 * S, -4 * S, 8 * S, 6 * S);
    ctx.fillStyle = p.shirtHighlight;
    ctx.fillRect(-4 * S, -4 * S, 2 * S, 5 * S);

    // Detalhe / Acessório
    if (p.accessory) {
      ctx.fillStyle = p.accessory;
      ctx.fillRect(-1 * S, -2 * S, 2 * S, 2 * S);
    }

    // Braços
    ctx.fillStyle = p.skin;
    ctx.fillRect(-6 * S, -3 * S + stepOffset, 2 * S, 4 * S);
    ctx.fillRect(4 * S, -3 * S - stepOffset, 2 * S, 4 * S);

    // Pernas & Sapatos (Passos alternados)
    ctx.fillStyle = p.pants;
    ctx.fillRect(-4 * S, 2 * S, 3 * S, 2 * S);
    ctx.fillRect(1 * S, 2 * S, 3 * S, 2 * S);

    ctx.fillStyle = p.shoes;
    ctx.fillRect(-4 * S, 4 * S + stepOffset, 3 * S, 2 * S);
    ctx.fillRect(1 * S, 4 * S - stepOffset, 3 * S, 2 * S);
  } else if (direction === 'up') {
    // 2. VISÃO DE COSTAS (Andando para cima)
    // Cabelo de costas
    ctx.fillStyle = p.hair;
    ctx.fillRect(-6 * S, -15 * S, 12 * S, 8 * S);
    ctx.fillRect(-7 * S, -14 * S, 14 * S, 6 * S);
    ctx.fillStyle = p.hairShadow;
    ctx.fillRect(-5 * S, -8 * S, 10 * S, 2 * S);

    // Camisa de costas / Mochila
    ctx.fillStyle = p.shirt;
    ctx.fillRect(-4 * S, -5 * S, 8 * S, 6 * S);
    if (p.backpack) {
      ctx.fillStyle = p.backpack;
      ctx.fillRect(-3 * S, -5 * S, 6 * S, 5 * S);
    }

    // Braços
    ctx.fillStyle = p.shirtShadow;
    ctx.fillRect(-6 * S, -4 * S - stepOffset, 2 * S, 4 * S);
    ctx.fillRect(4 * S, -4 * S + stepOffset, 2 * S, 4 * S);

    // Pernas
    ctx.fillStyle = p.pants;
    ctx.fillRect(-4 * S, 1 * S, 3 * S, 3 * S);
    ctx.fillRect(1 * S, 1 * S, 3 * S, 3 * S);

    ctx.fillStyle = p.shoes;
    ctx.fillRect(-4 * S, 4 * S - stepOffset, 3 * S, 2 * S);
    ctx.fillRect(1 * S, 4 * S + stepOffset, 3 * S, 2 * S);
  } else {
    // 3. VISÃO LATERAL (Esquerda / Direita)
    if (direction === 'left') {
      ctx.scale(-1, 1);
    }

    // Cabelo perfil
    ctx.fillStyle = p.hair;
    ctx.fillRect(-4 * S, -15 * S, 9 * S, 6 * S);
    ctx.fillRect(-5 * S, -13 * S, 10 * S, 4 * S);

    // Rosto perfil
    ctx.fillStyle = p.skin;
    ctx.fillRect(-3 * S, -10 * S, 7 * S, 5 * S);
    ctx.fillRect(4 * S, -9 * S, 2 * S, 2 * S); // Nariz/queixo

    // Olho perfil
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(1 * S, -9 * S, 2 * S, 2 * S);
    ctx.fillStyle = p.eyes;
    ctx.fillRect(2 * S, -9 * S, 1 * S, 2 * S);

    // Tronco
    ctx.fillStyle = p.shirt;
    ctx.fillRect(-3 * S, -5 * S, 6 * S, 6 * S);

    // Braço balançando
    ctx.fillStyle = p.skin;
    ctx.fillRect(-1 * S + stepOffset, -3 * S, 2 * S, 4 * S);

    // Pernas
    ctx.fillStyle = p.pants;
    ctx.fillRect(-2 * S, 1 * S, 4 * S, 3 * S);

    ctx.fillStyle = p.shoes;
    ctx.fillRect(-3 * S + stepOffset, 4 * S, 4 * S, 2 * S);
    ctx.fillRect(0 * S - stepOffset, 4 * S, 4 * S, 2 * S);
  }

  ctx.restore();
}

/**
 * Desenha a Sala Top-Down (Chão, Paredes e Tapete de Saída)
 */
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

  // 1. Fundo externo à sala (Bordas pretas de RPG)
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, canvasW, canvasH);

  // 2. Chão da Sala
  ctx.fillStyle = interior.floorColor;
  ctx.fillRect(originX, originY, roomW, roomH);

  // Textura quadriculada / tábuas de madeira no chão
  ctx.fillStyle = interior.floorTileColor;
  for (let ty = originY + 36; ty < originY + roomH - 10; ty += 24) {
    for (let tx = originX + 16; tx < originX + roomW - 16; tx += 24) {
      if ((Math.floor((tx - originX) / 24) + Math.floor((ty - originY) / 24)) % 2 === 0) {
        ctx.fillRect(tx, ty, 24, 24);
      }
    }
  }

  // 3. Paredes Superiores e Laterais com Sombra
  // Parede superior (Back wall)
  ctx.fillStyle = interior.wallColor;
  ctx.fillRect(originX, originY, roomW, 36);

  // Rodapé da parede
  ctx.fillStyle = interior.wallBorderColor;
  ctx.fillRect(originX, originY + 32, roomW, 4);

  // Moldura do teto
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(originX, originY, roomW, 4);

  // Paredes laterais (bordas)
  ctx.fillStyle = interior.wallColor;
  ctx.fillRect(originX, originY, 14, roomH);
  ctx.fillRect(originX + roomW - 14, originY, 14, roomH);

  ctx.fillStyle = interior.wallBorderColor;
  ctx.fillRect(originX + 12, originY, 2, roomH);
  ctx.fillRect(originX + roomW - 14, originY, 2, roomH);

  // Parede inferior (com vão da porta)
  const doorW = 44;
  const doorLeft = originX + (roomW / 2) - (doorW / 2);

  ctx.fillStyle = interior.wallColor;
  ctx.fillRect(originX, originY + roomH - 12, doorLeft - originX, 12);
  ctx.fillRect(doorLeft + doorW, originY + roomH - 12, originX + roomW - (doorLeft + doorW), 12);

  // 4. Tapete de Saída estilo Pokémon (Vermelho com setinha indicando saída)
  ctx.fillStyle = '#DC2626';
  ctx.fillRect(doorLeft, originY + roomH - 24, doorW, 20);
  ctx.strokeStyle = '#FEE2E2';
  ctx.lineWidth = 1;
  ctx.strokeRect(doorLeft, originY + roomH - 24, doorW, 20);

  // Setinha piscante para baixo
  const arrowBlink = Math.sin(time * 6) > 0;
  ctx.fillStyle = arrowBlink ? '#FEF08A' : '#FFFFFF';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('▼ SAIR', doorLeft + (doorW / 2), originY + roomH - 11);

  // 5. Placa com Nome da Sala no Topo
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(originX + (roomW / 2) - 100, originY + 4, 200, 22);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(originX + (roomW / 2) - 100, originY + 4, 200, 22);

  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(interior.name, originX + (roomW / 2), originY + 15);
  ctx.fillStyle = '#94A3B8';
  ctx.font = '8px monospace';
  ctx.fillText(interior.subtitle, originX + (roomW / 2), originY + 23);

  ctx.restore();
}

/**
 * Desenha Mobília Top-Down
 */
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

  // Sombra sob o móvel
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(fX + 2, fY + 2, W, H);

  if (item.type === 'desk_computer') {
    // Mesa de trabalho de madeira com monitor
    ctx.fillStyle = '#78350F';
    ctx.fillRect(fX, fY, W, H);
    ctx.fillStyle = '#92400E';
    ctx.fillRect(fX, fY, W, 3);

    // Teclado
    ctx.fillStyle = '#334155';
    ctx.fillRect(fX + (W / 2) - 10, fY + H - 10, 20, 6);

    // Monitor
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(fX + (W / 2) - 12, fY + 4, 24, 14);
    // Tela iluminada (código / terminal verde)
    const screenGlow = Math.sin(time * 4) > 0 ? '#22C55E' : '#10B981';
    ctx.fillStyle = screenGlow;
    ctx.fillRect(fX + (W / 2) - 10, fY + 6, 20, 10);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(fX + (W / 2) - 8, fY + 8, 4, 1);
    ctx.fillRect(fX + (W / 2) - 8, fY + 11, 8, 1);
  } else if (item.type === 'bookshelf') {
    // Estante de livros
    ctx.fillStyle = '#451A03';
    ctx.fillRect(fX, fY, W, H);

    // Prateleiras com livros coloridos
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
    // Rack de Servidores de IA / TI
    ctx.fillStyle = '#090D16';
    ctx.fillRect(fX, fY, W, H);
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 1;
    ctx.strokeRect(fX, fY, W, H);

    // Luzes piscantes
    for (let ly = fY + 6; ly < fY + H - 6; ly += 8) {
      const led1 = Math.sin(time * 8 + ly) > 0;
      const led2 = Math.cos(time * 6 + ly) > 0;
      ctx.fillStyle = led1 ? '#22C55E' : '#14532D';
      ctx.fillRect(fX + 4, ly, 3, 3);
      ctx.fillStyle = led2 ? '#38BDF8' : '#0369A1';
      ctx.fillRect(fX + 10, ly, 3, 3);
      ctx.fillStyle = '#334155';
      ctx.fillRect(fX + 16, ly, W - 20, 2);
    }
  } else if (item.type === 'whiteboard') {
    // Quadro branco com diagramas de arquitetura
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(fX, fY, W, H);
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.strokeRect(fX, fY, W, H);

    // Desenho de flowchart / código
    ctx.fillStyle = '#2563EB';
    ctx.fillRect(fX + 6, fY + 6, 12, 8);
    ctx.fillRect(fX + W - 18, fY + 6, 12, 8);
    ctx.strokeStyle = '#EF4444';
    ctx.beginPath();
    ctx.moveTo(fX + 18, fY + 10);
    ctx.lineTo(fX + W - 18, fY + 10);
    ctx.stroke();
  } else if (item.type === 'plant') {
    // Vaso de planta no canto
    ctx.fillStyle = '#B45309';
    ctx.fillRect(fX + (W / 2) - 6, fY + H - 10, 12, 10);

    ctx.fillStyle = '#16A34A';
    ctx.beginPath();
    ctx.arc(fX + (W / 2), fY + 8, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#22C55E';
    ctx.beginPath();
    ctx.arc(fX + (W / 2) - 2, fY + 6, 5, 0, Math.PI * 2);
    ctx.fill();
  } else if (item.type === 'ai_holo') {
    // Holo-emblema de IA flutuante
    const floatY = fY + Math.sin(time * 3) * 4;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.beginPath();
    ctx.arc(fX + (W / 2), floatY + (H / 2), 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(fX + (W / 2), floatY + (H / 2), 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(fX + (W / 2), floatY + (H / 2), 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Desenha Item de Skill Colecionável na Sala Top-Down
 */
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
    // Já coletado: pedestal transparente
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

  // Não coletado: Cristal / Pokébola de Skill Flutuante
  const floatY = sY + Math.sin(time * 4) * 4;

  // Sombra pulsante no chão
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(sX, sY + 8, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Halo reluzente
  const glow = 14 + Math.sin(time * 6) * 3;
  ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.beginPath();
  ctx.arc(sX, floatY, glow, 0, Math.PI * 2);
  ctx.fill();

  // Estilo Pokébola Tech (Metade Superior Vermelha, Inferior Branca, Botão Central Ciano)
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.arc(sX, floatY, 9, Math.PI, 0);
  ctx.fill();

  ctx.fillStyle = '#F8FAFC';
  ctx.beginPath();
  ctx.arc(sX, floatY, 9, 0, Math.PI);
  ctx.fill();

  // Faixa preta divisória
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(sX - 9, floatY - 1, 18, 2);

  // Botão central iluminado
  ctx.fillStyle = '#38BDF8';
  ctx.beginPath();
  ctx.arc(sX, floatY, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(sX, floatY, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Balão de texto retrô com o nome da Skill
  ctx.fillStyle = '#0F172A';
  const textW = ctx.measureText(skill.name).width + 12;
  ctx.fillRect(sX - (textW / 2), floatY - 20, textW, 12);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1;
  ctx.strokeRect(sX - (textW / 2), floatY - 20, textW, 12);

  ctx.fillStyle = '#FEF08A';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(skill.name, sX, floatY - 11);

  ctx.restore();
}

/**
 * Desenha o Mentor / NPC da Sala Top-Down
 */
export function drawNPC(
  ctx: CanvasRenderingContext2D,
  npc: { name: string; role: string; x: number; y: number; direction: TopDownDirection },
  originX: number,
  originY: number
) {
  const nX = originX + npc.x;
  const nY = originY + npc.y;
  const S = 2;

  ctx.save();
  ctx.translate(Math.floor(nX), Math.floor(nY));

  // Sombra
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 4, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cabelo grisalho / sábio
  ctx.fillStyle = '#64748B';
  ctx.fillRect(-6 * S, -15 * S, 12 * S, 5 * S);
  ctx.fillRect(-7 * S, -14 * S, 14 * S, 4 * S);

  // Rosto
  ctx.fillStyle = '#F5D0A9';
  ctx.fillRect(-5 * S, -10 * S, 10 * S, 6 * S);

  // Olhos
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(-3 * S, -8 * S, 2 * S, 2 * S);
  ctx.fillRect(1 * S, -8 * S, 2 * S, 2 * S);

  // Jaleco branco de professor / orientador
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(-4 * S, -4 * S, 8 * S, 7 * S);
  ctx.fillStyle = '#2563EB'; // Gravata
  ctx.fillRect(-1 * S, -4 * S, 2 * S, 4 * S);

  // Calça social
  ctx.fillStyle = '#334155';
  ctx.fillRect(-4 * S, 3 * S, 3 * S, 2 * S);
  ctx.fillRect(1 * S, 3 * S, 3 * S, 2 * S);

  // Sapatos
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(-4 * S, 5 * S, 3 * S, 2 * S);
  ctx.fillRect(1 * S, 5 * S, 3 * S, 2 * S);

  // Etiqueta com Nome e Cargo
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(-35, -28 * S, 70, 11);
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 1;
  ctx.strokeRect(-35, -28 * S, 70, 11);

  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 7px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(npc.role, 0, -28 * S + 8);

  ctx.restore();
}

