// server.ts - Main server entry point for Deno application
import { serve } from "https://deno.land/std@0.220.1/http/server.ts";
import { serveDir } from "https://deno.land/std@0.220.1/http/file_server.ts";
import { apiRoutes } from "./routes/api.ts";
import { pageRoutes } from "./routes/pages.ts";

const port = 8000;

console.log(`Starting server on port ${port}`);

await serve(async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname;

  // Handle static assets
  if (path.startsWith("/static/")) {
    const response = await serveDir(req, {
      fsRoot: ".",
      urlRoot: "",
    });
    return response;
  }

  // Handle API routes
  if (path.startsWith("/api/")) {
    return await apiRoutes(req);
  }

  // Handle page routes
  return await pageRoutes(req);
}, { port });