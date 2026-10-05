export type EraOutfit = 'cefet' | 'chemtech' | 'uff' | 'cid' | 'baxijen';

export type GameView = 'overworld' | 'interior';

export type TopDownDirection = 'down' | 'up' | 'left' | 'right';

export interface Milestone {
  id: string;
  year: number;
  x: number; // World X position
  label: string;
  subLabel: string;
  role: string;
  description: string;
  outfit: EraOutfit;
  color: string;
  roofColor: string;
  accentColor: string;
  neonColor: string;
  buildingStyle: 'cefet' | 'chemtech' | 'uff' | 'cid' | 'coppead' | 'baxijen';
  width: number;
  height: number;
}

export type TechIconType = 'python' | 'mcp' | 'claude' | 'codex' | 'langgraph' | 'docker' | 'react' | 'agent' | 'terminal';

export interface TechOrb {
  id: string;
  name: string;
  x: number;
  y: number;
  iconType: TechIconType;
  collected: boolean;
  floatOffset: number;
}

export type ObstacleType = 'glitch_bug' | 'server_rack' | 'hazard_cone' | 'firewall';

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: ObstacleType;
  label?: string;
  animTimer?: number;
}

export interface Platform {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'metal' | 'brick' | 'wood' | 'cyber';
}

export interface SceneryProp {
  id: string;
  x: number;
  type: 'lamp_classic' | 'lamp_cyber' | 'bench' | 'bush_flowers' | 'hydrant' | 'billboard';
  label?: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  isJumping: boolean;
  facing: 'right' | 'left';
  frame: number;
  animTimer: number;
  outfit: EraOutfit;
  stumbleTimer: number;
  invulnerableTimer: number;
}

export interface TopDownPlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  direction: TopDownDirection;
  frame: number;
  animTimer: number;
  outfit: EraOutfit;
}

export type FurnitureType =
  | 'desk_computer'
  | 'bookshelf'
  | 'server_cabinet'
  | 'whiteboard'
  | 'plant'
  | 'rug'
  | 'water_tank'
  | 'ai_holo';

export interface FurnitureItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: FurnitureType;
  solid: boolean;
  label?: string;
}

export interface InteriorSkillItem {
  id: string;
  name: string;
  category: string;
  description: string;
  x: number;
  y: number;
  collected: boolean;
  icon: TechIconType;
}

export interface BuildingInterior {
  buildingId: string;
  name: string;
  subtitle: string;
  theme: 'workshop' | 'industrial_office' | 'university_lab' | 'data_center' | 'research_dome' | 'cyber_headquarters';
  floorColor: string;
  floorTileColor: string;
  wallColor: string;
  wallBorderColor: string;
  roomWidth: number;
  roomHeight: number;
  doorX: number;
  doorY: number;
  furniture: FurnitureItem[];
  skills: InteriorSkillItem[];
  npc?: {
    name: string;
    role: string;
    x: number;
    y: number;
    direction: TopDownDirection;
    dialog: string;
  };
}

export interface GameInput {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jump: boolean;
  interact: boolean;
}
