import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/advisor", async (req, res) => {
    try {
      const { prompt, objective } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json({
          advice: `TACTICAL ADVISOR BRIEFING:\n\n1. Target Breakdown: Divide "${objective || 'Study Target'}" into 25-minute high-yield operational sprints.\n2. Zero Distractions: Mute external communications, prepare hydration, and maintain focus lock.\n3. Active Recall Protocol: After every 15 minutes, test your memory without looking at notes.`,
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are the Tactical AI Study Advisor in ELITE FOCUS, a high-octane gamified study hub. 
Speak like a tactical military commander and master learning strategist. 
Current Objective: "${objective || 'General Focus Session'}".
User Prompt: "${prompt}".
Provide concise, high-octane tactical advice formatted in scannable bullet points.`,
      });

      res.json({ advice: response.text });
    } catch (err) {
      console.error("Gemini Advisor Error:", err);
      res.json({
        advice: `TACTICAL ADVISOR BRIEFING:\n\n1. SPRINT PROTOCOL: Execute 25-minute high-intensity focus cycles.\n2. ACTIVE RECALL: Test yourself immediately after completing a topic.\n3. HYDRATION & RECOVERY: Utilize 5-minute tactical breaks to sustain peak cognitive output.`,
      });
    }
  });

  // Vite middleware for development vs static serve for production
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
    console.log(`Elite Focus server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
