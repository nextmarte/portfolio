import type { Metadata } from "next";
import { Space_Grotesk, Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// ISR: Revalidate layout every 1 hour
export const revalidate = 3600;

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const SITE_URL = "https://marcusramalho.com.br";
const PHOTO_URL = "https://www.baxijen.com.br/marcus.jpg";
const TITLE = "Marcus Ramalho | AI Architect & Software Engineer";
const DESCRIPTION =
  "AI Architect & Software Engineer na BaXiJen, pesquisador em IA e doutorando no COPPEAD/UFRJ, cientista de dados no CID-UFF. Especialista em desenvolvimento assistido por IA (Claude Code, Antigravity, Codex e MCP).";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Marcus Ramalho",
    images: [
      {
        url: PHOTO_URL,
        alt: "Marcus Ramalho, AI Architect & Software Engineer",
      },
    ],
    locale: "pt_BR",
    type: "profile",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
    images: [PHOTO_URL],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Marcus Ramalho",
  jobTitle: "AI Architect & Software Engineer",
  image: PHOTO_URL,
  email: "mailto:nextmarted@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Niterói",
    addressRegion: "RJ",
    addressCountry: "BR",
  },
  affiliation: [
    { "@type": "Organization", name: "COPPEAD/UFRJ" },
    { "@type": "Organization", name: "CID-UFF" },
  ],
  worksFor: { "@type": "Organization", name: "BaXiJen", url: "https://baxijen.com.br" },
  url: SITE_URL,
  sameAs: [
    "https://github.com/nextmarte",
    "https://www.linkedin.com/in/marcus-ramalho-8a440545/",
    "https://lattes.cnpq.br/9578799014185405",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${outfit.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Skip to content — a11y */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground focus:text-sm focus:font-semibold"
          >
            Pular para o conteúdo
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <ChatBot />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}