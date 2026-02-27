"use client";

import { Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/useInView";
import { SectionTitle } from "./SectionTitle";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiPython,
  SiNodedotjs,
  SiExpress,
  SiFastapi,
  SiDocker,
  SiGit,
  SiLinux,
  SiR,
  SiGithub,
  SiStreamlit,
  SiDjango,
  SiLangchain,
  SiSupabase,
  SiPostgresql,
  SiOllama,
  SiOpenai,
  SiGoogle,
  SiAnthropic,
} from "react-icons/si";
import { Zap, Sliders, Sparkles, BrainCircuit, Workflow } from "lucide-react";

interface Skill {
  name: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>;
  color: string;
}

interface SkillCategory {
  label: string;
  skills: Skill[];
}

const categories: SkillCategory[] = [
  {
    label: "Frontend",
    skills: [
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", icon: SiNextdotjs, color: "#000000" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
    ],
  },
  {
    label: "Backend & Infra",
    skills: [
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "Django", icon: SiDjango, color: "#092E20" },
      { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
      { name: "Express", icon: SiExpress, color: "#000000" },
      { name: "FastAPI", icon: SiFastapi, color: "#009688" },
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
      { name: "Linux", icon: SiLinux, color: "#FCC624" },
      { name: "Supabase", icon: SiSupabase, color: "#3FCF8E" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#336791" },
    ],
  },
  {
    label: "AI & Data",
    skills: [
      { name: "R", icon: SiR, color: "#276DC3" },
      { name: "Streamlit", icon: SiStreamlit, color: "#FF2B2B" },
      { name: "Gradio", icon: Sliders, color: "#FF6B6B" },
      { name: "LangChain", icon: SiLangchain, color: "#1C3144" },
      { name: "Ollama", icon: SiOllama, color: "#FB542B" },
      { name: "Claude", icon: SiAnthropic, color: "#9333EA" },
      { name: "Google Gen AI SDK", icon: Sparkles, color: "#8B5CF6" },
      { name: "RAG", icon: BrainCircuit, color: "#10B981" },
    ],
  },
  {
    label: "Ferramentas",
    skills: [
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "GitHub", icon: SiGithub, color: "#181717" },
      { name: "GitHub Copilot", icon: SiGithub, color: "#010409" },
      { name: "MCP", icon: Zap, color: "#00A0DF" },
      { name: "n8n", icon: Workflow, color: "#EA4B71" },
    ],
  },
];

export function Skills() {
  const { ref, isVisible } = useInView({ threshold: 0.1 });

  let globalIndex = 0;

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <SectionTitle icon={Code2} title="Stack" />

        <div ref={ref} className="space-y-8 max-w-4xl mx-auto">
          {categories.map((category) => (
            <div key={category.label}>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 pl-1">
                {category.label}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill) => {
                  const Icon = skill.icon;
                  const idx = globalIndex++;
                  return (
                    <div
                      key={skill.name}
                      className={cn(
                        "scroll-fade-in",
                        isVisible && "visible"
                      )}
                      style={{
                        transitionDelay: `${idx * 30}ms`,
                      }}
                    >
                      <div
                        className={cn(
                          "flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-lg",
                          "border border-border bg-white dark:bg-slate-800",
                          "card-3d hover:border-blue-500/50 transition-all duration-300",
                          "group cursor-default hover:shadow-md shadow-sm"
                        )}
                        style={{
                          backgroundColor: "var(--skill-bg, var(--card))",
                        }}
                      >
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-md bg-white dark:bg-white">
                          <Icon
                            size={24}
                            style={{
                              color: skill.color,
                            }}
                            className="group-hover:scale-125 transition-transform duration-300"
                          />
                        </div>
                        <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                          {skill.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}