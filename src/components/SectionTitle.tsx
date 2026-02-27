import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SectionTitleProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({
  icon: Icon,
  title,
  subtitle,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center gap-4">
        <div className="relative">
          {/* Gradiente background circular */}
          <div
            className={cn(
              "absolute inset-0 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300",
              "bg-gradient-to-br from-primary/40 via-primary/20 to-transparent"
            )}
          />
          {/* Circle com ícone */}
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/30 backdrop-blur-sm shadow-lg">
            <Icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
