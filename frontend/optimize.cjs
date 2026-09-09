const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            
            // Replace all .jpeg" with the optimized query parameters
            // Only replace if it doesn't already have parameters
            content = content.replace(/\.jpeg"/g, '.jpeg?auto=compress&cs=tinysrgb&w=800"');
            content = content.replace(/\.jpeg\?auto=compress&cs=tinysrgb&w=800\?auto=compress&cs=tinysrgb&w=800"/g, '.jpeg?auto=compress&cs=tinysrgb&w=800"');
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log('Optimized images in: ' + fullPath);
            }
        }
    }
}
replaceInDir(path.join(__dirname, 'src'));
