'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { CareerGameEngine, INITIAL_TECH_ORBS } from '@/game/engine';
import { BuildingInterior, GameView, InteriorSkillItem, Milestone } from '@/game/types';
import { retroAudio } from '@/game/audio';
import {
  Volume2,
  VolumeX,
  Play,
  Gamepad2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  DoorOpen,
  LogOut,
  X,
  Info,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CareerGameProps {
  onViewChange?: (view: GameView) => void;
}

export default function CareerGame({ onViewChange: externalOnViewChange }: CareerGameProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<CareerGameEngine | null>(null);
  const { resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'auto' | 'playable'>('auto');
  const [gameView, setGameView] = useState<GameView>('overworld');
  const [activeInterior, setActiveInterior] = useState<BuildingInterior | null>(null);
  const [currentYear, setCurrentYear] = useState<number>(2008);
  const [orbsCollected, setOrbsCollected] = useState<number>(0);
  const [nearMilestone, setNearMilestone] = useState<Milestone | null>(null);
  const [inspectedMilestone, setInspectedMilestone] = useState<Milestone | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  // Estados do Interior RPG
  const [dialog, setDialog] = useState<{ speaker: string; role: string; text: string } | null>(null);
  const [skillToast, setSkillToast] = useState<{ skill: InteriorSkillItem; buildingName: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Inicializa o engine do jogo
  useEffect(() => {
    if (!canvasRef.current) return;

    const isDark = resolvedTheme === 'dark';
    const engine = new CareerGameEngine(canvasRef.current, isDark);
    engineRef.current = engine;

    engine.onYearUpdate = (year) => setCurrentYear(year);
    engine.onOrbsUpdate = (collected) => setOrbsCollected(collected);
    engine.onMilestoneNear = (m) => setNearMilestone(m);

    engine.onViewChange = (v, interior) => {
      setGameView(v);
      setActiveInterior(interior);
      if (v === 'interior') {
        setInspectedMilestone(null);
      }
      externalOnViewChange?.(v);
    };

    engine.onDialog = (d) => setDialog(d);

    engine.onSkillAcquired = (skill, building) => {
      setSkillToast({ skill, buildingName: building.name });
      setTimeout(() => {
        setSkillToast(null);
      }, 4000);
    };

    engine.start();

    const handleResize = () => engine.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.stop();
    };
  }, [resolvedTheme]);

  // Sincroniza tema dark/light
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setDark(resolvedTheme === 'dark');
    }
  }, [resolvedTheme]);

  // Trata Teclado para Ambos os Modos (Overworld & Interior Top-Down)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (!engineRef.current) return;

      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        if (mode === 'auto') {
          setMode('playable');
          engineRef.current.setMode('playable');
        }
        engineRef.current.setInput({ left: true });
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        if (mode === 'auto') {
          setMode('playable');
          engineRef.current.setMode('playable');
        }
        engineRef.current.setInput({ right: true });
      } else if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        if (mode === 'auto') {
          setMode('playable');
          engineRef.current.setMode('playable');
        }
        engineRef.current.setInput({ up: true, jump: true });
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        engineRef.current.setInput({ down: true });
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (mode === 'auto') {
          setMode('playable');
          engineRef.current.setMode('playable');
        }
        engineRef.current.setInput({ jump: true });
      } else if (e.code === 'KeyE') {
        if (gameView === 'overworld' && nearMilestone) {
          engineRef.current.enterBuilding(nearMilestone.id);
        } else if (gameView === 'interior') {
          engineRef.current.exitBuilding();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!engineRef.current) return;

      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        engineRef.current.setInput({ left: false });
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        engineRef.current.setInput({ right: false });
      } else if (['ArrowUp', 'KeyW'].includes(e.code)) {
        engineRef.current.setInput({ up: false, jump: false });
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        engineRef.current.setInput({ down: false });
      } else if (e.code === 'Space') {
        engineRef.current.setInput({ jump: false });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [mode, gameView, nearMilestone]);

  const toggleMode = useCallback(() => {
    const next = mode === 'auto' ? 'playable' : 'auto';
    setMode(next);
    if (engineRef.current) {
      engineRef.current.setMode(next);
    }
  }, [mode]);

  const toggleAudio = useCallback(() => {
    const muted = retroAudio.toggleMute();
    setIsMuted(muted);
  }, []);

  const handleEnterBuilding = useCallback((bldId: string) => {
    if (engineRef.current) {
      if (mode === 'auto') {
        setMode('playable');
        engineRef.current.setMode('playable');
      }
      engineRef.current.enterBuilding(bldId);
    }
  }, [mode]);

  const handleExitBuilding = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.exitBuilding();
    }
  }, []);

  const handleTouchControl = useCallback((key: 'left' | 'right' | 'up' | 'down' | 'jump', active: boolean) => {
    if (!engineRef.current) return;
    if (mode === 'auto' && active) {
      setMode('playable');
      engineRef.current.setMode('playable');
    }
    engineRef.current.setInput({ [key]: active });
  }, [mode]);

  return (
    <div className="absolute inset-0 overflow-hidden select-none" aria-label="Simulação 2D Pixel Art da Carreira">
      {/* Canvas Element */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* ========================================================================= */}
      {/* HUD SUPERIOR — OVERWORLD (RUA) */}
      {/* ========================================================================= */}
      {mounted && gameView === 'overworld' && (
        <div className="absolute top-20 md:top-22 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
          {/* Estatísticas à esquerda */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-mono flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{currentYear}</span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-cyan-300 text-xs font-mono flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tech: {orbsCollected}/{INITIAL_TECH_ORBS.length}</span>
            </div>
          </div>

          {/* Dica de Controles */}
          {mode === 'playable' && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-cyan-500/30 text-white/80 text-[11px] font-mono shadow-lg pointer-events-auto animate-fade-in-up">
              <span>🎮 <strong>[A/D/←/→]</strong> Mover • <strong>[Espaço/W/↑]</strong> Pular • <strong>[E]</strong> Entrar no Prédio</span>
            </div>
          )}

          {/* Botões à direita */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={toggleMode}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg border",
                mode === 'playable'
                  ? "bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-400 shadow-cyan-500/20"
                  : "bg-black/60 hover:bg-black/80 text-white/90 border-white/10"
              )}
              title={mode === 'playable' ? "Alternar para Auto-Run" : "Assumir controle do jogo"}
            >
              {mode === 'playable' ? (
                <>
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>Modo Jogo</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Auto-Run</span>
                </>
              )}
            </button>

            <button
              onClick={toggleAudio}
              className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 border border-white/10 text-white transition-all shadow-lg"
              aria-label={isMuted ? "Ativar som retrô" : "Mutar som"}
              title={isMuted ? "Ativar som retrô" : "Mutar som"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white/60" />
              ) : (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HUD SUPERIOR — INTERIOR RPG (DENTRO DO PRÉDIO POKÉMON STYLE) */}
      {/* ========================================================================= */}
      {mounted && gameView === 'interior' && activeInterior && (
        <div className="absolute top-20 md:top-22 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
          {/* Nome e Skills da Sala */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-2 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-bold">{activeInterior.name.split('—')[0]}</span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-1.5 shadow-xl">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Skills: {activeInterior.skills.filter(s => s.collected).length}/{activeInterior.skills.length}</span>
            </div>
          </div>

          {/* Dica de movimentação top-down */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-white/80 text-[11px] font-mono shadow-lg pointer-events-auto">
            <span>🕹️ <strong>[W/A/S/D]</strong> Andar • Colete as Pokébolas/Skills pelo chão!</span>
          </div>

          {/* Botão de Sair e Som */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={handleExitBuilding}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-xl transition-all hover:scale-105"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair da Sala [E]</span>
            </button>

            <button
              onClick={toggleAudio}
              className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 border border-white/10 text-white transition-all shadow-lg"
              aria-label={isMuted ? "Ativar som retrô" : "Mutar som"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white/60" />
              ) : (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BALÃO DE INTERAÇÃO PARA ENTRAR NO PRÉDIO (OVERWORLD) */}
      {/* ========================================================================= */}
      {gameView === 'overworld' && nearMilestone && !inspectedMilestone && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 animate-fade-in-up flex gap-2">
          <button
            onClick={() => handleEnterBuilding(nearMilestone.id)}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs shadow-2xl backdrop-blur-md flex items-center gap-2 group transition-all hover:scale-105 border border-cyan-300"
          >
            <DoorOpen className="w-4 h-4 text-slate-950 animate-bounce" />
            <span>Entrar no Prédio: <strong>{nearMilestone.label}</strong> [E]</span>
          </button>

          <button
            onClick={() => setInspectedMilestone(nearMilestone)}
            className="p-2.5 rounded-xl bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-xl transition-all"
            title="Ver informações da era"
          >
            <Info className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOAST DE SKILL ADQUIRIDA ESTILO POKÉMON ("ITEM GET!") */}
      {/* ========================================================================= */}
      {skillToast && (
        <div className="absolute top-36 left-1/2 -translate-x-1/2 z-30 animate-fade-in-up">
          <div className="px-5 py-3 rounded-2xl bg-slate-950/95 border-2 border-amber-400 text-white shadow-2xl backdrop-blur-md flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-amber-300 uppercase tracking-wider">
                ✨ Nova Habilidade Adquirida!
              </p>
              <h4 className="text-sm font-bold text-white">
                {skillToast.skill.name} <span className="text-xs text-slate-400 font-normal">({skillToast.skill.category})</span>
              </h4>
              <p className="text-xs text-slate-300 max-w-sm mt-0.5">
                {skillToast.skill.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CAIXA DE DIÁLOGO POKÉMON COM O MENTOR/NPC */}
      {/* ========================================================================= */}
      {gameView === 'interior' && dialog && (
        <div className="absolute bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-xl z-20 animate-fade-in-up">
          <div className="bg-slate-950/95 border-2 border-cyan-400 rounded-2xl p-4 text-white shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2 mb-1.5">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-cyan-300 text-xs font-mono">{dialog.speaker}</span>
              <span className="text-[10px] text-slate-400 font-mono">({dialog.role})</span>
            </div>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans">
              "{dialog.text}"
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE DETALHES DO MARCO (OVERWORLD) */}
      {/* ========================================================================= */}
      {inspectedMilestone && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-30 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border-2 border-cyan-500 rounded-2xl p-6 text-white shadow-2xl animate-fade-in-up relative">
            <button
              onClick={() => setInspectedMilestone(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
                {inspectedMilestone.year}
              </span>
              <h3 className="text-xl font-bold">{inspectedMilestone.label}</h3>
            </div>

            <p className="text-sm font-semibold text-cyan-400 mb-1">
              {inspectedMilestone.role} • {inspectedMilestone.subLabel}
            </p>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {inspectedMilestone.description}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const id = inspectedMilestone.id;
                  setInspectedMilestone(null);
                  handleEnterBuilding(id);
                }}
                className="flex-1 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 font-semibold text-sm transition-colors text-slate-950 flex items-center justify-center gap-2"
              >
                <DoorOpen className="w-4 h-4" />
                <span>Entrar no Prédio</span>
              </button>
              <button
                onClick={() => setInspectedMilestone(null)}
                className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-semibold text-sm transition-colors text-white"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MOBILE CONTROLS — VIRTUAL D-PAD */}
      {/* ========================================================================= */}
      {isTouchDevice && mode === 'playable' && (
        <div className="absolute bottom-6 left-4 right-4 flex items-center justify-between z-20 pointer-events-auto">
          {gameView === 'overworld' ? (
            <>
              {/* Controles Laterais Overworld */}
              <div className="flex gap-2">
                <button
                  onTouchStart={() => handleTouchControl('left', true)}
                  onTouchEnd={() => handleTouchControl('left', false)}
                  onMouseDown={() => handleTouchControl('left', true)}
                  onMouseUp={() => handleTouchControl('left', false)}
                  className="w-12 h-12 rounded-xl bg-black/60 active:bg-cyan-500/80 border border-white/20 text-white flex items-center justify-center shadow-lg"
                  aria-label="Andar para a esquerda"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onTouchStart={() => handleTouchControl('right', true)}
                  onTouchEnd={() => handleTouchControl('right', false)}
                  onMouseDown={() => handleTouchControl('right', true)}
                  onMouseUp={() => handleTouchControl('right', false)}
                  className="w-12 h-12 rounded-xl bg-black/60 active:bg-cyan-500/80 border border-white/20 text-white flex items-center justify-center shadow-lg"
                  aria-label="Andar para a direita"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Pulo / Entrar */}
              <div className="flex gap-2">
                {nearMilestone && (
                  <button
                    onClick={() => handleEnterBuilding(nearMilestone.id)}
                    className="w-14 h-14 rounded-2xl bg-emerald-500 active:bg-emerald-400 text-white flex items-center justify-center shadow-lg font-bold"
                    aria-label="Entrar no prédio"
                  >
                    <DoorOpen className="w-6 h-6" />
                  </button>
                )}
                <button
                  onTouchStart={() => handleTouchControl('jump', true)}
                  onTouchEnd={() => handleTouchControl('jump', false)}
                  onMouseDown={() => handleTouchControl('jump', true)}
                  onMouseUp={() => handleTouchControl('jump', false)}
                  className="w-14 h-14 rounded-2xl bg-cyan-500 active:bg-cyan-400 text-white flex items-center justify-center shadow-lg font-bold"
                  aria-label="Pular"
                >
                  <ArrowUp className="w-6 h-6" />
                </button>
              </div>
            </>
          ) : (
            /* Controles D-Pad 4 Direções Top-Down */
            <div className="w-full flex items-center justify-between">
              <div className="grid grid-cols-3 gap-1.5 w-36 h-36">
                <div />
                <button
                  onTouchStart={() => handleTouchControl('up', true)}
                  onTouchEnd={() => handleTouchControl('up', false)}
                  className="w-11 h-11 rounded-xl bg-black/60 active:bg-cyan-500/80 border border-white/20 text-white flex items-center justify-center"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
                <div />
                <button
                  onTouchStart={() => handleTouchControl('left', true)}
                  onTouchEnd={() => handleTouchControl('left', false)}
                  className="w-11 h-11 rounded-xl bg-black/60 active:bg-cyan-500/80 border border-white/20 text-white flex items-center justify-center"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div />
                <button
                  onTouchStart={() => handleTouchControl('right', true)}
                  onTouchEnd={() => handleTouchControl('right', false)}
                  className="w-11 h-11 rounded-xl bg-black/60 active:bg-cyan-500/80 border border-white/20 text-white flex items-center justify-center"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
                <div />
                <button
                  onTouchStart={() => handleTouchControl('down', true)}
                  onTouchEnd={() => handleTouchControl('down', false)}
                  className="w-11 h-11 rounded-xl bg-black/60 active:bg-cyan-500/80 border border-white/20 text-white flex items-center justify-center"
                >
                  <ArrowDown className="w-5 h-5" />
                </button>
                <div />
              </div>

              <button
                onClick={handleExitBuilding}
                className="px-4 py-3 rounded-2xl bg-rose-600 active:bg-rose-500 text-white font-mono text-xs font-bold shadow-xl flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
