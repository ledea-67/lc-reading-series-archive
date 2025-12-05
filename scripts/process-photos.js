#!/usr/bin/env node
/**
 * Photo Processing Script for Lewis & Clark College Reading Series Archive
 *
 * Downloads author photos from source URLs, resizes them to standard dimensions,
 * converts to WebP format, and updates the writers-sample.json with local paths.
 *
 * Usage: npm run process-photos
 *
 * Options:
 *   --dry-run    Show what would be processed without downloading
 *   --force      Re-download all photos even if they exist locally
 *   --writer=id  Process only a specific writer by ID
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Configuration
const CONFIG = {
  writersFile: path.join(PROJECT_ROOT, 'initial-data', 'writers-sample.json'),
  outputDir: path.join(PROJECT_ROOT, 'public', 'images', 'writers'),

  // Photo dimensions (4:5 portrait ratio)
  width: 400,
  height: 500,

  // Output format
  format: 'webp',
  quality: 85,

  // Request settings
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  timeout: 30000,
};

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const force = args.includes('--force');
const writerArg = args.find(arg => arg.startsWith('--writer='));
const specificWriter = writerArg ? writerArg.split('=')[1] : null;

/**
 * Download an image from a URL
 */
async function downloadImage(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': CONFIG.userAgent,
    },
    signal: AbortSignal.timeout(CONFIG.timeout),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType?.startsWith('image/')) {
    throw new Error(`Not an image: ${contentType}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

/**
 * Process an image: resize, crop to fit, convert to WebP
 */
async function processImage(buffer) {
  return sharp(buffer)
    .resize(CONFIG.width, CONFIG.height, {
      fit: 'cover',
      position: 'top', // Focus on face (usually top of image)
    })
    .webp({ quality: CONFIG.quality })
    .toBuffer();
}

/**
 * Get the direct image URL from a photo object
 * Uses imageUrl if available, otherwise falls back to url
 */
function getDirectImageUrl(photo) {
  // Prefer the direct imageUrl field
  if (photo.imageUrl) {
    return photo.imageUrl;
  }

  // Fall back to url if it looks like a direct image link
  if (photo.url && /\.(jpg|jpeg|png|gif|webp)($|\?)/i.test(photo.url)) {
    return photo.url;
  }

  // Wikimedia Commons - convert page URL to direct image URL
  if (photo.url && photo.url.includes('commons.wikimedia.org/wiki/File:')) {
    const filename = photo.url.split('File:')[1];
    return `https://upload.wikimedia.org/wikipedia/commons/thumb/${filename.charAt(0).toLowerCase()}/${filename.substring(0, 2).toLowerCase()}/${filename}/800px-${filename}`;
  }

  return null;
}

/**
 * Process a single writer's photo
 */
async function processWriter(writer, index, total) {
  const { id, name, photo } = writer;
  const outputPath = path.join(CONFIG.outputDir, `${id}.webp`);
  const localPath = `writers/${id}.webp`;

  console.log(`\n[${index + 1}/${total}] ${name} (${id})`);

  // Skip if no photo data
  if (!photo) {
    console.log('  ⚠ No photo data');
    return { status: 'skipped', reason: 'no_photo_data' };
  }

  // Skip if photo not available
  if (photo.status !== 'available') {
    console.log(`  ⚠ Photo status: ${photo.status}`);
    return { status: 'skipped', reason: photo.status };
  }

  // Skip if no URL
  if (!photo.url) {
    console.log('  ⚠ No photo URL');
    return { status: 'skipped', reason: 'no_url' };
  }

  // Check if already processed
  if (!force) {
    try {
      await fs.access(outputPath);
      console.log('  ✓ Already processed (use --force to re-download)');
      return { status: 'exists', localPath };
    } catch {
      // File doesn't exist, proceed with download
    }
  }

  if (dryRun) {
    const imageUrl = getDirectImageUrl(photo);
    if (!imageUrl) {
      console.log(`  ⚠ No direct image URL available (only page URL: ${photo.url})`);
      return { status: 'skipped', reason: 'no_direct_url' };
    }
    console.log(`  → Would download from: ${imageUrl}`);
    console.log(`  → Would save to: ${outputPath}`);
    return { status: 'dry_run', localPath };
  }

  try {
    const imageUrl = getDirectImageUrl(photo);

    if (!imageUrl) {
      console.log(`  ⚠ No direct image URL available (only page URL: ${photo.url})`);
      return { status: 'skipped', reason: 'no_direct_url' };
    }

    console.log(`  ↓ Downloading from ${photo.source}...`);

    const imageBuffer = await downloadImage(imageUrl);
    console.log(`  ⚙ Processing (${CONFIG.width}×${CONFIG.height}, WebP)...`);

    const processedBuffer = await processImage(imageBuffer);

    await fs.writeFile(outputPath, processedBuffer);
    console.log(`  ✓ Saved: ${outputPath}`);

    return { status: 'processed', localPath };
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}`);
    return { status: 'error', error: error.message };
  }
}

/**
 * Main processing function
 */
async function main() {
  console.log('========================================');
  console.log('Lewis & Clark Photo Processing Script');
  console.log('========================================');
  console.log(`Output: ${CONFIG.width}×${CONFIG.height}px WebP @ ${CONFIG.quality}%`);
  console.log(`Directory: ${CONFIG.outputDir}`);
  if (dryRun) console.log('Mode: DRY RUN (no files will be written)');
  if (force) console.log('Mode: FORCE (re-downloading all photos)');
  if (specificWriter) console.log(`Filter: Only processing ${specificWriter}`);

  // Ensure output directory exists
  await fs.mkdir(CONFIG.outputDir, { recursive: true });

  // Load writers data
  const writersData = JSON.parse(await fs.readFile(CONFIG.writersFile, 'utf-8'));
  let writers = writersData.writers;

  // Filter to specific writer if requested
  if (specificWriter) {
    writers = writers.filter(w => w.id === specificWriter);
    if (writers.length === 0) {
      console.error(`\nError: Writer "${specificWriter}" not found`);
      process.exit(1);
    }
  }

  // Filter to only writers with available photos
  const availableWriters = writers.filter(w => w.photo?.status === 'available');
  console.log(`\nFound ${availableWriters.length} writers with available photos`);

  // Process each writer
  const results = {
    processed: [],
    exists: [],
    skipped: [],
    errors: [],
  };

  for (let i = 0; i < availableWriters.length; i++) {
    const writer = availableWriters[i];
    const result = await processWriter(writer, i, availableWriters.length);

    if (result.status === 'processed' || result.status === 'dry_run') {
      results.processed.push({ id: writer.id, ...result });
    } else if (result.status === 'exists') {
      results.exists.push({ id: writer.id, ...result });
    } else if (result.status === 'error') {
      results.errors.push({ id: writer.id, ...result });
    } else {
      results.skipped.push({ id: writer.id, ...result });
    }
  }

  // Update writers-sample.json with local paths (if not dry run)
  if (!dryRun && results.processed.length > 0) {
    console.log('\n\nUpdating writers-sample.json with local paths...');

    for (const writer of writersData.writers) {
      const processedResult = results.processed.find(r => r.id === writer.id);
      const existsResult = results.exists.find(r => r.id === writer.id);

      if (processedResult?.localPath || existsResult?.localPath) {
        writer.photo.localPath = processedResult?.localPath || existsResult?.localPath;
      }
    }

    await fs.writeFile(CONFIG.writersFile, JSON.stringify(writersData, null, 2) + '\n');
    console.log('✓ Updated writers-sample.json');
  }

  // Summary
  console.log('\n========================================');
  console.log('Summary');
  console.log('========================================');
  console.log(`Processed: ${results.processed.length}`);
  console.log(`Already existed: ${results.exists.length}`);
  console.log(`Skipped: ${results.skipped.length}`);
  console.log(`Errors: ${results.errors.length}`);

  if (results.errors.length > 0) {
    console.log('\nErrors:');
    for (const err of results.errors) {
      console.log(`  - ${err.id}: ${err.error}`);
    }
  }

  if (results.skipped.length > 0) {
    console.log('\nWriters skipped (no direct image URL):');
    for (const skip of results.skipped.filter(s => s.reason === 'no_direct_url')) {
      console.log(`  - ${skip.id}`);
    }
    console.log('\nTo fix: Add imageUrl field to these writers in writers-sample.json');
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
