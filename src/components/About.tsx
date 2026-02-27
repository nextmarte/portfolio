"use client";

import Image from "next/image";
import { User, Calendar, BookOpen, GraduationCap, Wrench } from "lucide-react";
import { useInView } from "@/lib/useInView";
import { SectionTitle } from "./SectionTitle";
import { cn } from "@/lib/utils";

const stats = [
  { icon: Calendar, value: "+8", label: "Anos em Data & IA" },
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
              Doutorando em Administração pelo COPPEAD/UFRJ, com mestrado e graduação em
              Administração pela Universidade Federal Fluminense (UFF). Atuo como pesquisador
              e desenvolvedor de sistemas no Centro de Inteligência de Dados da UFF (CID-UFF),
              participando de projetos em parceria com instituições públicas, com foco em
              engenharia de dados, aplicações analíticas e soluções baseadas em inteligência artificial.
            </p>
            <p className="text-muted-foreground leading-relaxed text-justify">
              Possuo experiência em ciência de dados com R e Python, programação funcional,
              construção de pipelines de dados (ETL/Lakehouse), desenvolvimento de sistemas e dashboards
              com NextJs, React, Django, Streamlit, Gradio e Shiny, visualização de dados e automação de processos organizacionais.
            </p>
            <p className="text-muted-foreground leading-relaxed text-justify">
              Sou autor e tradutor de materiais sobre ciência de dados, coorganizador do Seminário
              Internacional de Estatística com R e fui docente em cursos de pós-graduação e educação
              executiva na UFF em Ciência de Dados. Meus interesses de pesquisa concentram-se em Governança de IA na administração pública,
              cultura de dados no setor público e sistemas inteligentes aplicados a problemas organizacionais.
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
                src="https://www.baxijen.tech/marcus.jpg"
                alt="Foto de Marcus"
                width={256}
                height={600}
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