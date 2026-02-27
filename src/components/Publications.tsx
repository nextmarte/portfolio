"use client";

import { BookOpen, FileText, Languages, Presentation } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/useInView";
import { SectionTitle } from "./SectionTitle";

interface Publication {
  title: string;
  description: string;
  year: string;
  type: "book" | "article" | "conference" | "translation";
}

const publications: Publication[] = [
  {
    title: "Análise empírica sobre fundos imobiliários no Brasil",
    description: "Livro publicado pela Editora Atena. Pesquisa abrangente sobre o mercado de FIIs brasileiro.",
    year: "2025",
    type: "book",
  },
  {
    title: "Aplicações em R: encurtando distâncias nas ciências",
    description: "Livro publicado pela USP (288p). Material voltado à disseminação da ciência de dados com R.",
    year: "2024",
    type: "book",
  },
  {
    title: "A inteligência artificial nas ciências de dados",
    description: "Livro publicado pela USP (192p). Exploração de aplicações práticas de IA em R para pesquisa científica.",
    year: "2024",
    type: "book",
  },
  {
    title: "Arquitetura Lakehouse com RAG para Gestão do Conhecimento",
    description: "Trabalho completo publicado nos anais da Enanpad em Aracaju. Abordagem integrada para análise de dados em empresas públicas.",
    year: "2025",
    type: "conference",
  },
  {
    title: "Potencial e Desafios da ABP e IA no Ensino de Programação",
    description: "Artigo completo publicado em periódico (DOI: 10.5281/zenodo.12709058). Pesquisa sobre aprendizagem baseada em problemas com IA.",
    year: "2024",
    type: "article",
  },
  {
    title: "R para Ciência de Dados",
    description: "Tradução para português do livro referência da comunidade R.",
    year: "2023",
    type: "translation",
  },
];

const typeConfig = {
  book: { icon: BookOpen, label: "Livro", color: "text-blue-600 dark:text-blue-400" },
  article: { icon: FileText, label: "Artigo", color: "text-green-600 dark:text-green-400" },
  conference: { icon: Presentation, label: "Congresso", color: "text-purple-600 dark:text-purple-400" },
  translation: { icon: Languages, label: "Tradução", color: "text-amber-600 dark:text-amber-400" },
};

export function Publications() {
  const { ref, isVisible } = useInView({ threshold: 0.1 });

  return (
    <section id="publications" className="py-20">
      <div className="container mx-auto px-4">
        <SectionTitle icon={BookOpen} title="Publicações" />

        <div ref={ref} className="grid md:grid-cols-2 gap-6">
          {publications.map((pub, index) => {
            const config = typeConfig[pub.type];
            const Icon = config.icon;
            return (
              <div
                key={index}
                className={cn("scroll-fade-in", isVisible && "visible")}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className={cn(
                    "p-6 rounded-xl border border-border h-full",
                    "bg-card text-card-foreground",
                    "card-3d hover:border-primary/50 transition-all duration-300"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={cn("w-5 h-5 mt-1 flex-shrink-0", config.color)} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("text-[10px] font-bold uppercase tracking-wider", config.color)}>
                          {config.label}
                        </span>
                        <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-secondary text-secondary-foreground">
                          {pub.year}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {pub.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {pub.description}
                      </p>
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
