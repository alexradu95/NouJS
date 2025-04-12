// views/layout.ts - Main layout template for the application

export function renderLayout(content: string, title: string): string {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Deno Web Standards App</title>
    <link rel="stylesheet" href="/static/css/styles.css">
  </head>
  <body>
    <header>
      <h1>Deno + Web Standards</h1>
      <nav>
        <a href="/">Home</a>
      </nav>
    </header>
    
    <main>
      ${content}
    </main>
    
    <footer>
      <p>Built with Deno and Action Web Components</p>
    </footer>
  
    <!-- Load Action Web Components definitions -->
    <script type="module" src="/static/js/action-components.js"></script>
    <!-- Load application code -->
    <script type="module" src="/static/js/app.js"></script>
  </body>
  </html>`;
  }