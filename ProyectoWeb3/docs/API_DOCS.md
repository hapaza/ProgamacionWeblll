# API Documentation - Ignister

## Base URL
`http://localhost:5000/api/v1`

## Authentication
Bearer token required for protected endpoints.

## Endpoints

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/solo-lectura` - Guest mode

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products/:id/rate` - Rate product

### Orders
- `POST /orders` - Create custom order
- `GET /orders/my-orders` - Get user orders

### Admin
- `GET /admin/products` - Get all products (admin)
- `PUT /admin/products/:id` - Update product
- `GET /admin/orders` - Get all orders
- `PUT /admin/orders/:id` - Update order status