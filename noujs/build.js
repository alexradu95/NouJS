// noujs/build.js - Build script for NouJS framework
// Run with: deno run --allow-read --allow-write noujs/build.js

import { ensureDir } from "https://deno.land/std@0.220.1/fs/ensure_dir.ts";
import { copy } from "https://deno.land/std@0.220.1/fs/copy.ts";

async function buildNouJS() {
  console.log("Building NouJS framework...");
  
  // Ensure dist directory exists
  await ensureDir("./dist");
  await ensureDir("./dist/js");
  
  // Copy client files to dist
  await copy("./noujs/client/bundle.js", "./dist/js/noujs.min.js", { overwrite: true });
  
  console.log("Build complete. Files in ./dist directory:");
  console.log("- ./dist/js/noujs.min.js");
}

// Run the build
await buildNouJS(); 