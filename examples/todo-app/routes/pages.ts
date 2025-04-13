// examples/todo-app/routes/pages.ts - Handles main page routes for the todo app

import { renderLayout } from '../../../noujs/web/view.ts';
import { renderHomePage } from '../views/home.ts';

export async function pageRoutes(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  // Home page
  if (path === "/" || path === "/index.html") {
    const content = renderHomePage();
    
    return new Response(renderLayout(content, {
      title: 'Todo App - NouJS Example',
      stylesheets: ['/static/css/styles.css'],
      scripts: [
        '/static/js/action-components.js',
        '/static/js/app.js'
      ]
    }), {
      headers: { "Content-Type": "text/html" },
    });
  }

  // 404 page
  return new Response("Not Found", {
    status: 404,
    headers: { "Content-Type": "text/plain" },
  });
} 