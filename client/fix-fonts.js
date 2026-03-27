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

    // Convert extreme heavy fonts to standard professional weights
    content = content.replace(/\bfont-black\b/g, 'font-semibold');
    content = content.replace(/\bfont-extrabold\b/g, 'font-bold');
    
    // Remove all-caps sci-fi styling
    content = content.replace(/\buppercase\b/g, '');
    
    // Remove wide letter spacing
    content = content.replace(/\btracking-widest\b/g, '');
    content = content.replace(/\btracking-\[0\.[2-4]em\]\b/g, '');
    
    // Clean up multiple spaces that might result from removal
    content = content.replace(/\s{2,}(?=[a-zA-Z-0-9]+=["])/g, ' '); // Clean spaces inside classNames roughly
    content = content.replace(/className="\s+/g, 'className="');
    content = content.replace(/\s+"/g, '"');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
