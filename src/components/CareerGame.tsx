'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { CareerGameEngine, INITIAL_TECH_ORBS } from '@/game/engine';
import { Milestone } from '@/game/types';
import { retroAudio } from '@/game/audio';
import { Volume2, VolumeX, Play, Gamepad2, Sparkles, ArrowLeft, ArrowRight, ArrowUp, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CareerGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<CareerGameEngine | null>(null);
  const { resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'auto' | 'playable'>('auto');
  const [currentYear, setCurrentYear] = useState<number>(2008);
  const [orbsCollected, setOrbsCollected] = useState<number>(0);
  const [nearMilestone, setNearMilestone] = useState<Milestone | null>(null);
  const [inspectedMilestone, setInspectedMilestone] = useState<Milestone | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Initialize engine on mount
  useEffect(() => {
    if (!canvasRef.current) return;

    const isDark = resolvedTheme === 'dark';
    const engine = new CareerGameEngine(canvasRef.current, isDark);
    engineRef.current = engine;

    engine.onYearUpdate = (year) => setCurrentYear(year);
    engine.onOrbsUpdate = (collected) => setOrbsCollected(collected);
    engine.onMilestoneNear = (m) => setNearMilestone(m);

    engine.start();

    const handleResize = () => engine.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.stop();
    };
  }, [resolvedTheme]);

  // Update dark mode
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setDark(resolvedTheme === 'dark');
    }
  }, [resolvedTheme]);

  // Handle Keyboard Inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
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
      } else if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        if (mode === 'auto') {
          setMode('playable');
          engineRef.current.setMode('playable');
        }
        engineRef.current.setInput({ jump: true });
      } else if (e.code === 'KeyE') {
        if (nearMilestone) {
          setInspectedMilestone(nearMilestone);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!engineRef.current) return;

      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        engineRef.current.setInput({ left: false });
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        engineRef.current.setInput({ right: false });
      } else if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        engineRef.current.setInput({ jump: false });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [mode, nearMilestone]);

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

  const handleTouchControl = useCallback((key: 'left' | 'right' | 'jump', active: boolean) => {
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

      {/* Retro HUD Bar */}
      {mounted && (
        <div className="absolute top-20 md:top-22 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
          {/* Left stats: Year & Tech Orbs */}
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

          {/* Right controls: Play/Auto Mode & Audio Toggle */}
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

      {/* Near Milestone Interaction Balloon */}
      {nearMilestone && !inspectedMilestone && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 animate-fade-in-up">
          <button
            onClick={() => setInspectedMilestone(nearMilestone)}
            className="px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-900 border-2 border-cyan-400 text-white shadow-2xl backdrop-blur-md flex items-center gap-2 group transition-all hover:scale-105"
          >
            <Info className="w-4 h-4 text-cyan-400 animate-bounce" />
            <span className="text-xs font-mono">
              🏛️ <strong>{nearMilestone.label}</strong> — Clique ou pressione <strong>[E]</strong>
            </span>
          </button>
        </div>
      )}

      {/* Milestone Inspection Detail Modal */}
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

            <button
              onClick={() => setInspectedMilestone(null)}
              className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 font-semibold text-sm transition-colors text-white"
            >
              Continuar Jornada
            </button>
          </div>
        </div>
      )}

      {/* Mobile Virtual D-Pad (Shown on touch devices when in playable mode) */}
      {isTouchDevice && mode === 'playable' && (
        <div className="absolute bottom-6 left-4 right-4 flex items-center justify-between z-20 pointer-events-auto">
          {/* Directional buttons */}
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

          {/* Jump button */}
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
      )}
    </div>
  );
}
