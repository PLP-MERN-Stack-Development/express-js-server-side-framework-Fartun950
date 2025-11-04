const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { validateProduct } = require('../middleware/validators');
const { AppError } = require('../errors/CustomErrors');

const dataPath = path.join(__dirname, 'products.json');

function loadProducts() {
  try {
    const raw = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}
function saveProducts(products) {
  fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
}

router.get('/', (req, res) => {
  const { category, search, page = 1, limit = 10 } = req.query;
  let products = loadProducts();

  if (category) {
    products = products.filter(p => (p.category || '').toLowerCase() === String(category).toLowerCase());
  }
  if (search) {
    products = products.filter(p => (p.name || '').toLowerCase().includes(String(search).toLowerCase()));
  }

  const pageNum = Math.max(1, parseInt(page) || 1);
  const lim = Math.max(1, parseInt(limit) || 10);
  const start = (pageNum - 1) * lim;
  const paginated = products.slice(start, start + lim);

  res.json({ total: products.length, page: pageNum, limit: lim, data: paginated });
});

router.get('/:id', (req, res, next) => {
  const products = loadProducts();
  const p = products.find(x => x.id === req.params.id);
  if (!p) return next(new AppError('Product not found', 404));
  res.json(p);
});

router.post('/', validateProduct, (req, res) => {
  const products = loadProducts();
  const newProd = {
    id: Date.now().toString(),
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    inStock: req.body.inStock === undefined ? true : req.body.inStock
  };
  products.push(newProd);
  saveProducts(products);
  res.status(201).json({ message: 'Product created successfully', product: newProd });
});

router.put('/:id', validateProduct, (req, res, next) => {
  const products = loadProducts();
  const idx = products.findIndex(x => x.id === req.params.id);
  if (idx === -1) return next(new AppError('Product not found', 404));
  products[idx] = { ...products[idx], name: req.body.name, description: req.body.description, price: req.body.price, category: req.body.category, inStock: req.body.inStock };
  saveProducts(products);
  res.json({ message: 'Product updated successfully', product: products[idx] });
});

router.delete('/:id', (req, res, next) => {
  const products = loadProducts();
  const idx = products.findIndex(x => x.id === req.params.id);
  if (idx === -1) return next(new AppError('Product not found', 404));
  const deleted = products.splice(idx, 1)[0];
  saveProducts(products);
  res.json({ message: 'Product deleted successfully', product: deleted });
});

router.get('/stats/categories', (req, res) => {
  const products = loadProducts();
  const counts = products.reduce((acc, p) => {
    const c = p.category || 'uncategorized';
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});
  res.json({ total: products.length, counts });
});

module.exports = router;
