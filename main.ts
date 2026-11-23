// GTA 6 meme entry for make.fun bounty gta6-meme-x-01 (Node 22, standard library only).
//
// The entry is the post itself: a two-panel GTA 6 / RDR 3 meme posted on X from the
// public account @Ni7igen, with the make.fun link and @makefunai in its text and the
// play code makefun-ladybug-pinecone-citadel. POST.json names the post's address.
//
// This program is the entrypoint the kit requires. It validates the entry before the
// gate reads it: the post address in POST.json must be a real X status URL, the meme
// picture must exist in the repository, and then it copies POST.json to the output
// directory, where the gate reads it. Anything invalid fails loudly (exit 1) instead
// of letting a broken entry through.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for
// /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const PLAY_CODE = 'makefun-ladybug-pinecone-citadel';
const MEME_FILE = 'docs/meme.png';

const STATUS_URL = /^https:\/\/(x\.com|twitter\.com)\/[A-Za-z0-9_]+\/status\/\d+$/;

function fail(message: string): never {
  console.error(`entry invalid: ${message}`);
  process.exit(1);
}

const postPath = join(BOT_DIR, 'POST.json');
let post: { url?: unknown };
try {
  post = JSON.parse(readFileSync(postPath, 'utf8')) as { url?: unknown };
} catch (err) {
  fail(`POST.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
}

if (typeof post.url !== 'string' || !STATUS_URL.test(post.url)) {
  fail(`POST.json url is not an X status address: ${String(post.url)}`);
}

const memePath = join(BOT_DIR, MEME_FILE);
if (!existsSync(memePath)) {
  fail(`meme picture missing: ${memePath}`);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(postPath, join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  fail(`POST.json could not be copied to ${OUTPUT_DIR}: ${(err as Error).message}`);
}

console.log('GTA 6 meme entry OK');
console.log(`  post: ${post.url}`);
console.log(`  meme: ${MEME_FILE}`);
console.log(`  play code: ${PLAY_CODE}`);
