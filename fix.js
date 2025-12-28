const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fixed = content.replace(/\} & \{[^}]*\}\) \{/g, '}) {');
  fs.writeFileSync(filePath, fixed);
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.jsx')) {
      fixFile(filePath);
    }
  }
}

walkDir('.');
console.log('Fixed all .jsx files');