import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_DIR = 'FOTOS PARA CATALOGO Y CATALOGO';
const OUTPUT_DIR = path.join('src', 'assets', 'catalogo');
const MAX_SIZE = 1600;
const QUALITY = 80;
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg']);

const categoryCounters = new Map();
const usedNames = new Map();

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' y ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function isWhatsappImage(fileName) {
  return /^whatsapp image/i.test(fileName);
}

function nextSequentialName(categorySlug) {
  const next = (categoryCounters.get(categorySlug) ?? 0) + 1;
  categoryCounters.set(categorySlug, next);
  return `${categorySlug}-${String(next).padStart(2, '0')}`;
}

function uniqueName(categorySlug, baseName) {
  const key = categorySlug;
  const seen = usedNames.get(key) ?? new Set();
  let name = baseName || 'imagen';
  let candidate = name;
  let index = 2;

  while (seen.has(candidate)) {
    candidate = `${name}-${index}`;
    index += 1;
  }

  seen.add(candidate);
  usedNames.set(key, seen);
  return candidate;
}

async function walkImages(dir, files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await walkImages(fullPath, files);
      continue;
    }

    if (!entry.isFile()) continue;

    const ext = path.extname(entry.name).toLowerCase();
    if (IMAGE_EXTENSIONS.has(ext)) {
      files.push(fullPath);
    }
  }

  return files;
}

function getOutputPath(sourcePath) {
  const relativePath = path.relative(SOURCE_DIR, sourcePath);
  const parts = relativePath.split(path.sep);
  const fileName = parts.at(-1);
  const isRootFile = parts.length === 1;
  const categoryName = isRootFile ? 'varios' : parts[0];
  const categorySlug = slugify(categoryName) || 'varios';
  const sourceBaseName = path.basename(fileName, path.extname(fileName));
  const baseSlug = isWhatsappImage(fileName)
    ? nextSequentialName(categorySlug)
    : slugify(sourceBaseName);
  const fileSlug = uniqueName(categorySlug, baseSlug);

  return {
    categorySlug,
    outputPath: path.join(OUTPUT_DIR, categorySlug, `${fileSlug}.webp`),
  };
}

async function convertImage(sourcePath) {
  const { outputPath } = getOutputPath(sourcePath);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  await sharp(sourcePath)
    .rotate()
    .resize({
      width: MAX_SIZE,
      height: MAX_SIZE,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: QUALITY })
    .toFile(outputPath);

  return outputPath;
}

async function getTotalSize(paths) {
  let total = 0;

  for (const filePath of paths) {
    const stat = await fs.stat(filePath);
    total += stat.size;
  }

  return total;
}

function formatMb(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

const sourceImages = (await walkImages(SOURCE_DIR)).sort((a, b) =>
  a.localeCompare(b, 'es', { sensitivity: 'base' }),
);

await fs.rm(OUTPUT_DIR, { recursive: true, force: true });

const outputImages = [];
for (const sourceImage of sourceImages) {
  outputImages.push(await convertImage(sourceImage));
}

const before = await getTotalSize(sourceImages);
const after = await getTotalSize(outputImages);

console.log(`Converted ${outputImages.length} images`);
console.log(`Source: ${SOURCE_DIR}`);
console.log(`Output: ${OUTPUT_DIR}`);
console.log(`Before: ${formatMb(before)}`);
console.log(`After: ${formatMb(after)}`);
