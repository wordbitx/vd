#!/usr/bin/env node
/**
 * Fails the build if any /images/... path referenced in src/ is missing from public/.
 * Run: node scripts/check-images.mjs
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const root = process.cwd();
const srcDir = join(root, "src");
const publicDir = join(root, "public");

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, files);
    else if ([".ts", ".tsx", ".md"].includes(extname(entry))) files.push(full);
  }
  return files;
}

const referenced = new Set();
for (const file of walk(srcDir)) {
  const text = readFileSync(file, "utf8");
  for (const match of text.matchAll(/["'`](\/images\/[A-Za-z0-9._/-]+)["'`]/g)) referenced.add(match[1]);
}

const missing = [...referenced].filter((path) => {
  try {
    return !statSync(join(publicDir, path.replace(/^\//, ""))).isFile();
  } catch {
    return true;
  }
});

if (missing.length) {
  console.error(`\n✖ ${missing.length} referenced image(s) are missing from public/:\n`);
  for (const path of missing.sort()) console.error(`   ${path}`);
  process.exit(1);
}

console.log(`✓ all ${referenced.size} referenced images exist in public/`);
