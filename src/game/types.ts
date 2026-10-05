export type EraOutfit = 'cefet' | 'chemtech' | 'uff' | 'cid' | 'baxijen';

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

export interface GameInput {
  left: boolean;
  right: boolean;
  jump: boolean;
  interact: boolean;
}
