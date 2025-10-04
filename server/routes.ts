import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import fetch from "node-fetch";
import FormData from "form-data";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.post("/api/restore", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const formData = new FormData();
      formData.append("file", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);

      try {
        const response = await fetch(`${PYTHON_API_URL}/api/restore`, {
          method: "POST",
          body: formData as any,
          headers: formData.getHeaders(),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errorText = await response.text().catch(() => response.statusText);
          console.error("Python API error:", errorText);
          return res.status(response.status).json({ 
            error: "Photo processing failed", 
            details: errorText 
          });
        }

        const imageBuffer = await response.buffer();
        res.set("Content-Type", "image/jpeg");
        res.set("Content-Disposition", `attachment; filename="restored_${req.file.originalname}"`);
        res.send(imageBuffer);
      } catch (fetchError: any) {
        clearTimeout(timeout);
        if (fetchError.name === 'AbortError') {
          return res.status(504).json({ error: "Processing timeout - image may be too large" });
        }
        if (fetchError.code === 'ECONNREFUSED') {
          return res.status(503).json({ error: "AI service unavailable - please ensure Python API is running" });
        }
        throw fetchError;
      }
    } catch (error: any) {
      console.error("Error processing image:", error);
      res.status(500).json({ 
        error: "Failed to process image",
        message: error.message 
      });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy" });
  });

  const httpServer = createServer(app);

  return httpServer;
}
