"use client";

import { Folder, ExternalLink, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/useInView";
import { SectionTitle } from "./SectionTitle";

const projects = [
  {
    title: "TalkingHead AI",
    description:
      "Sistema de agentes conversacionais com interface estilo Skype. Integra STT (Whisper), RAG (ChromaDB), LLM (GPT-4) e TTS (XTTS/ElevenLabs) com streaming via WebSocket. Suporte a múltiplos agentes com base de conhecimento própria, painel admin e autenticação.",
    tags: ["Next.js", "FastAPI", "Whisper", "RAG", "Docker", "CUDA"],
    github: "https://github.com/nextmarte/talkinghead",
    demo: null,
  },
  {
    title: "☃️ Snowman AI",
    description:
      "Agente autônomo de revisão de literatura científica vencedor do Gradio MCP Hackathon. Extrai referências de PDFs, busca em 6 bases acadêmicas (CrossRef, Semantic Scholar, OpenAlex), avalia papers com IA e expõe MCP Server para Claude Desktop e Cursor.",
    tags: ["LangGraph", "Gradio", "GPT-4o", "MCP Server", "Python", "🏆 Hackathon Winner"],
    github: "https://github.com/nextmarte/snowball",
    demo: "https://www.gradio.app/mcp-birthday-winners",
  },
  {
    title: "Daredevil",
    description:
      "API de transcrição de áudio e vídeo otimizada para PT-BR. Usa Django Ninja + Whisper com aceleração GPU NVIDIA CUDA, processamento assíncrono via Celery + Redis, cache inteligente e suporte a 23 formatos de mídia em processamento batch.",
    tags: ["Python", "Django Ninja", "Whisper", "CUDA", "Celery", "Docker"],
    github: "https://github.com/nextmarte/daredevil",
    demo: null,
  },
  {
    title: "Devel",
    description:
      "Plataforma full-stack de transcrição assíncrona com isolamento multi-usuário. Frontend Next.js para a API Daredevil, com modos sync/async, polling em tempo real, correção de texto e identificação de speakers via Genkit AI.",
    tags: ["TypeScript", "Next.js", "Prisma", "Genkit AI", "React"],
    github: "https://github.com/nextmarte/Devel",
    demo: null,
  },
  {
    title: "Raspa Colab",
    description:
      "Web scraper automatizado para a plataforma Colab.re de reclamações cidadãs. Autenticação automática, navegação por scroll infinito, filtragem por data e exportação em JSON. Construído com Playwright e BeautifulSoup.",
    tags: ["Python", "Playwright", "BeautifulSoup", "Web Scraping"],
    github: "https://github.com/nextmarte/raspa_colab",
    demo: null,
  },
  {
    title: "PROSPECTA",
    description:
      "Sistema de gestão de oportunidades de vendas com autenticação OAuth 2.0 (Google/GitHub), controle de acesso baseado em roles (RBAC), pipeline de vendas com etapas e atividades, painel admin completo e auditoria de ações.",
    tags: ["Django", "PostgreSQL", "HTMX", "Tailwind CSS", "OAuth 2.0"],
    github: "https://github.com/nextmarte/Outlook",
    demo: null,
  },
  {
    title: "LAGUNA",
    description:
      "Sistema de gerenciamento de amostras de qualidade da água para o projeto Lagoa Viva (CID-UFF). Dashboard com calendário, previsão do tempo, checklist de campanhas de coleta, cálculo de IQA, mapas GIS com Folium e geração de etiquetas.",
    tags: ["Django", "PostgreSQL", "Plotly", "Folium", "Bootstrap"],
    github: "https://github.com/CIDUFF/LAGUNA",
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