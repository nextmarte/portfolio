import {
  EraOutfit,
  GameInput,
  Milestone,
  Obstacle,
  Particle,
  Platform,
  PlayerState,
  SceneryProp,
  TechOrb,
} from './types';
import {
  drawCharacter,
  drawDetailedBuilding,
  drawObstacle,
  drawPlatform,
  drawSceneryProps,
  drawTechOrb,
  drawPixelTree,
} from './sprites';
import { retroAudio } from './audio';

export const MILESTONES: Milestone[] = [
  {
    id: 'cefet',
    year: 2008,
    x: 350,
    label: 'CEFET/RJ',
    subLabel: 'Técnico em Mecânica',
    role: 'Estudante Técnico',
    description: 'Bases sólidas em ciências exatas, lógica e processos industriais no CEFET/RJ.',
    outfit: 'cefet',
    color: '#78350F',
    roofColor: '#451A03',
    accentColor: '#B45309',
    neonColor: '#FBBF24',
    buildingStyle: 'cefet',
    width: 220,
    height: 220,
  },
  {
    id: 'chemtech',
    year: 2011,
    x: 1650,
    label: 'Chemtech / Siemens',
    subLabel: 'Engenharia de Automação',
    role: 'Engenheiro & Projetista',
    description: 'Projetos de grande porte em sistemas industriais, integração e processos críticos na Siemens/Chemtech.',
    outfit: 'chemtech',
    color: '#0369A1',
    roofColor: '#082F49',
    accentColor: '#38BDF8',
    neonColor: '#38BDF8',
    buildingStyle: 'chemtech',
    width: 240,
    height: 240,
  },
  {
    id: 'uff',
    year: 2016,
    x: 3000,
    label: 'UFF',
    subLabel: 'Administração & Mestrado',
    role: 'Graduando & Mestre',
    description: 'Graduação em Administração de Empresas e Mestrado Acadêmico na UFF, focando em governança, métodos quantitativos e análise de dados.',
    outfit: 'uff',
    color: '#1E3A8A',
    roofColor: '#0F172A',
    accentColor: '#60A5FA',
    neonColor: '#60A5FA',
    buildingStyle: 'uff',
    width: 250,
    height: 250,
  },
  {
    id: 'cid',
    year: 2024,
    x: 4400,
    label: 'CID-UFF',
    subLabel: 'Projeto Laguna & Dados',
    role: 'Data Scientist & Dev',
    description: 'Engenharia de dados, dashboards analíticos e desenvolvimento do sistema LAGUNA para monitoramento ambiental.',
    outfit: 'cid',
    color: '#312E81',
    roofColor: '#1E1B4B',
    accentColor: '#818CF8',
    neonColor: '#34D399',
    buildingStyle: 'cid',
    width: 240,
    height: 230,
  },
  {
    id: 'coppead',
    year: 2025,
    x: 5750,
    label: 'COPPEAD / UFRJ',
    subLabel: 'Doutorado em IA',
    role: 'Doutorando & Pesquisador',
    description: 'Pesquisa avançada sobre Governança de Inteligência Artificial e cultura de dados no setor público na COPPEAD/UFRJ.',
    outfit: 'uff',
    color: '#831843',
    roofColor: '#500724',
    accentColor: '#F472B6',
    neonColor: '#F43F5E',
    buildingStyle: 'coppead',
    width: 250,
    height: 250,
  },
  {
    id: 'baxijen',
    year: 2026,
    x: 7100,
    label: 'BaXiJen',
    subLabel: 'AI Architecture & Agentes',
    role: 'AI Architect & Software Engineer',
    description: 'Concepção de soluções inteligentes, orquestração de agentes autônomos, integrações MCP e desenvolvimento acelerado por IA.',
    outfit: 'baxijen',
    color: '#090D16',
    roofColor: '#0284C7',
    accentColor: '#38BDF8',
    neonColor: '#00F0FF',
    buildingStyle: 'baxijen',
    width: 280,
    height: 270,
  },
];

export const INITIAL_TECH_ORBS: TechOrb[] = [
  { id: 'orb-1', name: 'Python', x: 750, y: 0, iconType: 'python', collected: false, floatOffset: 0 },
  { id: 'orb-2', name: 'Docker', x: 1250, y: 0, iconType: 'docker', collected: false, floatOffset: 1 },
  { id: 'orb-3', name: 'FastAPI', x: 2150, y: 0, iconType: 'terminal', collected: false, floatOffset: 2 },
  { id: 'orb-4', name: 'SQL', x: 2600, y: 0, iconType: 'terminal', collected: false, floatOffset: 3 },
  { id: 'orb-5', name: 'Next.js', x: 3500, y: 0, iconType: 'react', collected: false, floatOffset: 4 },
  { id: 'orb-6', name: 'Data Sci', x: 3950, y: 0, iconType: 'terminal', collected: false, floatOffset: 5 },
  { id: 'orb-7', name: 'LangGraph', x: 4900, y: 0, iconType: 'langgraph', collected: false, floatOffset: 6 },
  { id: 'orb-8', name: 'OpenAI', x: 5350, y: 0, iconType: 'agent', collected: false, floatOffset: 7 },
  { id: 'orb-9', name: 'MCP Server', x: 6250, y: 0, iconType: 'mcp', collected: false, floatOffset: 8 },
  { id: 'orb-10', name: 'Claude Code', x: 6700, y: 0, iconType: 'claude', collected: false, floatOffset: 9 },
  { id: 'orb-11', name: 'Codex AI', x: 7450, y: 0, iconType: 'agent', collected: false, floatOffset: 10 },
];

export const INITIAL_OBSTACLES: Obstacle[] = [
  // Zona 1: CEFET -> Chemtech
  { id: 'obs-1', x: 880, y: 0, width: 20, height: 24, type: 'hazard_cone', label: 'Cone' },
  { id: 'obs-2', x: 1250, y: 0, width: 24, height: 20, type: 'glitch_bug', label: 'Bug' },

  // Zona 2: Chemtech -> UFF
  { id: 'obs-3', x: 2150, y: 0, width: 22, height: 32, type: 'server_rack', label: 'Legacy Server' },
  { id: 'obs-4', x: 2550, y: 0, width: 24, height: 20, type: 'glitch_bug', label: 'Syntax Error' },

  // Zona 3: UFF -> CID-UFF
  { id: 'obs-5', x: 3450, y: 0, width: 20, height: 24, type: 'hazard_cone', label: 'Prazo' },
  { id: 'obs-6', x: 3900, y: 0, width: 24, height: 20, type: 'glitch_bug', label: 'NullPointer' },

  // Zona 4: CID-UFF -> COPPEAD
  { id: 'obs-7', x: 4850, y: 0, width: 14, height: 36, type: 'firewall', label: 'Firewall' },
  { id: 'obs-8', x: 5300, y: 0, width: 24, height: 20, type: 'glitch_bug', label: 'Data Drift' },

  // Zona 5: COPPEAD -> BaXiJen
  { id: 'obs-9', x: 6200, y: 0, width: 14, height: 38, type: 'firewall', label: 'Security Gateway' },
  { id: 'obs-10', x: 6650, y: 0, width: 24, height: 20, type: 'glitch_bug', label: 'AI Hallucination' },
];

export const INITIAL_PLATFORMS: Platform[] = [
  // Plataformas suspensas com orbes ou rota alternativa sobre obstáculos
  { id: 'plat-1', x: 820, y: 0, width: 120, height: 12, type: 'metal' },
  { id: 'plat-2', x: 1200, y: 0, width: 110, height: 12, type: 'brick' },
  { id: 'plat-3', x: 2100, y: 0, width: 130, height: 12, type: 'metal' },
  { id: 'plat-4', x: 2500, y: 0, width: 120, height: 12, type: 'wood' },
  { id: 'plat-5', x: 3400, y: 0, width: 130, height: 12, type: 'wood' },
  { id: 'plat-6', x: 3850, y: 0, width: 120, height: 12, type: 'brick' },
  { id: 'plat-7', x: 4800, y: 0, width: 130, height: 12, type: 'cyber' },
  { id: 'plat-8', x: 5250, y: 0, width: 120, height: 12, type: 'cyber' },
  { id: 'plat-9', x: 6150, y: 0, width: 140, height: 12, type: 'cyber' },
  { id: 'plat-10', x: 6600, y: 0, width: 130, height: 12, type: 'cyber' },
];

export const INITIAL_PROPS: SceneryProp[] = [
  { id: 'prop-1', x: 200, type: 'lamp_classic' },
  { id: 'prop-2', x: 600, type: 'bench' },
  { id: 'prop-3', x: 700, type: 'bush_flowers' },
  { id: 'prop-4', x: 1000, type: 'lamp_classic' },
  { id: 'prop-5', x: 1450, type: 'hydrant' },
  { id: 'prop-6', x: 1950, type: 'lamp_classic' },
  { id: 'prop-7', x: 2350, type: 'bench' },
  { id: 'prop-8', x: 2750, type: 'bush_flowers' },
  { id: 'prop-9', x: 3300, type: 'lamp_classic' },
  { id: 'prop-10', x: 3700, type: 'bench' },
  { id: 'prop-11', x: 4150, type: 'bush_flowers' },
  { id: 'prop-12', x: 4650, type: 'lamp_cyber' },
  { id: 'prop-13', x: 5100, type: 'lamp_cyber' },
  { id: 'prop-14', x: 5550, type: 'bench' },
  { id: 'prop-15', x: 6050, type: 'lamp_cyber' },
  { id: 'prop-16', x: 6450, type: 'lamp_cyber' },
  { id: 'prop-17', x: 6900, type: 'lamp_cyber' },
];

export class CareerGameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isDark: boolean;
  private width: number = 800;
  private height: number = 400;

  // Estados do jogo
  private mode: 'auto' | 'playable' = 'auto';
  private player: PlayerState;
  private cameraX: number = 0;
  private groundY: number = 360;
  private techOrbs: TechOrb[] = [];
  private obstacles: Obstacle[] = [];
  private platforms: Platform[] = [];
  private props: SceneryProp[] = [];
  private particles: Particle[] = [];
  private collectedCount: number = 0;
  private activeMilestone: Milestone | null = null;
  private input: GameInput = { left: false, right: false, jump: false, interact: false };
  private lastTime: number = 0;
  private animId: number | null = null;
  private worldLength: number = 7800;

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
      stumbleTimer: 0,
      invulnerableTimer: 0,
    };

    this.techOrbs = JSON.parse(JSON.stringify(INITIAL_TECH_ORBS));
    this.obstacles = JSON.parse(JSON.stringify(INITIAL_OBSTACLES));
    this.platforms = JSON.parse(JSON.stringify(INITIAL_PLATFORMS));
    this.props = JSON.parse(JSON.stringify(INITIAL_PROPS));

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

    // Ajusta posições Y dos obstáculos, plataformas e orbes
    this.obstacles.forEach(obs => {
      obs.y = this.groundY - obs.height;
    });

    this.platforms.forEach(plat => {
      plat.y = this.groundY - 58;
    });

    this.techOrbs.forEach(orb => {
      // Posiciona orbes sobre plataformas ou no ar
      const hasPlatform = this.platforms.find(p => Math.abs(p.x + (p.width / 2) - orb.x) < 40);
      if (hasPlatform) {
        orb.y = hasPlatform.y - 25;
      } else {
        orb.y = this.groundY - 55;
      }
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
    const gravity = 26;
    const runSpeed = 230;
    const jumpVelocity = -430;

    // Timers de tropeço e invulnerabilidade
    if (this.player.stumbleTimer > 0) {
      this.player.stumbleTimer = Math.max(0, this.player.stumbleTimer - dt);
    }
    if (this.player.invulnerableTimer > 0) {
      this.player.invulnerableTimer = Math.max(0, this.player.invulnerableTimer - dt);
    }

    // 1. INPUT & VELOCIDADE HORIZONTAL
    if (this.mode === 'auto') {
      this.player.vx = 150; // Auto-run fluído
      this.player.facing = 'right';

      // Auto-jump inteligente: salta sobre obstáculos antes de encostar!
      if (this.player.isGrounded) {
        const nextObstacle = this.obstacles.find(
          obs => obs.x > this.player.x && obs.x - this.player.x < 75
        );
        if (nextObstacle) {
          this.player.vy = jumpVelocity;
          this.player.isGrounded = false;
          this.player.isJumping = true;
          retroAudio.playJump();
          this.createDust(this.player.x, this.groundY, 5);
        }
      }

      // Loop do mundo
      if (this.player.x > this.worldLength) {
        this.player.x = 80;
        this.cameraX = 0;
        retroAudio.playVictory();
      }
    } else {
      // Modo jogável
      if (this.player.stumbleTimer > 0) {
        // Empurrão de recuo durante o tropeço
        this.player.vx = -70;
      } else {
        if (this.input.left) {
          this.player.vx = -runSpeed;
          this.player.facing = 'left';
        } else if (this.input.right) {
          this.player.vx = runSpeed;
          this.player.facing = 'right';
        } else {
          this.player.vx = 0;
        }

        // Pulo manual
        if (this.input.jump && this.player.isGrounded) {
          this.player.vy = jumpVelocity;
          this.player.isGrounded = false;
          this.player.isJumping = true;
          retroAudio.playJump();
          this.createDust(this.player.x, this.groundY, 6);
        }
      }
    }

    // 2. FÍSICA VERTICAL (Gravidade & Movimento)
    this.player.vy += gravity;
    this.player.x += this.player.vx * dt;
    this.player.y += this.player.vy * dt;

    // Colisão com plataformas elevadas (one-way platforms)
    let onPlatform = false;
    for (const plat of this.platforms) {
      if (
        this.player.x >= plat.x - 8 &&
        this.player.x <= plat.x + plat.width + 8 &&
        this.player.y >= plat.y &&
        this.player.y - (this.player.vy * dt) <= plat.y + 12 &&
        this.player.vy > 0
      ) {
        this.player.y = plat.y;
        this.player.vy = 0;
        this.player.isGrounded = true;
        this.player.isJumping = false;
        onPlatform = true;
        break;
      }
    }

    // Colisão com o solo principal
    if (!onPlatform) {
      if (this.player.y >= this.groundY) {
        if (!this.player.isGrounded && this.player.vy > 120) {
          this.createDust(this.player.x, this.groundY, 4);
        }
        this.player.y = this.groundY;
        this.player.vy = 0;
        this.player.isGrounded = true;
        this.player.isJumping = false;
      } else {
        this.player.isGrounded = false;
      }
    }

    // Limites de mundo
    this.player.x = Math.max(30, this.player.x);

    // 3. COLISÃO COM OBSTÁCULOS
    if (this.player.invulnerableTimer <= 0) {
      for (const obs of this.obstacles) {
        const playerFootY = this.player.y;
        const playerTopY = this.player.y - 36;
        const obsTopY = obs.y;
        const obsBottomY = this.groundY;

        // Bounding box overlap
        if (
          this.player.x + 12 >= obs.x &&
          this.player.x - 12 <= obs.x + obs.width &&
          playerFootY > obsTopY + 4 &&
          playerTopY < obsBottomY
        ) {
          // Atingiu obstáculo: tropeço
          this.player.stumbleTimer = 0.35;
          this.player.invulnerableTimer = 1.2;
          retroAudio.playHurt();
          this.createSparkles(this.player.x, this.player.y - 20, 8, ['#EF4444', '#F87171', '#FEF08A']);
          break;
        }
      }
    }

    // 4. ANIMAÇÃO DE CORRIDA & POEIRA
    if (Math.abs(this.player.vx) > 10 && this.player.stumbleTimer <= 0) {
      this.player.animTimer += dt;
      if (this.player.animTimer > 0.11) {
        this.player.animTimer = 0;
        this.player.frame = (this.player.frame + 1) % 4;
        if (this.player.isGrounded && Math.random() < 0.35) {
          this.createDust(this.player.x - (this.player.facing === 'right' ? 8 : -8), this.player.y, 1);
        }
      }
    } else {
      this.player.frame = 0;
    }

    // 5. ATUALIZAÇÃO DO TRAJE & ANO CONFORME X
    this.player.outfit = this.determineOutfit(this.player.x);
    const currentYear = this.determineYear(this.player.x);
    if (this.onYearUpdate) {
      this.onYearUpdate(currentYear);
    }

    // 6. CÂMERA (Segue o jogador suavemente com antecipação)
    const lookAhead = this.player.facing === 'right' ? 80 : -80;
    const targetCameraX = this.player.x - (this.width * 0.35) + lookAhead;
    this.cameraX += (targetCameraX - this.cameraX) * 0.08;
    this.cameraX = Math.max(0, this.cameraX);

    // 7. COLETA DE TECH ORBS
    this.techOrbs.forEach(orb => {
      if (!orb.collected) {
        const dx = this.player.x - orb.x;
        const dy = (this.player.y - 20) - orb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 28) {
          orb.collected = true;
          this.collectedCount++;
          retroAudio.playCollect();
          this.createSparkles(orb.x, orb.y, 12, ['#38BDF8', '#FACC15', '#34D399', '#A78BFA']);
          if (this.onOrbsUpdate) {
            this.onOrbsUpdate(this.collectedCount, this.techOrbs.length);
          }
        }
      }
    });

    // 8. CHECKPOINT / INSPEÇÃO DE MARCOS
    let nearM: Milestone | null = null;
    for (const m of MILESTONES) {
      const doorX = m.x + (m.width / 2);
      if (Math.abs(this.player.x - doorX) < 65) {
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

    // 9. ATUALIZAR PARTÍCULAS
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
    if (x < 1200) return 'cefet';
    if (x < 2500) return 'chemtech';
    if (x < 3900) return 'uff';
    if (x < 5200) return 'cid';
    return 'baxijen';
  }

  private determineYear(x: number): number {
    const minX = 100;
    const maxX = 7200;
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

  private createSparkles(x: number, y: number, count: number, colors: string[]) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 2.8;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0.45 + Math.random() * 0.35,
        maxLife: 0.7,
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
      skyGrad.addColorStop(0.5, '#0B1528');
      skyGrad.addColorStop(1, '#1E293B');
    } else {
      skyGrad.addColorStop(0, '#38BDF8');
      skyGrad.addColorStop(0.5, '#BAE6FD');
      skyGrad.addColorStop(1, '#E0F2FE');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    // Estrelas / Lua (Modo Noite)
    if (isDark) {
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < 35; i++) {
        const sx = ((i * 127) - (this.cameraX * 0.02)) % W;
        const realSx = sx < 0 ? sx + W : sx;
        const sy = 20 + (i * 17) % (this.groundY - 140);
        ctx.fillRect(Math.floor(realSx), sy, 2, 2);
      }
      // Lua pixelada
      const moonX = W - 120;
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(moonX, 30, 20, 20);
      ctx.fillStyle = '#FDE047';
      ctx.fillRect(moonX + 4, 34, 5, 5);
    } else {
      // Sol pixelado
      const sunX = W - 110;
      ctx.fillStyle = '#FBBF24';
      ctx.fillRect(sunX, 30, 22, 22);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(sunX + 4, 34, 14, 14);
    }

    // 2. PARALLAX CAMADA 1: NUVENS (Velocidade 0.06x)
    const cloudColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)';
    ctx.fillStyle = cloudColor;
    for (let c = 0; c < 12; c++) {
      const cx = ((c * 350) - (this.cameraX * 0.06) + (now * 6)) % (W + 400);
      const cy = 35 + (c % 4) * 30;
      ctx.fillRect(cx - 100, cy, 75, 14);
      ctx.fillRect(cx - 85, cy - 8, 48, 10);
      ctx.fillRect(cx - 68, cy - 14, 22, 8);
    }

    // 3. PARALLAX CAMADA 2: MONTANHAS / SKYLINE DISTANTE (Velocidade 0.22x)
    const mountainColor = isDark ? '#0F172A' : '#94A3B8';
    ctx.fillStyle = mountainColor;
    ctx.beginPath();
    ctx.moveTo(0, this.groundY);
    for (let mx = 0; mx <= W + 40; mx += 60) {
      const worldMx = mx + (this.cameraX * 0.22);
      const mH = 55 + Math.sin(worldMx * 0.005) * 40 + Math.cos(worldMx * 0.003) * 25;
      ctx.lineTo(mx, this.groundY - mH);
    }
    ctx.lineTo(W, this.groundY);
    ctx.closePath();
    ctx.fill();

    // 4. MUNDO PRINCIPAL (Camada com Câmera 1.0x)
    ctx.save();
    ctx.translate(-Math.floor(this.cameraX), 0);

    // Árvores no cenário distribuídas espaçadamente
    for (let tx = 150; tx < this.worldLength; tx += 320) {
      drawPixelTree(ctx, tx, this.groundY, isDark, Math.floor(tx / 320));
    }

    // Elementos de Cenário (Postes com Cone de Luz, Bancos, Flores)
    this.props.forEach(prop => {
      drawSceneryProps(ctx, prop, this.groundY, isDark);
    });

    // Prédios dos Marcos da Carreira
    MILESTONES.forEach(m => {
      drawDetailedBuilding(ctx, m, this.groundY, isDark, now);
    });

    // Plataformas Suspensas
    this.platforms.forEach(plat => {
      drawPlatform(ctx, plat, isDark);
    });

    // Obstáculos (Bugs de software, cones, racks, firewalls)
    this.obstacles.forEach(obs => {
      drawObstacle(ctx, obs, this.groundY, isDark, now);
    });

    // Tech Orbs colecionáveis
    this.techOrbs.forEach(orb => {
      drawTechOrb(ctx, orb, now);
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
      this.player.outfit,
      this.player.stumbleTimer,
      this.player.invulnerableTimer
    );

    ctx.restore();

    // 6. CHÃO & PISTA (Primeiro Plano)
    // Faixa de grama superior
    ctx.fillStyle = isDark ? '#166534' : '#22C55E';
    ctx.fillRect(0, this.groundY, W, 4);

    // Subsolo de terra/pedra em pixel art
    ctx.fillStyle = isDark ? '#1E293B' : '#64748B';
    ctx.fillRect(0, this.groundY + 4, W, H - (this.groundY + 4));

    // Textura de pedras e lajotas no subsolo com movimento sincronizado
    ctx.fillStyle = isDark ? '#334155' : '#475569';
    for (let px = 0; px < W + 30; px += 24) {
      const offsetX = (px - (Math.floor(this.cameraX) % 24));
      ctx.fillRect(offsetX, this.groundY + 10, 4, 3);
      ctx.fillRect(offsetX + 10, this.groundY + 20, 5, 2);
    }
  }
}
