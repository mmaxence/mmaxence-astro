import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogDir = path.join(__dirname, '../src/content/blog');

// Fix image paths in markdown files
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  const slug = path.basename(file, '.md');
  
  // Fix image paths in markdown content
  // Pattern: ![...](/blog/posts/...)
  content = content.replace(
    /!\[([^\]]*)\]\(\/blog\/posts\/([^)]+)\)/g,
    (match, alt, imgPath) => {
      // Extract just the filename
      const filename = path.basename(imgPath);
      return `![${alt}](/blog/${slug}/${filename})`;
    }
  );
  
  // Fix images/blog/posts/... paths
  content = content.replace(
    /!\[([^\]]*)\]\(\/images\/blog\/posts\/([^)]+)\)/g,
    (match, alt, imgPath) => {
      const filename = path.basename(imgPath);
      return `![${alt}](/blog/${slug}/${filename})`;
    }
  );
  
  // Fix featured_image paths in frontmatter
  if (content.includes('featured_image:')) {
    content = content.replace(
      /featured_image:\s*"\/blog\/posts\/([^"]+)"/g,
      (match, imgPath) => {
        const filename = path.basename(imgPath);
        return `featured_image: "/blog/${slug}/${filename}"`;
      }
    );
    
    // Fix /images/blog/posts/... in frontmatter
    content = content.replace(
      /featured_image:\s*"\/images\/blog\/posts\/([^"]+)"/g,
      (match, imgPath) => {
        const filename = path.basename(imgPath);
        return `featured_image: "/blog/${slug}/${filename}"`;
      }
    );
  }
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Fixed: ${file}`);
});

console.log('Image paths fixed!');

