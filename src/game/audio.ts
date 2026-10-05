// Web Audio API procedural 8-bit sound generator (Zero external MP3 dependencies)
class RetroAudio {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private currentTheme: 'overworld' | 'interior' | null = null;
  private bgmIntervalId: ReturnType<typeof setInterval> | null = null;
  private bgmStep: number = 0;

  constructor() {
    // AudioContext is initialized on first user gesture
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!muted) {
      this.initContext();
      if (this.currentTheme) {
        this.playBgmLoop(this.currentTheme);
      }
    } else {
      this.stopBGM();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Inicia o Background Music (BGM) Chiptune procedural
   */
  public startBGM(theme: 'overworld' | 'interior') {
    this.currentTheme = theme;
    if (this.isMuted) return;
    this.initContext();
    this.playBgmLoop(theme);
  }

  public stopBGM() {
    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  private playBgmLoop(theme: 'overworld' | 'interior') {
    this.stopBGM();
    if (!this.ctx) return;

    this.bgmStep = 0;
    const tempo = theme === 'overworld' ? 120 : 92;
    const stepDurationMs = (60 / tempo / 4) * 1000; // semicolcheia (1/16 note)

    // Frequências das notas (Hz)
    const C3 = 130.81, D3 = 146.83, E3 = 164.81, F3 = 174.61, G3 = 196.00, A2 = 110.00, G2 = 98.00;
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88;
    const C5 = 523.25, D5 = 587.33, E5 = 659.25, G5 = 783.99, A5 = 880.00, C6 = 1046.50;

    // Pattern Overworld (16 steps repetitivos, alegre, arcade)
    const owMelody = [C5, 0, E5, G5, 0, A5, G5, 0, E5, 0, D5, C5, 0, D5, E5, 0];
    const owBass = [C3, 0, C3, 0, A2, 0, A2, 0, F3, 0, F3, 0, G2, 0, G2, 0];

    // Pattern Interior (Lo-Fi Research Lab, relaxante)
    const inMelody = [E4, 0, G4, 0, B4, 0, D5, 0, C5, 0, G4, 0, E4, 0, D4, 0];
    const inBass = [C3, 0, 0, 0, A2, 0, 0, 0, F3, 0, 0, 0, G2, 0, 0, 0];

    this.bgmIntervalId = setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      try {
        const step = this.bgmStep % 16;
        const now = this.ctx.currentTime;
        const melodyPattern = theme === 'overworld' ? owMelody : inMelody;
        const bassPattern = theme === 'overworld' ? owBass : inBass;

        // 1. Canal de Melodia (Square Wave suave com decay rápido)
        const noteFreq = melodyPattern[step];
        if (noteFreq > 0) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = theme === 'overworld' ? 'square' : 'triangle';
          osc.frequency.setValueAtTime(noteFreq, now);

          const vol = theme === 'overworld' ? 0.022 : 0.025;
          gain.gain.setValueAtTime(vol, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + (stepDurationMs / 1000) * 0.9);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + (stepDurationMs / 1000) * 0.9);
        }

        // 2. Canal de Baixo (Triangle Wave encorpado)
        const bassFreq = bassPattern[step];
        if (bassFreq > 0) {
          const bassOsc = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();
          bassOsc.type = 'triangle';
          bassOsc.frequency.setValueAtTime(bassFreq, now);

          bassGain.gain.setValueAtTime(0.04, now);
          bassGain.gain.exponentialRampToValueAtTime(0.0001, now + (stepDurationMs / 1000) * 1.5);

          bassOsc.connect(bassGain);
          bassGain.connect(this.ctx.destination);
          bassOsc.start(now);
          bassOsc.stop(now + (stepDurationMs / 1000) * 1.5);
        }

        // 3. Canal de Percussão Retrô (White Noise curto no ritmo)
        if (theme === 'overworld' && (step === 4 || step === 12)) {
          this.playRetroSnare(now);
        }

        this.bgmStep++;
      } catch {
        // Silently fail
      }
    }, stepDurationMs);
  }

  private playRetroSnare(time: number) {
    if (!this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 0.04;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1000, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.015, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(time);
      whiteNoise.stop(time + 0.04);
    } catch {
      // Silently fail
    }
  }

  public playJump() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Silently fail
    }
  }

  public playCollect() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(987.77, now); // B5
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.08);

      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain2.gain.setValueAtTime(0.08, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.25);
    } catch {
      // Silently fail
    }
  }

  public playHurt() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Silently fail
    }
  }

  public playInspect() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const start = now + i * 0.06;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.07, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(start);
        osc.stop(start + 0.15);
      });
    } catch {
      // Silently fail
    }
  }

  // Pokémon style "Item / Skill Acquired!" Fanfare
  public playSkillFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Classic GBA / Pokémon fanfare: C5, D5, E5, G5, C6 (sustain)
      const notes = [523.25, 587.33, 659.25, 783.99, 1046.5];
      const durations = [0.08, 0.08, 0.08, 0.12, 0.35];
      let currentT = now;

      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const dur = durations[i];

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, currentT);

        gain.gain.setValueAtTime(0.09, currentT);
        gain.gain.exponentialRampToValueAtTime(0.001, currentT + dur);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(currentT);
        osc.stop(currentT + dur);

        currentT += dur * 0.9;
      });
    } catch {
      // Silently fail
    }
  }

  // Transição de porta Pokémon
  public playDoor() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.18);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Silently fail
    }
  }

  public playVictory() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const arpeggio = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      arpeggio.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const start = now + i * 0.07;
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.06, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(start);
        osc.stop(start + 0.2);
      });
    } catch {
      // Silently fail
    }
  }

  public playLevelUp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [392.0, 523.25, 659.25, 783.99, 1046.5];
      const durations = [0.1, 0.1, 0.1, 0.15, 0.5];
      let t = now;
      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + durations[i]);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t);
        osc.stop(t + durations[i]);
        t += durations[i] * 0.85;
      });
    } catch {
      // Silently fail
    }
  }

  public playMenuOpen() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.05);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Silently fail
    }
  }

  public playMenuSelect() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Silently fail
    }
  }

  public playDash() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Sweep descendente rápido simulando propulsão a jato / slide
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.18);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);

      // Noise rush suave de ar comprimido
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1400, now);
      noiseFilter.frequency.linearRampToValueAtTime(400, now + 0.12);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.08, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.12);
    } catch {
      // Silently fail
    }
  }

  public playPowerUp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Arpeggio brilhante sintetizado ascendente
      const freqs = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      freqs.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const start = now + idx * 0.04;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, start);

        gain.gain.setValueAtTime(0.09, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(start);
        osc.stop(start + 0.15);
      });
    } catch {
      // Silently fail
    }
  }

  public playShieldBreak() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.22);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Silently fail
    }
  }

  public playTerminalOpen() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Som clássico de boot de mainframe dos anos 80/90
      const beeps = [880, 1174.66, 1760];
      beeps.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const start = now + idx * 0.05;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.07, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(start);
        osc.stop(start + 0.08);
      });
    } catch {
      // Silently fail
    }
  }
}

export const retroAudio = new RetroAudio();
