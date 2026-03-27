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

    // Remove all tracking modifiers that mess up the font appearance
    content = content.replace(/\btracking-(tighter|tight|normal|wide|wider|widest)\b/g, '');
    content = content.replace(/\btracking-\[([0-9a-zA-Z.-]+)\]\b/g, '');
    
    // Remove all uppercase modifiers that mess up the font appearance
    content = content.replace(/\buppercase\b/g, '');
    
    // Remove all lowercase or capitalize that might also look weird
    content = content.replace(/\bcapitalize\b/g, '');
    
    // Convert any remaining bizarre font sizes
    content = content.replace(/\btext-\[?[6789]px\]?\b/g, 'text-sm');
    content = content.replace(/\btext-\[1[0-1]px\]\b/g, 'text-sm');

    // Clean up spaces
    content = content.replace(/\s{2,}(?=[a-zA-Z-0-9]+=["])/g, ' '); 
    content = content.replace(/className="\s+/g, 'className="');
    content = content.replace(/\s+"/g, '"');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
