const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'site');
const targetDir = 'F:\\第三方登录(二维码)\\third-party-app\\public\\vant-wx';

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`Source directory does not exist: ${src}`);
    process.exit(1);
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
    console.log(`Created directory: ${dest}`);
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  entries.forEach((entry) => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

function removeRecursive(dir) {
  if (fs.existsSync(dir)) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach((entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        removeRecursive(entryPath);
      } else {
        fs.unlinkSync(entryPath);
      }
    });
    fs.rmdirSync(dir);
  }
}

console.log('Building site...');

try {
  execSync('vant-cli build-site', { stdio: 'inherit' });
  console.log('Site built successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}

console.log(`\nCopying files from ${sourceDir} to ${targetDir}...`);

try {
  if (fs.existsSync(targetDir)) {
    const entries = fs.readdirSync(targetDir, { withFileTypes: true });
    entries.forEach((entry) => {
      const entryPath = path.join(targetDir, entry.name);
      if (entry.isDirectory()) {
        removeRecursive(entryPath);
      } else {
        fs.unlinkSync(entryPath);
      }
    });
    console.log('Cleared target directory');
  }

  copyRecursive(sourceDir, targetDir);
  console.log(`Files copied successfully to ${targetDir}`);
} catch (error) {
  console.error('Copy failed:', error.message);
  process.exit(1);
}
