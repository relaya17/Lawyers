import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const repoRoot = process.cwd();
const baselinePath = path.join(repoRoot, '.eslint-baseline.json');

function readBaseline() {
  const raw = fs.readFileSync(baselinePath, 'utf8');
  return JSON.parse(raw);
}

function runEslintJson(args) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'eslint-report-'));
  const outFile = path.join(tmpDir, 'report.json');

  // Avoid stdout buffering limits (ENOBUFS) by writing the JSON report to disk.
  execFileSync('pnpm', ['exec', 'eslint', ...args, '--format', 'json', '--output-file', outFile], {
    stdio: ['ignore', 'inherit', 'inherit'],
    windowsHide: true,
  });

  const raw = fs.readFileSync(outFile, 'utf8');
  const cleaned = raw.replace(/^\uFEFF/, '');
  return JSON.parse(cleaned);
}

function countWarnings(report) {
  let warnings = 0;
  for (const file of report) warnings += file.warningCount || 0;
  return warnings;
}

function main() {
  const args = process.argv.slice(2);
  const update = args.includes('--update');

  if (!fs.existsSync(baselinePath)) {
    console.error(`Missing baseline file: ${baselinePath}`);
    process.exit(2);
  }

  const baseline = readBaseline();
  const coreGlobs = baseline.coreGlobs || [];

  const overallReport = runEslintJson(['.', '--ext', 'ts,tsx', '--report-unused-disable-directives']);
  const coreReport = runEslintJson([...coreGlobs, '--report-unused-disable-directives']);

  const overallWarnings = countWarnings(overallReport);
  const coreWarnings = countWarnings(coreReport);

  if (update) {
    const next = {
      ...baseline,
      overallWarnings,
      coreWarnings,
    };
    fs.writeFileSync(baselinePath, JSON.stringify(next, null, 2) + '\n', 'utf8');
    console.log(`Updated baseline: overall=${overallWarnings}, core=${coreWarnings}`);
    return;
  }

  const overallOk = overallWarnings <= baseline.overallWarnings;
  const coreOk = coreWarnings <= baseline.coreWarnings;

  console.log(`ESLint warnings: overall=${overallWarnings} (baseline=${baseline.overallWarnings}), core=${coreWarnings} (baseline=${baseline.coreWarnings})`);

  if (!overallOk || !coreOk) {
    console.error('Lint regression detected: warnings increased above baseline. Run `pnpm run lint:fix`, then `pnpm run lint:baseline:update` if the increase is intentional.');
    process.exit(1);
  }
}

main();


