"use client";

import { Mail, Linkedin, Github, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/useInView";
import { SectionTitle } from "./SectionTitle";

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    value: "nextmarted@gmail.com",
    href: "mailto:nextmarted@gmail.com",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "marcus-ramalho-8a440545",
    href: "https://www.linkedin.com/in/marcus-ramalho-8a440545/",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "nextmarte",
    href: "https://github.com/nextmarte",
  },
];

export function Contact() {
  const { ref, isVisible } = useInView();

  return (
    <section id="contact" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <SectionTitle icon={Mail} title="Contato" />

        <div
          ref={ref}
          className="max-w-2xl mx-auto scroll-fade-in"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.6s ease-out",
          }}
        >
          <p className="text-muted-foreground text-center mb-8">
            Interessado em trabalhar junto? Entre em contato através dos canais abaixo.
          </p>

          <div className="space-y-4">
            {contactLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border border-border",
                  "bg-card text-card-foreground",
                  "card-3d hover:border-primary/50 hover:shadow-md transition-all"
                )}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div className="p-3 rounded-lg bg-primary/10">
                  <link.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{link.label}</p>
                  <p className="font-medium text-foreground">{link.value}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>Niterói, Rio de Janeiro - Brasil</span>
          </div>
        </div>
      </div>
    </section>
  );
}