// routes/pages.ts - Handles main page routes
import { renderLayout } from "../views/layout.ts";
import { renderHomePage } from "../views/home.ts";

export async function pageRoutes(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  // Home page
  if (path === "/" || path === "/index.html") {
    const content = renderHomePage();
    return new Response(renderLayout(content, "Home"), {
      headers: { "Content-Type": "text/html" },
    });
  }

  // 404 page
  return new Response("Not Found", {
    status: 404,
    headers: { "Content-Type": "text/plain" },
  });
}