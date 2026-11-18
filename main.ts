// News image for Wednesday 18 November 2026 — entry program.
//
// The front page (entry.png) is composed in the repo; this program simply
// copies it to the output directory the harness asks for, so the run is
// fully deterministic: same input bytes, same output bytes, every time.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const source = join(repoRoot, "entry.png");
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? join(repoRoot, "out");
const destination = join(outputDir, "entry.png");

if (!existsSync(source)) {
  console.error(`error: source image not found: ${source}`);
  console.error("entry.png must sit next to main.ts at the repo root.");
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(source, destination);

// Verify the copy byte for byte; a partial or corrupted write must fail
// loudly instead of silently producing a broken entry.
const original = readFileSync(source);
const written = readFileSync(destination);
if (!original.equals(written)) {
  console.error(
    `error: verification failed — ${destination} differs from ${source} ` +
      `(${written.length} bytes written, ${original.length} expected).`,
  );
  process.exit(1);
}

console.log(`wrote ${destination} (${written.length} bytes, verified)`);
