import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../../mmaxence.github.io/content/Timeline/posts');
const targetDir = path.join(__dirname, '../src/content/timeline');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const posts = fs.readdirSync(sourceDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

posts.forEach(postDir => {
  const sourceFile = path.join(sourceDir, postDir, 'index.md');
  if (fs.existsSync(sourceFile)) {
    let content = fs.readFileSync(sourceFile, 'utf-8');
    
    // Convert slug from directory name
    const slug = postDir.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const targetFile = path.join(targetDir, `${slug}.md`);
    
    fs.writeFileSync(targetFile, content, 'utf-8');
    console.log(`Migrated: ${postDir} -> ${slug}.md`);
  }
});

console.log(`✅ Migrated ${posts.length} timeline posts`);

