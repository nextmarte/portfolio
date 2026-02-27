import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PineconeStore } from "@langchain/pinecone";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

// Extract text from PDF using system pdftotext (poppler-utils)
function parsePdf(filePath: string): string {
  try {
    const result = execSync(`pdftotext -layout "${filePath}" -`, {
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    });
    return result;
  } catch {
    // Fallback: try without -layout
    const result = execSync(`pdftotext "${filePath}" -`, {
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    });
    return result;
  }
}

// ─── Load .env.local ─────────────────────────────────────────────────────────

const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const value = trimmed.slice(eqIdx + 1).trim();
        process.env[key] = value;
      }
    }
  }
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY!;
const PINECONE_INDEX = process.env.PINECONE_INDEX || "marcus-portfolio";

if (!OPENAI_API_KEY || !PINECONE_API_KEY) {
  console.error("❌ Missing OPENAI_API_KEY or PINECONE_API_KEY in .env.local");
  process.exit(1);
}

const RAG_DIR = path.resolve(process.cwd(), "public/rag");
const COMPONENTS_DIR = path.resolve(process.cwd(), "src/components");

// ─── Extract text content from TSX component files ──────────────────────────

function extractTextFromTSX(code: string): string {
  const lines: string[] = [];
  
  // Extract string literals from data arrays (title, description, label, etc.)
  const stringProps = /(?:title|description|label|value|organization|period|issuer|date|hours|location|name)\s*:\s*["'`]([^"'`]+)["'`]/g;
  let match;
  while ((match = stringProps.exec(code)) !== null) {
    lines.push(match[1]);
  }
  
  // Extract JSX text content (text between > and <)
  const jsxText = />\s*\n?\s*([A-ZÀ-ÿ][^<>{}\n]{10,})/g;
  while ((match = jsxText.exec(code)) !== null) {
    const text = match[1].trim();
    if (text.length > 15 && !text.includes("className") && !text.includes("function")) {
      lines.push(text);
    }
  }
  
  // Extract template literals and long strings in paragraphs
  const paragraphs = /["'`]([^"'`]{30,})["'`]/g;
  while ((match = paragraphs.exec(code)) !== null) {
    const text = match[1].trim();
    // Filter out code-like strings
    if (!text.includes("{") && !text.includes("=>") && !text.includes("className") && !text.includes("http")) {
      lines.push(text);
    }
  }

  // Deduplicate
  return [...new Set(lines)].join("\n");
}

// ─── Load documents from public/rag ─────────────────────────────────────────

async function loadDocuments(): Promise<{ text: string; source: string; category: string }[]> {
  const docs: { text: string; source: string; category: string }[] = [];
  const files = fs.readdirSync(RAG_DIR);

  for (const file of files) {
    const filePath = path.join(RAG_DIR, file);
    const ext = path.extname(file).toLowerCase();

    try {
      if (ext === ".pdf") {
        const text = parsePdf(filePath);
        docs.push({ text, source: file, category: "curriculum" });
        console.log(`📄 PDF: ${file} (${text.length} chars)`);
      } else if (ext === ".txt" || ext === ".md") {
        const text = fs.readFileSync(filePath, "utf-8");
        docs.push({ text, source: file, category: "knowledge-base" });
        console.log(`📝 Text: ${file} (${text.length} chars)`);
      }
    } catch (err) {
      console.error(`❌ Error loading ${file}:`, err);
    }
  }

  return docs;
}

// ─── Load content from site components ──────────────────────────────────────

function loadSiteContent(): { text: string; source: string; category: string }[] {
  const docs: { text: string; source: string; category: string }[] = [];
  const components = [
    "About.tsx",
    "Resume.tsx",
    "Skills.tsx",
    "Projects.tsx",
    "Publications.tsx",
    "Certifications.tsx",
    "Hero.tsx",
    "Contact.tsx",
  ];

  for (const comp of components) {
    const filePath = path.join(COMPONENTS_DIR, comp);
    if (!fs.existsSync(filePath)) continue;

    try {
      const code = fs.readFileSync(filePath, "utf-8");
      const extracted = extractTextFromTSX(code);
      if (extracted.length > 50) {
        docs.push({
          text: extracted,
          source: `site/${comp}`,
          category: "website",
        });
        console.log(`🌐 Component: ${comp} (${extracted.length} chars extracted)`);
      }
    } catch (err) {
      console.error(`❌ Error extracting ${comp}:`, err);
    }
  }

  return docs;
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Starting RAG ingestion (improved)...\n");

  // 1. Load all content sources
  const ragDocs = await loadDocuments();
  const siteDocs = loadSiteContent();
  const allDocs = [...ragDocs, ...siteDocs];

  if (allDocs.length === 0) {
    console.error("❌ No documents found");
    process.exit(1);
  }

  console.log(`\n📚 Total sources: ${allDocs.length}\n`);

  // 2. Split with different strategies per category
  const allChunks: { pageContent: string; metadata: Record<string, string> }[] = [];

  // Knowledge base: split by markdown sections (## headers)
  const mdSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 600,
    chunkOverlap: 150,
    separators: ["\n## ", "\n### ", "\n\n", "\n", ". ", " "],
  });

  // PDFs: larger chunks since they're less structured
  const pdfSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 200,
    separators: ["\n\n", "\n", ". ", " ", ""],
  });

  // Site content: smaller focused chunks
  const siteSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
    separators: ["\n\n", "\n", ". ", " "],
  });

  for (const doc of allDocs) {
    // Ensure text is a string and not empty
    const text = typeof doc.text === "string" ? doc.text.trim() : String(doc.text || "").trim();
    if (!text || text.length < 20) {
      console.log(`⏭️  Skipping ${doc.source} (too short: ${text.length} chars)`);
      continue;
    }

    const splitter =
      doc.category === "knowledge-base"
        ? mdSplitter
        : doc.category === "curriculum"
          ? pdfSplitter
          : siteSplitter;

    const chunks = await splitter.createDocuments(
      [text],
      [{ source: doc.source, category: doc.category }]
    );

    allChunks.push(
      ...chunks
        .filter((c) => c.pageContent && c.pageContent.trim().length > 10)
        .map((c) => ({
          pageContent: c.pageContent.trim(),
          metadata: c.metadata as Record<string, string>,
        }))
    );
  }

  console.log(`✂️  Created ${allChunks.length} chunks from ${allDocs.length} sources\n`);

  // 3. Initialize Pinecone
  const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
  const index = pinecone.index(PINECONE_INDEX);

  // 4. Clear existing vectors
  console.log("🗑️  Clearing existing vectors...");
  try {
    await index.deleteAll();
    console.log("✅ Cleared\n");
  } catch {
    console.log("ℹ️  Index empty or deleteAll not supported\n");
  }

  // 5. Create embeddings and store directly via Pinecone SDK
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: OPENAI_API_KEY,
    modelName: "text-embedding-3-small",
  });

  console.log("📊 Generating embeddings and uploading...");

  // Upload in batches directly via Pinecone SDK
  const BATCH_SIZE = 25;
  let totalUploaded = 0;
  for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
    const batch = allChunks.slice(i, i + BATCH_SIZE).filter((c) => c.pageContent.length > 0);
    if (batch.length === 0) continue;
    try {
      // Generate embeddings
      const texts = batch.map((c) => c.pageContent);
      const vectors = await embeddings.embedDocuments(texts);

      // Create Pinecone records (sanitize metadata — Pinecone only allows string/number/boolean/string[])
      const records = batch.map((c, j) => {
        const cleanMeta: Record<string, string> = {
          text: c.pageContent,
        };
        for (const [key, val] of Object.entries(c.metadata)) {
          if (key === "loc") continue; // skip LangChain's loc object
          if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
            cleanMeta[key] = String(val);
          }
        }
        return {
          id: `chunk-${i + j}-${Date.now()}`,
          values: vectors[j],
          metadata: cleanMeta,
        };
      });

      await index.upsert(records);
      totalUploaded += records.length;
      console.log(`  ✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(allChunks.length / BATCH_SIZE)} (${batch.length} chunks)`);
    } catch (err) {
      console.error(`  ❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, err);
    }
    // Small delay between batches
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\n🎉 Done! ${allChunks.length} chunks → Pinecone "${PINECONE_INDEX}"`);
}

main().catch(console.error);
