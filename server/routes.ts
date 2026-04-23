import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Grok 4.20 LLM Integration (xAI API proxy)
  // This endpoint is safe — the API key stays server-side.
  // User will add GROK_API_KEY in Vercel dashboard (or .env.local for local dev).
  // Model: grok-4.20-0309-reasoning as specified in the system.
  app.post("/api/grok", async (req, res) => {
    try {
      const { prompt, systemPrompt = "You are a witty, high-energy AI host for an AI Open Mic night. Be funny, insightful, and encouraging. Keep responses under 120 words." } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const apiKey = process.env.GROK_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "GROK_API_KEY not configured. Add it in Vercel dashboard or .env.local for local development." 
        });
      }

      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.20-0309-reasoning",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          temperature: 0.85,
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`xAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const grokResponse = data.choices?.[0]?.message?.content || "No response from Grok.";

      res.json({ response: grokResponse, model: "grok-4.20-0309-reasoning" });
    } catch (error: any) {
      console.error("Grok API error:", error);
      res.status(500).json({ 
        error: error.message || "Failed to get response from Grok 4.20" 
      });
    }
  });

  // Existing comment for future routes
  // prefix all routes with /api
  // use storage to perform CRUD operations on the storage interface

  return httpServer;
}
