"use client";

import Image from "next/image";
import { User, Calendar, BookOpen, GraduationCap, Wrench } from "lucide-react";
import { useInView } from "@/lib/useInView";
import { SectionTitle } from "./SectionTitle";
import { cn } from "@/lib/utils";

const stats = [
  { icon: Calendar, value: "8+", label: "Anos em Data & IA" },
  { icon: BookOpen, value: "4", label: "Livros Publicados" },
  { icon: GraduationCap, value: "3", label: "Orientações de MBA" },
  { icon: Wrench, value: "25+", label: "Tecnologias" },
];

export function About() {
  const { ref, isVisible } = useInView();

  return (
    <section id="about" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <SectionTitle icon={User} title="Sobre Mim" />

        <div
          ref={ref}
          className="grid md:grid-cols-2 gap-8 items-center"
        >
          <div className={cn(
            "space-y-4 scroll-fade-in",
            isVisible && "visible"
          )}>
            <p className="text-muted-foreground leading-relaxed text-justify">
              Atuo como <strong>AI Architect &amp; Software Engineer</strong> na <strong>BaXiJen</strong>,
              liderando a arquitetura de soluções inteligentes e sistemas agênticos, além de atuar como pesquisador
              e desenvolvedor no Centro de Inteligência de Dados da UFF (CID-UFF) em projetos públicos analíticos e de IA.
              Sou doutorando em Administração pelo COPPEAD/UFRJ e pós-graduando em Engenharia de Software.
            </p>
            <p className="text-muted-foreground leading-relaxed text-justify">
              Especialista em <strong>desenvolvimento assistido por IA</strong> de alta performance (Claude Code, Antigravity, OpenAI Codex e MCP),
              construo produtos unindo rigor arquitetural, clean code e automação agêntica. Possuo sólida bagagem em Python, R, TypeScript,
              Next.js, Django, FastAPI e pipelines de dados (ETL/Lakehouse).
            </p>
            <p className="text-muted-foreground leading-relaxed text-justify">
              Autor e tradutor de obras sobre ciência de dados e IA, coorganizador do Seminário Internacional de Estatística com R e docente em
              pós-graduações da UFF. Meus focos convergem em <strong>Arquitetura de Sistemas Inteligentes</strong>, Governança de IA no setor público
              e engenharia de software contemporânea acelerada por agentes.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="text-center p-3 rounded-lg bg-card border border-border"
                  >
                    <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-[11px] text-muted-foreground leading-tight">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={cn(
            "flex justify-center scroll-fade-in",
            isVisible && "visible"
          )}>
            <div className="card-3d w-64 h-90 rounded-2xl overflow-hidden border-4 border-border shadow-lg">
              <Image
                src="https://www.baxijen.com.br/marcus.jpg"
                alt="Marcus Ramalho, pesquisador em IA e cientista de dados"
                width={256}
                height={360}
                sizes="256px"
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}