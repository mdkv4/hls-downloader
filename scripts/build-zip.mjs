#!/usr/bin/env node

import { createWriteStream } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '..');

// Parse arguments
const distDir = process.env.DIST_DIR || 'dist';
const zipBasename = process.env.ZIP_BASENAME || 'extension';
const makeFirefox = process.env.MAKE_FIREFOX !== 'false';

const distPath = join(rootDir, distDir);

/**
 * Create a ZIP archive using the archiver library
 * This ensures cross-platform compatibility and proper Firefox XPI support
 */
async function createZipArchive(sourceDir, outputPath) {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    output.on('close', () => {
      console.log(`Created: ${relative(rootDir, outputPath)} (${archive.pointer()} bytes)`);
      resolve(true);
    });

    archive.on('error', (err) => {
      console.error(`Failed to create ${outputPath}:`, err.message);
      reject(err);
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn('Warning:', err.message);
      } else {
        reject(err);
      }
    });

    // Pipe archive data to the file
    archive.pipe(output);

    // Add all files from the source directory
    archive.directory(sourceDir, false);

    // Finalize the archive
    archive.finalize();
  });
}

async function main() {
  console.log(`Building archives from ${distDir}...`);

  try {
    // Create Chrome ZIP
    const chromeZip = join(rootDir, `${zipBasename}-chrome.zip`);
    await createZipArchive(distPath, chromeZip);

    // Create Firefox XPI if requested
    if (makeFirefox) {
      const firefoxXpi = join(rootDir, `${zipBasename}-firefox.xpi`);
      await createZipArchive(distPath, firefoxXpi);
    }

    console.log('Build archives created successfully!');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

main();
