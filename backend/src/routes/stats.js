const express = require('express');
const fs = require('fs').promises; 
const path = require('path');
const router = express.Router();

const DATA_PATH = path.join(__dirname, '../../data/items.json');
// We watch the directory where items.json lives for changes
const WATCH_DIR_PATH = path.join(__dirname, '../../data'); 

// In-memory cache storage
let cachedStats = null;
let lastCalculated = null;

// --- Utility Functions ---

async function readData() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    throw error;
  }
}

async function calculateAndCacheStats() {
  try {
    const items = await readData();

    const total = items.length;
    let averagePrice = 0;

    if (total > 0) {
      const totalPrice = items.reduce((acc, cur) => acc + (cur.price || 0), 0);
      averagePrice = totalPrice / total;
    }

    // Update the global cache
    cachedStats = {
      total: total,
      averagePrice: parseFloat(averagePrice.toFixed(2)), 
      cachedAt: new Date().toISOString()
    };
    lastCalculated = Date.now();
    console.log(`Stats cached successfully at ${cachedStats.cachedAt}`);

  } catch (error) {
    console.error('Failed to calculate or cache statistics:', error);
    cachedStats = null;
  }
}

calculateAndCacheStats();


// Introduce file watching for real-time cache invalidation
// When items.json changes (via POST to /api/items), the cache is automatically updated.
try {
    // using require('fs').watch 
    const watcher = require('fs').watch(WATCH_DIR_PATH, (eventType, filename) => {
        if (filename === 'items.json') {
            setTimeout(() => {
                console.log(`File change detected (${eventType} on ${filename}). Recalculating stats...`);
                calculateAndCacheStats();
            }, 100); 
        }
    });

    watcher.on('error', (err) => {
        console.error('FS Watcher Error: Stats will not update automatically on file change.', err);
    });

} catch (e) {
    console.error(`Could not start file watcher. Stats will only be calculated on startup. Error: ${e.message}`);
}


// GET /api/stats
router.get('/', (req, res, next) => {
  if (cachedStats) {
    res.json(cachedStats);
  } else {
    calculateAndCacheStats().then(() => {
        if (cachedStats) {
            res.json(cachedStats);
        } else {
            const err = new Error('Statistics calculation failed or data file is unavailable.');
            err.status = 500;
            next(err);
        }
    }).catch(next);
  }
});

module.exports = router;
