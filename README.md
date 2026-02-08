# Crown Game Store - Online Digital Games Shop

A full-stack e-commerce platform for selling digital games, built with Node.js, Express, and MongoDB.  
Features a product catalog, shopping cart, user authentication, admin panel, and order placement with WhatsApp redirect for confirmation and payment.

## Key Features

- **Product catalog** with category filtering (Action/Adventure, RPG, Horror, Racing, Shooter)
- **Detailed product pages** with images, descriptions, platform variants, and discounts
- **Shopping cart** persisted in the database
- **User registration and login** (JWT-based)
- **Admin dashboard** with sales statistics and order management
- **Order creation →** record saved in the database → automatic redirect to WhatsApp chat for confirmation and payment
- Fully **responsive design** using Bootstrap 5 and vanilla JavaScript

## Technologies

### Backend
- Node.js + Express.js
- MongoDB (Atlas) + Mongoose
- JWT authentication
- Role-based access control (user / admin)

### Frontend
- Vanilla JavaScript
- Bootstrap 5
- HTML + CSS

### Utilities
- **dotenv** – for environment variables
- **bcryptjs** – password hashing
- **jsonwebtoken** – JWT tokens

## Deployment

Live demo: https://crown-game-store.onrender.com/
Deployed on Render (free tier).  
Database: MongoDB Atlas  
All environment variables are set in Render dashboard.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Zhalgastelmanzz/webfinal.git
   cd webfinal
2. **Install dependencies:**

npm install
3. **Create a .env file in the project root and fill it with the following:**

PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/crown_gamestore?retryWrites=true&w=majority
JWT_SECRET=your_very_long_and_secure_secret_key_at_least_32_chars
4.**Start the server:**

For development (with nodemon, auto-restart on changes):

npm run dev
Or, for a normal start:

npm start
The server will run at http://localhost:5000.

5.**Open in your browser:**

# Home: http://localhost:5000/

# Product details: http://localhost:5000/product.html?id=...

# Cart: http://localhost:5000/cart.html (login required)

## Authentication
**Register:** POST /api/auth/register

**Login:** POST /api/auth/login → saves token to localStorage

Protected routes require Authorization: Bearer <token>

The **Admin Panel** is available only for users with an admin role.

## Order Placement
Add items to the cart from product pages.

Go to /cart.html.

Click Place Order.

The order is created in the orders collection.

The cart is automatically cleared.

Browser redirects to WhatsApp chat with the message:

My order ID: 123abc456def. Please confirm.
(The WhatsApp number is set in cart.js — replace it with your support number.)

## Admin Panel (In Progress)
Sales statistics by category (using MongoDB Aggregation)

View and update order statuses

Product and category management

## Useful Commands
Start with nodemon (recommended):

npm run dev
Normal start:

npm start
## Important Notes
All products are digital games, so stock check and shipping address are disabled.

Payment and key delivery happen via WhatsApp chat.

Use test accounts (admin / user) for development.

## Contact & Support
Want to add features like Kaspi payment, user profile, reviews, or product search?
Feel free to open an issue or contact via WhatsApp. Ready to help with improvements! 🚀

## Authors:
**Zhalgas Telman**

**Samandar Babakhanov**

**Adil Yerlik**

## Date:
February 2026

