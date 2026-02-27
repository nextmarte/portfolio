"use client";

import { Briefcase, GraduationCap } from "lucide-react";
import { useInView } from "@/lib/useInView";
import { SectionTitle } from "./SectionTitle";
import { cn } from "@/lib/utils";
import PixelCharacter, { OutfitType } from "./PixelCharacter";

interface Experience {
  id: string;
  type: "education" | "work";
  title: string;
  organization: string;
  period: string;
  description: string;
  outfit: OutfitType;
  tools: string[];
}

const experiences: Experience[] = [
  {
    id: "1",
    type: "education",
    title: "Doutorando em Administração",
    organization: "COPPEAD/UFRJ",
    period: "2025 – Presente",
    description:
      "Pesquisa sobre Governança de IA na administração pública municipal. Orientadora: Elaine Maria Tavares Rodrigues.",
    outfit: "phd",
    tools: ["IA", "Governança", "Setor Público", "NLP"],
  },
  {
    id: "2",
    type: "work",
    title: "Pesquisador & Desenvolvedor",
    organization: "CID-UFF / Fundação Euclides da Cunha",
    period: "2024 – Presente",
    description:
      "Pesquisa aplicada no projeto Lagoa Viva. Desenvolvimento de sistema Django para gestão e análise de dados ambientais. Engenharia de dados e IA.",
    outfit: "engineer",
    tools: ["Python", "Django", "Streamlit", "R", "Shiny", "LangChain", "Docker"],
  },
  {
    id: "3",
    type: "work",
    title: "Professor de MBA",
    organization: "Universidade Federal Fluminense",
    period: "2023 – Presente",
    description:
      "Professor em MBAs de Ciência de Dados e Finanças Corporativas. Orientador de monografias e membro de bancas examinadoras.",
    outfit: "teacher",
    tools: ["R", "Python", "Data Science", "Finanças", "Didática"],
  },
  {
    id: "4",
    type: "education",
    title: "Mestrado em Administração",
    organization: "Universidade Federal Fluminense",
    period: "2022 – 2024",
    description:
      "Dissertação: Fundos de Investimento Imobiliário — análise dos principais indicadores de performance.",
    outfit: "masters",
    tools: ["R", "Python", "Estatística", "Machine Learning", "Finanças"],
  },
  {
    id: "5",
    type: "work",
    title: "Responsável Técnico",
    organization: "Web Rádio Censura Livre",
    period: "2018 – 2021",
    description:
      "Administração de mídias sociais, sites, programação e manutenção de equipamentos.",
    outfit: "manager",
    tools: ["WordPress", "Mídias Sociais", "Web", "Infraestrutura"],
  },
  {
    id: "6",
    type: "work",
    title: "Bolsista de Iniciação Científica",
    organization: "FAPERJ",
    period: "2018 – 2020",
    description:
      "Pesquisa bibliométrica na Hemeroteca Nacional sobre organização sindical dos operários navais, com produção de relatório e apoio a artigo científico.",
    outfit: "researcher",
    tools: ["R", "Python", "Pesquisa", "Web Scraping"],
  },
  {
    id: "7",
    type: "work",
    title: "Estagiário",
    organization: "Grupo Águas do Brasil",
    period: "2017 – 2018",
    description:
      "Mapeamento de melhorias em processos internos, criação e análise de indicadores comerciais, elaboração de treinamentos.",
    outfit: "it_advisor",
    tools: ["Excel", "PowerPoint", "Indicadores", "Processos"],
  },
  {
    id: "8",
    type: "education",
    title: "Bacharelado em Administração",
    organization: "Universidade Federal Fluminense",
    period: "2016 – 2020",
    description:
      "Graduação com TCC sobre análise de risco e rentabilidade de carteiras de fundos imobiliários.",
    outfit: "university",
    tools: ["Excel", "R", "Estatística", "Finanças"],
  },
  {
    id: "9",
    type: "work",
    title: "Técnico em Mecânica",
    organization: "Chemtech / Siemens",
    period: "2009 – 2014",
    description:
      "Análises de tensão em tubulações industriais, atuando em projetos de engenharia de detalhamento e FEED.",
    outfit: "engineer",
    tools: ["AutoCAD", "PDMS", "CAESAR II", "Cálculo Estrutural"],
  },
  {
    id: "10",
    type: "education",
    title: "Técnico em Mecânica Industrial",
    organization: "CEFET/RJ",
    period: "2006 – 2010",
    description:
      "Formação técnica em mecânica industrial com foco em desenho técnico e design de elementos estruturais.",
    outfit: "student",
    tools: ["AutoCAD", "SolidWorks", "Desenho Técnico"],
  },
];

export function Resume() {
  const { ref, isVisible } = useInView({ threshold: 0.05 });

  return (
    <section id="resume" className="py-20">
      <div className="container mx-auto px-4">
        <SectionTitle icon={Briefcase} title="Currículo" />

        <div ref={ref} className="max-w-3xl mx-auto relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[27px] md:left-[31px] top-0 bottom-0 w-px bg-border" />

          {experiences.map((exp, index) => {
            const isEdu = exp.type === "education";
            const Icon = isEdu ? GraduationCap : Briefcase;
            const accentColor = isEdu
              ? "text-purple-600 dark:text-purple-400"
              : "text-blue-600 dark:text-blue-400";
            const dotBorder = isEdu
              ? "border-purple-400 dark:border-purple-500"
              : "border-blue-400 dark:border-blue-500";
            const badgeBg = isEdu
              ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
              : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300";

            return (
              <div
                key={exp.id}
                className={cn(
                  "relative pl-16 md:pl-20 pb-8 last:pb-0 scroll-fade-in",
                  isVisible && "visible"
                )}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/* Timeline dot */}
                <div
                  className={cn(
                    "absolute left-[18px] md:left-[22px] top-3 w-[20px] h-[20px] rounded-full border-2 bg-card flex items-center justify-center z-10",
                    dotBorder
                  )}
                >
                  <Icon size={10} className={accentColor} />
                </div>

                {/* Card */}
                <div
                  className={cn(
                    "p-5 rounded-xl border border-border",
                    "bg-card text-card-foreground",
                    "hover:border-primary/30 hover:shadow-md transition-all duration-300"
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Pixel Character mini avatar */}
                    <div className="hidden sm:block flex-shrink-0 mt-1 opacity-80">
                      <PixelCharacter outfit={exp.outfit} scale={3} />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Header row */}
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                            badgeBg
                          )}
                        >
                          {isEdu ? "Educação" : "Trabalho"}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {exp.period}
                        </span>
                      </div>

                      {/* Title & org */}
                      <h3 className="font-bold text-foreground leading-tight">
                        {exp.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {exp.organization}
                      </p>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {exp.description}
                      </p>

                      {/* Tools */}
                      <div className="flex flex-wrap gap-1.5">
                        {exp.tools.map((tool) => (
                          <span
                            key={tool}
                            className={cn(
                              "px-2 py-0.5 text-[10px] font-semibold rounded-full border",
                              isEdu
                                ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                                : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                            )}
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}