const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src/app', function(filePath) {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Remaining text-white opacities that make it invisible
    content = content.replace(/text-white\/[0-9]\b/g, 'text-white/60');
    content = content.replace(/text-white\/1[0-9]\b/g, 'text-white/60');
    content = content.replace(/text-white\/2[0-9]\b/g, 'text-white/70');
    // Ensure headings aren't black
    content = content.replace(/\bfont-black\b/g, 'font-bold');
    content = content.replace(/\bfont-extrabold\b/g, 'font-bold');
    content = content.replace(/\btext-\[?[6789]px\]?\b/g, 'text-sm');
    content = content.replace(/\buppercase\b/g, '');
    
    // Some texts are mapped explicitly with string uppercase like {title.toUpperCase()}
    content = content.replace(/\.toUpperCase\(\)/g, '');

    // Replace color specific tracking/opacity
    content = content.replace(/text-(purple|indigo|cyan|emerald|blue|slate)-[456]00\/[12]0/g, 'text-$1-400');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
