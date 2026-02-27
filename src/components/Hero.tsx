"use client";

import { ArrowDown, Download, Github, Linkedin, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import HeroBackground from "./HeroBackground";

const socialLinks = [
  {
    icon: Github,
    href: "https://github.com/nextmarte",
    label: "GitHub",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/marcus-ramalho-8a440545/",
    label: "LinkedIn",
  },
  {
    icon: ExternalLink,
    href: "https://lattes.cnpq.br/9578799014185405",
    label: "Lattes",
  },
];

export function Hero() {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Marcus Ramalho";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.substring(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden"
    >
      {/* Pixel-art animated background */}
      <HeroBackground />

      {/* Readability overlay — covers the text area, fades to transparent near the bottom */}
      <div className="absolute inset-0 bg-gradient-to-b dark:from-slate-900/80 dark:via-slate-900/50 dark:to-transparent pointer-events-none z-[5]" />

      <div className="container mx-auto px-4 text-center relative z-10 pb-48 md:pb-56">
        <div className="animate-fade-in-up mb-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-sm">
            Olá, eu sou{" "}
            <span className="text-primary">
              {displayedText}
              <span className="animate-blink-cursor">|</span>
            </span>
          </h1>
        </div>

        <p
          className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-2xl mx-auto animate-slide-in-left drop-shadow-sm"
          style={{ animationDelay: "0.2s" }}
        >
          AI Researcher/Developer • Ph.D. Student @ COPPEAD/UFRJ • Data Scientist @ CID-UFF
        </p>

        {/* Social Links */}
        <div
          className="flex justify-center gap-4 mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full border border-border bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300 hover:scale-110"
              title={link.label}
            >
              <link.icon className="w-5 h-5" />
            </a>
          ))}
        </div>

        <div
          className="flex flex-wrap gap-4 justify-center mb-12 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <a
            href="#projects"
            className={cn(
              "px-6 py-3 rounded-lg font-medium transition-all duration-300",
              "bg-primary text-primary-foreground shadow-md",
              "hover:bg-primary/90 hover:shadow-lg hover:scale-105"
            )}
          >
            Ver Projetos
          </a>
          <a
            href="/CV.pdf"
            download
            className={cn(
              "px-6 py-3 rounded-lg font-medium transition-all duration-300 inline-flex items-center gap-2",
              "border border-border bg-card/80 backdrop-blur-sm text-foreground",
              "hover:bg-secondary hover:shadow-lg hover:scale-105"
            )}
          >
            <Download className="w-4 h-4" />
            Download CV
          </a>
          <a
            href="#contact"
            className={cn(
              "px-6 py-3 rounded-lg font-medium transition-all duration-300",
              "border border-border bg-card/80 backdrop-blur-sm text-foreground",
              "hover:bg-secondary hover:shadow-lg hover:scale-105"
            )}
          >
            Entre em Contato
          </a>
        </div>

        <a
          href="#about"
          className="inline-flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors animate-float drop-shadow-sm"
        >
          <span className="text-sm mb-2">Saiba mais</span>
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </a>
      </div>
    </section>
  );
}