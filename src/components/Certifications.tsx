"use client";

import { Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/useInView";
import { SectionTitle } from "./SectionTitle";

const certifications = [
  {
    title: "Gradio Agents & MCP Hackathon Winner",
    issuer: "Hugging Face",
    date: "2025",
  },
  {
    title: "Lakehouse na Prática: Engenharia de Dados",
    issuer: "Grupo Portfolio",
    date: "2024",
    hours: "25h",
  },
  {
    title: "R para Machine Learning",
    issuer: "Certificado",
    date: "2024",
  },
  {
    title: "Certificado de Moderador - Finanças (FIN)",
    issuer: "XV CASI",
    date: "2024",
  },
  {
    title: "Intermediate Tidymodels",
    issuer: "POSIT",
    date: "2023",
    location: "Estados Unidos",
  },
  {
    title: "Destaque Acadêmico",
    issuer: "PUC-Rio",
    date: "2010",
  },
];

export function Certifications() {
  const { ref, isVisible } = useInView({ threshold: 0.1 });

  return (
    <section id="certifications" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <SectionTitle icon={Award} title="Certificações" />

        <div ref={ref} className="grid md:grid-cols-2 gap-4">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className={cn("scroll-fade-in", isVisible && "visible")}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div
                className={cn(
                  "p-4 rounded-xl border border-border h-full",
                  "bg-card text-card-foreground",
                  "card-3d hover:border-primary/50 transition-all duration-300"
                )}
              >
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {cert.issuer}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {cert.date}
                      {"hours" in cert && cert.hours && ` • ${cert.hours}`}
                      {"location" in cert && cert.location && ` • ${cert.location}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
