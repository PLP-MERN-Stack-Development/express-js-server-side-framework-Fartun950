function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;
  const missing = [];
  if (!name) missing.push('name');
  if (!description) missing.push('description');
  if (price === undefined || price === null) missing.push('price');
  if (!category) missing.push('category');
  if (missing.length) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}.` });
  }
  if (typeof price !== 'number') {
    return res.status(400).json({ message: 'Price must be a number.' });
  }
  if (inStock !== undefined && typeof inStock !== 'boolean') {
    return res.status(400).json({ message: 'inStock must be boolean.' });
  }
  next();
}
module.exports = { validateProduct };
