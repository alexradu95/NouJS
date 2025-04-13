// examples/todo-app/server.ts - Main server for the Todo app example

import { serve } from "https://deno.land/std@0.220.1/http/server.ts";
import { serveDir } from "https://deno.land/std@0.220.1/http/file_server.ts";
import { apiRoutes } from './routes/api.ts';
import { pageRoutes } from './routes/pages.ts';

const port = 8000;

// Create and start the server
await serve(async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname;

  // Handle static assets from the todo app
  if (path.startsWith("/static/")) {
    const response = await serveDir(req, {
      fsRoot: "./examples/todo-app",
      urlRoot: "",
    });
    return response;
  }

  // Handle NouJS framework client files
  if (path.startsWith("/noujs/")) {
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

console.log(`Todo app server running on http://localhost:${port}`); 