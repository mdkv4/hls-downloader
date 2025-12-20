#!/usr/bin/env node

import { rmSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '..');

// Directories to remove
const dirsToRemove = ['dist', 'dist-mv2', 'dist-mv3'];

// Remove directories
for (const dir of dirsToRemove) {
  const dirPath = join(rootDir, dir);
  try {
    rmSync(dirPath, { recursive: true, force: true });
    console.log(`Removed: ${dir}`);
  } catch (err) {
    // Directory might not exist, which is fine
  }
}

// Remove extension archives
const files = readdirSync(rootDir);
const extensionFiles = files.filter(f =>
  f.startsWith('extension-') && (f.endsWith('.zip') || f.endsWith('.xpi'))
);

for (const file of extensionFiles) {
  try {
    rmSync(join(rootDir, file), { force: true });
    console.log(`Removed: ${file}`);
  } catch (err) {
    // File might not exist, which is fine
  }
}

// Create dist directory
try {
  mkdirSync(join(rootDir, 'dist'), { recursive: true });
  console.log('Created: dist');
} catch (err) {
  console.error('Failed to create dist directory:', err);
  process.exit(1);
}
