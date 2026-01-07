import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../../mmaxence.github.io/content/Library/Books');
const targetDir = path.join(__dirname, '../src/content/library');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Only migrate review files
const files = fs.readdirSync(sourceDir)
  .filter(file => file.endsWith('-review.md'));

files.forEach(file => {
  const sourceFile = path.join(sourceDir, file);
  const targetFile = path.join(targetDir, file);
  
  let content = fs.readFileSync(sourceFile, 'utf-8');
  
  // Fix image paths if needed
  content = content.replace(/\/images\//g, '/images/');
  
  fs.writeFileSync(targetFile, content, 'utf-8');
  console.log(`Migrated: ${file}`);
});

console.log(`✅ Migrated ${files.length} library books`);

