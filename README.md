
# Express Products API (Final)

This is a cleaned, submission-ready Express.js RESTful API for products. Authentication removed for easier testing.
Run with Node 18+.

## Install
```
npm install
```

## Run
```
npm start
```
Server runs on port 3000 by default or the PORT env var.

## Endpoints
- GET /api/products
- GET /api/products/:id
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id
- GET /api/products/stats/categories

Data is stored in `routes/products.json` (simple file storage for assignment).

## Testing
Use the included `api_test.rest` file with VS Code REST Client, or Postman.

