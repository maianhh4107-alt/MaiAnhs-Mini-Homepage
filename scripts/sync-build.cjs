const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distSource = path.join(rootDir, 'artifacts', 'mai-anh-homepage', 'dist');

if (!fs.existsSync(distSource)) {
  console.error('Source dist folder does not exist at:', distSource);
  process.exit(1);
}

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Ensure dist/ in root
const rootDist = path.join(rootDir, 'dist');
copyDirSync(distSource, rootDist);

// 2. Ensure docs/ in root (for GitHub Pages branch /docs deploy option)
const rootDocs = path.join(rootDir, 'docs');
copyDirSync(distSource, rootDocs);

// 3. Ensure root index.html, 404.html, assets, favicon.svg (for GitHub Pages branch /root deploy option)
const indexSrc = path.join(distSource, 'index.html');
if (fs.existsSync(indexSrc)) {
  fs.copyFileSync(indexSrc, path.join(rootDir, 'index.html'));
  fs.copyFileSync(indexSrc, path.join(rootDir, '404.html'));
  fs.copyFileSync(indexSrc, path.join(rootDist, '404.html'));
  fs.copyFileSync(indexSrc, path.join(rootDocs, '404.html'));
}

const assetsSrc = path.join(distSource, 'assets');
if (fs.existsSync(assetsSrc)) {
  copyDirSync(assetsSrc, path.join(rootDir, 'assets'));
}

const faviconSrc = path.join(distSource, 'favicon.svg');
if (fs.existsSync(faviconSrc)) {
  fs.copyFileSync(faviconSrc, path.join(rootDir, 'favicon.svg'));
}

// 4. Create .nojekyll in dist, docs, and root to disable Jekyll processing on GitHub Pages
fs.writeFileSync(path.join(rootDir, '.nojekyll'), '');
fs.writeFileSync(path.join(rootDist, '.nojekyll'), '');
fs.writeFileSync(path.join(rootDocs, '.nojekyll'), '');

console.log('✓ Successfully synchronized build artifacts to dist/, docs/, and repository root.');
