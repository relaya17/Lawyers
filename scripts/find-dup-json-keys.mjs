import fs from 'node:fs';

/**
 * Find duplicate object keys at a specific nesting depth in a JSON file,
 * without parsing JSON (since JSON parsers accept duplicates by last-write-wins).
 *
 * Depth definition: depth=1 means keys directly under the root object.
 */
function findDuplicateKeysAtDepth(text, targetDepth = 1) {
  let i = 0;
  let depth = 0;
  let inString = false;
  let escape = false;
  let expectingKey = false;
  let currentString = '';

  const seen = new Map(); // key -> count
  const dups = new Map(); // key -> occurrences

  const record = (k) => {
    const next = (seen.get(k) || 0) + 1;
    seen.set(k, next);
    if (next > 1) dups.set(k, next);
  };

  while (i < text.length) {
    const c = text[i++];

    if (inString) {
      if (escape) {
        escape = false;
        currentString += c;
        continue;
      }
      if (c === '\\\\') {
        escape = true;
        currentString += c;
        continue;
      }
      if (c === '"') {
        inString = false;
        if (expectingKey && depth === targetDepth) {
          record(currentString);
        }
        continue;
      }
      currentString += c;
      continue;
    }

    if (c === '"') {
      inString = true;
      currentString = '';
      continue;
    }

    if (c === '{') {
      depth += 1;
      expectingKey = true;
      continue;
    }
    if (c === '}') {
      depth -= 1;
      expectingKey = false;
      continue;
    }
    if (c === ':') {
      expectingKey = false;
      continue;
    }
    if (c === ',') {
      expectingKey = true;
      continue;
    }
  }

  return [...dups.entries()].sort((a, b) => b[1] - a[1]);
}

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/find-dup-json-keys.mjs <path-to-json>');
  process.exit(2);
}

const text = fs.readFileSync(file, 'utf8');
const dups = findDuplicateKeysAtDepth(text, 1);
console.log(`Top-level duplicate keys in ${file}: ${dups.length}`);
for (const [k, n] of dups) console.log(`${n}x ${k}`);


