// noujs/web/view.ts - View utilities for rendering HTML

/**
 * Options for the layout rendering
 */
export interface LayoutOptions {
  title: string;
  stylesheets?: string[];
  scripts?: string[];
  meta?: Record<string, string>;
}

/**
 * Default layout rendering function
 * @param content The main content HTML
 * @param options Layout rendering options
 * @returns Complete HTML document
 */
export function renderLayout(content: string, options: LayoutOptions): string {
  const { 
    title, 
    stylesheets = [],
    scripts = [],
    meta = {}
  } = options;

  // Generate meta tags
  const metaTags = Object.entries(meta)
    .map(([name, content]) => `<meta name="${name}" content="${content}">`)
    .join('\n    ');

  // Generate stylesheet links
  const styleLinks = stylesheets
    .map(href => `<link rel="stylesheet" href="${href}">`)
    .join('\n    ');

  // Generate script tags
  const scriptTags = scripts
    .map(src => `<script type="module" src="${src}"></script>`)
    .join('\n    ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${metaTags}
    <title>${title}</title>
    ${styleLinks}
</head>
<body>
    ${content}
    
    ${scriptTags}
</body>
</html>`;
} 