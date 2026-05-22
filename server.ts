import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[Express LOG] ${req.method} ${req.url}`);
  next();
});

// Body parsing with size limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Configure Multer for in-memory uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured. Please open Settings > Secrets and add your real key.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// API Route: Real Meeting Capture & Synthesis
app.post("/api/synthesize", upload.array("files"), async (req, res): Promise<any> => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded for synthesis." });
    }

    console.log(`Processing ${files.length} uploaded assets for intelligence extraction...`);
    let aggregatedText = "";
    const attachmentsNames: string[] = [];

    // Parse each uploaded file
    for (const file of files) {
      attachmentsNames.push(file.originalname);
      let fileText = "";

      if (file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) {
        try {
          const uint8 = new Uint8Array(file.buffer);
          const parser = new PDFParse(uint8);
          const parsed = await parser.getText();
          fileText = parsed.text;
        } catch (pdfError: any) {
          console.error(`PDF Parse Error for ${file.originalname}:`, pdfError);
          // Fallback to reading raw buffer as UTF-8 string
          fileText = file.buffer.toString("utf-8");
        }
      } else {
        // Plain text, markdown, CSV, JSON transcripts
        fileText = file.buffer.toString("utf-8");
      }

      aggregatedText += `\n--- SOURCE: ${file.originalname} ---\n${fileText}\n`;
    }

    if (!aggregatedText.trim()) {
      return res.status(400).json({ error: "No readable text content extracted from uploaded files." });
    }

    // Call Gemini API server-side
    const ai = getGeminiClient();

    // To prevent exceeding Gemini's Free Tier input token limits (250,000 token limit per minute),
    // we truncate the aggregated document if it is extremely large.
    const MAX_CHARACTERS = 80000; // Roughly ~16k to ~20k tokens. Extremely safe and handles plenty of pages.
    let textForGemini = aggregatedText;
    let wasTruncated = false;
    if (aggregatedText.length > MAX_CHARACTERS) {
      textForGemini = aggregatedText.substring(0, MAX_CHARACTERS) + 
        "\n\n[WARNING: Input material was truncated for AI processing to remain within Gemini API free-tier token allowances. Please try uploading shorter snippets if key content was missed.]";
      wasTruncated = true;
    }

    const prompt = `Analyze the following meeting transcript, notes, or brief assets. Synthesize a professional, highly compressed, structured report with actionable takeaways in JSON format matching the schema.\n\nCRITICAL CONSTRAINTS:\n- Keep the executive summary paragraph extremely short, high-impact, and limited to exactly 1 to 3 sentences.\n- Every roadblock, strategic observation, talking point, and next step bullet must be extremely concise, tactical, and maximum 12 words.\n- Deliver direct operational value with absolutely no preamble, fluff, or verbosity.\n\nInput Assets Material:\n${textForGemini}`;

    console.log("Invoking Gemini model 'gemini-3.5-flash' for synthesis...");
    
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite enterprise operations officer and AI corporate intelligence expert. Analyze meeting notes/transcripts deeply. Structure your output exactly as standard JSON. Maintain 100% semantic integrity. CRITICAL: Every section in your response MUST be extremely brief, highly compressed, and focused strictly on high-yield tactical value. The 'summary' must be a highly condensed executive summary of exactly 1 to 3 sentences. All array bullets ('risks', 'insights', 'talkingPoints', 'nextSteps') must be direct, short, actionable, and maximum 12 words per bullet point. Avoid any wordiness, fluff, or extended descriptions. Keep it short but highly useful. For status, choose 'Summarized' if normal; if risks, choose '1 Risk Found' or '3 Risks Found'. Create concrete deliverables for nextSteps.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Title of the meeting (concise and tactical)" },
            duration: { type: Type.STRING, description: "Estimated duration of the meeting, e.g. '45 mins'" },
            category: { type: Type.STRING, description: "Broad strategic category, e.g. 'OPERATIONAL SYNCHRONIZATION'" },
            status: { type: Type.STRING, description: "Must be exactly one of: 'Summarized', '3 Risks Found', '1 Risk Found', 'Success', 'In Progress'" },
            summary: { type: Type.STRING, description: "Executive high-impact summary paragraph summarizing the material" },
            risks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Strategic or technical risks and roadblocks highlighted"
            },
            insights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Engaging strategic observations/conclusions"
            },
            talkingPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key arguments/points discussed in dialogue"
            },
            nextSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING, description: "Task checklist item" }
                },
                required: ["text"]
              },
              description: "Uncompleted action items checklist"
            }
          },
          required: ["title", "duration", "category", "status", "summary", "risks", "insights", "talkingPoints", "nextSteps"]
        }
      }
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error("Empty model response received from Gemini.");
    }

    const aiReport = JSON.parse(outputText);

    // Format final Meeting type with generated properties plus standard visuals
    const generatedMeeting = {
      id: "synthesized-" + Date.now(),
      title: aiReport.title || `Synthesized Report: ${files[0].originalname.split(".")[0]}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      duration: aiReport.duration || "45 mins",
      category: aiReport.category || "STRATEGY AUTOMATION",
      status: aiReport.status || "Summarized",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600",
      summary: aiReport.summary + (wasTruncated ? " [Note: To safeguard performance boundaries and comply with Gemini minutes quotas, input assets were filtered and summarized from the initial segment.]" : ""),
      risks: aiReport.risks || [],
      insights: aiReport.insights || [],
      talkingPoints: aiReport.talkingPoints || [],
      nextSteps: (aiReport.nextSteps || []).map((step: any, index: number) => ({
        id: `ns-step-${index}-${Date.now()}`,
        text: step.text,
        completed: false,
      })),
      participantsCount: 3,
      participantAvatars: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDFWMVB3LDygVHvjbMMF8tktZq3Qu3ldcZgOHrPuja7ab3Tu3fB_bp5Yk6Ke0sQ2xl6b-Yi15Jkc73Z7MU4b-mQsIgV70jRclORv6yApJnjtOwO-DyAUAfVs4c2gWYg8t_S0Qme5jedYeMhaHWr_MHlDt-WTYBHW7qf4OfowWbx_H7vx055NKpvrFFoVmXCayQQP4MmcCPlacywF3A2gqlNVMkzyXM8u9En23Ga7vMd1TvydjmvuCmevQJaElbXcfCG9--kt-Nc8Es",
      ],
      attachments: attachmentsNames,
      fullTranscript: aggregatedText.substring(0, 15000) + (aggregatedText.length > 15000 ? "\n\n[Transcript Truncated due to absolute scale...]" : ""),
    };

    return res.json(generatedMeeting);
  } catch (error: any) {
    console.error("Synthesize API Error:", error);
    
    let friendlyError = error.message || "Internal server error occurred when synthesizing the PDF briefing text.";
    const isQuotaError = 
      friendlyError.includes("429") || 
      friendlyError.toLowerCase().includes("quota") || 
      friendlyError.toUpperCase().includes("RESOURCE_EXHAUSTED") ||
      (error.status && error.status === "RESOURCE_EXHAUSTED") ||
      (error.code && error.code === 429);
      
    if (isQuotaError) {
      friendlyError = "Gemini API Free Tier limits exceeded:\n" +
        "You've hit the Gemini free usage limit of 250,000 tokens per minute. " +
        "Please wait 10-15 seconds before retrying so the quota resets, and try sending smaller documents if the problem persists.";
    }

    return res.status(500).json({
      error: friendlyError,
    });
  }
});

// Express router global error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): any => {
  console.error("[Express Global Error Handled]:", err);
  return res.status(500).json({
    error: err.message || "An error occurred on the server.",
    details: err.stack,
  });
});

// Vite server / build setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
