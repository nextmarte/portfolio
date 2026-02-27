"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Home } from "lucide-react";
import PixelCharacter from "@/components/PixelCharacter";
import { cn } from "@/lib/utils";

export default function NotFound() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-50 dark:from-indigo-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500" />

      {/* Sun / Moon */}
      {isDark ? (
        <div className="absolute top-12 right-20">
          <div className="w-10 h-10 rounded-full bg-gray-200 shadow-[0_0_20px_rgba(200,200,200,0.3)]" />
          <div className="absolute top-1.5 left-1.5 w-7 h-7 rounded-full bg-indigo-950" />
        </div>
      ) : (
        <div className="absolute top-12 right-20 w-12 h-12 rounded-full bg-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.5)]" />
      )}

      {/* Stars (dark mode) */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none">
          {[10, 25, 40, 55, 70, 85, 15, 60, 80, 35, 45, 92].map((l, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-60"
              style={{ left: `${l}%`, top: `${5 + ((i * 7) % 30)}%` }}
            />
          ))}
        </div>
      )}

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-1.5 bg-gradient-to-r from-green-400 via-green-500 to-green-400 dark:from-green-700 dark:via-green-800 dark:to-green-700" />
        <div className="h-6 bg-gradient-to-b from-green-500 to-green-600 dark:from-green-800 dark:to-green-900" />
        <div className="h-3 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700" />
        <div className="h-8 bg-gradient-to-b from-amber-700 to-amber-800 dark:from-amber-900 dark:to-amber-950" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        {/* Character */}
        <div className="flex justify-center mb-8">
          <div className="animate-float">
            <PixelCharacter
              outfit="casual"
              isWalking={true}
              hasMask={false}
              scale={7.2}
            />
          </div>
        </div>

        {/* 404 */}
        <h1 className="font-display text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Página não encontrada
        </h2>

        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          O Marcus se perdeu pelo caminho... Parece que essa página não existe
          ou foi movida.
        </p>

        <a
          href="/"
          className={cn(
            "inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 hover:shadow-lg hover:scale-105"
          )}
        >
          <Home className="w-4 h-4" />
          Voltar ao Início
        </a>
      </div>
    </section>
  );
}
