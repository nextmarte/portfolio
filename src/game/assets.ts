export interface GameAssets {
  backgrounds: {
    rioSkyline: HTMLImageElement | null;
  };
  buildings: Record<string, HTMLImageElement>;
  playerOverworld: {
    idle: HTMLImageElement | null;
    run: HTMLImageElement[];
    jump: HTMLImageElement | null;
  };
  playerTopDown: {
    down: HTMLImageElement[];
    up: HTMLImageElement[];
    right: HTMLImageElement[];
    left: HTMLImageElement[];
  };
  obstacles: Record<string, HTMLImageElement>;
}

class AssetManager {
  private assets: GameAssets = {
    backgrounds: {
      rioSkyline: null,
    },
    buildings: {},
    playerOverworld: {
      idle: null,
      run: [],
      jump: null,
    },
    playerTopDown: {
      down: [],
      up: [],
      right: [],
      left: [],
    },
    obstacles: {},
  };
  private isLoaded: boolean = false;

  private loadImage(src: string): HTMLImageElement {
    const img = new Image();
    img.src = src;
    return img;
  }

  public loadAll(): Promise<void> {
    if (typeof window === 'undefined') return Promise.resolve();
    if (this.isLoaded) return Promise.resolve();

    const buildingIds = ['cefet', 'chemtech', 'uff', 'cid', 'coppead', 'baxijen'];
    const obstacleIds = ['glitch_bug', 'server_rack', 'firewall', 'hazard_cone'];
    const promises: Promise<void>[] = [];

    // 1. Background Panorâmico de Rio & Niterói
    const bg = this.loadImage('/game/backgrounds/rio_skyline.jpg');
    this.assets.backgrounds.rioSkyline = bg;
    promises.push(new Promise(resolve => { bg.onload = () => resolve(); bg.onerror = () => resolve(); }));

    // 2. Sprites de Edifícios
    for (const id of buildingIds) {
      const bImg = this.loadImage(`/game/buildings/${id}.png`);
      this.assets.buildings[id] = bImg;
      promises.push(new Promise(resolve => { bImg.onload = () => resolve(); bImg.onerror = () => resolve(); }));
    }

    // 3. Sprites do Jogador Overworld (Corrida, Pulo, Parado)
    const idleImg = this.loadImage('/game/sprites/player_idle.png');
    this.assets.playerOverworld.idle = idleImg;
    promises.push(new Promise(resolve => { idleImg.onload = () => resolve(); idleImg.onerror = () => resolve(); }));

    const jumpImg = this.loadImage('/game/sprites/player_jump.png');
    this.assets.playerOverworld.jump = jumpImg;
    promises.push(new Promise(resolve => { jumpImg.onload = () => resolve(); jumpImg.onerror = () => resolve(); }));

    const runFrames = ['player_run_0', 'player_run_1', 'player_run_2', 'player_run_3'];
    this.assets.playerOverworld.run = runFrames.map(f => {
      const rImg = this.loadImage(`/game/sprites/${f}.png`);
      promises.push(new Promise(resolve => { rImg.onload = () => resolve(); rImg.onerror = () => resolve(); }));
      return rImg;
    });

    // 4. Sprites do Jogador Top-Down RPG (4 Direções)
    const directions: ('down' | 'up' | 'right' | 'left')[] = ['down', 'up', 'right', 'left'];
    directions.forEach(dir => {
      this.assets.playerTopDown[dir] = [0, 1].map(frame => {
        const tdImg = this.loadImage(`/game/sprites/player_td_${dir}_${frame}.png`);
        promises.push(new Promise(resolve => { tdImg.onload = () => resolve(); tdImg.onerror = () => resolve(); }));
        return tdImg;
      });
    });

    // 5. Obstáculos do Overworld
    for (const obs of obstacleIds) {
      const obsImg = this.loadImage(`/game/sprites/${obs}.png`);
      this.assets.obstacles[obs] = obsImg;
      promises.push(new Promise(resolve => { obsImg.onload = () => resolve(); obsImg.onerror = () => resolve(); }));
    }

    return Promise.all(promises).then(() => {
      this.isLoaded = true;
    });
  }

  public getAssets(): GameAssets {
    return this.assets;
  }
}

export const assetManager = new AssetManager();
