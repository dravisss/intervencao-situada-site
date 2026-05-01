const { spawn } = require('child_process');
const path = require('path');

const siteDir = path.resolve(__dirname, '..');
const rootDir = path.resolve(__dirname, '..', '..');

// 1. Run the watcher
const watcher = spawn('npx', ['nodemon', '--watch', rootDir, '--ext', 'md,js,css', '--ignore', 'site/', '--exec', 'node build.js'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
});

// 2. Run the server
const server = spawn('npx', ['serve', siteDir], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
});

console.log('👀 Watching for Markdown changes and 🌐 Serving site at http://localhost:3000');

// Handle exit
process.on('SIGINT', () => {
    watcher.kill();
    server.kill();
    process.exit();
});