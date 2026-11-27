// The Oz Ledger — hand-in program (Node 22, standard library only).
//
// The site is plain static files under app/: index.html plus its own CSS and
// ES modules, no build step, nothing loaded over the network. This program
// hands it in: it copies app/ and screenshots/ from beside this file into
// the output directory and writes dossier.json there, the summary the judge
// reads, using the vendored make.fun library. vendor/makefun-frontend.ts is
// the kit's copy and must not be changed — the scorer rebuilds the dossier
// with its own copy and compares the two byte for byte.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader, /output stands in for MAKEFUN_OUTPUT_DIR.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

// Directory this file lives in; everything it hands in sits beside it.
const here = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outDir, { recursive: true });

// The whole site, as-is.
cpSync(join(here, "app"), join(outDir, "app"), { recursive: true });

// The screenshots, when they exist. (They must: the gate wants 3 or 4.)
mkdirSync(join(outDir, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(outDir, "screenshots"), { recursive: true });
}

// The dossier, with the gate's own limits baked in: at most 4 screenshots of
// at most 256 KiB each, app/ at most 993 files and directories and 16 MiB,
// and the dossier text capped at 160 KiB. An entry past any of these is one
// the scorer would refuse, so refusing here first is the honest behaviour.
writeFileSync(
  join(outDir, "dossier.json"),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
