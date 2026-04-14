# 🛍 ShopEase — MERN E-Commerce App

A full-stack e-commerce application built with MongoDB, Express, React, and Node.js.

---

## ✨ Features

### Customer
- Browse & search products with category filters
- Product detail page with reviews & ratings
- Add to cart, update quantities, remove items
- Checkout with shipping address form
- Stripe payment integration (demo mode)
- Order tracking & history
- User profile with address management

### Admin Panel
- Dashboard with revenue stats & sales chart
- Full product CRUD (create, edit, delete)
- Order management with status updates
- User management (make admin, delete)

---

## 🗂 Project Structure

```
mern-ecommerce/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── controllers/    # Business logic
│   ├── middleware/     # Auth middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routes
│   ├── seed.js         # Sample data seeder
│   ├── server.js       # Entry point
│   └── .env.example
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/ # Navbar, Footer, ProductCard, AdminLayout
│       ├── context/    # AuthContext, CartContext
│       ├── pages/      # All pages + admin pages
│       └── utils/      # Axios API helper
└── package.json        # Root scripts
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free) OR local MongoDB

### Step 1 — Clone & Install

```bash
# Install root, backend and frontend dependencies
npm run install-all
```

### Step 2 — Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/ecommerce
JWT_SECRET=your_secret_key_here_make_it_long
STRIPE_SECRET_KEY=sk_test_your_stripe_key
CLIENT_URL=http://localhost:3000
```

> **MongoDB Atlas (free):** Go to mongodb.com → Create cluster → Connect → Get connection string

### Step 3 — Configure Frontend

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

### Step 4 — Seed the Database

```bash
npm run seed
```

This creates 12 sample products and 2 users:
| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@ecommerce.com    | admin123  |
| User  | john@example.com       | user123   |

### Step 5 — Run the App

```bash
# Run backend and frontend together
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## 🌐 Deployment

### Backend — Render (Free)
1. Push to GitHub
2. Go to render.com → New Web Service
3. Connect your repo → Set root dir to `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add all environment variables from `.env`

### Frontend — Vercel (Free)
1. Go to vercel.com → Import project
2. Set root dir to `frontend`
3. Add env variable: `REACT_APP_API_URL=https://your-render-url.onrender.com/api`
4. Deploy!

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint           | Access  |
|--------|--------------------|---------|
| POST   | /api/auth/register | Public  |
| POST   | /api/auth/login    | Public  |
| GET    | /api/auth/profile  | Private |
| PUT    | /api/auth/profile  | Private |

### Products
| Method | Endpoint                  | Access  |
|--------|---------------------------|---------|
| GET    | /api/products             | Public  |
| GET    | /api/products/:id         | Public  |
| GET    | /api/products/featured    | Public  |
| GET    | /api/products/categories  | Public  |
| POST   | /api/products/:id/reviews | Private |
| POST   | /api/products             | Admin   |
| PUT    | /api/products/:id         | Admin   |
| DELETE | /api/products/:id         | Admin   |

### Orders
| Method | Endpoint               | Access  |
|--------|------------------------|---------|
| POST   | /api/orders            | Private |
| GET    | /api/orders/myorders   | Private |
| GET    | /api/orders/:id        | Private |
| PUT    | /api/orders/:id/pay    | Private |
| GET    | /api/orders            | Admin   |
| PUT    | /api/orders/:id/status | Admin   |

### Admin
| Method | Endpoint                        | Access |
|--------|---------------------------------|--------|
| GET    | /api/admin/dashboard            | Admin  |
| GET    | /api/admin/users                | Admin  |
| DELETE | /api/admin/users/:id            | Admin  |
| PUT    | /api/admin/users/:id/toggle-admin | Admin |

---

## 🛠 Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, React Router v6, Context API |
| Styling  | Plain CSS (no framework)            |
| Backend  | Node.js, Express.js                 |
| Database | MongoDB with Mongoose               |
| Auth     | JWT (JSON Web Tokens) + bcryptjs    |
| Payments | Stripe API                          |
| HTTP     | Axios                               |
| Notifications | React Toastify                |

## 📄 License
MIT — Free to use for personal and commercial projects.
