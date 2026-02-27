import { Heart, Github, Linkedin, ExternalLink } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/nextmarte",
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/marcus-ramalho-8a440545/",
      label: "LinkedIn",
    },
    {
      icon: ExternalLink,
      href: "https://lattes.cnpq.br/9578799014185405",
      label: "Lattes",
    },
  ];

  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {year} Marcus Ramalho. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                title={link.label}
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            Feito com <Heart className="w-4 h-4 text-red-500" /> usando Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}