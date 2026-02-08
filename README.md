# Crown Game Store - Online Digital Games Shop

A full-stack e-commerce platform for selling digital games, built with Node.js, Express, and MongoDB.  
Features a product catalog, shopping cart, user authentication, admin panel, and order placement with WhatsApp redirect for confirmation and payment.

## Key Features

- Product catalog with category filtering (Action/Adventure, RPG, Horror, Racing, Shooter)
- Detailed product pages with images, description, platform variants, and discounts
- Shopping cart persisted in the database
- User registration and login (JWT-based)
- Admin dashboard with sales statistics and order management
- Order creation → record saved in database → automatic redirect to WhatsApp chat
- Fully responsive design using Bootstrap 5 and vanilla JavaScript

## Technologies

**Backend**
- Node.js + Express.js
- MongoDB (Atlas) + Mongoose
- JWT authentication
- Role-based access control (user / admin)

**Frontend**
- Vanilla JavaScript
- Bootstrap 5
- HTML + CSS

**Utilities**
- dotenv – environment variables
- bcryptjs – password hashing
- jsonwebtoken – JWT tokens

## Project Structure
webfinal/
├── public/                     # Static files (HTML, CSS, JS)
│   ├── js/
│   │   ├── main.js           # Home page, catalog, categories
│   │   ├── product.js        # Product detail page + add to cart
│   │   └── cart.js           # Cart page + Place Order → WhatsApp
│   ├── product.html
│   ├── cart.html
│   └── ... (other pages)
├── src/
│   ├── models/               # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   └── Category.js
│   ├── controllers/          # Request handlers logic
│   ├── routes/               # API routes
│   ├── middleware/
│   │   └── auth.middleware.js
│   └── server.js             # Server entry point
├── .env.example
├── package.json
└── README.md
text## Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/Zhalgastelmanzz/webfinal.git
   cd webfinal

Install dependenciesBashnpm install
Create .env file in the project root and fill it:envPORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/crown_gamestore?retryWrites=true&w=majority
JWT_SECRET=your_very_long_and_secure_secret_key_at_least_32_chars
Start the serverBashnpm run dev    # with nodemon (auto-restart on changes)
# or
npm start      # normal startServer runs at http://localhost:5000
Open in browser
Home: http://localhost:5000/
Product detail: http://localhost:5000/product.html?id=...
Cart: http://localhost:5000/cart.html (login required)


Authentication

Register: POST /api/auth/register
Login: POST /api/auth/login → saves token to localStorage
Protected routes require Authorization: Bearer <token>

Admin panel is available only for users with admin role.
Order Placement (Place Order)

Add items to cart from product pages
Go to /cart.html
Click Place Order
Order is created in orders collection
Cart is automatically cleared
Browser redirects to WhatsApp chat with message:textMy order ID: 123abc456def. Please confirm.(WhatsApp number is set in cart.js – replace with your support number)

Admin Panel (In Progress)

Sales statistics by category (MongoDB Aggregation)
View and update order statuses
Product and category management

Useful Commands
Bashnpm run dev     # Start with nodemon (recommended)
npm start       # Normal start
Important Notes

All products are digital games → stock check and shipping address are disabled
Payment and key delivery happen via WhatsApp chat
Use test accounts (admin / user) for development

Contact & Support
Want to add features like Kaspi payment, user profile, reviews, product search?
Feel free to open an issue or contact via WhatsApp.
Ready to help with improvements! 🚀
Author: Zhalgas Telman,Samandar Babakhanov,Adil Yerlik
Date: February 2026