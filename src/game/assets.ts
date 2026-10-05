export interface GameAssets {
  backgrounds: {
    rioSkyline: HTMLImageElement | null;
  };
  buildings: Record<string, HTMLImageElement>;
}

class AssetManager {
  private assets: GameAssets = {
    backgrounds: {
      rioSkyline: null,
    },
    buildings: {},
  };
  private isLoaded: boolean = false;

  public loadAll(): Promise<void> {
    if (typeof window === 'undefined') return Promise.resolve();
    if (this.isLoaded) return Promise.resolve();

    const buildingIds = ['cefet', 'chemtech', 'uff', 'cid', 'coppead', 'baxijen'];
    const promises: Promise<void>[] = [];

    // Background Panorâmico de Rio & Niterói
    const bg = new Image();
    bg.src = '/game/backgrounds/rio_skyline.jpg';
    this.assets.backgrounds.rioSkyline = bg;
    promises.push(
      new Promise(resolve => {
        bg.onload = () => resolve();
        bg.onerror = () => resolve();
      })
    );

    // Sprites de Edifícios
    for (const id of buildingIds) {
      const img = new Image();
      img.src = `/game/buildings/${id}.png`;
      this.assets.buildings[id] = img;
      promises.push(
        new Promise(resolve => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
      );
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
