import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Static routes to the API can be added here if needed
  // All Firebase operations will be done client-side

  const httpServer = createServer(app);

  return httpServer;
}
