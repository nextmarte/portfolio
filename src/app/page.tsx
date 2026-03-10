import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Resume } from "@/components/Resume";
import { Certifications } from "@/components/Certifications";
import { Publications } from "@/components/Publications";
import { Contact } from "@/components/Contact";

// ISR: Revalidate this page every 1 hour
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Resume />
      <Certifications />
      <Publications />
      <Contact />
    </>
  );
}