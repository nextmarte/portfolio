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
  width: number;
  height: number;
}

export interface TechOrb {
  id: string;
  name: string;
  x: number;
  y: number;
  iconType: 'python' | 'mcp' | 'claude' | 'codex' | 'langgraph' | 'docker';
  collected: boolean;
  floatOffset: number;
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
}

export interface GameInput {
  left: boolean;
  right: boolean;
  jump: boolean;
  interact: boolean;
}
