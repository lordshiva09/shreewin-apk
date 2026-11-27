'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const DATA_PATH = path.join(ROOT_DIR, 'shreewin_data.json');
const SEED_PATH = path.join(ROOT_DIR, 'cloudflare', 'seed-data.json');

const STATIC_FILES = ['index.html', 'admin.html', 'app.js', 'app.css'];
const STATIC_DIRS = ['assets', 'at.alicdn.com', 'ossimg'];

function copyDirClean(srcDir, dstDir) {
  fs.mkdirSync(dstDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name.includes('.bak')) continue;
    const src = path.join(srcDir, entry.name);
    const dst = path.join(dstDir, entry.name);
    if (entry.isDirectory()) {
      copyDirClean(src, dst);
    } else if (entry.isFile()) {
      fs.copyFileSync(src, dst);
    }
  }
}

function build() {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
  fs.mkdirSync(DIST_DIR, { recursive: true });

  for (const file of STATIC_FILES) {
    const src = path.join(ROOT_DIR, file);
    if (!fs.existsSync(src)) {
      throw new Error('Missing required static file: ' + file);
    }
    fs.copyFileSync(src, path.join(DIST_DIR, file));
  }

  for (const dir of STATIC_DIRS) {
    const src = path.join(ROOT_DIR, dir);
    if (fs.existsSync(src)) {
      copyDirClean(src, path.join(DIST_DIR, dir));
    }
  }

  fs.mkdirSync(path.dirname(SEED_PATH), { recursive: true });
  if (fs.existsSync(DATA_PATH)) {
    const parsed = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    const seed = {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
      wingo: parsed.wingo || { period: 20261114001, duration: 30, forcedOutcome: null, history: [], bets: [] },
      dailyPromotion: parsed.dailyPromotion || null,
      promotionHistory: Array.isArray(parsed.promotionHistory) ? parsed.promotionHistory : []
    };
    fs.writeFileSync(SEED_PATH, JSON.stringify(seed, null, 2), 'utf8');
  } else if (!fs.existsSync(SEED_PATH)) {
    throw new Error('Missing shreewin_data.json and cloudflare/seed-data.json');
  }

  console.log('Cloudflare build ready in', DIST_DIR);
}

build();
