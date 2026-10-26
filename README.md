# AURA Commerce — Fullstack E-Commerce (React + Node.js + MySQL)

A secure, production-grade fullstack e-commerce web application built with **React 19**, **Node.js (Express)**, and **MySQL 8.0**.

---

## 🛡️ Security Protections Implemented

To protect against hackers, automated bot attacks, and data breaches, this application implements multi-layered security:

| Threat Vector | Security Defense Implemented |
|---|---|
| **SQL Injection (SQLi)** | **100% Parameterized Prepared Statements** (`?` placeholders via `mysql2`). User inputs are never directly concatenated into SQL queries. |
| **Brute-Force & Credential Stuffing** | **Rate Limiting** via `express-rate-limit`: Admin login endpoint is strictly throttled (maximum 8 attempts per 15 minutes). |
| **Denial of Service (DoS)** | General API rate limiting (300 req/15min) and strict payload body size limits (`1mb`). |
| **Password Theft** | **bcryptjs** with **12 salt rounds** to hash all passwords before database storage. Passwords are never stored in plaintext. |
| **Unauthorized Admin Access** | **Signed JSON Web Tokens (JWT)** with HMAC SHA-256 and 24-hour expiration. Protected admin endpoints verify the Bearer token on every request. |
| **Cross-Site Scripting (XSS)** | Input sanitization to strip dangerous HTML tags/scripts, plus React's built-in JSX escaping. |
| **HTTP Security Headers** | **Helmet** automatically sets `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and strict referrer policies. |
| **Cross-Origin Resource Sharing** | **CORS Origin Whitelisting** locks down the API to only allow requests from the trusted frontend (`http://localhost:5173`). |
| **Information Disclosure** | Centralized production error handling strips database stack traces from client responses. |

---

## 🗄️ MySQL Database Setup

The backend connects to MySQL and automatically creates the database and all required tables (`users`, `products`, `orders`, `order_items`, `site_settings`).

### 1. Configure Database Credentials
Edit [`server/.env`](file:///C:/Users/Ahmed%20TL/.gemini/antigravity/scratch/react-ecommerce/server/.env):

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=aura_ecommerce

# Security Secrets
JWT_SECRET=super_secure_aura_ecommerce_secret_key_928374982347
JWT_EXPIRES_IN=24h

# Default Admin Credentials
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@auracommerce.com
ADMIN_PASSWORD=AdminSecurePass2026!
```

> [!NOTE]
> If your MySQL password has not been entered yet, the server boots in **Resilient Storage Mode** automatically, ensuring that the frontend and backend remain 100% operational without crashing! As soon as your password is set in `.env`, it automatically switches to live MySQL.

### 2. Manual Schema Import (Optional)
If you prefer to initialize the database directly through MySQL Workbench or CLI:
```bash
mysql -u root -p < server/sql/schema.sql
```

---

## 🚀 Running the Application

### Option A: Run Fullstack (Both Backend & Frontend in 1 Command)
```bash
npm run fullstack
```

### Option B: Run in Separate Terminals
**Terminal 1 — Node.js Backend:**
```bash
cd "C:\Users\Ahmed TL\.gemini\antigravity\scratch\react-ecommerce"
npm run server
```
*Backend runs on `http://localhost:5000` (Health check at `http://localhost:5000/api/health`)*

**Terminal 2 — React Frontend:**
```bash
cd "C:\Users\Ahmed TL\.gemini\antigravity\scratch\react-ecommerce"
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🔑 Admin Access

1. Open **`http://localhost:5173/admin`** (or click **"Admin Portal"** in the top navigation bar).
2. Enter the default secure admin credentials:
   - **Username**: `admin`
   - **Password**: `AdminSecurePass2026!`
3. Inside the Admin Dashboard you can:
   - Edit the Website Name, Brand Subtitle, Announcement banner, and Currency.
   - Add, Edit, and Delete products in the MySQL database.
   - View customer orders with their **auto-detected device GPS delivery locations**.

---

## 📁 Project Structure

```
react-ecommerce/
├── server/                           # Secure Node.js Backend
│   ├── config/
│   │   └── db.js                     # MySQL Connection Pool & Auto-Initialization
│   ├── controllers/
│   │   ├── authController.js         # Admin JWT Login & Token Issuance
│   │   ├── productController.js      # Parameterized Product CRUD Operations
│   │   ├── orderController.js        # Checkout Placement & Order Management
│   │   └── settingsController.js     # Global Site & Branding Settings
│   ├── middleware/
│   │   ├── auth.js                   # JWT Bearer Token Verification
│   │   ├── security.js               # Helmet, Rate Limiter & Sanitization
│   │   ├── validation.js             # Strict Input Validation
│   │   └── errorHandler.js           # Safe Error Response Handler
│   ├── routes/                       # Express API Routes
│   ├── sql/
│   │   └── schema.sql                # Production MySQL Schema
│   ├── .env                          # Backend Environment Secrets
│   ├── package.json
│   └── server.js                     # Express Server Entry Point
│
├── src/                              # React 19 Frontend
│   ├── components/                   # Navbar, ProductCard, CartDrawer, Toast, Footer
│   ├── context/                      # StoreContext (API synced), CartContext
│   ├── pages/
│   │   ├── HomePage.jsx              # Dynamic Catalog with Filters & Search
│   │   ├── ProductDetailPage.jsx     # Product Detail View with Specs
│   │   ├── CheckoutPage.jsx          # Checkout with Device GPS Auto-Detect
│   │   └── AdminPage.jsx             # Secure Admin Dashboard & Login Gate
│   ├── services/
│   │   └── api.js                    # Secure Fetch Client with JWT Handling
│   ├── App.css
│   └── App.jsx
└── package.json
```
