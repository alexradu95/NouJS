# NouJS Framework Testing and Integration Rules

## Component Organization Rules

1. **Framework Component Placement**
   - Server-side TypeScript definitions go in `/noujs/components/`
   - Client-side JavaScript implementations go in `/noujs/client/actions/`
   - Always update the bundled version in `/noujs/client/bundle.js` when adding new components

2. **Import Path Handling**
   - In browser contexts, use absolute paths starting with `/noujs/` (e.g., `/noujs/client/bundle.js`)
   - In server-side Deno code, use relative imports (e.g., `../../noujs/web/view.ts`)
   - Ignore TypeScript errors for browser imports in `.js` files

## Testing Procedure

1. **Server Initialization Test**
   ```bash
   deno run --allow-net --allow-read examples/todo-app/server.ts
   ```
   - Verify server starts without errors
   - Confirm listening on expected port (8000)

2. **Static Asset Accessibility**
   - Test framework bundle:
     ```bash
     curl http://localhost:8000/noujs/client/bundle.js -I
     ```
   - Test example app assets:
     ```bash
     curl http://localhost:8000/static/js/app.js -I
     ```
   - Both should return HTTP 200 status

3. **HTML Rendering**
   - Verify scripts are included in the rendered HTML:
     ```bash
     curl http://localhost:8000 | grep "<script"
     ```
   - Should show both action-components.js and app.js

4. **API Functionality**
   - Test data retrieval:
     ```bash
     curl http://localhost:8000/api/todos?format=json
     ```
   - Verify response contains expected todo items

5. **Component Registration**
   - Verify in browser console that "NouJS components loaded" and "NouJS components registered" messages appear
   - Test each component by triggering relevant actions in the UI

## Production Bundling

1. **Build Process**
   ```bash
   deno run --allow-read --allow-write noujs/build.js
   ```
   - Verify `/dist/js/noujs.min.js` is created
   - Test by updating HTML to use the production bundle instead

## Error Resolution Guide

1. **Import Path Errors**
   - Browser imports like `import '/noujs/client/bundle.js'` will show linter errors in Deno
   - These can be safely ignored as they're resolved by the browser at runtime
   - For production, verify all paths resolve correctly when deployed

2. **Server Path Configuration**
   - The server must have route handlers for both `/static/` and `/noujs/` paths
   - Each path should be served from the correct directory using `serveDir` 