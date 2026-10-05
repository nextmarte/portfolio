"use client";

import { BookOpen, ExternalLink, FileText, Languages, Presentation } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/useInView";
import { SectionTitle } from "./SectionTitle";

interface Publication {
  title: string;
  subtitle?: string;
  description: string;
  year: string;
  type: "book" | "chapter" | "article" | "conference" | "translation";
  /** Optional link (DOI, publisher page, etc.). When set, the title becomes clickable. */
  url?: string;
}

const publications: Publication[] = [
  {
    title: "O Quarto como ferramenta de PKM para pesquisa científica",
    subtitle: "Capítulo 3 (p. 61–84) em 'Aplicações em R: encurtando distâncias nas ciências'",
    description:
      "Capítulo sobre gestão do conhecimento pessoal (PKM) e reprodutibilidade científica utilizando Quarto e R. Publicado pela Universidade de São Paulo (USP).",
    year: "2024",
    type: "chapter",
    url: "https://doi.org/10.11606/9786587023397",
  },
  {
    title: "Análise e Otimização de uma Carteira de Ações com R",
    subtitle: "Capítulo 1 (p. 22–45) em 'A inteligência artificial nas ciências de dados'",
    description:
      "Capítulo sobre modelagem quantitativa, análise de risco-retorno e otimização de carteiras de ativos financeiros com R. Publicado pela Universidade de São Paulo (USP).",
    year: "2024",
    type: "chapter",
    url: "https://doi.org/10.11606/9786587023465",
  },
  {
    title: "Editando os gráficos do pacote Likert",
    subtitle: "Capítulo 11 (p. 265–288) em 'Aplicações em R: encurtando distâncias nas ciências'",
    description:
      "Capítulo técnico demonstrando customizações avançadas e visualização de dados de pesquisas de opinião/satisfação com o pacote Likert em R. Publicado pela USP.",
    year: "2024",
    type: "chapter",
    url: "https://doi.org/10.11606/9786587023397",
  },
  {
    title: "Análise empírica sobre fundos imobiliários no Brasil",
    description:
      "Livro publicado pela Editora Atena. Pesquisa abrangente sobre modelagem e comportamento do mercado de Fundos de Investimento Imobiliário (FIIs) brasileiro.",
    year: "2025",
    type: "book",
  },
  {
    title: "Arquitetura Lakehouse com RAG para Gestão do Conhecimento",
    subtitle: "Showcase de Produtos Técnico-Tecnológicos (PTT 260) — EnANPAD 2025",
    description:
      "Trabalho publicado nos anais do XLIX Encontro da ANPAD (Aracaju). Abordagem integrada unindo Lakehouse e RAG para inteligência de dados no setor público.",
    year: "2025",
    type: "conference",
    url: "https://anpad.org.br",
  },
  {
    title: "Potencial e Desafios da ABP e IA no Ensino de Programação",
    description:
      "Artigo completo publicado em periódico científico (DOI: 10.5281/zenodo.12709058). Pesquisa empírica sobre aprendizagem baseada em problemas com auxílio de IA.",
    year: "2024",
    type: "article",
    url: "https://doi.org/10.5281/zenodo.12709058",
  },
  {
    title: "R para Ciência de Dados (2ª Edição)",
    description:
      "Tradução oficial e comunitária para a língua portuguesa do clássico 'R for Data Science' de Hadley Wickham, Mine Çetinkaya-Rundel e Garrett Grolemund.",
    year: "2023",
    type: "translation",
    url: "https://pt.r4ds.hadley.nz/",
  },
];

const typeConfig = {
  book: { icon: BookOpen, label: "Livro", color: "text-blue-600 dark:text-blue-400" },
  chapter: { icon: BookOpen, label: "Capítulo", color: "text-cyan-600 dark:text-cyan-400" },
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
                        {pub.url ? (
                          <a
                            href={pub.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-start gap-1 hover:text-primary transition-colors"
                          >
                            {pub.title}
                            <ExternalLink className="w-3.5 h-3.5 mt-1 flex-shrink-0" aria-hidden="true" />
                          </a>
                        ) : (
                          pub.title
                        )}
                      </h3>
                      {pub.subtitle && (
                        <p className="text-xs font-medium text-primary/90 mb-2">
                          {pub.subtitle}
                        </p>
                      )}
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
