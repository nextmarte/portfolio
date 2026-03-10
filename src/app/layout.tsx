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

export const metadata: Metadata = {
  title: "Marcus Ramalho | AI Researcher & Data Scientist",
  description:
    "AI Researcher, Ph.D. Student at COPPEAD/UFRJ, Data Scientist at CID-UFF, Professor at UFF's MBA programs. Portfolio showcasing projects in AI, Data Science, and Web Development.",
  metadataBase: new URL("https://www.baxijen.tech"),
  openGraph: {
    title: "Marcus Ramalho | AI Researcher & Data Scientist",
    description:
      "AI Researcher, Ph.D. Student at COPPEAD/UFRJ, Data Scientist at CID-UFF. Portfolio showcasing projects in AI, Data Science, and Web Development.",
    url: "https://www.baxijen.tech",
    siteName: "Marcus Ramalho Portfolio",
    images: [
      {
        url: "https://www.baxijen.tech/marcus.jpg",
        width: 256,
        height: 600,
        alt: "Marcus Ramalho",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marcus Ramalho | AI Researcher & Data Scientist",
    description:
      "AI Researcher, Ph.D. Student at COPPEAD/UFRJ, Data Scientist at CID-UFF.",
    images: ["https://www.baxijen.tech/marcus.jpg"],
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
  jobTitle: "AI Researcher & Data Scientist",
  affiliation: [
    { "@type": "Organization", name: "COPPEAD/UFRJ" },
    { "@type": "Organization", name: "CID-UFF" },
  ],
  url: "https://www.baxijen.tech",
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