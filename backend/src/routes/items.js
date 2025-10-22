const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Utility to read data
async function readData() {
  try{
    const raw = await fs.readFile(DATA_PATH);
    return JSON.parse(raw);
  }catch(error){
    throw error
  }
}

// utility to write file
async function writeData(data){
  await fs.writeFile(DATA_PATH,JSON.stringify(data,null,2));
}

// GET /api/items
router.get('/', async(req, res, next) => {
  try {
    const data = await readData();
    const { _page, _limit, q } = req.query; 

    let filteredResults = data;
    if (q) {
      const queryLower = q.toLowerCase();
      filteredResults = data.filter(item => 
        item.name.toLowerCase().includes(queryLower) ||
        (item.category && item.category.toLowerCase().includes(queryLower))
      );
    }
    
    const totalCount = filteredResults.length;

    let paginatedResults = filteredResults;
    
    const page = parseInt(_page) || 1;
    const limit = parseInt(_limit) || 10;
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    paginatedResults = filteredResults.slice(startIndex, endIndex);

    res.setHeader('X-Total-Count', totalCount);
    
    res.json(paginatedResults);

  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async(req, res, next) => {
  try {
    const data =await readData();
    const item = data.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async(req, res, next) => {
  try {
    const item = req.body;
    const data =await readData();
    
    const maxId = data.reduce((max, i) => (i.id > max ? i.id : max), 0);
    item.id = maxId + 1;

    data.push(item);
    await writeData(data)
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;