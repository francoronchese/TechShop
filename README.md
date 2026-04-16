# TechShop 🛒

**Live Demo:** [https://tech-shop-hp5c.vercel.app/](https://tech-shop-hp5c.vercel.app/)

A full-stack ecommerce platform for high-end technology products, built with a modern React frontend and a Node.js/Express backend.

---

## Description

TechShop is a fully functional ecommerce application that allows users to browse products by category, manage a shopping cart, place orders, and pay via **Stripe** or **Cash on Delivery**. It includes a complete admin panel for managing products, categories, orders, and users, as well as a role-based permission system with **User**, **Admin**, and **SuperAdmin** roles.

---

## Motivation

This project was built to demonstrate a production-ready full-stack application with real-world features including:

- Secure cookie-based authentication with access and refresh tokens
- Stripe payment integration with order confirmation emails sent automatically after successful payment
- Role-based access control across the entire app
- A fully responsive UI with persistent URL-based pagination and filters
- Admin panel with order management, user management, and inventory control

---

## Tech Stack

### Frontend
- **React** — UI library
- **Redux Toolkit + RTK Query** — global state management and data fetching
- **React Router** — client-side routing
- **Tailwind CSS** — styling
- **Stripe.js** — payment integration
- **Cloudinary** — image storage
- **react-helmet-async** — dynamic page titles and meta tags
- **react-hot-toast** — notifications

### Backend
- **Node.js + Express** — REST API
- **MongoDB + Mongoose** — database
- **JWT** — access and refresh token authentication
- **Stripe** — payment processing
- **Nodemailer** — transactional emails
- **Helmet + CORS** — security
- **express-rate-limit** — rate limiting on sensitive endpoints

---

## Features

### Customer
- Browse products by category and subcategory
- Search products with live dropdown suggestions
- Filter by price range, subcategory and sort order
- Add products to cart (persisted for guests in localStorage, synced on login)
- Save products to favorites
- Checkout with **Stripe** (online payment) or **Cash on Delivery**
- Receive an order confirmation email after successful Stripe payment
- View and track order history
- Manage saved addresses
- Edit profile, change password, and delete account

### Admin
- Full product, category and subcategory management (create, edit, delete)
- Product dashboard sorted by stock ascending to quickly identify low-stock items
- Image upload to Cloudinary
- View and manage all customer orders
- Update order status (pending → confirmed → shipped → delivered → cancelled)
- Stock automatically adjusted on order placement and cancellation
- View all registered users, update their status and role
- Customer info persisted on orders even after account deletion

### SuperAdmin
- All Admin permissions
- Change user roles (promote/demote Admins)
- Only the SuperAdmin can assign or remove Admin roles

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Stripe account

### 1. Clone the repository

```bash
git clone https://github.com/francoronchese/TechShop.git
cd TechShop
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env.development` file in the `server` folder:

```env
FRONTEND_URL=http://localhost:5173
PORT=8080
MAILER_HOST=smtp.gmail.com
MAILER_USER=your_email@gmail.com
MAILER_PASSWORD=your_app_password
SECRET_KEY_ACCESS_TOKEN=your_access_token_secret
SECRET_KEY_REFRESH_TOKEN=your_refresh_token_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
DB_PROTOCOL=mongodb+srv
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_OPTIONS=appName=your_app_name
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd client
npm install
```

Create a `.env.development` file in the `client` folder:

```env
VITE_CLOUDINARY_NAME=your_cloudinary_name
VITE_CLOUDINARY_PRESET_AVATARS=your_avatars_preset
VITE_CLOUDINARY_PRESET_CATEGORIES=your_categories_preset
VITE_CLOUDINARY_PRESET_PRODUCTS=your_products_preset

# Leave empty in development, Vite proxy handles API requests
VITE_API_URL=

VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

Start the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Usage

### As a customer
1. Register an account and verify your email
2. Browse products from the homepage or use the search bar
3. Add products to your cart and proceed to checkout
4. Choose between **Stripe** (test card: `4242 4242 4242 4242`) or **Cash on Delivery**
5. Track your orders from the dashboard

### As an admin
1. Register an account normally through the app. To grant Admin role, a SuperAdmin must assign it from the Users panel
2. Log in and access the admin panel from the dashboard sidebar
3. Manage products, categories, subcategories, orders and users

### As a SuperAdmin
1. Set your account role to `SuperAdmin` directly in MongoDB — this only needs to be done once for the first SuperAdmin
2. From the Users panel, assign or remove Admin roles to other users
3. All admin features are available plus full role management


---

## Project Structure

```
techshop/
├── client/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── config/          # API endpoints configuration
│   │   ├── features/        # Auth and Dashboard feature modules
│   │   ├── helpers/         # Cloudinary upload helper
│   │   ├── hooks/           # Custom hooks (cart, favorites)
│   │   ├── layouts/         # Header, Footer, MobileMenu
│   │   ├── pages/           # Page components
│   │   ├── routes/          # Protected and Public route wrappers
│   │   ├── store/           # Redux store, slices and RTK Query API
│   │   ├── utils/           # Helper utilities
│   │   ├── App.jsx          # Main application setup
│   │   ├── index.css        # Global styles and fonts
│   │   └── main.jsx         # App entry and providers
│   └── vite.config.js       # Vite configuration
│
└── server/
    ├── config/              # Database connection
    ├── controllers/         # Route controllers
    ├── middlewares/         # Auth, admin, rate limit middlewares
    ├── models/              # Mongoose models
    ├── routes/              # Express routers
    ├── services/            # Email service
    ├── utils/               # Async handler, token generators, email templates
    ├── vercel.json          # Vercel deployment config
    └── index.js             # Server entry point
```

---

## License

This project is for portfolio purposes only.
