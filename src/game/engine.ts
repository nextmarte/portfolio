import {
  BuildingInterior,
  EraOutfit,
  GameInput,
  GameView,
  InteriorSkillItem,
  Milestone,
  Obstacle,
  Particle,
  Platform,
  PlayerState,
  SceneryProp,
  TechOrb,
  TopDownDirection,
  TopDownPlayerState,
} from './types';
import {
  drawCharacter,
  drawDetailedBuilding,
  drawFurniture,
  drawInteriorSkillItem,
  drawNPC,
  drawObstacle,
  drawPlatform,
  drawSceneryProps,
  drawTechOrb,
  drawTopDownCharacter,
  drawTopDownRoom,
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

export const BUILDING_INTERIORS: Record<string, BuildingInterior> = {
  cefet: {
    buildingId: 'cefet',
    name: 'CEFET/RJ — Laboratório de Mecânica',
    subtitle: 'Ano 2008 • O Início Técnico',
    theme: 'workshop',
    floorColor: '#451A03',
    floorTileColor: '#78350F',
    wallColor: '#271206',
    wallBorderColor: '#B45309',
    roomWidth: 460,
    roomHeight: 320,
    doorX: 230,
    doorY: 300,
    furniture: [
      { id: 'f-1', x: 40, y: 50, width: 90, height: 45, type: 'desk_computer', solid: true },
      { id: 'f-2', x: 330, y: 50, width: 80, height: 60, type: 'bookshelf', solid: true },
      { id: 'f-3', x: 170, y: 40, width: 120, height: 35, type: 'whiteboard', solid: true },
      { id: 'f-4', x: 390, y: 240, width: 30, height: 30, type: 'plant', solid: true },
    ],
    skills: [
      { id: 'sk-cefet-1', name: 'Desenho Técnico', category: 'Engenharia', description: 'Visão espacial e rigor metodológico para projetos de engenharia.', x: 80, y: 130, collected: false, icon: 'terminal' },
      { id: 'sk-cefet-2', name: 'Lógica & Automação', category: 'Software', description: 'Fundamentos de algoritmos, lógica booleana e controle.', x: 230, y: 120, collected: false, icon: 'python' },
      { id: 'sk-cefet-3', name: 'Termodinâmica', category: 'Ciências', description: 'Modelagem de sistemas térmicos e fluidos com bases matemáticas.', x: 360, y: 140, collected: false, icon: 'terminal' },
    ],
    npc: {
      name: 'Prof. Silva',
      role: 'Mestre em Engenharia',
      x: 180,
      y: 95,
      direction: 'down',
      dialog: 'Marcus, sua precisão técnica e base matemática começaram aqui no CEFET. Leve esse rigor para o software!',
    },
  },
  chemtech: {
    buildingId: 'chemtech',
    name: 'Chemtech / Siemens — Engenharia de Sistemas',
    subtitle: 'Ano 2011 • Automação & Indústria 4.0',
    theme: 'industrial_office',
    floorColor: '#082F49',
    floorTileColor: '#0369A1',
    wallColor: '#021827',
    wallBorderColor: '#38BDF8',
    roomWidth: 480,
    roomHeight: 330,
    doorX: 240,
    doorY: 310,
    furniture: [
      { id: 'f-1', x: 40, y: 50, width: 85, height: 65, type: 'server_cabinet', solid: true },
      { id: 'f-2', x: 350, y: 50, width: 90, height: 45, type: 'desk_computer', solid: true },
      { id: 'f-3', x: 180, y: 42, width: 120, height: 35, type: 'whiteboard', solid: true },
      { id: 'f-4', x: 40, y: 230, width: 30, height: 30, type: 'plant', solid: true },
    ],
    skills: [
      { id: 'sk-chem-1', name: 'Sistemas SCADA', category: 'Automação', description: 'Supervisão e controle em tempo real de infraestruturas industriais críticas.', x: 95, y: 140, collected: false, icon: 'docker' },
      { id: 'sk-chem-2', name: 'Gestão de Projetos', category: 'Engenharia', description: 'Coordenação técnica de projetos corporativos de grande porte na Siemens.', x: 240, y: 125, collected: false, icon: 'terminal' },
      { id: 'sk-chem-3', name: 'Integração HW/SW', category: 'Sistemas', description: 'Ponte direta entre sensores físicos de telemetria e sistemas digitais.', x: 380, y: 135, collected: false, icon: 'mcp' },
    ],
    npc: {
      name: 'Eng. Roberto',
      role: 'Líder de Automação Siemens',
      x: 320,
      y: 95,
      direction: 'down',
      dialog: 'Em sistemas industriais, confiabilidade e tolerância a falhas são vitais. Esse mindset faz a diferença na sua arquitetura!',
    },
  },
  uff: {
    buildingId: 'uff',
    name: 'UFF — Campus Gragoatá / Sala de Mestrado',
    subtitle: 'Anos 2016-2023 • Administração & Métodos Quantitativos',
    theme: 'university_lab',
    floorColor: '#172554',
    floorTileColor: '#1E3A8A',
    wallColor: '#0F172A',
    wallBorderColor: '#60A5FA',
    roomWidth: 500,
    roomHeight: 330,
    doorX: 250,
    doorY: 310,
    furniture: [
      { id: 'f-1', x: 35, y: 45, width: 95, height: 75, type: 'bookshelf', solid: true },
      { id: 'f-2', x: 360, y: 45, width: 95, height: 75, type: 'bookshelf', solid: true },
      { id: 'f-3', x: 180, y: 50, width: 140, height: 45, type: 'desk_computer', solid: true },
      { id: 'f-4', x: 420, y: 230, width: 30, height: 30, type: 'plant', solid: true },
    ],
    skills: [
      { id: 'sk-uff-1', name: 'Modelagem em R', category: 'Data Science', description: 'Estatística inferencial, análise multivariada e econometria em R.', x: 100, y: 155, collected: false, icon: 'terminal' },
      { id: 'sk-uff-2', name: 'Governança & Gestão', category: 'Estratégia', description: 'Visão holística de negócios, governança institucional e liderança.', x: 250, y: 135, collected: false, icon: 'react' },
      { id: 'sk-uff-3', name: 'Metodologia Científica', category: 'Pesquisa', description: 'Rigor científico para testar hipóteses e validar produtos analíticos.', x: 400, y: 155, collected: false, icon: 'terminal' },
    ],
    npc: {
      name: 'Dra. Helena',
      role: 'Orientadora Acadêmica',
      x: 190,
      y: 110,
      direction: 'down',
      dialog: 'A ciência nos ensina a não aceitar palpites: qualquer modelo ou hipótese deve ser provada com rigor de dados.',
    },
  },
  cid: {
    buildingId: 'cid',
    name: 'CID-UFF — Laboratório de Ciência de Dados',
    subtitle: 'Ano 2024 • Projeto Laguna & Big Data',
    theme: 'data_center',
    floorColor: '#022C22',
    floorTileColor: '#065F46',
    wallColor: '#064E3B',
    wallBorderColor: '#34D399',
    roomWidth: 490,
    roomHeight: 330,
    doorX: 245,
    doorY: 310,
    furniture: [
      { id: 'f-1', x: 35, y: 50, width: 90, height: 70, type: 'server_cabinet', solid: true },
      { id: 'f-2', x: 360, y: 50, width: 90, height: 48, type: 'desk_computer', solid: true },
      { id: 'f-3', x: 180, y: 40, width: 130, height: 35, type: 'whiteboard', solid: true },
      { id: 'f-4', x: 45, y: 230, width: 30, height: 30, type: 'plant', solid: true },
    ],
    skills: [
      { id: 'sk-cid-1', name: 'Python & ETL', category: 'Data Eng', description: 'Construção de pipelines resilientes de ingestão e transformação de dados.', x: 110, y: 150, collected: false, icon: 'python' },
      { id: 'sk-cid-2', name: 'Dashboards Analíticos', category: 'Analytics', description: 'Interfaces interativas com Streamlit, FastAPI e visualizações avançadas.', x: 245, y: 130, collected: false, icon: 'react' },
      { id: 'sk-cid-3', name: 'IoT & Telemetria', category: 'IoT', description: 'Sistema LAGUNA para monitoramento ambiental em tempo real.', x: 390, y: 145, collected: false, icon: 'mcp' },
    ],
    npc: {
      name: 'Dr. Lucas',
      role: 'Coordenador do Projeto Laguna',
      x: 320,
      y: 95,
      direction: 'down',
      dialog: 'O Projeto LAGUNA gerou impacto real para o meio ambiente graças aos dashboards e à modelagem dos seus dados.',
    },
  },
  coppead: {
    buildingId: 'coppead',
    name: 'COPPEAD / UFRJ — Sala de Pesquisa de Doutorado',
    subtitle: 'Ano 2025 • Governança & IA Avançada',
    theme: 'research_dome',
    floorColor: '#4A044E',
    floorTileColor: '#701A75',
    wallColor: '#2E0854',
    wallBorderColor: '#F472B6',
    roomWidth: 500,
    roomHeight: 330,
    doorX: 250,
    doorY: 310,
    furniture: [
      { id: 'f-1', x: 40, y: 50, width: 95, height: 75, type: 'bookshelf', solid: true },
      { id: 'f-2', x: 360, y: 50, width: 90, height: 65, type: 'server_cabinet', solid: true },
      { id: 'f-3', x: 180, y: 48, width: 140, height: 46, type: 'desk_computer', solid: true },
      { id: 'f-4', x: 420, y: 230, width: 30, height: 30, type: 'plant', solid: true },
    ],
    skills: [
      { id: 'sk-cop-1', name: 'Governança de IA', category: 'Pesquisa', description: 'Frameworks estratégicos de conformidade, riscos e governança algorítmica.', x: 110, y: 155, collected: false, icon: 'agent' },
      { id: 'sk-cop-2', name: 'Cultura Data-Driven', category: 'Inovação', description: 'Transformação cultural e adoção de IA no setor público e corporativo.', x: 250, y: 135, collected: false, icon: 'langgraph' },
      { id: 'sk-cop-3', name: 'IA Responsável', category: 'Ética', description: 'Mitigação de viés, interpretabilidade e segurança em modelos de linguagem.', x: 395, y: 155, collected: false, icon: 'claude' },
    ],
    npc: {
      name: 'Prof. Fontes',
      role: 'Catedrático COPPEAD',
      x: 195,
      y: 110,
      direction: 'down',
      dialog: 'A inteligência artificial exige governança de ponta. Desenvolver agentes autônomos requer profunda responsabilidade.',
    },
  },
  baxijen: {
    buildingId: 'baxijen',
    name: 'BaXiJen — Central de Arquitetura de IA & Agentes',
    subtitle: 'Ano 2026+ • Orquestração Cognitiva Autônoma',
    theme: 'cyber_headquarters',
    floorColor: '#020617',
    floorTileColor: '#0B1528',
    wallColor: '#090D16',
    wallBorderColor: '#00F0FF',
    roomWidth: 520,
    roomHeight: 340,
    doorX: 260,
    doorY: 320,
    furniture: [
      { id: 'f-1', x: 40, y: 50, width: 100, height: 75, type: 'server_cabinet', solid: true },
      { id: 'f-2', x: 370, y: 50, width: 100, height: 75, type: 'server_cabinet', solid: true },
      { id: 'f-3', x: 210, y: 55, width: 100, height: 50, type: 'ai_holo', solid: false },
      { id: 'f-4', x: 440, y: 240, width: 30, height: 30, type: 'plant', solid: true },
    ],
    skills: [
      { id: 'sk-bax-1', name: 'Agentes Autônomos', category: 'AI Architecture', description: 'Orquestração multiagente assíncrona, LangGraph, tool-calling e memória vetorial.', x: 120, y: 160, collected: false, icon: 'agent' },
      { id: 'sk-bax-2', name: 'MCP (Model Context Protocol)', category: 'Protocolos', description: 'Integrações padronizadas com ferramentas locais, bancos de dados e APIs externas.', x: 260, y: 140, collected: false, icon: 'mcp' },
      { id: 'sk-bax-3', name: 'Dev Assistido por IA', category: 'Engenharia', description: 'Engenharia acelerada com Claude Code, Google Antigravity e OpenAI Codex.', x: 410, y: 160, collected: false, icon: 'claude' },
    ],
    npc: {
      name: 'Marcus AI Core',
      role: 'Agente Sintético BaXiJen',
      x: 230,
      y: 110,
      direction: 'down',
      dialog: 'Você dominou todas as eras! Na BaXiJen, unimos arquitetura de software sólida ao poder dos agentes autônomos.',
    },
  },
};

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
  { id: 'obs-1', x: 880, y: 0, width: 20, height: 24, type: 'hazard_cone', label: 'Cone' },
  { id: 'obs-2', x: 1250, y: 0, width: 24, height: 20, type: 'glitch_bug', label: 'Bug' },
  { id: 'obs-3', x: 2150, y: 0, width: 22, height: 32, type: 'server_rack', label: 'Legacy Server' },
  { id: 'obs-4', x: 2550, y: 0, width: 24, height: 20, type: 'glitch_bug', label: 'Syntax Error' },
  { id: 'obs-5', x: 3450, y: 0, width: 20, height: 24, type: 'hazard_cone', label: 'Prazo' },
  { id: 'obs-6', x: 3900, y: 0, width: 24, height: 20, type: 'glitch_bug', label: 'NullPointer' },
  { id: 'obs-7', x: 4850, y: 0, width: 14, height: 36, type: 'firewall', label: 'Firewall' },
  { id: 'obs-8', x: 5300, y: 0, width: 24, height: 20, type: 'glitch_bug', label: 'Data Drift' },
  { id: 'obs-9', x: 6200, y: 0, width: 14, height: 38, type: 'firewall', label: 'Security Gateway' },
  { id: 'obs-10', x: 6650, y: 0, width: 24, height: 20, type: 'glitch_bug', label: 'AI Hallucination' },
];

export const INITIAL_PLATFORMS: Platform[] = [
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

  // View atual ('overworld' = rua lateral; 'interior' = RPG top-down)
  private view: GameView = 'overworld';
  private currentInterior: BuildingInterior | null = null;
  private fadeAlpha: number = 0;
  private isTransitioning: boolean = false;

  // Estados do Overworld (Runner)
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
  private worldLength: number = 7800;

  // Estados do Interior (Top-Down Pokémon)
  private topDownPlayer: TopDownPlayerState;
  private interiors: Record<string, BuildingInterior>;
  private acquiredSkillsTotal: number = 0;

  // Input & Loop
  private input: GameInput = { left: false, right: false, up: false, down: false, jump: false, interact: false };
  private lastTime: number = 0;
  private animId: number | null = null;

  // Estatísticas & RPG Progression
  private stats: {
    level: number;
    title: string;
    currentXp: number;
    nextLevelXp: number;
    totalSkillsCollected: number;
    totalOrbsCollected: number;
    dodgeCombo: number;
    visitedBuildings: Record<string, boolean>;
    completedBuildings: Record<string, boolean>;
  } = {
    level: 1,
    title: 'Estudante Técnico (2008)',
    currentXp: 0,
    nextLevelXp: 200,
    totalSkillsCollected: 0,
    totalOrbsCollected: 0,
    dodgeCombo: 0,
    visitedBuildings: {},
    completedBuildings: {},
  };

  // Callbacks para UI
  public onMilestoneNear: ((milestone: Milestone | null) => void) | null = null;
  public onOrbsUpdate: ((collected: number, total: number) => void) | null = null;
  public onYearUpdate: ((year: number) => void) | null = null;
  public onViewChange: ((view: GameView, interior: BuildingInterior | null) => void) | null = null;
  public onSkillAcquired: ((skill: InteriorSkillItem, building: BuildingInterior) => void) | null = null;
  public onDialog: ((dialog: { speaker: string; role: string; text: string } | null) => void) | null = null;
  public onStatsUpdate: ((stats: any) => void) | null = null;
  public onLevelUp: ((level: number, title: string) => void) | null = null;
  public onComboDodge: ((combo: number) => void) | null = null;

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

    this.topDownPlayer = {
      x: 230,
      y: 280,
      vx: 0,
      vy: 0,
      direction: 'up',
      frame: 0,
      animTimer: 0,
      outfit: 'cefet',
    };

    this.techOrbs = JSON.parse(JSON.stringify(INITIAL_TECH_ORBS));
    this.obstacles = JSON.parse(JSON.stringify(INITIAL_OBSTACLES));
    this.platforms = JSON.parse(JSON.stringify(INITIAL_PLATFORMS));
    this.props = JSON.parse(JSON.stringify(INITIAL_PROPS));
    this.interiors = JSON.parse(JSON.stringify(BUILDING_INTERIORS));

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

  public getView(): GameView {
    return this.view;
  }

  public getCurrentInterior(): BuildingInterior | null {
    return this.currentInterior;
  }

  public setDark(isDark: boolean) {
    this.isDark = isDark;
  }

  public setInput(newInput: Partial<GameInput>) {
    this.input = { ...this.input, ...newInput };
  }

  public getStats() {
    return { ...this.stats };
  }

  public getInteriors(): Record<string, BuildingInterior> {
    return this.interiors;
  }

  public getMilestones(): Milestone[] {
    return MILESTONES;
  }

  public getTechOrbs(): TechOrb[] {
    return this.techOrbs;
  }

  public getPlayerX(): number {
    return this.player.x;
  }

  public getWorldLength(): number {
    return this.worldLength;
  }

  public addXp(amount: number) {
    this.stats.currentXp += amount;

    const levels = [
      { level: 1, xp: 0, title: 'Estudante Técnico (2008)' },
      { level: 2, xp: 200, title: 'Engenheiro de Automação (2011)' },
      { level: 3, xp: 500, title: 'Administrador & Mestre (2016)' },
      { level: 4, xp: 900, title: 'Cientista de Dados Laguna (2024)' },
      { level: 5, xp: 1400, title: 'Doutorando em IA COPPEAD (2025)' },
      { level: 6, xp: 2000, title: 'AI Architect Supremo @ BaXiJen (2026)' },
    ];

    let newLevel = 1;
    let newTitle = levels[0].title;
    let nextXp = levels[1].xp;

    for (let i = levels.length - 1; i >= 0; i--) {
      if (this.stats.currentXp >= levels[i].xp) {
        newLevel = levels[i].level;
        newTitle = levels[i].title;
        nextXp = levels[i + 1] ? levels[i + 1].xp : levels[i].xp + 1000;
        break;
      }
    }

    if (newLevel > this.stats.level) {
      this.stats.level = newLevel;
      this.stats.title = newTitle;
      retroAudio.playLevelUp();
      this.createSparkles(this.player.x, this.player.y - 30, 25, ['#FACC15', '#F59E0B', '#38BDF8', '#FFFFFF']);
      if (this.onLevelUp) {
        this.onLevelUp(newLevel, newTitle);
      }
    }

    this.stats.nextLevelXp = nextXp;
    if (this.onStatsUpdate) {
      this.onStatsUpdate({ ...this.stats });
    }
  }

  /**
   * Entra no prédio com transição clássica de RPG
   */
  public enterBuilding(buildingId: string) {
    if (this.isTransitioning) return;
    const interior = this.interiors[buildingId];
    if (!interior) return;

    this.isTransitioning = true;
    retroAudio.playDoor();

    // Fade to black
    const fadeInterval = setInterval(() => {
      this.fadeAlpha += 0.15;
      if (this.fadeAlpha >= 1) {
        clearInterval(fadeInterval);
        this.fadeAlpha = 1;

        // Troca de cena para Interior Top-Down
        this.view = 'interior';
        this.currentInterior = interior;
        this.topDownPlayer.x = interior.doorX;
        this.topDownPlayer.y = interior.doorY - 25;
        this.topDownPlayer.direction = 'up';
        this.topDownPlayer.outfit = this.player.outfit;

        this.stats.visitedBuildings[buildingId] = true;
        this.addXp(20);

        if (this.onViewChange) {
          this.onViewChange('interior', interior);
        }

        // Fade from black
        const fadeIn = setInterval(() => {
          this.fadeAlpha -= 0.15;
          if (this.fadeAlpha <= 0) {
            clearInterval(fadeIn);
            this.fadeAlpha = 0;
            this.isTransitioning = false;
          }
        }, 25);
      }
    }, 25);
  }

  /**
   * Sai do prédio e retorna para a rua (Overworld)
   */
  public exitBuilding() {
    if (this.isTransitioning || this.view !== 'interior') return;
    this.isTransitioning = true;
    retroAudio.playDoor();

    // Limpa diálogo se houver
    if (this.onDialog) {
      this.onDialog(null);
    }

    const fadeInterval = setInterval(() => {
      this.fadeAlpha += 0.15;
      if (this.fadeAlpha >= 1) {
        clearInterval(fadeInterval);
        this.fadeAlpha = 1;

        // Retorna para o Overworld
        this.view = 'overworld';
        this.currentInterior = null;

        if (this.onViewChange) {
          this.onViewChange('overworld', null);
        }

        const fadeIn = setInterval(() => {
          this.fadeAlpha -= 0.15;
          if (this.fadeAlpha <= 0) {
            clearInterval(fadeIn);
            this.fadeAlpha = 0;
            this.isTransitioning = false;
          }
        }, 25);
      }
    }, 25);
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

    this.groundY = this.height - 40;
    this.player.y = this.groundY;

    this.obstacles.forEach(obs => {
      obs.y = this.groundY - obs.height;
    });

    this.platforms.forEach(plat => {
      plat.y = this.groundY - 58;
    });

    this.techOrbs.forEach(orb => {
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
      const dt = Math.min((time - this.lastTime) / 1000, 0.05);
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
    if (this.view === 'overworld') {
      this.updateOverworld(dt);
    } else {
      this.updateInterior(dt);
    }

    // Atualizar partículas universais
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

  // =========================================================================
  // OVERWORLD UPDATE (RUNNER 2D)
  // =========================================================================
  private updateOverworld(dt: number) {
    const gravity = 26;
    const runSpeed = 230;
    const jumpVelocity = -430;

    if (this.player.stumbleTimer > 0) {
      this.player.stumbleTimer = Math.max(0, this.player.stumbleTimer - dt);
    }
    if (this.player.invulnerableTimer > 0) {
      this.player.invulnerableTimer = Math.max(0, this.player.invulnerableTimer - dt);
    }

    // Input & Movimento
    if (this.mode === 'auto') {
      this.player.vx = 150;
      this.player.facing = 'right';

      // Auto-jump inteligente
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

      // Loop do mapa
      if (this.player.x > this.worldLength) {
        this.player.x = 80;
        this.cameraX = 0;
        retroAudio.playVictory();
      }
    } else {
      if (this.player.stumbleTimer > 0) {
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

        if (this.input.jump && this.player.isGrounded) {
          this.player.vy = jumpVelocity;
          this.player.isGrounded = false;
          this.player.isJumping = true;
          retroAudio.playJump();
          this.createDust(this.player.x, this.groundY, 6);
        }
      }
    }

    // Gravidade e Física
    this.player.vy += gravity;
    this.player.x += this.player.vx * dt;
    this.player.y += this.player.vy * dt;

    // Colisão com plataformas suspensas
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

    // Colisão com solo
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

    this.player.x = Math.max(30, this.player.x);

    // Colisão com obstáculos e esquivas
    for (const obs of this.obstacles) {
      // Esquiva bem-sucedida (pulando sobre o obstáculo)
      if (
        !obs.dodged &&
        this.player.isJumping &&
        this.player.x > obs.x + obs.width &&
        this.player.x - (obs.x + obs.width) < 55 &&
        this.player.y < this.groundY - 15
      ) {
        obs.dodged = true;
        this.stats.dodgeCombo++;
        this.addXp(40);
        if (this.onComboDodge) {
          this.onComboDodge(this.stats.dodgeCombo);
        }
        this.createSparkles(obs.x + (obs.width / 2), this.groundY - 20, 8, ['#FACC15', '#38BDF8']);
      }

      if (this.player.invulnerableTimer <= 0) {
        const playerFootY = this.player.y;
        const playerTopY = this.player.y - 36;
        const obsTopY = obs.y;
        const obsBottomY = this.groundY;

        if (
          this.player.x + 12 >= obs.x &&
          this.player.x - 12 <= obs.x + obs.width &&
          playerFootY > obsTopY + 4 &&
          playerTopY < obsBottomY
        ) {
          this.player.stumbleTimer = 0.35;
          this.player.invulnerableTimer = 1.2;
          this.stats.dodgeCombo = 0; // Perde o combo ao tropeçar
          retroAudio.playHurt();
          this.createSparkles(this.player.x, this.player.y - 20, 8, ['#EF4444', '#F87171', '#FEF08A']);
          break;
        }
      }
    }

    // Ciclo de corrida
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

    // Traje & Ano
    this.player.outfit = this.determineOutfit(this.player.x);
    const currentYear = this.determineYear(this.player.x);
    if (this.onYearUpdate) {
      this.onYearUpdate(currentYear);
    }

    // Câmera
    const lookAhead = this.player.facing === 'right' ? 80 : -80;
    const targetCameraX = this.player.x - (this.width * 0.35) + lookAhead;
    this.cameraX += (targetCameraX - this.cameraX) * 0.08;
    this.cameraX = Math.max(0, this.cameraX);

    // Coleta de Orbes na Rua
    this.techOrbs.forEach(orb => {
      if (!orb.collected) {
        const dx = this.player.x - orb.x;
        const dy = (this.player.y - 20) - orb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 28) {
          orb.collected = true;
          this.collectedCount++;
          this.stats.totalOrbsCollected++;
          this.addXp(60);
          retroAudio.playCollect();
          this.createSparkles(orb.x, orb.y, 12, ['#38BDF8', '#FACC15', '#34D399', '#A78BFA']);
          if (this.onOrbsUpdate) {
            this.onOrbsUpdate(this.collectedCount, this.techOrbs.length);
          }
        }
      }
    });

    // Checkpoint de Marcos
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
  }

  // =========================================================================
  // INTERIOR UPDATE (TOP-DOWN POKÉMON RPG)
  // =========================================================================
  private updateInterior(dt: number) {
    if (!this.currentInterior) return;
    const interior = this.currentInterior;
    const speed = 150; // pixels / segundo

    let vx = 0;
    let vy = 0;

    // 4 Direções
    if (this.input.left) {
      vx -= speed;
      this.topDownPlayer.direction = 'left';
    } else if (this.input.right) {
      vx += speed;
      this.topDownPlayer.direction = 'right';
    }

    if (this.input.up) {
      vy -= speed;
      this.topDownPlayer.direction = 'up';
    } else if (this.input.down) {
      vy += speed;
      this.topDownPlayer.direction = 'down';
    }

    // Normalizar velocidade diagonal
    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071;
      vy *= 0.7071;
    }

    const nextX = this.topDownPlayer.x + vx * dt;
    const nextY = this.topDownPlayer.y + vy * dt;

    // 1. Limites das Paredes da Sala
    const minX = 26;
    const maxX = interior.roomWidth - 26;
    const minY = 46;
    const maxY = interior.roomHeight - 20;

    // 2. Colisão com Móveis Sólidos
    let collideX = false;
    let collideY = false;

    interior.furniture.forEach(item => {
      if (!item.solid) return;
      const buffer = 10;
      // Checa colisão em X
      if (
        nextX >= item.x - buffer &&
        nextX <= item.x + item.width + buffer &&
        this.topDownPlayer.y >= item.y - buffer &&
        this.topDownPlayer.y <= item.y + item.height + buffer
      ) {
        collideX = true;
      }
      // Checa colisão em Y
      if (
        this.topDownPlayer.x >= item.x - buffer &&
        this.topDownPlayer.x <= item.x + item.width + buffer &&
        nextY >= item.y - buffer &&
        nextY <= item.y + item.height + buffer
      ) {
        collideY = true;
      }
    });

    if (!collideX && nextX >= minX && nextX <= maxX) {
      this.topDownPlayer.x = nextX;
    }
    if (!collideY && nextY >= minY && nextY <= maxY) {
      this.topDownPlayer.y = nextY;
    }

    // Animação de caminhada top-down
    if (vx !== 0 || vy !== 0) {
      this.topDownPlayer.animTimer += dt;
      if (this.topDownPlayer.animTimer > 0.14) {
        this.topDownPlayer.animTimer = 0;
        this.topDownPlayer.frame = (this.topDownPlayer.frame + 1) % 4;
      }
    } else {
      this.topDownPlayer.frame = 0;
    }

    // 3. Checagem de Saída pela Porta (Tapete Vermelho)
    const doorDist = Math.hypot(
      this.topDownPlayer.x - interior.doorX,
      this.topDownPlayer.y - interior.doorY
    );
    if (doorDist < 25 || this.topDownPlayer.y > interior.roomHeight - 16) {
      this.exitBuilding();
      return;
    }

    // 4. Coleta de Skills Top-Down (Pokébolas / Cristais)
    interior.skills.forEach(skill => {
      if (!skill.collected) {
        const dist = Math.hypot(
          this.topDownPlayer.x - skill.x,
          this.topDownPlayer.y - skill.y
        );

        if (dist < 26) {
          skill.collected = true;
          this.acquiredSkillsTotal++;
          this.stats.totalSkillsCollected++;
          this.addXp(180);
          retroAudio.playSkillFanfare();

          // Verifica se dominou todas as skills do prédio
          if (interior.skills.every(s => s.collected) && !this.stats.completedBuildings[interior.buildingId]) {
            this.stats.completedBuildings[interior.buildingId] = true;
            this.addXp(300);
            retroAudio.playVictory();
          }

          // Cria partículas de celebração ao redor da skill
          const originX = Math.floor((this.width - interior.roomWidth) / 2);
          const originY = Math.floor((this.height - interior.roomHeight) / 2);
          this.createSparkles(
            originX + skill.x,
            originY + skill.y,
            16,
            ['#38BDF8', '#FACC15', '#34D399', '#F43F5E']
          );

          if (this.onSkillAcquired) {
            this.onSkillAcquired(skill, interior);
          }
        }
      }
    });

    // 5. Interação com o NPC da Sala
    if (interior.npc) {
      const npcDist = Math.hypot(
        this.topDownPlayer.x - interior.npc.x,
        this.topDownPlayer.y - interior.npc.y
      );

      if (npcDist < 45) {
        if (this.onDialog) {
          this.onDialog({
            speaker: interior.npc.name,
            role: interior.npc.role,
            text: interior.npc.dialog,
          });
        }
      } else {
        if (this.onDialog) {
          this.onDialog(null);
        }
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
    const now = performance.now() / 1000;

    if (this.view === 'overworld') {
      this.renderOverworld(now);
    } else {
      this.renderInterior(now);
    }

    // Efeito de transição de fade to black / fade in
    if (this.fadeAlpha > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, Math.max(0, this.fadeAlpha))})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  private renderOverworld(now: number) {
    const ctx = this.ctx;
    const W = this.width;
    const H = this.height;
    const isDark = this.isDark;

    // Céu
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

    // Estrelas / Lua ou Sol
    if (isDark) {
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < 35; i++) {
        const sx = ((i * 127) - (this.cameraX * 0.02)) % W;
        const realSx = sx < 0 ? sx + W : sx;
        const sy = 20 + (i * 17) % (this.groundY - 140);
        ctx.fillRect(Math.floor(realSx), sy, 2, 2);
      }
      const moonX = W - 120;
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(moonX, 30, 20, 20);
      ctx.fillStyle = '#FDE047';
      ctx.fillRect(moonX + 4, 34, 5, 5);
    } else {
      const sunX = W - 110;
      ctx.fillStyle = '#FBBF24';
      ctx.fillRect(sunX, 30, 22, 22);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(sunX + 4, 34, 14, 14);
    }

    // Nuvens
    const cloudColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)';
    ctx.fillStyle = cloudColor;
    for (let c = 0; c < 12; c++) {
      const cx = ((c * 350) - (this.cameraX * 0.06) + (now * 6)) % (W + 400);
      const cy = 35 + (c % 4) * 30;
      ctx.fillRect(cx - 100, cy, 75, 14);
      ctx.fillRect(cx - 85, cy - 8, 48, 10);
      ctx.fillRect(cx - 68, cy - 14, 22, 8);
    }

    // Skyline distante
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

    // Mundo com Câmera
    ctx.save();
    ctx.translate(-Math.floor(this.cameraX), 0);

    for (let tx = 150; tx < this.worldLength; tx += 320) {
      drawPixelTree(ctx, tx, this.groundY, isDark, Math.floor(tx / 320));
    }

    this.props.forEach(prop => {
      drawSceneryProps(ctx, prop, this.groundY, isDark);
    });

    MILESTONES.forEach(m => {
      drawDetailedBuilding(ctx, m, this.groundY, isDark, now);
    });

    this.platforms.forEach(plat => {
      drawPlatform(ctx, plat, isDark);
    });

    this.obstacles.forEach(obs => {
      drawObstacle(ctx, obs, this.groundY, isDark, now);
    });

    this.techOrbs.forEach(orb => {
      drawTechOrb(ctx, orb, now);
    });

    this.particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
    });

    // Personagem na rua
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

    // Chão
    ctx.fillStyle = isDark ? '#166534' : '#22C55E';
    ctx.fillRect(0, this.groundY, W, 4);

    ctx.fillStyle = isDark ? '#1E293B' : '#64748B';
    ctx.fillRect(0, this.groundY + 4, W, H - (this.groundY + 4));

    ctx.fillStyle = isDark ? '#334155' : '#475569';
    for (let px = 0; px < W + 30; px += 24) {
      const offsetX = (px - (Math.floor(this.cameraX) % 24));
      ctx.fillRect(offsetX, this.groundY + 10, 4, 3);
      ctx.fillRect(offsetX + 10, this.groundY + 20, 5, 2);
    }
  }

  private renderInterior(now: number) {
    if (!this.currentInterior) return;
    const ctx = this.ctx;
    const interior = this.currentInterior;
    const originX = Math.floor((this.width - interior.roomWidth) / 2);
    const originY = Math.floor((this.height - interior.roomHeight) / 2);

    // 1. Sala (Piso, Paredes, Porta)
    drawTopDownRoom(ctx, interior, this.width, this.height, now);

    // 2. Móveis
    interior.furniture.forEach(item => {
      drawFurniture(ctx, item, originX, originY, now);
    });

    // 3. NPC / Mentor
    if (interior.npc) {
      drawNPC(ctx, interior.npc, originX, originY);
    }

    // 4. Skills Colecionáveis na Sala
    interior.skills.forEach(skill => {
      drawInteriorSkillItem(ctx, skill, originX, originY, now);
    });

    // 5. Partículas na Sala
    this.particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
    });

    // 6. Personagem Top-Down
    drawTopDownCharacter(
      ctx,
      originX + this.topDownPlayer.x,
      originY + this.topDownPlayer.y,
      this.topDownPlayer.direction,
      this.topDownPlayer.frame,
      this.topDownPlayer.outfit
    );
  }
}
