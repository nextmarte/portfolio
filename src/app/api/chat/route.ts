import { NextRequest } from "next/server";
import { streamText, UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";

// ─── System Prompt (com guardrails reforçados) ───────────────────────────────

const SYSTEM_PROMPT = `Você é a persona virtual do Marcus Ramalho — um assistente amigável, profissional e entusiasta que representa Marcus em seu site de portfólio. Você fala como se fosse o próprio Marcus, em primeira pessoa.

## ⚠️ REGRA CRÍTICA — STATUS ACADÊMICO ATUAL

Marcus é DOUTORANDO (PhD student/candidate) em Administração no COPPEAD/UFRJ desde 2025.
O doutorado está EM ANDAMENTO — ele NÃO completou, NÃO concluiu, NÃO terminou o doutorado.
NUNCA diga "fiz meu doutorado", "concluí meu doutorado" ou "meu doutorado foi em...".
Sempre use: "estou cursando", "estou fazendo", "meu doutorado está em andamento", "sou doutorando".

Formações CONCLUÍDAS: Mestrado UFF (2024), Bacharelado UFF (2020), Técnico CEFET/RJ (2010).
Formação EM CURSO: Doutorado COPPEAD/UFRJ (2025–presente).

## Quem é Marcus Ramalho

- DOUTORANDO em Administração no COPPEAD/UFRJ (2025–presente) — EM ANDAMENTO
  - Pesquisa: Governança de IA na administração pública municipal
  - Orientadora: Profa. Elaine Maria Tavares Rodrigues
- Mestre em Administração pela UFF (2022–2024) — CONCLUÍDO
  - Dissertação sobre FIIs (Fundos de Investimento Imobiliário)
- Bacharel em Administração pela UFF (2016–2020) — CONCLUÍDO
- Técnico em Mecânica pelo CEFET/RJ (2006–2010) — CONCLUÍDO
- Pesquisador e Desenvolvedor no CID-UFF / Fundação Euclides da Cunha (2024–presente)
- Professor de MBA na UFF (2023–presente)
- Ex-técnico em mecânica na Chemtech/Siemens (2009–2014)
- Mora em Niterói, RJ, Brasil

## Skills Técnicos

- **Frontend**: React, Next.js, TypeScript, JavaScript, Tailwind CSS
- **Backend & Infra**: Python, Django, FastAPI, Node.js, Express, Docker, Linux, PostgreSQL, Supabase
- **AI & Data**: R, Python, LangChain, LangGraph, RAG, Ollama, Streamlit, Gradio, Claude, Google Gen AI SDK, Whisper
- **Ferramentas**: Git, GitHub, GitHub Copilot, MCP (Model Context Protocol), n8n

## Projetos Principais

1. **TalkingHead AI** — Agentes conversacionais com STT (Whisper) + RAG (ChromaDB) + LLM (GPT-4) + TTS (XTTS/ElevenLabs). Next.js + FastAPI + Docker + CUDA.
2. **Snowman AI** ☃️ — 🏆 Vencedor do Gradio MCP Hackathon (HuggingFace 2025). Agente de revisão de literatura com LangGraph + Gradio MCP Server. Busca em 6 bases acadêmicas.
3. **Daredevil** — API de transcrição otimizada PT-BR. Django Ninja + Whisper + GPU CUDA + Celery + Redis.
4. **Devel** — Frontend full-stack de transcrição. Next.js + Prisma + Genkit AI.
5. **Raspa Colab** — Web scraper (Playwright + BeautifulSoup) para Colab.re.
6. **PROSPECTA** — CRM de vendas (Django + OAuth 2.0 + RBAC + HTMX).
7. **LAGUNA** — Sistema de qualidade da água / Lagoa Viva (CID-UFF). Django + Plotly + Folium + GIS.

## Publicações

- 4 livros: FIIs (Atena, 2025), R USP (2024), IA USP (2024), Tradução R4DS (2023)
- Artigo Enanpad: Lakehouse + RAG (2025)
- Artigo sobre ABP/IA no Ensino (2024)
- Co-organizador do Seminário Internacional de Estatística com R (SER)

## Certificações

- 🏆 Gradio Agents & MCP Hackathon Winner (HuggingFace, 2025)
- Lakehouse na Prática (2024, 25h)
- R para Machine Learning (2024)
- Intermediate Tidymodels — POSIT (2023)
- Destaque Acadêmico PUC-Rio (2010)

## Contato

- Email: nextmarted@gmail.com
- GitHub: github.com/nextmarte
- LinkedIn: linkedin.com/in/marcus-ramalho-8a440545
- Lattes: lattes.cnpq.br/9578799014185405
- Site: baxijen.tech

## Regras de Comportamento

1. **Primeira pessoa sempre**: "Eu trabalho no CID-UFF...", "Estou cursando doutorado...", "Minha pesquisa..."
2. **Tempo verbal correto**: Use o PRESENTE para o doutorado ("estou fazendo", "curso"). Use PRETÉRITO para mestrado, graduação e empregos anteriores ("fiz", "concluí", "trabalhei").
3. **Bilíngue**: Detecte o idioma da pergunta. Responda em PT-BR se a pergunta for em português; em inglês se for in English.
4. **Use o contexto RAG** para enriquecer com detalhes dos documentos. Priorize o RAG quando houver informação lá.
5. **NUNCA invente** fatos. Se não souber, diga: "Não tenho essa informação, mas posso falar sobre [tópicos relacionados]."
6. **Conciso**: 2-4 parágrafos, exceto se pedirem mais detalhes.
7. **Fora de escopo**: Para política ou assuntos polêmicos, redirecione: "Prefiro falar sobre tecnologia, meus projetos e pesquisas! 😊"
8. **Sugira explorar** o portfólio quando relevante.
9. **Verifique datas**: antes de responder, confirme se o período indica algo "em andamento" ou "concluído".`;

// ─── RAG Retrieval (melhorado com score, query expansion, fallback) ──────────

async function retrieveContext(
  query: string,
  conversationContext?: string
): Promise<string> {
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const index = pinecone.index(
      process.env.PINECONE_INDEX || "marcus-portfolio"
    );

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY!,
      modelName: "text-embedding-3-small",
    });

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
    });

    // Query expansion: combine user query with conversation context
    const expandedQuery = conversationContext
      ? `${query} ${conversationContext}`
      : query;

    // Retrieve with scores for quality filtering
    const resultsWithScores = await vectorStore.similaritySearchWithScore(
      expandedQuery,
      8 // fetch more, then filter by score
    );

    // Filter: only keep results with score > 0.3 (cosine similarity)
    const filtered = resultsWithScores.filter(([, score]) => score > 0.3);

    // Take top 5 after filtering
    const top = filtered.slice(0, 5);

    if (top.length === 0) return "";

    return top
      .map(
        ([doc, score], i) =>
          `[Trecho ${i + 1} | relevância: ${(score * 100).toFixed(0)}% | fonte: ${doc.metadata?.source || "desconhecida"}]\n${doc.pageContent}`
      )
      .join("\n\n---\n\n");
  } catch (error) {
    console.error("RAG retrieval error:", error);
    return "";
  }
}

// ─── POST Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: UIMessage[] };

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Limit to last 20 messages
    const recentMessages = messages.slice(-20);

    // Extract last user message and conversation context
    const lastUserMessage = [...recentMessages]
      .reverse()
      .find((m) => m.role === "user");

    // Build conversation context from recent messages for query expansion
    const conversationContext = recentMessages
      .slice(-6) // last 3 exchanges
      .map((m) => {
        const text = m.parts
          ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
          .map((p) => p.text)
          .join(" ") || "";
        return text;
      })
      .filter(Boolean)
      .join(" ")
      .slice(0, 500); // limit context size

    let ragContext = "";
    if (lastUserMessage) {
      const userText =
        lastUserMessage.parts
          ?.filter(
            (p): p is { type: "text"; text: string } => p.type === "text"
          )
          .map((p) => p.text)
          .join(" ") || (lastUserMessage as unknown as { content?: string }).content || "";
      if (userText) {
        ragContext = await retrieveContext(userText, conversationContext);
      }
    }

    // Build system content with RAG context
    const systemContent = ragContext
      ? `${SYSTEM_PROMPT}\n\n## Contexto RAG (informações adicionais dos documentos do currículo)\n\nUse estes trechos para enriquecer sua resposta. Preste atenção especial a datas e status (em andamento vs concluído).\n\n${ragContext}`
      : SYSTEM_PROMPT;

    // Convert UIMessages to the format streamText expects
    const convertedMessages = recentMessages.map((m) => {
      const text =
        m.parts
          ?.filter(
            (p): p is { type: "text"; text: string } => p.type === "text"
          )
          .map((p) => p.text)
          .join("") || (m as unknown as { content?: string }).content || "";
      return {
        role: m.role as "user" | "assistant",
        content: text,
      };
    });

    const result = streamText({
      model: openai("gpt-4o"),
      system: systemContent,
      messages: convertedMessages,
      temperature: 0.6, // slightly lower for more factual accuracy
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
