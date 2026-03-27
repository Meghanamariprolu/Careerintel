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

    // Fix dull text globally
    content = content.replace(/text-white\/40/g, 'text-white/70');
    content = content.replace(/text-white\/60/g, 'text-white/90');
    content = content.replace(/text-white\/50/g, 'text-white/80');
    content = content.replace(/text-white\/30/g, 'text-white/60');
    
    // For the specific dashboard page tools grid fixes
    if (filePath.includes('dashboard\\page.jsx') || filePath.includes('dashboard/page.jsx')) {
        // Make the cards themselves brighter and more modern
        content = content.replace(
            /<button className="w-full aspect-square flex flex-col items-center justify-center gap-1.5 bg-white\/\[0.01\] border border-white\/5 rounded-lg hover:bg-white\/\[0.03\] hover:border-indigo-500\/10 transition-all duration-300 group p-1.5 shadow-xl">/g,
            '<button className="w-full aspect-square flex flex-col items-center justify-center gap-2.5 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.06] hover:border-white/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group p-3 shadow-lg">'
        );
        
        // Make the icons larger and brighter
        content = content.replace(
            /<div className={`p-2 rounded-lg \$\{tool.bg\} border border-white\/5 transition-transform duration-500 group-hover:scale-105 shadow-xl`}>/g,
            '<div className={`p-3 rounded-xl ${tool.bg} border border-white/10 transition-transform duration-500 group-hover:scale-110 shadow-xl`}>'
        );
        content = content.replace(
            /<tool\.icon className={`h-3\.5 w-3\.5 \$\{tool.color\}`} \/>/g,
            '<tool.icon className={`h-5 w-5 ${tool.color}`} />'
        );
        
        // Make the text bigger and brighter
        content = content.replace(
            /<span className="text-\[10px\] font-semibold text-white\/90 group-hover:text-indigo-400 text-center leading-tight w-full break-words px-1">\{tool\.name\}<\/span>/g,
            '<span className="text-[13px] font-bold text-white/90 group-hover:text-white text-center leading-snug w-full break-words px-2">{tool.name}</span>'
        );

        // Generate Node card
        content = content.replace(
            /<button className="w-full aspect-square flex flex-col items-center justify-center gap-1.5 bg-indigo-500\/\[0.02\] border border-indigo-500\/10 rounded-lg hover:bg-indigo-500\/5 transition-all duration-300 group p-1.5 shadow-xl">/g,
            '<button className="w-full aspect-square flex flex-col items-center justify-center gap-2.5 bg-indigo-500/[0.05] border border-indigo-500/20 rounded-xl hover:bg-indigo-500/[0.1] hover:border-indigo-400/30 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 group p-3">'
        );
        content = content.replace(
            /<div className="p-2 rounded-lg bg-indigo-500\/10 border border-indigo-500\/10 transition-transform duration-500 group-hover:scale-105 shadow-xl">/g,
            '<div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30 transition-transform duration-500 group-hover:scale-110 shadow-xl">'
        );
        content = content.replace(
            /<Compass className="h-3\.5 w-3\.5 text-indigo-400\/50" \/>/g,
            '<Compass className="h-5 w-5 text-indigo-400" />'
        );
        content = content.replace(
            /<span className="text-\[10px\] font-semibold text-indigo-400\/50 text-center leading-tight px-1">GENERATE NODE<\/span>/g,
            '<span className="text-[13px] font-bold text-indigo-400 text-center leading-snug px-1">GENERATE NODE</span>'
        );
    }
    
    // Also change the global font family definition to rely simply on standard 'Inter' for that extremely clean look
    if (filePath.includes('layout.jsx') && !filePath.includes('dashboard')) {
        content = content.replace(
            /className={`\$\{plusJakartaSans\.variable\} font-sans flex flex-col min-h-screen antialiased`}/g,
            'className={`font-sans flex flex-col min-h-screen antialiased`}' // Fallback to globals.css standard Inter
        );
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
