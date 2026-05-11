const fs = require('fs');
const files = [
  'src/pages/Register.tsx',
  'src/pages/Login.tsx',
  'src/pages/Dashboard.tsx',
  'src/components/ListingReviewCard.tsx',
  'src/components/DraftsGrid.tsx'
];
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\`\$\{API_URL\}\/([^']+)'/g, '\`\$\{API_URL\}/$1\`');
  fs.writeFileSync(file, content);
});
console.log('Fixed quotes in files.');
