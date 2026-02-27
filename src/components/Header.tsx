"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useActiveSection } from "@/lib/useActiveSection";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Início", href: "#hero" },
  { label: "Sobre", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projetos", href: "#projects" },
  { label: "Currículo", href: "#resume" },
  { label: "Certificações", href: "#certifications" },
  { label: "Publicações", href: "#publications" },
  { label: "Contato", href: "#contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const activeSection = useActiveSection();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-4 py-4" aria-label="Navegação principal">
        <div className="flex items-center justify-between">
          <a href="#hero" className="text-xl font-bold text-foreground flex items-center gap-2">
            <svg
              viewBox="0 0 16 20"
              width={24}
              height={30}
              className="animate-[headerBounce_0.8s_ease-in-out_infinite]"
              shapeRendering="crispEdges"
              aria-hidden="true"
            >
              {/* Hair */}
              <rect x="4" y="0" width="8" height="1" fill="#3A2818" />
              <rect x="3" y="1" width="10" height="1" fill="#3A2818" />
              <rect x="3" y="2" width="10" height="1" fill="#3A2818" />
              {/* Face */}
              <rect x="4" y="3" width="8" height="6" fill="#F5D0A9" />
              <rect x="3" y="4" width="1" height="4" fill="#F5D0A9" />
              <rect x="12" y="4" width="1" height="4" fill="#F5D0A9" />
              {/* Green eyes */}
              <rect x="5" y="5" width="2" height="2" fill="#22C55E" />
              <rect x="9" y="5" width="2" height="2" fill="#22C55E" />
              {/* Pupils */}
              <rect x="6" y="5" width="1" height="1" fill="#166534" />
              <rect x="10" y="5" width="1" height="1" fill="#166534" />
              {/* Eye shine */}
              <rect x="5" y="5" width="1" height="1" fill="#BBFFD0" opacity="0.6" />
              <rect x="9" y="5" width="1" height="1" fill="#BBFFD0" opacity="0.6" />
              {/* Smile */}
              <rect x="6" y="8" width="1" height="1" fill="#D4956A" />
              <rect x="7" y="8" width="2" height="1" fill="#E8A07A" />
              <rect x="9" y="8" width="1" height="1" fill="#D4956A" />
              {/* Neck */}
              <rect x="7" y="9" width="2" height="1" fill="#F5D0A9" />
              {/* Body */}
              <rect x="4" y="10" width="8" height="5" fill="#3B82F6" />
              {/* Shirt detail */}
              <rect x="7" y="10" width="2" height="4" fill="#2563EB" />
              {/* Arms up — jumping pose */}
              <rect x="2" y="9" width="2" height="1" fill="#3B82F6" />
              <rect x="1" y="8" width="2" height="1" fill="#3B82F6" />
              <rect x="12" y="9" width="2" height="1" fill="#3B82F6" />
              <rect x="13" y="8" width="2" height="1" fill="#3B82F6" />
              {/* Hands up */}
              <rect x="1" y="7" width="1" height="1" fill="#F5D0A9" />
              <rect x="14" y="7" width="1" height="1" fill="#F5D0A9" />
              {/* Legs */}
              <rect x="5" y="15" width="2" height="3" fill="#1E3A5F" />
              <rect x="9" y="15" width="2" height="3" fill="#1E3A5F" />
              {/* Shoes */}
              <rect x="4" y="18" width="3" height="2" fill="#5C3317" />
              <rect x="9" y="18" width="3" height="2" fill="#5C3317" />
            </svg>
            Marcus Ramalho Portfólio
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "text-sm transition-colors duration-200",
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </a>
              );
            })}
            <ThemeToggle />
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="flex flex-col gap-4 pt-4 pb-2">
            {navItems.map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "transition-colors duration-200",
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}