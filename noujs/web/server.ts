// noujs/web/server.ts - Server utilities for NouJS applications

import { serve } from "https://deno.land/std@0.220.1/http/server.ts";
import { serveDir } from "https://deno.land/std@0.220.1/http/file_server.ts";

/**
 * Configuration options for creating a NouJS server
 */
export interface ServerConfig {
  port: number;
  staticDir?: string;
  staticUrlPath?: string;
  apiRouteHandler?: (req: Request) => Promise<Response> | Response;
  pageRouteHandler?: (req: Request) => Promise<Response> | Response;
}

/**
 * Creates and starts a NouJS server
 * @param config Server configuration options
 */
export async function createServer(config: ServerConfig) {
  const { 
    port,
    staticDir = "static",
    staticUrlPath = "/static/",
    apiRouteHandler,
    pageRouteHandler
  } = config;

  console.log(`Starting NouJS server on port ${port}`);

  await serve(async (req: Request) => {
    const url = new URL(req.url);
    const path = url.pathname;

    // Handle static assets
    if (path.startsWith(staticUrlPath)) {
      const response = await serveDir(req, {
        fsRoot: staticDir,
        urlRoot: staticUrlPath,
      });
      return response;
    }

    // Handle API routes
    if (path.startsWith("/api/") && apiRouteHandler) {
      return await apiRouteHandler(req);
    }

    // Handle page routes
    if (pageRouteHandler) {
      return await pageRouteHandler(req);
    }

    // Default 404 response
    return new Response("Not Found", {
      status: 404,
      headers: { "Content-Type": "text/plain" },
    });
  }, { port });
} 