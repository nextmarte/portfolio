"use client";

import { Briefcase } from "lucide-react";
import { useInView } from "@/lib/useInView";
import { SectionTitle } from "./SectionTitle";
import InteractiveTimeline, { TimelineExperience } from "./InteractiveTimeline";

const experiences: TimelineExperience[] = [
  {
    id: "1",
    type: "education",
    title: "Técnico em Mecânica Industrial",
    organization: "CEFET/RJ",
    period: "2006 – 2010",
    startYear: 2006,
    endYear: 2010,
    description: "Formação técnica em mecânica industrial com foco em desenho técnico e design de elementos estruturais.",
    outfit: "student",
    tools: ["AutoCAD", "SolidWorks", "Desenho Técnico"],
  },
  {
    id: "2",
    type: "work",
    title: "Técnico em Mecânica",
    organization: "Chemtech / Siemens",
    period: "2009 – 2014",
    startYear: 2009,
    endYear: 2014,
    description: "Análises de tensão em tubulações industriais, atuando em projetos de engenharia de detalhamento e FEED.",
    outfit: "engineer",
    tools: ["AutoCAD", "PDMS", "CAESAR II", "Cálculo Estrutural"],
  },
  {
    id: "3",
    type: "education",
    title: "Bacharelado em Administração",
    organization: "Universidade Federal Fluminense",
    period: "2016 – 2020",
    startYear: 2016,
    endYear: 2020,
    description: "Graduação com TCC sobre análise de risco e rentabilidade de carteiras de fundos imobiliários.",
    outfit: "university",
    tools: ["Excel", "R", "Estatística", "Finanças"],
  },
  {
    id: "4",
    type: "work",
    title: "Estagiário",
    organization: "Grupo Águas do Brasil",
    period: "2017 – 2018",
    startYear: 2017,
    endYear: 2018,
    description: "Mapeamento de melhorias em processos internos, criação e análise de indicadores comerciais, elaboração de treinamentos.",
    outfit: "it_advisor",
    tools: ["Excel", "PowerPoint", "Indicadores", "Processos"],
  },
  {
    id: "5",
    type: "work",
    title: "Bolsista de Iniciação Científica",
    organization: "FAPERJ",
    period: "2018 – 2020",
    startYear: 2018,
    endYear: 2020,
    description: "Pesquisa bibliométrica na Hemeroteca Nacional sobre organização sindical dos operários navais, com produção de relatório e apoio a artigo científico.",
    outfit: "researcher",
    tools: ["R", "Python", "Pesquisa", "Web Scraping"],
  },
  {
    id: "6",
    type: "work",
    title: "Responsável Técnico",
    organization: "Web Rádio Censura Livre",
    period: "2018 – 2021",
    startYear: 2018,
    endYear: 2021,
    description: "Administração de mídias sociais, sites, programação e manutenção de equipamentos.",
    outfit: "manager",
    tools: ["WordPress", "Mídias Sociais", "Web", "Infraestrutura"],
  },
  {
    id: "7",
    type: "education",
    title: "Mestrado em Administração",
    organization: "Universidade Federal Fluminense",
    period: "2022 – 2024",
    startYear: 2022,
    endYear: 2024,
    description: "Dissertação: Fundos de Investimento Imobiliário — análise dos principais indicadores de performance.",
    outfit: "masters",
    tools: ["R", "Python", "Estatística", "Machine Learning", "Finanças"],
  },
  {
    id: "8",
    type: "work",
    title: "Professor de MBA",
    organization: "Universidade Federal Fluminense",
    period: "2023 – Presente",
    startYear: 2023,
    endYear: 2027,
    description: "Professor em MBAs de Ciência de Dados e Finanças Corporativas. Orientador de monografias e membro de bancas examinadoras.",
    outfit: "teacher",
    tools: ["R", "Python", "Data Science", "Finanças", "Didática"],
  },
  {
    id: "9",
    type: "work",
    title: "Pesquisador & Desenvolvedor",
    organization: "CID-UFF / Fundação Euclides da Cunha",
    period: "2024 – Presente",
    startYear: 2024,
    endYear: 2027,
    description: "Pesquisa aplicada no projeto Lagoa Viva. Desenvolvimento de sistema Django para gestão e análise de dados ambientais. Engenharia de dados e IA.",
    outfit: "engineer",
    tools: ["Python", "Django", "Streamlit", "R", "Shiny", "LangChain", "Docker"],
  },
  {
    id: "10",
    type: "education",
    title: "Doutorado em Administração",
    organization: "COPPEAD/UFRJ",
    period: "2025 – Presente",
    startYear: 2025,
    endYear: 2030,
    description: "Pesquisa sobre Governança de IA na administração pública municipal. Orientadora: Elaine Maria Tavares Rodrigues.",
    outfit: "phd",
    tools: ["IA", "Governança", "Setor Público", "NLP"],
  },
];


export function Resume() {
  const { ref, isVisible } = useInView({ threshold: 0.1 });

  return (
    <section id="resume" className="py-20">
      <div className="container mx-auto px-4">
        <SectionTitle icon={Briefcase} title="Currículo" />

        <div
          ref={ref}
          className={`max-w-5xl mx-auto ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
        >
          <InteractiveTimeline experiences={experiences} />
        </div>
      </div>
    </section>
  );
}