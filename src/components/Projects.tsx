"use client";

import { Folder, ExternalLink, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/useInView";
import { SectionTitle } from "./SectionTitle";

const projects = [
  {
    title: "Treinamento",
    description: "Plataforma de treinamento moderna construída com Next.js e JavaScript. Hospedada em Vercel para máxima escalabilidade.",
    tags: ["Next.js", "JavaScript", "Tailwind CSS"],
    github: "https://github.com/nextmarte/Treinamento",
    demo: "https://treinamento-theta.vercel.app",
  },
  {
    title: "Introdução a Git & GitHub",
    description: "Repositório educacional do curso de introdução a Git e GitHub na Formação de Executivos em Ciência de Dados da UFF.",
    tags: ["Git", "GitHub", "Educação", "JavaScript"],
    github: "https://github.com/nextmarte/introgit-uff",
    demo: "https://nextmarte.github.io/introgit-uff/",
  },
  {
    title: "Daredevil",
    description: "Projeto de análise e experimentação em Python com foco em processamento de dados e machine learning.",
    tags: ["Python", "Data Science", "Machine Learning"],
    github: "https://github.com/nextmarte/daredevil",
    demo: null,
  },
  {
    title: "Fofoca Remunerada",
    description: "Aplicação TypeScript desenvolvida com propósitos de pesquisa e inovação em comunicação digital.",
    tags: ["TypeScript", "Node.js", "Firebase"],
    github: "https://github.com/nextmarte/fofoca_remunerada",
    demo: null,
  },
  {
    title: "Devel",
    description: "Plataforma de desenvolvimento especializada em TypeScript. Projeto ativo com múltiplas features em desenvolvimento.",
    tags: ["TypeScript", "Next.js", "React"],
    github: "https://github.com/nextmarte/Devel",
    demo: null,
  },
  {
    title: "Raspador Colaborativo",
    description: "Ferramenta Python para web scraping e coleta de dados com foco em pesquisa colaborativa.",
    tags: ["Python", "Web Scraping", "Data Collection"],
    github: "https://github.com/nextmarte/raspa_colab",
    demo: null,
  },
];

export function Projects() {
  const { ref, isVisible } = useInView({ threshold: 0.1 });

  return (
    <section id="projects" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <SectionTitle icon={Folder} title="Projetos" />

        <div
          ref={ref}
          className="grid md:grid-cols-2 gap-6"
        >
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={cn(
                "scroll-fade-in",
                isVisible && "visible"
              )}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <div
                className={cn(
                  "p-6 rounded-xl border border-border h-full",
                  "bg-card text-card-foreground",
                  "card-3d hover:border-primary/50 transition-all duration-300"
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    {project.title}
                  </h3>
                  <div className="flex gap-2">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Ver código no GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Ver demonstração"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}