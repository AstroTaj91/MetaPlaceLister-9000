const fs = require('fs');
const path = require('path');
const files = [
  'src/pages/Register.tsx',
  'src/pages/Login.tsx',
  'src/pages/Dashboard.tsx',
  'src/components/ListingReviewCard.tsx',
  'src/components/FacebookConnectModal.tsx',
  'src/components/DraftsGrid.tsx'
];
const apiUrlStr = "const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';\n";

files.forEach(file => {
  const p = path.join(__dirname, file);
  let content = fs.readFileSync(p, 'utf8');
  
  if (!content.includes('const API_URL =')) {
    // Insert after imports
    const lines = content.split('\n');
    let lastImportIndex = -1;
    for(let i=0; i<lines.length; i++) {
      if(lines[i].startsWith('import ')) {
        lastImportIndex = i;
      }
    }
    lines.splice(lastImportIndex + 1, 0, '\n' + apiUrlStr);
    content = lines.join('\n');
  }

  content = content.replace(/'http:\/\/localhost:3000\//g, '`${API_URL}/');
  fs.writeFileSync(p, content);
});
console.log('Replaced localhost with VITE_API_URL in all files.');
