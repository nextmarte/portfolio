'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { CareerGameEngine, INITIAL_TECH_ORBS, MILESTONES, BUILDING_INTERIORS } from '@/game/engine';
import { BuildingInterior, GameView, InteriorSkillItem, Milestone, PlayerCareerStats, TechOrb } from '@/game/types';
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
  Briefcase,
  Award,
  Zap,
  BookOpen,
  UserCheck,
  Flame,
  Layers,
  ChevronRight,
  HelpCircle,
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
  const [playerX, setPlayerX] = useState<number>(100);
  const [nearMilestone, setNearMilestone] = useState<Milestone | null>(null);
  const [inspectedMilestone, setInspectedMilestone] = useState<Milestone | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  // Estados RPG & TechDex
  const [stats, setStats] = useState<PlayerCareerStats>({
    level: 1,
    title: 'Estudante Técnico (2008)',
    currentXp: 0,
    nextLevelXp: 200,
    totalSkillsCollected: 0,
    totalOrbsCollected: 0,
    dodgeCombo: 0,
    visitedBuildings: {},
    completedBuildings: {},
  });
  const [isTechDexOpen, setIsTechDexOpen] = useState(false);
  const [techDexTab, setTechDexTab] = useState<'skills' | 'stack' | 'profile'>('skills');

  // Notificações e Diálogos
  const [dialog, setDialog] = useState<{ speaker: string; role: string; text: string } | null>(null);
  const [skillToast, setSkillToast] = useState<{ skill: InteriorSkillItem; buildingName: string } | null>(null);
  const [levelUpToast, setLevelUpToast] = useState<{ level: number; title: string } | null>(null);
  const [comboToast, setComboToast] = useState<{ combo: number } | null>(null);

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

    engine.onYearUpdate = (year) => {
      setCurrentYear(year);
      setPlayerX(engine.getPlayerX());
    };
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

    engine.onStatsUpdate = (s) => setStats(s);

    engine.onSkillAcquired = (skill, building) => {
      setSkillToast({ skill, buildingName: building.name });
      setTimeout(() => setSkillToast(null), 4000);
    };

    engine.onLevelUp = (level, title) => {
      setLevelUpToast({ level, title });
      setTimeout(() => setLevelUpToast(null), 4500);
    };

    engine.onComboDodge = (combo) => {
      setComboToast({ combo });
      setTimeout(() => setComboToast(null), 1800);
    };

    engine.start();

    const handleResize = () => engine.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.stop();
    };
  }, [resolvedTheme, externalOnViewChange]);

  // Sincroniza tema dark/light
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setDark(resolvedTheme === 'dark');
    }
  }, [resolvedTheme]);

  // Controles de Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      // TAB ou 'I' abre/fecha a mochila TechDex
      if (e.code === 'Tab' || e.code === 'KeyI') {
        e.preventDefault();
        retroAudio.playMenuOpen();
        setIsTechDexOpen((prev) => !prev);
        return;
      }

      if (e.code === 'Escape') {
        if (isTechDexOpen) {
          setIsTechDexOpen(false);
          return;
        }
        if (inspectedMilestone) {
          setInspectedMilestone(null);
          return;
        }
      }

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
  }, [mode, gameView, nearMilestone, isTechDexOpen, inspectedMilestone]);

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

  // Progresso de XP
  const xpPercentage = Math.min(100, Math.floor((stats.currentXp / stats.nextLevelXp) * 100));

  return (
    <div className="absolute inset-0 overflow-hidden select-none" aria-label="Simulação 2D Pixel Art da Carreira">
      {/* Canvas Element */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* ========================================================================= */}
      {/* HUD SUPERIOR COMPLEXO — STATUS DO DESENVOLVEDOR & XP */}
      {/* ========================================================================= */}
      {mounted && (
        <div className="absolute top-20 md:top-22 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
          {/* Card de Nível & Estatísticas (Esquerda) */}
          <div className="flex items-center gap-3 pointer-events-auto">
            {/* Avatar Pixel com Brilho Neural */}
            <div className="relative group cursor-pointer" onClick={() => setIsTechDexOpen(true)}>
              <div className="w-11 h-11 rounded-xl bg-slate-900 border-2 border-cyan-400 flex items-center justify-center shadow-lg overflow-hidden relative">
                <span className="text-lg">👨‍💻</span>
                <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-amber-500 text-slate-950 font-mono font-bold text-[9px] rounded">
                  Nv.{stats.level}
                </span>
              </div>
            </div>

            {/* Informações de Nível e Barra de XP */}
            <div className="flex flex-col gap-1 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 shadow-xl max-w-xs sm:max-w-md">
              <div className="flex items-center justify-between gap-3 text-xs font-mono">
                <span className="font-bold text-white truncate">{stats.title}</span>
                <span className="text-[10px] text-amber-300 font-bold shrink-0">{stats.currentXp}/{stats.nextLevelXp} XP</span>
              </div>

              {/* Barra de XP Animada */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 transition-all duration-300"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>

              {/* Badges de Coleção Rápidas */}
              <div className="flex items-center gap-2.5 text-[10px] font-mono text-slate-300 mt-0.5">
                <span className="flex items-center gap-1 text-cyan-300">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                  {stats.totalSkillsCollected}/18 Skills
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-300">
                  <Zap className="w-2.5 h-2.5 text-emerald-400" />
                  {stats.totalOrbsCollected}/{INITIAL_TECH_ORBS.length} Orbes
                </span>
                {stats.dodgeCombo > 1 && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-300 font-bold animate-pulse">
                      <Flame className="w-2.5 h-2.5 text-amber-400" />
                      x{stats.dodgeCombo} Combo
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Botões de Ação do HUD (Direita) */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Botão TechDex / Mochila */}
            <button
              onClick={() => {
                retroAudio.playMenuOpen();
                setIsTechDexOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border-2 border-cyan-400/80 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-xl transition-all hover:scale-105"
              title="Abrir TechDex e Mochila de Habilidades [TAB]"
            >
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">TechDex</span>
              <span className="px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono">TAB</span>
            </button>

            {/* Alternador de Modo: Jogo vs Auto-Run */}
            <button
              onClick={toggleMode}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xl border",
                mode === 'playable'
                  ? "bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold border-cyan-300 shadow-cyan-500/25"
                  : "bg-black/70 hover:bg-black/90 text-white border-white/10"
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

            {/* Alternador de Som */}
            <button
              onClick={toggleAudio}
              className="p-2 rounded-xl bg-black/70 hover:bg-black/90 border border-white/10 text-white transition-all shadow-xl"
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
      {/* MINIMAPA DA LINHA DO TEMPO (RODAPÉ — OVERWORLD) */}
      {/* ========================================================================= */}
      {mounted && gameView === 'overworld' && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-full max-w-xl px-4 animate-fade-in-up">
          <div className="bg-slate-950/90 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 shadow-2xl flex flex-col gap-1.5 pointer-events-auto">
            {/* Marcadores das 6 Eras */}
            <div className="flex items-center justify-between text-[10px] font-mono px-2 text-slate-400">
              {MILESTONES.map((m) => {
                const isVisited = stats.visitedBuildings[m.id];
                const isCompleted = stats.completedBuildings[m.id];
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      if (mode === 'playable' && engineRef.current) {
                        handleEnterBuilding(m.id);
                      }
                    }}
                    className={cn(
                      "flex flex-col items-center gap-0.5 transition-all hover:scale-110",
                      isCompleted ? "text-amber-400 font-bold" : isVisited ? "text-cyan-300" : "text-slate-500"
                    )}
                    title={`${m.label} (${m.year}) - ${isCompleted ? '100% Dominado' : isVisited ? 'Visitado' : 'Não explorado'}`}
                  >
                    <span>{isCompleted ? '⭐' : isVisited ? '🏛️' : '📍'}</span>
                    <span className="hidden sm:inline">{m.year}</span>
                  </button>
                );
              })}
            </div>

            {/* Barra de Progresso com Marcador do Jogador */}
            <div className="relative w-full h-2 bg-slate-900 rounded-full border border-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-cyan-500 to-emerald-400"
                style={{ width: `${Math.min(100, Math.max(3, (playerX / 7800) * 100))}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BALÃO DE INTERAÇÃO PARA ENTRAR NO PRÉDIO (OVERWORLD) */}
      {/* ========================================================================= */}
      {gameView === 'overworld' && nearMilestone && !inspectedMilestone && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 animate-fade-in-up flex gap-2">
          <button
            onClick={() => handleEnterBuilding(nearMilestone.id)}
            className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold font-mono text-xs shadow-2xl backdrop-blur-md flex items-center gap-2 group transition-all hover:scale-105 border border-white/30"
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
      {/* HUD DO MODO INTERIOR RPG (DENTRO DO PRÉDIO) */}
      {/* ========================================================================= */}
      {gameView === 'interior' && activeInterior && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 animate-fade-in-up flex items-center gap-3">
          <button
            onClick={handleExitBuilding}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-mono flex items-center gap-2 shadow-2xl transition-all hover:scale-105 border border-rose-400"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair para a Rua [E]</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOASTS & NOTIFICAÇÕES (SKILL GET! / LEVEL UP / DODGE COMBO) */}
      {/* ========================================================================= */}
      {/* Level Up Banner */}
      {levelUpToast && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-30 animate-fade-in-up">
          <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-mono shadow-2xl border-2 border-white flex items-center gap-3">
            <span className="text-2xl animate-bounce">🏆</span>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-900">
                ⭐ LEVEL UP ALCANÇADO! ⭐
              </p>
              <h3 className="text-base font-extrabold text-slate-950">
                Nível {levelUpToast.level}: {levelUpToast.title}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Skill Acquired Toast */}
      {skillToast && (
        <div className="absolute top-32 left-1/2 -translate-x-1/2 z-30 animate-fade-in-up">
          <div className="px-5 py-3 rounded-2xl bg-slate-950/95 border-2 border-amber-400 text-white shadow-2xl backdrop-blur-md flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-amber-300 uppercase tracking-wider">
                ✨ Nova Habilidade Adquirida! (+180 XP)
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

      {/* Dodge Combo Toast */}
      {comboToast && (
        <div className="absolute top-36 left-1/2 -translate-x-1/2 z-30 animate-fade-in-up">
          <div className="px-4 py-1.5 rounded-full bg-slate-950/90 border border-amber-400/80 text-amber-300 font-mono text-xs font-bold shadow-xl flex items-center gap-1.5 animate-bounce">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>ESQUIVA PERFEITA! +40 XP (Combo x{comboToast.combo})</span>
          </div>
        </div>
      )}

      {/* Dialog Box com Mentor da Sala */}
      {gameView === 'interior' && dialog && (
        <div className="absolute bottom-20 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-xl z-20 animate-fade-in-up">
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
      {/* MODAL TECHDEX — LIVRO DE SKILLS, STACK & PERFIL DO DESENVOLVEDOR */}
      {/* ========================================================================= */}
      {isTechDexOpen && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-40 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-950 border-2 border-cyan-500 rounded-2xl text-white shadow-2xl animate-fade-in-up overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header do TechDex */}
            <div className="px-6 py-4 bg-slate-900 border-b border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-cyan-400" />
                <div>
                  <h3 className="text-lg font-bold font-mono">TECHDEX — Portfólio RPG</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Nível {stats.level} • {stats.title}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsTechDexOpen(false)}
                className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Fechar TechDex"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Abas do TechDex */}
            <div className="flex border-b border-white/10 bg-slate-900/50 text-xs font-mono">
              <button
                onClick={() => {
                  retroAudio.playMenuSelect();
                  setTechDexTab('skills');
                }}
                className={cn(
                  "flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 font-bold transition-all",
                  techDexTab === 'skills'
                    ? "border-cyan-400 text-cyan-300 bg-cyan-500/10"
                    : "border-transparent text-slate-400 hover:text-white"
                )}
              >
                <Award className="w-4 h-4" />
                <span>Skills da Carreira ({stats.totalSkillsCollected}/18)</span>
              </button>

              <button
                onClick={() => {
                  retroAudio.playMenuSelect();
                  setTechDexTab('stack');
                }}
                className={cn(
                  "flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 font-bold transition-all",
                  techDexTab === 'stack'
                    ? "border-cyan-400 text-cyan-300 bg-cyan-500/10"
                    : "border-transparent text-slate-400 hover:text-white"
                )}
              >
                <Zap className="w-4 h-4" />
                <span>Tech Stack ({stats.totalOrbsCollected}/11)</span>
              </button>

              <button
                onClick={() => {
                  retroAudio.playMenuSelect();
                  setTechDexTab('profile');
                }}
                className={cn(
                  "flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 font-bold transition-all",
                  techDexTab === 'profile'
                    ? "border-cyan-400 text-cyan-300 bg-cyan-500/10"
                    : "border-transparent text-slate-400 hover:text-white"
                )}
              >
                <UserCheck className="w-4 h-4" />
                <span>Trainer Card</span>
              </button>
            </div>

            {/* Conteúdo das Abas */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* ABA 1: SKILLS DA CARREIRA POR PRÉDIO */}
              {techDexTab === 'skills' && (
                <div className="space-y-6">
                  {Object.values(BUILDING_INTERIORS).map((bld) => {
                    const isCompleted = stats.completedBuildings[bld.buildingId];
                    const isVisited = stats.visitedBuildings[bld.buildingId];

                    return (
                      <div key={bld.buildingId} className="bg-slate-900/60 rounded-xl p-4 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{isCompleted ? '⭐' : isVisited ? '🏛️' : '🔒'}</span>
                            <h4 className="font-bold text-sm text-white font-mono">{bld.name}</h4>
                          </div>

                          <div className="flex items-center gap-2">
                            {isCompleted && (
                              <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold">
                                100% DOMINADO
                              </span>
                            )}
                            <button
                              onClick={() => {
                                setIsTechDexOpen(false);
                                handleEnterBuilding(bld.buildingId);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-1 border border-cyan-500/30"
                            >
                              <span>Explorar</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Grade de 3 Skills daquele Prédio */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {bld.skills.map((skill) => {
                            // Verifica no interior se foi coletada
                            const currentInteriorState = engineRef.current?.getInteriors()[bld.buildingId];
                            const isSkillCollected = currentInteriorState?.skills.find(s => s.id === skill.id)?.collected;

                            return (
                              <div
                                key={skill.id}
                                className={cn(
                                  "p-3 rounded-lg border text-xs font-mono transition-all",
                                  isSkillCollected
                                    ? "bg-slate-800/80 border-cyan-500/50 text-white"
                                    : "bg-slate-950/40 border-white/5 text-slate-500 opacity-60"
                                )}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-bold">{isSkillCollected ? '✓ ' + skill.name : '🔒 ' + skill.name}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-sans line-clamp-2">
                                  {skill.description}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ABA 2: TECH STACK ORBS */}
              {techDexTab === 'stack' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {INITIAL_TECH_ORBS.map((orb) => {
                    const currentOrbs = engineRef.current?.getTechOrbs() || [];
                    const isCollected = currentOrbs.find(o => o.id === orb.id)?.collected;

                    return (
                      <div
                        key={orb.id}
                        className={cn(
                          "p-3.5 rounded-xl border flex items-center gap-3 transition-all",
                          isCollected
                            ? "bg-slate-900 border-cyan-400 text-white shadow-lg"
                            : "bg-slate-950/40 border-white/10 text-slate-500 opacity-60"
                        )}
                      >
                        <div className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-sm",
                          isCollected ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40" : "bg-slate-800 text-slate-600"
                        )}>
                          {isCollected ? '⚡' : '○'}
                        </div>
                        <div>
                          <h5 className="font-bold font-mono text-xs">{orb.name}</h5>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {isCollected ? 'Dominado (+60 XP)' : 'Disponível na Pista'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ABA 3: TRAINER CARD / PERFIL DO DESENVOLVEDOR */}
              {techDexTab === 'profile' && (
                <div className="bg-slate-900/80 rounded-2xl p-6 border-2 border-cyan-500/50 space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-white/10 pb-6">
                    <div className="w-20 h-20 rounded-2xl bg-slate-950 border-2 border-cyan-400 flex items-center justify-center text-4xl shadow-xl">
                      👨‍💻
                    </div>
                    <div className="text-center sm:text-left space-y-1">
                      <h4 className="text-xl font-bold font-mono text-white">Marcus Ramalho</h4>
                      <p className="text-sm font-semibold text-cyan-400 font-mono">
                        AI Architect &amp; Software Engineer @ BaXiJen
                      </p>
                      <p className="text-xs text-slate-400 font-mono">
                        COPPEAD/UFRJ (Doutorando IA) • UFF (Mestre) • CEFET/RJ
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10">
                      <span className="text-[10px] text-slate-400 block">NÍVEL DE CARREIRA</span>
                      <strong className="text-lg text-amber-400 font-bold">Nv. {stats.level}</strong>
                    </div>

                    <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10">
                      <span className="text-[10px] text-slate-400 block">TOTAL DE XP</span>
                      <strong className="text-lg text-cyan-400 font-bold">{stats.currentXp} XP</strong>
                    </div>

                    <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10">
                      <span className="text-[10px] text-slate-400 block">SKILLS COLETADAS</span>
                      <strong className="text-lg text-emerald-400 font-bold">{stats.totalSkillsCollected}/18</strong>
                    </div>

                    <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10">
                      <span className="text-[10px] text-slate-400 block">TECH ORBS</span>
                      <strong className="text-lg text-purple-400 font-bold">{stats.totalOrbsCollected}/11</strong>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-white/5">
                    <h5 className="font-bold text-white font-mono text-sm flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Especialidade &amp; Metodologia de IA
                    </h5>
                    <p>
                      Proficiência em desenvolvimento assistido por agentes autônomos utilizando Claude Code, Google Antigravity e OpenAI Codex com Model Context Protocol (MCP). Foco em governança de inteligência artificial, conformidade e arquiteturas corporativas de alta disponibilidade.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé do TechDex */}
            <div className="px-6 py-3 bg-slate-900 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Pressione <strong>[TAB]</strong> ou <strong>[ESC]</strong> para fechar</span>
              <button
                onClick={() => setIsTechDexOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all"
              >
                Continuar Jogo
              </button>
            </div>
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
                className="flex-1 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 font-semibold text-sm transition-colors text-slate-950 flex items-center justify-center gap-2 font-mono font-bold"
              >
                <DoorOpen className="w-4 h-4" />
                <span>Entrar no Prédio</span>
              </button>
              <button
                onClick={() => setInspectedMilestone(null)}
                className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-semibold text-sm transition-colors text-white font-mono"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MOBILE VIRTUAL CONTROLS */}
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
