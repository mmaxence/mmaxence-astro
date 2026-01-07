import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hugoBlogDir = path.join(__dirname, '../../mmaxence.github.io/content/blog/posts');
const astroBlogDir = path.join(__dirname, '../src/content/blog');

// Create blog directory if it doesn't exist
if (!fs.existsSync(astroBlogDir)) {
  fs.mkdirSync(astroBlogDir, { recursive: true });
}

// Function to get slug from directory name
function getSlug(dirName) {
  return dirName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Function to migrate a single blog post
function migratePost(postDir) {
  const indexMd = path.join(postDir, 'index.md');
  const otherMd = fs.readdirSync(postDir).find(f => f.endsWith('.md') && f !== 'index.md');
  const mdFile = fs.existsSync(indexMd) ? indexMd : (otherMd ? path.join(postDir, otherMd) : null);
  
  if (!mdFile || !fs.existsSync(mdFile)) {
    console.log(`Skipping ${postDir}: No markdown file found`);
    return;
  }
  
  const content = fs.readFileSync(mdFile, 'utf-8');
  const dirName = path.basename(postDir);
  const slug = getSlug(dirName);
  
  // Write to Astro content directory
  const outputPath = path.join(astroBlogDir, `${slug}.md`);
  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(`Migrated: ${slug}`);
}

// Get all blog post directories
const postDirs = fs.readdirSync(hugoBlogDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => path.join(hugoBlogDir, dirent.name));

// Migrate all posts
postDirs.forEach(migratePost);

console.log(`\nMigration complete! Migrated ${postDirs.length} blog posts.`);

