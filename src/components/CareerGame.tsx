'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { CareerGameEngine, INITIAL_TECH_ORBS, MILESTONES, BUILDING_INTERIORS, INITIAL_ACHIEVEMENTS } from '@/game/engine';
import { Achievement, BuildingInterior, GameView, InteriorSkillItem, Milestone, PlayerCareerStats, TechOrb, TerminalProject } from '@/game/types';
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
  Terminal,
  ExternalLink,
  Trophy,
  Shield,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CareerGameProps {
  onViewChange?: (view: GameView) => void;
  onModeChange?: (mode: 'auto' | 'playable') => void;
}

export default function CareerGame({ onViewChange: externalOnViewChange, onModeChange: externalOnModeChange }: CareerGameProps = {}) {
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

  // Estados RPG, TechDex & Terminal
  const [stats, setStats] = useState<PlayerCareerStats>({
    level: 1,
    title: 'Estudante Técnico (2008)',
    currentXp: 0,
    nextLevelXp: 200,
    totalSkillsCollected: 0,
    totalOrbsCollected: 0,
    dodgeCombo: 0,
    dashCount: 0,
    terminalsAccessed: {},
    visitedBuildings: {},
    completedBuildings: {},
    achievements: {},
  });
  const [isTechDexOpen, setIsTechDexOpen] = useState(false);
  const [techDexTab, setTechDexTab] = useState<'skills' | 'stack' | 'achievements' | 'profile'>('skills');
  const [terminalData, setTerminalData] = useState<{ projects: TerminalProject[]; buildingName: string } | null>(null);

  // Notificações e Diálogos
  const [dialog, setDialog] = useState<{ speaker: string; role: string; text: string } | null>(null);
  const [skillToast, setSkillToast] = useState<{ skill: InteriorSkillItem; buildingName: string } | null>(null);
  const [levelUpToast, setLevelUpToast] = useState<{ level: number; title: string } | null>(null);
  const [comboToast, setComboToast] = useState<{ combo: number } | null>(null);
  const [achievementToast, setAchievementToast] = useState<Achievement | null>(null);

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

    engine.onTerminalOpen = (projects, buildingName) => {
      setTerminalData({ projects, buildingName });
    };

    engine.onAchievementUnlocked = (ach) => {
      setAchievementToast(ach);
      setTimeout(() => setAchievementToast(null), 4500);
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
        if (terminalData) {
          setTerminalData(null);
          return;
        }
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
      } else if (['ShiftLeft', 'ShiftRight', 'KeyC', 'KeyJ'].includes(e.code)) {
        // Dash / Slide de Alta Velocidade
        e.preventDefault();
        if (mode === 'auto') {
          setMode('playable');
          engineRef.current.setMode('playable');
        }
        engineRef.current.setInput({ dash: true });
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
          engineRef.current.openTerminalForCurrentRoom();
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
      } else if (['ShiftLeft', 'ShiftRight', 'KeyC', 'KeyJ'].includes(e.code)) {
        engineRef.current.setInput({ dash: false });
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
  }, [mode, gameView, nearMilestone, isTechDexOpen, inspectedMilestone, terminalData]);

  const toggleMode = useCallback(() => {
    const next = mode === 'auto' ? 'playable' : 'auto';
    setMode(next);
    externalOnModeChange?.(next);
    retroAudio.playMenuSelect();
    if (engineRef.current) {
      engineRef.current.setMode(next);
    }
  }, [mode, externalOnModeChange]);

  const toggleAudio = useCallback(() => {
    const muted = retroAudio.toggleMute();
    setIsMuted(muted);
  }, []);

  const handleEnterBuilding = useCallback((bldId: string) => {
    if (engineRef.current) {
      if (mode === 'auto') {
        setMode('playable');
        externalOnModeChange?.('playable');
        engineRef.current.setMode('playable');
      }
      engineRef.current.enterBuilding(bldId);
    }
  }, [mode, externalOnModeChange]);

  const handleExitBuilding = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.exitBuilding();
    }
  }, []);

  const handleTouchControl = useCallback((key: 'left' | 'right' | 'up' | 'down' | 'jump' | 'dash' | 'interact', active: boolean, e?: React.TouchEvent | React.MouseEvent) => {
    if (e && 'cancelable' in e && e.cancelable) {
      e.preventDefault();
    }
    if (!engineRef.current) return;
    if (mode === 'auto' && active) {
      setMode('playable');
      externalOnModeChange?.('playable');
      engineRef.current.setMode('playable');
    }
    engineRef.current.setInput({ [key]: active });
  }, [mode, externalOnModeChange]);

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
      {/* HUD SUPERIOR COMPLEXO — STATUS DO DESENVOLVEDOR, XP & MINIMAPA DA LINHA DO TEMPO */}
      {/* ========================================================================= */}
      {mounted && (
        <div className="absolute top-20 md:top-22 left-3 right-3 sm:left-4 sm:right-4 z-20 pointer-events-none flex flex-col gap-2">
          {/* Linha Principal do HUD */}
          <div className="flex items-center justify-between gap-2 w-full">
            {/* Card de Nível & Estatísticas (Esquerda) */}
            <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto shrink-0">
              {/* Avatar Pixel com Brilho Neural */}
              <div className="relative group cursor-pointer" onClick={() => setIsTechDexOpen(true)}>
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900 border-2 border-cyan-400 flex items-center justify-center shadow-lg overflow-hidden relative">
                  <span className="text-base sm:text-lg">👨‍💻</span>
                  <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-amber-500 text-slate-950 font-mono font-bold text-[8px] sm:text-[9px] rounded">
                    Nv.{stats.level}
                  </span>
                </div>
              </div>

              {/* Informações de Nível e Barra de XP */}
              <div className="flex flex-col gap-1 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-xl max-w-[200px] sm:max-w-xs md:max-w-md">
                <div className="flex items-center justify-between gap-2 text-xs font-mono">
                  <span className="font-bold text-white truncate text-[11px] sm:text-xs">{stats.title}</span>
                  <span className="text-[9px] sm:text-[10px] text-amber-300 font-bold shrink-0">{stats.currentXp}/{stats.nextLevelXp} XP</span>
                </div>

                {/* Barra de XP Animada */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 transition-all duration-300"
                    style={{ width: `${xpPercentage}%` }}
                  />
                </div>

                {/* Badges de Coleção Rápidas */}
                <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-mono text-slate-300">
                  <span className="flex items-center gap-1 text-cyan-300">
                    <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                    {stats.totalSkillsCollected}/18
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-300">
                    <Zap className="w-2.5 h-2.5 text-emerald-400" />
                    {stats.totalOrbsCollected}/{INITIAL_TECH_ORBS.length}
                  </span>
                  {stats.dodgeCombo > 1 && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-300 font-bold animate-pulse">
                        <Flame className="w-2.5 h-2.5 text-amber-400" />
                        x{stats.dodgeCombo}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Center: Linha do Tempo Integrada no Céu (lg:flex) */}
            {gameView === 'overworld' && (
              <div className="hidden lg:flex flex-col items-center gap-1 bg-slate-950/90 backdrop-blur-md border border-cyan-500/30 rounded-2xl px-4 py-1.5 shadow-2xl pointer-events-auto max-w-sm xl:max-w-md w-full">
                <div className="flex items-center justify-between w-full text-[10px] font-mono text-slate-400">
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
                          "flex items-center gap-1 transition-all hover:scale-110",
                          isCompleted ? "text-amber-400 font-bold" : isVisited ? "text-cyan-300 font-semibold" : "text-slate-500"
                        )}
                        title={`${m.label} (${m.year}) - ${isCompleted ? '100% Dominado' : isVisited ? 'Visitado' : 'Não explorado'}`}
                      >
                        <span className="text-xs">{isCompleted ? '⭐' : isVisited ? '🏛️' : '📍'}</span>
                        <span>{m.year}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="relative w-full h-1.5 bg-slate-900 rounded-full border border-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-cyan-500 to-emerald-400 transition-all duration-200"
                    style={{ width: `${Math.min(100, Math.max(3, (playerX / 7800) * 100))}%` }}
                  />
                </div>
              </div>
            )}

            {/* Botões de Ação do HUD (Direita) */}
            <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto shrink-0">
              {/* Botão TechDex / Mochila */}
              <button
                onClick={() => {
                  retroAudio.playMenuOpen();
                  setIsTechDexOpen(true);
                }}
                className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border-2 border-cyan-400/80 text-white text-xs font-mono font-bold flex items-center gap-1.5 sm:gap-2 shadow-xl transition-all hover:scale-105"
                title="Abrir TechDex e Mochila de Habilidades [TAB]"
              >
                <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">TechDex</span>
                <span className="hidden md:inline px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono">TAB</span>
              </button>

              {/* Alternador de Modo: Jogo vs Auto-Run */}
              <button
                onClick={toggleMode}
                className={cn(
                  "px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xl border",
                  mode === 'playable'
                    ? "bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold border-cyan-300 shadow-cyan-500/25"
                    : "bg-black/70 hover:bg-black/90 text-white border-white/10"
                )}
                title={mode === 'playable' ? "Alternar para Auto-Run" : "Assumir controle do jogo"}
              >
                {mode === 'playable' ? (
                  <>
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span className="text-[11px] sm:text-xs">Jogar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[11px] sm:text-xs">Auto</span>
                  </>
                )}
              </button>

              {/* Alternador de Som */}
              <button
                onClick={toggleAudio}
                className="p-1.5 sm:p-2 rounded-xl bg-black/70 hover:bg-black/90 border border-white/10 text-white transition-all shadow-xl"
                aria-label={isMuted ? "Ativar som retrô" : "Mutar som"}
                title={isMuted ? "Ativar som retrô" : "Mutar som"}
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/60" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile / Tablet Linha do Tempo (No céu logo abaixo do header — NUNCA na passagem da rua) */}
          {gameView === 'overworld' && (
            <div className="flex lg:hidden self-center w-full max-w-md pointer-events-auto animate-fade-in-up">
              <div className="w-full bg-slate-950/90 backdrop-blur-md border border-cyan-500/30 rounded-xl px-3 py-1.5 shadow-2xl flex flex-col gap-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
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
                          "flex flex-col items-center gap-0.5 transition-all active:scale-95",
                          isCompleted ? "text-amber-400 font-bold" : isVisited ? "text-cyan-300" : "text-slate-500"
                        )}
                      >
                        <span className="text-xs">{isCompleted ? '⭐' : isVisited ? '🏛️' : '📍'}</span>
                        <span className="text-[9px]">{m.year}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="relative w-full h-1.5 bg-slate-900 rounded-full border border-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-cyan-500 to-emerald-400 transition-all duration-200"
                    style={{ width: `${Math.min(100, Math.max(3, (playerX / 7800) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* BALÃO DE INTERAÇÃO PARA ENTRAR NO PRÉDIO (OVERWORLD) */}
      {/* ========================================================================= */}
      {gameView === 'overworld' && nearMilestone && !inspectedMilestone && (
        <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-20 animate-fade-in-up flex items-center gap-2 sm:gap-3 max-w-[92vw] pointer-events-auto">
          <button
            onClick={() => handleEnterBuilding(nearMilestone.id)}
            className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-black font-mono text-xs sm:text-sm shadow-[0_0_30px_rgba(6,182,212,0.5)] border-2 border-white flex items-center gap-2 transition-all hover:scale-105 active:scale-95 group truncate"
          >
            <DoorOpen className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 animate-bounce shrink-0" />
            <span className="truncate">ENTRAR: <strong className="text-slate-950 underline decoration-amber-500 decoration-2">{nearMilestone.label}</strong></span>
            <span className="hidden sm:inline px-2 py-0.5 rounded bg-slate-950 text-cyan-300 text-xs font-mono ml-1 shadow-sm shrink-0">TECLA [E]</span>
          </button>

          <button
            onClick={() => setInspectedMilestone(nearMilestone)}
            className="p-2.5 sm:p-3 rounded-2xl bg-slate-950/90 hover:bg-slate-900 text-white border-2 border-white/20 shadow-xl transition-all hover:scale-105 shrink-0"
            title="Ver informações da era"
          >
            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HUD DO MODO INTERIOR RPG (DENTRO DO PRÉDIO) */}
      {/* ========================================================================= */}
      {gameView === 'interior' && activeInterior && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 animate-fade-in-up flex items-center gap-2.5 sm:gap-3 flex-wrap justify-center pointer-events-auto">
          {activeInterior.terminalProjects && (
            <button
              onClick={() => {
                if (engineRef.current) {
                  engineRef.current.openTerminalForCurrentRoom();
                }
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black font-mono flex items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all hover:scale-105 border-2 border-white"
            >
              <Terminal className="w-4 h-4 text-slate-950" />
              <span>TERMINAL DE PROJETOS [E]</span>
            </button>
          )}

          <button
            onClick={handleExitBuilding}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-black font-mono flex items-center gap-2 shadow-[0_0_25px_rgba(244,63,94,0.4)] transition-all hover:scale-105 border-2 border-white"
          >
            <LogOut className="w-4 h-4" />
            <span>SAIR DO PRÉDIO</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOASTS & NOTIFICAÇÕES (SKILL GET! / LEVEL UP / DODGE COMBO) */}
      {/* ========================================================================= */}
      {/* Level Up Banner */}
      {levelUpToast && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-30 animate-fade-in-up">
          <div className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-mono shadow-[0_0_40px_rgba(245,158,11,0.6)] border-2 border-white flex items-center gap-3.5">
            <span className="text-3xl animate-bounce">🏆</span>
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-900">
                ⭐ LEVEL UP ALCANÇADO! ⭐
              </p>
              <h3 className="text-base font-black text-slate-950">
                Nível {levelUpToast.level}: {levelUpToast.title}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Skill Acquired Toast */}
      {skillToast && (
        <div className="absolute top-32 left-1/2 -translate-x-1/2 z-30 animate-fade-in-up">
          <div className="px-5 py-3 rounded-2xl bg-slate-950/95 border-2 border-amber-400 text-white shadow-[0_0_30px_rgba(245,158,11,0.4)] backdrop-blur-md flex items-center gap-3">
            <span className="text-2xl animate-spin">🌟</span>
            <div>
              <p className="text-[10px] text-amber-300 font-mono uppercase tracking-wider font-bold">
                Nova Habilidade Desbloqueada! ({skillToast.buildingName})
              </p>
              <h4 className="text-sm font-bold font-mono text-cyan-300">
                {skillToast.skill.name} • <span className="text-xs text-amber-400">[{skillToast.skill.category}]</span>
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
          <div className="px-5 py-2 rounded-full bg-slate-950/95 border-2 border-amber-400 text-amber-300 font-mono text-xs font-black shadow-[0_0_25px_rgba(245,158,11,0.5)] flex items-center gap-2 animate-bounce">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>ESQUIVA PERFEITA! +40 XP (Combo x{comboToast.combo})</span>
          </div>
        </div>
      )}

      {/* Achievement Unlocked Toast */}
      {achievementToast && (
        <div className="absolute top-40 left-1/2 -translate-x-1/2 z-30 animate-fade-in-up">
          <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-mono shadow-[0_0_35px_rgba(245,158,11,0.7)] border-2 border-white flex items-center gap-3.5">
            <span className="text-3xl animate-bounce">{achievementToast.icon}</span>
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-900 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 fill-slate-950 inline" />
                CONQUISTA DESBLOQUEADA! +{achievementToast.xpReward || 150} XP
              </p>
              <h4 className="text-sm font-black text-slate-950">
                {achievementToast.title}
              </h4>
              <p className="text-[11px] text-slate-900 font-medium font-sans">
                {achievementToast.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dialog Box com Mentor da Sala — Estilo JRPG Clássico */}
      {gameView === 'interior' && dialog && (
        <div className="absolute bottom-20 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl z-20 animate-fade-in-up">
          <div className="relative bg-slate-950/95 border-4 border-amber-400/90 rounded-2xl p-5 text-white shadow-[0_0_35px_rgba(245,158,11,0.35)] backdrop-blur-md">
            {/* Rebites nos 4 cantos */}
            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-amber-400 shadow-sm" />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 shadow-sm" />
            <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-amber-400 shadow-sm" />
            <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-amber-400 shadow-sm" />

            <div className="flex items-start gap-4">
              {/* Avatar do Mentor */}
              <div className="w-12 h-12 rounded-xl bg-slate-900 border-2 border-cyan-400 flex items-center justify-center shrink-0 shadow-lg text-2xl">
                👨‍🏫
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-amber-300 text-sm font-mono tracking-wider">{dialog.speaker}</span>
                    <span className="text-[10px] text-cyan-300 font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40">{dialog.role}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-cyan-400" /> DIÁLOGO
                  </span>
                </div>

                <p className="text-sm text-slate-100 leading-relaxed font-mono">
                  "{dialog.text}"
                </p>

                <div className="mt-2 text-right">
                  <span className="text-[10px] font-mono text-amber-300 animate-pulse font-bold">
                    ▼ [ESPAÇO OU ANDAR PARA FECHAR]
                  </span>
                </div>
              </div>
            </div>
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

              <button
                onClick={() => {
                  retroAudio.playMenuSelect();
                  setTechDexTab('achievements');
                }}
                className={cn(
                  "flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 font-bold transition-all",
                  techDexTab === 'achievements'
                    ? "border-amber-400 text-amber-300 bg-amber-500/10"
                    : "border-transparent text-slate-400 hover:text-white"
                )}
              >
                <Trophy className="w-4 h-4" />
                <span>Troféus ({Object.values(stats.achievements).filter(Boolean).length}/11)</span>
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

              {/* ABA 4: CONQUISTAS & TROFÉUS ARCADE */}
              {techDexTab === 'achievements' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-400/30 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-amber-300 font-mono text-sm flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        Sala de Troféus &amp; Conquistas
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Conquistas desbloqueadas durante a exploração, saltos, dashes e descobertas da carreira.
                      </p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-xs text-slate-400 block">DESBLOQUEADOS</span>
                      <strong className="text-base text-amber-400">
                        {Object.values(stats.achievements).filter(Boolean).length} / {INITIAL_ACHIEVEMENTS.length}
                      </strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {INITIAL_ACHIEVEMENTS.map((ach) => {
                      const isUnlocked = stats.achievements[ach.id];
                      return (
                        <div
                          key={ach.id}
                          className={cn(
                            "p-3.5 rounded-xl border flex items-start gap-3 transition-all",
                            isUnlocked
                              ? "bg-slate-900/90 border-amber-400/80 text-white shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                              : "bg-slate-950/40 border-white/5 text-slate-500 opacity-60"
                          )}
                        >
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border",
                              isUnlocked
                                ? "bg-amber-500/20 border-amber-400/40 shadow-inner"
                                : "bg-slate-800/60 border-white/5 text-slate-600 grayscale"
                            )}
                          >
                            {ach.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h5 className={cn("font-bold font-mono text-xs truncate", isUnlocked ? "text-amber-300" : "text-slate-400")}>
                                {ach.title}
                              </h5>
                              <span className={cn(
                                "text-[9px] font-mono px-1.5 py-0.2 rounded font-bold shrink-0",
                                isUnlocked ? "bg-amber-400/20 text-amber-300 border border-amber-400/30" : "bg-slate-800 text-slate-500"
                              )}>
                                +{ach.xpReward || 150} XP
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 font-sans">
                              {ach.description}
                            </p>
                            <span className={cn(
                              "inline-block mt-2 text-[9px] font-mono font-bold uppercase",
                              isUnlocked ? "text-emerald-400" : "text-slate-600"
                            )}>
                              {isUnlocked ? "✓ CONQUISTADO" : "🔒 BLOQUEADO"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
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
      {/* RETRO CRT HACKER TERMINAL (PROJETOS REAIS DA CARREIRA) */}
      {/* ========================================================================= */}
      {terminalData && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-35 flex items-center justify-center p-3 sm:p-5">
          <div className="w-full max-w-3xl bg-slate-950 border-2 border-emerald-500 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.35)] overflow-hidden flex flex-col max-h-[90vh] font-mono relative">
            {/* Linhas de Varredura CRT (Scanlines effect) */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40 z-10" />

            {/* Cabeçalho do Terminal estilo Unix / CRT */}
            <div className="p-4 bg-slate-900 border-b border-emerald-500/40 flex items-center justify-between text-emerald-400 z-20">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-2 pl-2 border-l border-white/10 text-xs">
                  <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="font-bold text-white tracking-wide">
                    TERMINAL DE PROJETOS // {terminalData.buildingName.toUpperCase()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setTerminalData(null)}
                className="p-1.5 rounded-lg text-emerald-400/70 hover:text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                aria-label="Fechar Terminal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corpo com Projetos do Laboratório / Empresa */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 z-20 text-slate-200">
              <div className="flex items-center gap-2 text-xs text-emerald-400 pb-2 border-b border-emerald-500/20">
                <span className="animate-pulse">❯</span>
                <span>cat projects_archive.log --verbose</span>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {terminalData.projects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-slate-900/80 border border-emerald-500/40 shadow-inner hover:border-emerald-400 transition-all space-y-3.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                            {proj.year}
                          </span>
                          <span className="text-xs text-slate-400">[{proj.category}]</span>
                        </div>
                        <h4 className="text-base font-bold text-white mt-1">
                          {proj.title}
                        </h4>
                      </div>

                      {proj.metrics && (
                        <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs self-start sm:self-auto font-sans">
                          📊 {proj.metrics}
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {proj.description}
                    </p>

                    {/* Tech Stack Tags */}
                    <div>
                      <span className="text-[10px] text-emerald-400 uppercase tracking-wider block mb-1.5 font-mono">
                        Tech Stack:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {proj.techStack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-white/10 text-[11px]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Links Oficiais / Artigos / GitHub */}
                    {proj.links && proj.links.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-2.5">
                        {proj.links.map((link, lIdx) => (
                          <a
                            key={lIdx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/40 transition-colors"
                          >
                            <span>{link.label}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Rodapé do Terminal */}
            <div className="px-5 py-3 bg-slate-900 border-t border-emerald-500/30 flex items-center justify-between text-xs text-slate-400 z-20">
              <span className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                SISTEMA OPERACIONAL RETRO CRT // STATUS: ONLINE
              </span>
              <button
                onClick={() => setTerminalData(null)}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all"
              >
                Fechar [ESC]
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
      {/* CONTROLES VIRTUAIS MOBILE (ERGONÔMICOS & RETRÔ ARCADE) */}
      {/* ========================================================================= */}
      {isTouchDevice && mode === 'playable' && (
        <div className="absolute bottom-4 left-3 right-3 sm:bottom-6 sm:left-4 sm:right-4 flex items-center justify-between z-20 pointer-events-auto touch-none select-none">
          {gameView === 'overworld' ? (
            <>
              {/* Controles Laterais Overworld (Esq / Dir) */}
              <div className="flex items-center gap-2 touch-none">
                <button
                  onTouchStart={(e) => handleTouchControl('left', true, e)}
                  onTouchEnd={(e) => handleTouchControl('left', false, e)}
                  onMouseDown={(e) => handleTouchControl('left', true, e)}
                  onMouseUp={(e) => handleTouchControl('left', false, e)}
                  className="w-14 h-14 rounded-2xl bg-slate-950/90 active:bg-cyan-500/80 border-2 border-cyan-400/60 text-white flex flex-col items-center justify-center shadow-[0_6px_20px_rgba(0,0,0,0.6)] active:scale-95 transition-transform touch-none"
                  aria-label="Andar para a esquerda"
                >
                  <ArrowLeft className="w-6 h-6 text-cyan-300" />
                  <span className="text-[8px] font-mono text-slate-400 font-bold">ESQ</span>
                </button>
                <button
                  onTouchStart={(e) => handleTouchControl('right', true, e)}
                  onTouchEnd={(e) => handleTouchControl('right', false, e)}
                  onMouseDown={(e) => handleTouchControl('right', true, e)}
                  onMouseUp={(e) => handleTouchControl('right', false, e)}
                  className="w-14 h-14 rounded-2xl bg-slate-950/90 active:bg-cyan-500/80 border-2 border-cyan-400/60 text-white flex flex-col items-center justify-center shadow-[0_6px_20px_rgba(0,0,0,0.6)] active:scale-95 transition-transform touch-none"
                  aria-label="Andar para a direita"
                >
                  <ArrowRight className="w-6 h-6 text-cyan-300" />
                  <span className="text-[8px] font-mono text-slate-400 font-bold">DIR</span>
                </button>
              </div>

              {/* Botões de Ação Overworld (Entrar / Dash / Pular) */}
              <div className="flex items-center gap-2 touch-none">
                {nearMilestone && (
                  <button
                    onClick={() => handleEnterBuilding(nearMilestone.id)}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 active:from-emerald-400 active:to-teal-300 text-slate-950 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.5)] border-2 border-white font-bold active:scale-95 transition-transform touch-none"
                    aria-label="Entrar no prédio"
                  >
                    <DoorOpen className="w-6 h-6 text-slate-950 animate-bounce" />
                    <span className="text-[8px] font-mono font-black">ENTRAR</span>
                  </button>
                )}
                <button
                  onTouchStart={(e) => handleTouchControl('dash', true, e)}
                  onTouchEnd={(e) => handleTouchControl('dash', false, e)}
                  onMouseDown={(e) => handleTouchControl('dash', true, e)}
                  onMouseUp={(e) => handleTouchControl('dash', false, e)}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 active:from-amber-400 active:to-yellow-300 text-slate-950 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.5)] border-2 border-white font-bold active:scale-95 transition-transform touch-none"
                  aria-label="Dash / Slide"
                >
                  <Zap className="w-6 h-6 text-slate-950" />
                  <span className="text-[8px] font-mono font-black">DASH</span>
                </button>
                <button
                  onTouchStart={(e) => handleTouchControl('jump', true, e)}
                  onTouchEnd={(e) => handleTouchControl('jump', false, e)}
                  onMouseDown={(e) => handleTouchControl('jump', true, e)}
                  onMouseUp={(e) => handleTouchControl('jump', false, e)}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 active:from-cyan-300 active:to-sky-400 text-slate-950 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.5)] border-2 border-white font-bold active:scale-95 transition-transform touch-none"
                  aria-label="Pular"
                >
                  <ArrowUp className="w-6 h-6 text-slate-950" />
                  <span className="text-[8px] font-mono font-black">PULAR</span>
                </button>
              </div>
            </>
          ) : (
            /* Controles D-Pad 4 Direções Top-Down */
            <div className="w-full flex items-center justify-between touch-none">
              <div className="grid grid-cols-3 gap-1.5 w-36 h-36 touch-none">
                <div />
                <button
                  onTouchStart={(e) => handleTouchControl('up', true, e)}
                  onTouchEnd={(e) => handleTouchControl('up', false, e)}
                  className="w-11 h-11 rounded-xl bg-slate-950/90 active:bg-cyan-500/80 border-2 border-cyan-400/60 text-white flex items-center justify-center shadow-lg active:scale-95 touch-none"
                >
                  <ArrowUp className="w-5 h-5 text-cyan-300" />
                </button>
                <div />
                <button
                  onTouchStart={(e) => handleTouchControl('left', true, e)}
                  onTouchEnd={(e) => handleTouchControl('left', false, e)}
                  className="w-11 h-11 rounded-xl bg-slate-950/90 active:bg-cyan-500/80 border-2 border-cyan-400/60 text-white flex items-center justify-center shadow-lg active:scale-95 touch-none"
                >
                  <ArrowLeft className="w-5 h-5 text-cyan-300" />
                </button>
                <div className="w-11 h-11 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-cyan-400/40" />
                </div>
                <button
                  onTouchStart={(e) => handleTouchControl('right', true, e)}
                  onTouchEnd={(e) => handleTouchControl('right', false, e)}
                  className="w-11 h-11 rounded-xl bg-slate-950/90 active:bg-cyan-500/80 border-2 border-cyan-400/60 text-white flex items-center justify-center shadow-lg active:scale-95 touch-none"
                >
                  <ArrowRight className="w-5 h-5 text-cyan-300" />
                </button>
                <div />
                <button
                  onTouchStart={(e) => handleTouchControl('down', true, e)}
                  onTouchEnd={(e) => handleTouchControl('down', false, e)}
                  className="w-11 h-11 rounded-xl bg-slate-950/90 active:bg-cyan-500/80 border-2 border-cyan-400/60 text-white flex items-center justify-center shadow-lg active:scale-95 touch-none"
                >
                  <ArrowDown className="w-5 h-5 text-cyan-300" />
                </button>
                <div />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (engineRef.current) {
                      engineRef.current.openTerminalForCurrentRoom();
                    }
                  }}
                  className="px-3.5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 active:from-emerald-400 active:to-teal-300 text-slate-950 font-mono text-xs font-black shadow-[0_0_20px_rgba(16,185,129,0.5)] border-2 border-white flex items-center gap-1.5 active:scale-95 transition-transform"
                >
                  <Terminal className="w-4 h-4 text-slate-950" />
                  <span>TERMINAL [E]</span>
                </button>
                <button
                  onClick={handleExitBuilding}
                  className="px-3.5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-500 active:from-rose-500 active:to-red-400 text-white font-mono text-xs font-black shadow-[0_0_20px_rgba(244,63,94,0.5)] border-2 border-white flex items-center gap-1.5 active:scale-95 transition-transform"
                >
                  <LogOut className="w-4 h-4" />
                  <span>SAIR [E]</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
