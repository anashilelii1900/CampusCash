const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const original = content;
            
            // Primary Gold -> Primary Indigo (Indigo 500)
            content = content.replace(/#C6A75E/gi, '#6366f1');
            
            // Dark Gold / Hover -> Dark Indigo (Indigo 600)
            content = content.replace(/#B39650/gi, '#4f46e5');
            
            // Light Gold / Highlight -> Violet/Purple (Violet 500)
            content = content.replace(/#D4AF37/gi, '#8b5cf6');
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

const targetDir = path.join(__dirname, 'src');
console.log(`Starting replacement in: ${targetDir}`);
replaceInDir(targetDir);
console.log('Replacement complete.');
