const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');

const collectJsFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'logs') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectJsFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }

  return files;
};

const files = collectJsFiles(root);
const failures = [];

for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  if (result.status !== 0) {
    failures.push({ file, output: result.stderr.toString() || result.stdout.toString() });
  }
}

if (failures.length) {
  // eslint-disable-next-line no-console
  console.error(`Syntax check failed in ${failures.length} file(s).`);
  failures.forEach((failure) => {
    // eslint-disable-next-line no-console
    console.error(`\n${failure.file}\n${failure.output}`);
  });
  process.exit(1);
}

// eslint-disable-next-line no-console
console.log(`Syntax check passed for ${files.length} file(s).`);
