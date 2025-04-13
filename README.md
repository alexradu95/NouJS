# NouJS Framework

NouJS is a lightweight web framework for Deno that leverages Action Web Components and modern web standards to create interactive web applications with minimal JavaScript.

## Project Structure

The NouJS project is organized into two main parts:

### 1. Core Framework (`noujs/`)

The framework code is located in the `noujs/` directory and organized as follows:

- `noujs/core/` - Core framework functionality and base classes
- `noujs/web/` - Web server utilities for handling HTTP requests
- `noujs/utils/` - Utility functions for common tasks
- `noujs/components/` - Server-side Action Web Component definitions
- `noujs/client/` - Client-side Action Web Component implementations
  - `noujs/client/bundle.js` - Ready-to-use bundled version of all client components

### 2. Example Application (`examples/todo-app/`)

A todo application that demonstrates how to use the NouJS framework:

- `examples/todo-app/server.ts` - Server entry point
- `examples/todo-app/routes/` - API and page route handlers
- `examples/todo-app/views/` - UI components and templates
- `examples/todo-app/static/` - Static assets (CSS, JS)

## Running the Todo Example

```
deno run --allow-net --allow-read examples/todo-app/server.ts
```

Then visit http://localhost:8000 in your browser.

## Building the Framework

To create a production-ready bundle of the client-side components:

```
deno run --allow-read --allow-write noujs/build.js
```

This will create a `dist/` directory with minified client assets that can be deployed.

## Using NouJS in Your Project

### Server-Side

```typescript
// Import NouJS framework
import { createServer, html } from './noujs/index.ts';

// Create a server
await createServer({
  port: 8000,
  pageRouteHandler: (req) => {
    // Your route handling logic
  }
});
```

### Client-Side

Include the client-side bundle in your HTML:

```html
<script type="module" src="/noujs/client/bundle.js"></script>
```

Or in production:

```html
<script type="module" src="/static/js/noujs.min.js"></script>
```

## Action Web Components

NouJS uses custom elements called "Action Web Components" that declaratively add interactivity to web pages. These components handle operations like:

- Dynamic content swapping (`<ac-swap>`)
- UI animations and transitions (`<ac-yellow-fade>`)
- Form handling (`<ac-fetch>`)
- Event management (`<ac-trigger>`)

These components are designed to work well with server-rendered HTML, reducing the need for complex client-side frameworks.

## License

MIT 