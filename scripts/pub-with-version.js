const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const packagePath = path.join(__dirname, '..', 'package.json');
const changelogPath = path.join(__dirname, '..', 'VERSION_LOG.md');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

const { version } = pkg;
const [major, minor, patch] = version.split('.').map(Number);

let newVersion;
if (patch >= 10) {
  if (minor >= 10) {
    newVersion = `${major + 1}.0.0`;
  } else {
    newVersion = `${major}.${minor + 1}.0`;
  }
} else {
  newVersion = `${major}.${minor}.${patch + 1}`;
}

console.log(`Publishing version: ${version}`);
console.log(`Next version will be: ${newVersion}`);

rl.question('请输入升级说明: ', (note) => {
  rl.close();

  try {
    execSync('npm publish', { stdio: 'inherit' });

    pkg.version = newVersion;
    fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`Version updated to: ${newVersion}`);

    const logEntry = `## v${newVersion} - ${
      new Date().toISOString().split('T')[0]
    }\n- ${note}\n\n`;
    let existingLog = '';
    if (fs.existsSync(changelogPath)) {
      existingLog = fs.readFileSync(changelogPath, 'utf8');
    }
    fs.writeFileSync(changelogPath, logEntry + existingLog);
    console.log(`Version log updated: VERSION_LOG.md`);

    execSync(`git checkout -b v${newVersion}`, { stdio: 'inherit' });
    console.log(`Git branch created: v${newVersion}`);

    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "chore: release v${newVersion} - ${note}"`, {
      stdio: 'inherit',
    });
    console.log(`Git commit created: v${newVersion} - ${note}`);
  } catch (error) {
    console.error('Publish failed:', error.message);
    process.exit(1);
  }
});
