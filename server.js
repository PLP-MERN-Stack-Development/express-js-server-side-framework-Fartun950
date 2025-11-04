require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('./middleware/logger');
const productRoutes = require('./routes/products');
const { errorHandler } = require('./errors/CustomErrors');

app.use(express.json());
app.use(logger);

app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Products API');
});

// global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
