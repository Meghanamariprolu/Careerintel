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

    // Fix extreme text sizing
    content = content.replace(/text-\[6px\]/g, 'text-[10px]');
    content = content.replace(/text-\[7px\]/g, 'text-[10px]');
    content = content.replace(/text-\[8px\]/g, 'text-xs');
    content = content.replace(/text-\[9px\]/g, 'text-xs');
    content = content.replace(/text-\[10px\]/g, 'text-sm');

    // Fix extreme opacity
    content = content.replace(/text-white\/5\b/g, 'text-white/40');
    content = content.replace(/text-white\/10\b/g, 'text-white/60');
    content = content.replace(/text-white\/20\b/g, 'text-white/70');
    
    // Fix specific tool colors that are unreadable
    content = content.replace(/text-([a-z]+)-[45]00\/20\b/g, 'text-$1-400');
    content = content.replace(/text-([a-z]+)-[45]00\/30\b/g, 'text-$1-400');
    
    // For dashboard tools cards specifically text-[7px] text-white/10 became text-[10px] text-white/60 which is better.
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
