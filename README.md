# 🛍️ Online Store API & Admin Dashboard

A full-stack E-commerce solution built with Node.js, Express, and MongoDB. The project features a robust product management system, real-time sales analytics via MongoDB Aggregation Pipelines, and a secure Admin Panel.

---

## 🏗️ System Architecture
The application follows a modular **Model-View-Controller (MVC)** pattern:
- **Frontend**: Vanilla JavaScript, Bootstrap 5, and Static HTML.
- **Backend**: Node.js & Express.js.
- **Database**: MongoDB Atlas (NoSQL) with Mongoose ODM.
- **Authentication**: Stateless JWT (JSON Web Tokens) with role-based access control (RBAC).

---

## 📊 Database Schema Description
The **online_shop** database consists of the following core collections:

1. **Products**: Highly detailed documents including:
   - `variants`: Array of objects (size, color, stockQty).
   - `images`: Array of URLs.
   - `categoryId`: Reference to the Categories collection.
2. **Orders**: Captures transaction snapshots, including `items` (productId, qty, lineTotal) and `status`.
3. **Users**: Stores credentials and roles (`user` vs `admin`).
4. **Categories**: Simple documents for catalog organization.

---

## 🔍 Advanced MongoDB Queries
### Sales Analytics (Aggregation Pipeline)
To generate the Admin Dashboard stats, we use a multi-stage pipeline to calculate revenue per category:

```javascript
[
  { "$unwind": "$items" },
  { "$lookup": { 
      "from": "products", 
      "localField": "items.productId", 
      "foreignField": "_id", 
      "as": "productDetails" 
  }},
  { "$unwind": "$productDetails" },
  { "$group": { 
      "_id": "$productDetails.categoryId", 
      "totalRevenue": { "$sum": "$items.lineTotal" },
      "totalUnitsSold": { "$sum": "$items.qty" }
  }},
  { "$sort": { "totalRevenue": -1 } }
]
```
## 🚀 API Documentation
### 🔐 Authentication (/api/auth)
POST /register: Registers a new user account and saves profile information to the database.

POST /login: Authenticates user credentials and returns a JWT for secure session access.

GET /me: Retrieves the profile data for the currently authenticated user session.

### 📦 Products (/api/products)
GET /: Fetches the complete list of available products for the store catalog.

GET /:id: Provides comprehensive details for a single specific product by its unique ID.

POST /: Grants administrators the ability to add new product entries to the database.

DELETE /:id: Allows administrators to permanently remove a specific product from the catalog.

### 🛒 Shopping Cart (/api/cart)
GET /: Loads all items currently stored in the authenticated user's personal shopping cart.

POST /add: Adds a selected product and its specified quantity to the user's active cart.

DELETE /item/:itemId: Removes a specific item entry from the user's shopping cart.

### 🧾 Orders (/api/orders)
POST /orders: Processes the checkout by converting cart items into a finalized order with shipping details.

GET /my-orders: Displays a complete history of all past and current orders placed by the user.

GET /cart: Provides a utility endpoint to verify cart state during the order placement sequence.

### 🛠️ Admin Management (/api/admin)
GET /stats: Generates a detailed sales analytics report with revenue grouped by category.

GET /orders: Gives administrators a centralized view of every customer order across the platform.

PATCH /orders/:id/status: Enables administrators to update the fulfillment status of any specific order.

### 📂 Categories (/api/categories)
GET /: Returns a list of all product categories defined in the system.

POST /: Allows for the creation of new product categories within the database.

## ⚡ Indexing & Optimization Strategy

### Compound Indexing: 
Implemented on { categoryId: 1, price: 1 } to optimize simultaneous filtering and price sorting in the product catalog.

### Relational Integrity: 
Used ObjectId references for categoryId to maintain clean data relationships.

### Schema Design: 
Utilized embedded documents for variants to minimize the number of database lookups when viewing product details.

## 🛠️ Setup Instructions
1) Clone the repository.
2) Install dependencies: npm install.
3) Create a .env file with:
 MONGO_URI: MongoDB connection string.
 JWT_SECRET: A secure key for token signing.
 PORT: 5000.
4) Start the server: npm start or npm run dev.
