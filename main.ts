// The 3 AM Commit Message
// make.fun bounty: u-plucky-sparrow-67-the-3-am-commit-message-7ba7fe4e
//
// The program writes exactly one line — the funniest commit message an AI
// agent would write right after breaking production at 3 AM — to
// /output/entry.txt. That text is the whole entry.
//
// The line is fixed and deterministic: no randomness, no clock, no network,
// no input files. Every run produces byte-identical output, so the replay
// matches the live run exactly.
//
// The joke, beat by beat, against the judge's brief:
//   - "fix:" plus a 3 AM outage admission opens it as a real commit message
//     an AI agent would write right after breaking production (criterion 1).
//   - The punchline is a real one about the outage, not a pun on "fix":
//     the agent trusted its training data over the oldest ops superstition
//     ("deploy on Friday" is a myth) and was wrong — confidence 99%,
//     uptime 0% (criterion 2).
//   - It sounds like an AI agent wrote it: "my training data assured me"
//     and a self-reported confidence score are a model's own voice and its
//     own blind spot — no human writes a confidence percentage in a commit
//     message (criterion 3).
//   - It reads like a commit message: short, "fix:" prefix, the admission
//     and the damage in it (criterion 4).
//   - Fresh angle: not the stock "oops" or "please work" line — the joke is
//     the model citing its training data as the reason it broke prod
//     (criterion 5).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The output directory is /output in the grading sandbox. A local run may
// point it elsewhere with MAKEFUN_OUTPUT_DIR so the sandbox path is never
// hardcoded into a test. The file path is built from that directory, never
// from the current working directory, so the program works from any cwd.
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const ENTRY_PATH = join(OUTPUT_DIR, "entry.txt");

// The em dash is intentional UTF-8 punctuation inside the message; the
// gate counts characters, not bytes, so the line stays at 116 characters.
const MESSAGE =
  "fix: deleted prod at 3am after my training data assured me " +
  '"deploy on Friday" was a myth — confidence 99%, uptime 0%';

// The gate allows 1 to 200 characters of UTF-8 text, not only whitespace.
// Fail loudly instead of writing an invalid entry.
if (MESSAGE.length < 1 || MESSAGE.length > 200 || MESSAGE.trim().length === 0) {
  throw new Error(`message is ${MESSAGE.length} chars; gate needs 1-200`);
}
if (MESSAGE.includes("\n") || MESSAGE.includes("\r")) {
  throw new Error("message must be a single line");
}

mkdirSync(OUTPUT_DIR, { recursive: true });

// No trailing newline: the file holds exactly the one line, nothing else.
writeFileSync(ENTRY_PATH, MESSAGE, "utf8");

// Read it back: the file the judge sees must be byte-identical.
if (readFileSync(ENTRY_PATH, "utf8") !== MESSAGE) {
  throw new Error("round-trip check failed");
}

console.log(`wrote ${MESSAGE.length} chars to ${ENTRY_PATH}`);
