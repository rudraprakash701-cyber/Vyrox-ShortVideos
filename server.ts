import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import http from "http";
import fs from "fs";

dotenv.config();

async function startServer() {
  try {
    const app = express();
    const server = http.createServer(app);
    const PORT = 3000;

    app.use(express.json());

    // Gemini Setup
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || "",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    // API Routes
    app.get("/api/health", (req, res) => {
      res.json({ status: "ok", timestamp: new Date().toISOString() });
    });

    // AI Caption/Hashtag Generator
    app.post("/api/ai/generate-metadata", async (req, res) => {
      try {
        const { description, musicContext } = req.body;
        const prompt = `Generate a catchy viral caption and 5 trending hashtags for a short video described as: "${description}". ${musicContext ? `The video features the song: ${musicContext}.` : ''} Return as JSON with "caption" and "hashtags" (array) keys.`;
        
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });
        res.json(JSON.parse(response.text || "{}"));
      } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({ error: "Failed to generate metadata" });
      }
    });

    // WebSocket for Real-time Messaging
    const wss = new WebSocketServer({ server, path: '/ws' });
    wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === 1) {
            client.send(message.toString());
          }
        });
      });
    });

    // Vite middleware for development
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      
      app.get('*', async (req, res, next) => {
        const url = req.originalUrl;
        if (url.startsWith('/api') || url.startsWith('/ws')) return next();
        
        try {
          let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          next(e);
        }
      });
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      const clientDistPath = path.join(distPath, 'client'); // Vite build --outDir dist/client might be used or just dist
      
      // Check if dist/client or dist exists
      const effectiveDist = fs.existsSync(clientDistPath) ? clientDistPath : distPath;
      
      app.use(express.static(effectiveDist));
      app.get('*', (req, res) => {
        const indexPath = path.join(effectiveDist, 'index.html');
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).send('Application not built yet. Please wait...');
        }
      });
    }

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Critical Server Error during startup:", error);
    process.exit(1);
  }
}

startServer();
