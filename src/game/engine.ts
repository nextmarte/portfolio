import { Milestone, TechOrb, Particle, PlayerState, GameInput, EraOutfit } from './types';
import { drawCharacter, drawBuilding, drawTechOrb, drawPixelTree } from './sprites';
import { retroAudio } from './audio';

export const MILESTONES: Milestone[] = [
  {
    id: 'cefet',
    year: 2008,
    x: 350,
    label: 'CEFET/RJ',
    subLabel: 'Mecânica Industrial',
    role: 'Técnico em Mecânica',
    description: 'Formação técnica industrial fundamental com desenho estrutural e cálculo.',
    outfit: 'cefet',
    color: '#8D6E63',
    roofColor: '#5D4037',
    width: 130,
    height: 150,
  },
  {
    id: 'chemtech',
    year: 2011,
    x: 800,
    label: 'Chemtech',
    subLabel: 'Siemens',
    role: 'Técnico em Mecânica',
    description: 'Engenharia de detalhamento, análise de tensão em tubulações e projetos industriais de grande porte.',
    outfit: 'chemtech',
    color: '#455A64',
    roofColor: '#263238',
    width: 140,
    height: 160,
  },
  {
    id: 'uff',
    year: 2016,
    x: 1300,
    label: 'UFF',
    subLabel: 'Administração',
    role: 'Graduação & Mestrado',
    description: 'Formação em Administração e Mestrado com foco em Finanças, Séries Temporais e Ciência de Dados com R.',
    outfit: 'uff',
    color: '#1E3A8A',
    roofColor: '#172554',
    width: 160,
    height: 180,
  },
  {
    id: 'cid',
    year: 2024,
    x: 1850,
    label: 'CID-UFF',
    subLabel: 'Lagoa Viva',
    role: 'Pesquisador & Dev',
    description: 'Engenharia de dados, dashboards analíticos e sistema LAGUNA de qualidade da água.',
    outfit: 'cid',
    color: '#312E81',
    roofColor: '#1E1B4B',
    width: 170,
    height: 190,
  },
  {
    id: 'coppead',
    year: 2025,
    x: 2350,
    label: 'COPPEAD/UFRJ',
    subLabel: 'Doutorado',
    role: 'Doutorando em IA',
    description: 'Pesquisa de ponta sobre Governança de Inteligência Artificial e cultura de dados no setor público.',
    outfit: 'uff',
    color: '#831843',
    roofColor: '#500724',
    width: 170,
    height: 200,
  },
  {
    id: 'baxijen',
    year: 2026,
    x: 2850,
    label: 'BaXiJen',
    subLabel: 'AI Architecture',
    role: 'AI Architect & Software Engineer',
    description: 'Concepção de soluções inteligentes, orquestração de agentes autônomos, integrações MCP e desenvolvimento acelerado por IA.',
    outfit: 'baxijen',
    color: '#0F172A',
    roofColor: '#0284C7',
    width: 190,
    height: 220,
  },
];

export const INITIAL_TECH_ORBS: TechOrb[] = [
  { id: 'orb-1', name: 'Python', x: 550, y: 0, iconType: 'python', collected: false, floatOffset: 0 },
  { id: 'orb-2', name: 'Docker', x: 1050, y: 0, iconType: 'docker', collected: false, floatOffset: 1 },
  { id: 'orb-3', name: 'Next.js', x: 1550, y: 0, iconType: 'codex', collected: false, floatOffset: 2 },
  { id: 'orb-4', name: 'LangGraph', x: 2100, y: 0, iconType: 'langgraph', collected: false, floatOffset: 3 },
  { id: 'orb-5', name: 'MCP Server', x: 2600, y: 0, iconType: 'mcp', collected: false, floatOffset: 4 },
  { id: 'orb-6', name: 'Claude Code', x: 3100, y: 0, iconType: 'claude', collected: false, floatOffset: 5 },
];

export class CareerGameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number = 800;
  private height: number = 400;
  private groundY: number = 320;
  private cameraX: number = 0;
  private isDark: boolean = true;
  private mode: 'auto' | 'playable' = 'auto';

  // Game state
  private player: PlayerState;
  private input: GameInput = { left: false, right: false, jump: false, interact: false };
  private particles: Particle[] = [];
  private techOrbs: TechOrb[] = [];
  private activeMilestone: Milestone | null = null;
  private collectedCount: number = 0;

  // Animation timing
  private lastTime: number = 0;
  private animId: number | null = null;

  // Callbacks
  public onMilestoneNear: ((milestone: Milestone | null) => void) | null = null;
  public onOrbsUpdate: ((collected: number, total: number) => void) | null = null;
  public onYearUpdate: ((year: number) => void) | null = null;

  constructor(canvas: HTMLCanvasElement, isDark: boolean) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false })!;
    this.isDark = isDark;

    this.player = {
      x: 100,
      y: this.groundY,
      vx: 0,
      vy: 0,
      isGrounded: true,
      isJumping: false,
      facing: 'right',
      frame: 0,
      animTimer: 0,
      outfit: 'cefet',
    };

    this.techOrbs = JSON.parse(JSON.stringify(INITIAL_TECH_ORBS));
    this.resize();
  }

  public setMode(mode: 'auto' | 'playable') {
    this.mode = mode;
    if (mode === 'playable') {
      this.player.vx = 0;
    }
  }

  public getMode(): 'auto' | 'playable' {
    return this.mode;
  }

  public setDark(isDark: boolean) {
    this.isDark = isDark;
  }

  public setInput(newInput: Partial<GameInput>) {
    this.input = { ...this.input, ...newInput };
  }

  public resize() {
    const rect = this.canvas.parentElement?.getBoundingClientRect() || { width: 800, height: 400 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.width = rect.width;
    this.height = Math.max(rect.height, 350);

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(dpr, dpr);
    this.ctx.imageSmoothingEnabled = false;

    // Ground position relative to canvas height
    this.groundY = this.height - 40;
    this.player.y = this.groundY;

    // Reposition orb heights
    this.techOrbs.forEach(orb => {
      orb.y = this.groundY - 55;
    });
  }

  public start() {
    this.lastTime = performance.now();
    const loop = (time: number) => {
      const dt = Math.min((time - this.lastTime) / 1000, 0.05); // Cap delta time
      this.lastTime = time;

      this.update(dt);
      this.render();

      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  public stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  private update(dt: number) {
    const gravity = 28; // pixels / s^2
    const runSpeed = 220; // pixels / s
    const jumpVelocity = -420;

    // 1. INPUT & VELOCIDADE HORIZONTAL
    if (this.mode === 'auto') {
      this.player.vx = 140; // Auto-run constante
      this.player.facing = 'right';

      // Loop do mundo no modo auto se passar do último prédio
      if (this.player.x > 3400) {
        this.player.x = 50;
        this.cameraX = 0;
      }
    } else {
      // Modo jogável
      if (this.input.left) {
        this.player.vx = -runSpeed;
        this.player.facing = 'left';
      } else if (this.input.right) {
        this.player.vx = runSpeed;
        this.player.facing = 'right';
      } else {
        this.player.vx = 0;
      }

      // Pulo
      if (this.input.jump && this.player.isGrounded) {
        this.player.vy = jumpVelocity;
        this.player.isGrounded = false;
        this.player.isJumping = true;
        retroAudio.playJump();

        // Partículas de poeira do pulo
        this.createDust(this.player.x, this.groundY, 6);
      }
    }

    // 2. FÍSICA VERTICAL (Gravidade)
    this.player.vy += gravity;
    this.player.x += this.player.vx * dt;
    this.player.y += this.player.vy * dt;

    // Colisão com o solo
    if (this.player.y >= this.groundY) {
      if (!this.player.isGrounded && this.player.vy > 100) {
        // Poeira ao aterrissar
        this.createDust(this.player.x, this.groundY, 4);
      }
      this.player.y = this.groundY;
      this.player.vy = 0;
      this.player.isGrounded = true;
      this.player.isJumping = false;
    }

    // Limites de mundo para o jogador
    this.player.x = Math.max(30, this.player.x);

    // 3. ANIMAÇÃO DO PERSONAGEM (Frame cycle)
    if (Math.abs(this.player.vx) > 10) {
      this.player.animTimer += dt;
      if (this.player.animTimer > 0.12) {
        this.player.animTimer = 0;
        this.player.frame = (this.player.frame + 1) % 4;
        if (this.player.isGrounded && Math.random() < 0.3) {
          this.createDust(this.player.x - (this.player.facing === 'right' ? 8 : -8), this.groundY, 1);
        }
      }
    } else {
      this.player.frame = 0;
    }

    // 4. ATUALIZAÇÃO DO TRAJE & ANO CONFORME A POSIÇÃO X
    const currentOutfit = this.determineOutfit(this.player.x);
    this.player.outfit = currentOutfit;

    const currentYear = this.determineYear(this.player.x);
    if (this.onYearUpdate) {
      this.onYearUpdate(currentYear);
    }

    // 5. CÂMERA (Segue o jogador suavemente)
    const targetCameraX = this.player.x - (this.width * 0.35);
    this.cameraX += (targetCameraX - this.cameraX) * 0.1;
    this.cameraX = Math.max(0, this.cameraX);

    // 6. COLETA DE TECH ORBS
    this.techOrbs.forEach(orb => {
      if (!orb.collected) {
        const dx = this.player.x - orb.x;
        const dy = (this.player.y - 18) - orb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 26) {
          orb.collected = true;
          this.collectedCount++;
          retroAudio.playCollect();
          this.createSparkles(orb.x, orb.y, 10);
          if (this.onOrbsUpdate) {
            this.onOrbsUpdate(this.collectedCount, this.techOrbs.length);
          }
        }
      }
    });

    // 7. CHECKPOINT / INSPEÇÃO DE MARCOS
    let nearM: Milestone | null = null;
    for (const m of MILESTONES) {
      const doorX = m.x + (m.width / 2);
      if (Math.abs(this.player.x - doorX) < 55) {
        nearM = m;
        break;
      }
    }

    if (nearM !== this.activeMilestone) {
      this.activeMilestone = nearM;
      if (this.onMilestoneNear) {
        this.onMilestoneNear(nearM);
      }
      if (nearM) {
        retroAudio.playInspect();
      }
    }

    // 8. ATUALIZAR PARTÍCULAS
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt * 60;
      p.y += p.vy * dt * 60;
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private determineOutfit(x: number): EraOutfit {
    if (x < 600) return 'cefet';
    if (x < 1100) return 'chemtech';
    if (x < 1650) return 'uff';
    if (x < 2200) return 'cid';
    return 'baxijen';
  }

  private determineYear(x: number): number {
    const minX = 100;
    const maxX = 3000;
    const progress = Math.min(Math.max((x - minX) / (maxX - minX), 0), 1);
    return Math.floor(2006 + progress * (2026 - 2006));
  }

  private createDust(x: number, y: number, count: number) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y - 2,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 1.5,
        size: Math.random() > 0.5 ? 2 : 1,
        color: this.isDark ? '#475569' : '#CBD5E1',
        life: 0.35 + Math.random() * 0.2,
        maxLife: 0.5,
      });
    }
  }

  private createSparkles(x: number, y: number, count: number) {
    const colors = ['#38BDF8', '#FACC15', '#34D399', '#A78BFA'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0.4 + Math.random() * 0.3,
        maxLife: 0.6,
      });
    }
  }

  private render() {
    const ctx = this.ctx;
    const W = this.width;
    const H = this.height;
    const isDark = this.isDark;
    const now = performance.now() / 1000;

    // 1. CÉU EM GRADIENTE (Pixel Art Sky)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, this.groundY);
    if (isDark) {
      skyGrad.addColorStop(0, '#020617');
      skyGrad.addColorStop(0.6, '#0B1528');
      skyGrad.addColorStop(1, '#1E293B');
    } else {
      skyGrad.addColorStop(0, '#38BDF8');
      skyGrad.addColorStop(0.6, '#BAE6FD');
      skyGrad.addColorStop(1, '#E0F2FE');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    // Estrelas / Lua (Modo Noite)
    if (isDark) {
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < 24; i++) {
        const sx = ((i * 127) - (this.cameraX * 0.03)) % W;
        const realSx = sx < 0 ? sx + W : sx;
        const sy = 25 + (i * 19) % (this.groundY - 140);
        ctx.fillRect(Math.floor(realSx), sy, 2, 2);
      }
      // Lua pixelada
      const moonX = W - 110;
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(moonX, 35, 18, 18);
      ctx.fillStyle = '#FDE047';
      ctx.fillRect(moonX + 3, 38, 4, 4);
    } else {
      // Sol pixelado
      const sunX = W - 100;
      ctx.fillStyle = '#FBBF24';
      ctx.fillRect(sunX, 35, 20, 20);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(sunX + 4, 39, 12, 12);
    }

    // 2. PARALLAX CAMADA 1: NUVENS (Velocidade 0.08x)
    const cloudColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)';
    ctx.fillStyle = cloudColor;
    for (let c = 0; c < 8; c++) {
      const cx = ((c * 420) - (this.cameraX * 0.08) + (now * 8)) % (W + 300);
      const cy = 40 + (c % 3) * 35;
      ctx.fillRect(cx - 100, cy, 70, 14);
      ctx.fillRect(cx - 85, cy - 8, 45, 10);
      ctx.fillRect(cx - 70, cy - 14, 20, 8);
    }

    // 3. PARALLAX CAMADA 2: MONTANHAS / SKYLINE DISTANTE (Velocidade 0.25x)
    const mountainColor = isDark ? '#111827' : '#94A3B8';
    ctx.fillStyle = mountainColor;
    ctx.beginPath();
    ctx.moveTo(0, this.groundY);
    for (let mx = 0; mx <= W + 40; mx += 60) {
      const worldMx = mx + (this.cameraX * 0.25);
      const mH = 50 + Math.sin(worldMx * 0.008) * 35 + Math.cos(worldMx * 0.004) * 20;
      ctx.lineTo(mx, this.groundY - mH);
    }
    ctx.lineTo(W, this.groundY);
    ctx.closePath();
    ctx.fill();

    // 4. PARALLAX CAMADA 3: ÁRVORES & MARCOS DA CARREIRA (Velocidade 1.0x)
    ctx.save();
    ctx.translate(-Math.floor(this.cameraX), 0);

    // Árvores no cenário
    for (let tx = 200; tx < 3500; tx += 280) {
      drawPixelTree(ctx, tx, this.groundY, isDark);
    }

    // Prédios dos marcos
    MILESTONES.forEach(m => {
      drawBuilding(
        ctx,
        m.x,
        this.groundY,
        m.label,
        m.subLabel,
        m.color,
        m.roofColor,
        m.width,
        m.height,
        isDark
      );
    });

    // Tech Orbs colecionáveis
    this.techOrbs.forEach(orb => {
      drawTechOrb(ctx, orb.x, orb.y, orb.name, orb.iconType, orb.collected, now);
    });

    // Partículas
    this.particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
    });

    // 5. O PERSONAGEM (Marcus em Pixel Art)
    drawCharacter(
      ctx,
      this.player.x,
      this.player.y,
      this.player.frame,
      this.player.isJumping,
      this.player.isGrounded,
      this.player.facing,
      this.player.outfit
    );

    ctx.restore();

    // 6. CHÃO & PISTA (Primeiro Plano)
    // Faixa de grama superior
    ctx.fillStyle = isDark ? '#166534' : '#22C55E';
    ctx.fillRect(0, this.groundY, W, 4);

    // Subsolo de terra/pedra em pixel art
    ctx.fillStyle = isDark ? '#1E293B' : '#64748B';
    ctx.fillRect(0, this.groundY + 4, W, H - (this.groundY + 4));

    // Textura de pedrinhas no subsolo
    ctx.fillStyle = isDark ? '#334155' : '#475569';
    for (let px = 0; px < W; px += 24) {
      const offsetX = (px + Math.floor(this.cameraX)) % W;
      ctx.fillRect(offsetX, this.groundY + 12, 4, 3);
      ctx.fillRect((offsetX + 10) % W, this.groundY + 22, 5, 2);
    }
  }
}
