# MERN E-Commerce Platform

A full-stack e-commerce web application built using the **MERN stack** with React, Node.js, Express.js, MongoDB, and Prisma. 
The application provides shopping functionality for users and a protected admin dashboard for managing products, categories, orders, and administrators.

## 🚀 Features

### 👤 User Features

* User registration and login
* JWT-based authentication
* View and update profile
* Change password
* Delete account
* Browse products
* Search products
* Filter products by category, price, and rating
* Sort products by price, rating, name, and creation date
* View product details
* Add products to cart
* Update cart quantities
* Remove products from cart
* Clear cart
* Checkout and place orders
* View order history
* View individual order details
* Cancel orders
* Add product reviews
* Update own reviews
* Delete own reviews
* View product ratings and reviews

### 🛠️ Admin Features

* Protected admin authentication
* Admin dashboard
* View dashboard statistics
* Create products
* Update products
* Delete products
* Create categories
* Update categories
* Delete categories
* View all orders
* Update order status
* Monitor low-stock products
* Create another administrator account



## 🏗️ Tech Stack

### Frontend

* React
* React Router
* Axios
* Vite
* CSS

### Backend

* Node.js
* Express.js
* Prisma ORM
* JWT
* bcrypt

### Database

* MongoDB



## 📁 Project Structure


ecommerce/
│
├── backend/
│   │
│   ├── config/
│   │   └── prisma.js
│   │
│   ├── controllers/
│   │   ├── admin.controller.js
│   │   ├── auth.controller.js
│   │   ├── cart.controller.js
│   │   ├── category.controller.js
│   │   ├── order.controller.js
│   │   ├── product.controller.js
│   │   ├── review.controller.js
│   │   └── user.controller.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js
│   │
│   ├── routes/
│   │   ├── admin.routes.js
│   │   ├── auth.routes.js
│   │   ├── cart.routes.js
│   │   ├── category.routes.js
│   │   ├── order.routes.js
│   │   ├── product.routes.js
│   │   ├── review.routes.js
│   │   └── user.routes.js
│   │
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md




# 🔐 Authentication & Authorization

The application uses authentication and role-based authorization to protect private functionality.

There are two roles:


USER
ADMIN


### Authentication

JWT is used to identify authenticated users.

Protected routes use:


authMiddleware


The middleware verifies the user's authentication token and makes the authenticated user available to the request.

### Authorization

Admin-only routes additionally use:


roleMiddleware("ADMIN")


This ensures that only users with the `ADMIN` role can access administrative operations.

Example:

js
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createProduct
);


The request must therefore pass:


Authentication
      ↓
Authorization
      ↓
Controller




# 👨‍💼 Admin Management

The application uses a protected admin creation flow.

The first administrator can be created manually in the database.

After logging in, an existing administrator can create another administrator through the Admin Dashboard.


Admin Dashboard
       ↓
Add Admin
       ↓
Admin Registration Page
       ↓
POST /api/admin/register
       ↓
authMiddleware
       ↓
roleMiddleware("ADMIN")
       ↓
createAdmin()
       ↓
New ADMIN created


The frontend does not send the role of the new account.

The backend explicitly creates the new account with:

js
role: "ADMIN"


This prevents users from assigning themselves an administrative role through the frontend.



# 🔌 API Documentation

All APIs are prefixed with:


/api


unless otherwise mentioned.

## Authentication APIs

### Register User


POST /api/auth/register


Creates a new user account.

### Login


POST /api/auth/login


Authenticates a user and returns authentication information.

### Authentication Test


GET /api/auth/profile


Protected route used to verify the authenticated user.



# 👤 User APIs

### Create User


POST /api/users/


Admin-only endpoint for creating a user.

### Get Profile


GET /api/users/profile


Returns the authenticated user's profile.

### Update Profile


PUT /api/users/profile


Updates the authenticated user's profile.

### Change Password


PUT /api/users/change-password


Changes the authenticated user's password.

### Delete Account


DELETE /api/users/account


Deletes the authenticated user's account.



# 📦 Product APIs

### Get Products


GET /api/products/


Returns products and supports product browsing/filtering functionality.

### Get Product by ID


GET /api/products/:id


Returns details of a specific product.

### Create Product


POST /api/products/


**Admin only.**

Creates a new product.

### Update Product


PUT /api/products/:id


**Admin only.**

Updates an existing product.

### Delete Product


DELETE /api/products/:id


**Admin only.**

Deletes a product.



# 🗂️ Category APIs

### Get Categories


GET /api/categories/


Returns all categories.

### Get Category by ID


GET /api/categories/:id


Returns a specific category.

### Create Category


POST /api/categories/


**Admin only.**

Creates a new category.

### Update Category


PUT /api/categories/:id


**Admin only.**

Updates a category.

### Delete Category


DELETE /api/categories/:id


**Admin only.**

Deletes a category.



# 🛒 Cart APIs

### Get Cart


GET /api/cart/


Returns the authenticated user's cart.

### Add Product to Cart


POST /api/cart/items


Adds a product to the cart.

### Update Cart Item


PUT /api/cart/items/:productId


Updates the quantity of a product in the cart.

### Remove Cart Item


DELETE /api/cart/items/:productId


Removes a product from the cart.

### Clear Cart


DELETE /api/cart/


Removes all products from the cart.



# 📋 Order APIs

### Create Order


POST /api/orders/


Creates an order for the authenticated user.

### Get My Orders


GET /api/orders/


Returns orders belonging to the authenticated user.

### Get All Orders


GET /api/orders/admin


**Admin only.**

Returns all orders.

### Update Order Status


PATCH /api/orders/:id/status


**Admin only.**

Updates the status of an order.

### Get Order by ID


GET /api/orders/:id


Returns an order accessible to the authenticated user.

### Cancel Order


PATCH /api/orders/:id/cancel


Cancels an order.



# ⭐ Review APIs

Review routes are mounted directly under `/api`.

### Get Product Reviews


GET /api/products/:productId/reviews


Returns all reviews for a product.

### Create Review


POST /api/products/:productId/reviews


Creates a review for a product.

### Update Review


PUT /api/products/:productId/reviews/:reviewId


Updates a review.

### Delete Review


DELETE /api/products/:productId/reviews/:reviewId


Deletes a review.



# 🛠️ Admin APIs

### Admin Dashboard


GET /api/admin/dashboard


**Admin only.**

Returns dashboard information and statistics.

### Create Another Admin


POST /api/admin/register


**Admin only.**

Creates another administrator account.

The endpoint is protected by:


authMiddleware
        ↓
roleMiddleware("ADMIN")




# 🔄 Frontend-Backend Communication

The React frontend communicates with the Express backend using Axios.

Axios is configured in:


frontend/src/services/api.js


For example:

js
api.get("/products");


If the Axios base URL is:


http://localhost:5000/api


the complete request becomes:


GET http://localhost:5000/api/products


The general request flow is:


React Component
      ↓
Axios
      ↓
Express Route
      ↓
Middleware
      ↓
Controller
      ↓
Prisma
      ↓
MongoDB
      ↓
Controller Response
      ↓
Axios
      ↓
React State
      ↓
UI




# 🗄️ Database

The application uses **MongoDB** as its database and **Prisma ORM** for database access.

The main entities include:


User
Category
Product
Cart
CartItem
Order
OrderItem
Review


Prisma handles database queries and relationships between these entities.



# ⚙️ Installation

## 1. Clone the Repository

bash
git clone <your-repository-url>
cd <project-folder>


## 2. Install Backend Dependencies

bash
cd backend
npm install


## 3. Configure Environment Variables

Example:

env
DATABASE_URL="mongodb-connection-string"
JWT_SECRET="jwt-secret"
PORT=5000


## 4. Generate Prisma Client

bash
npx prisma generate


## 5. Start Backend

bash
npm run dev


The backend will run on:


http://localhost:5000


## 6. Install Frontend Dependencies

Open another terminal:

bash
cd frontend
npm install


## 7. Start Frontend

bash
npm run dev


The frontend will normally be available at:


http://localhost:5173




# 🧪 Testing the Backend

A simple backend health-check endpoint is available:


GET /api/test


Expected response:

json
{
  "message": "Backend is working"
}


A database connection test is also available:


GET /api/db-test




# 🔒 Security Practices

The project implements:

* JWT-based authentication
* Password hashing using bcrypt
* Protected API routes
* Role-based authorization
* Admin-only operations
* Backend request validation
* Environment variables for sensitive configuration
* Server-side role assignment for admin creation
* CORS configuration



# 📌 Future Improvements

Possible future improvements include:

* Payment gateway integration
* Cloud-based product image uploads
* Wishlist functionality
* Email notifications
* Advanced admin analytics
* Improved inventory management
* Order management interface
* Docker support
* CI/CD pipeline
* Production deployment
* Automated testing



# 👨‍💻 Author

**Nikhil Pratap Singh**

Full-Stack Developer | MERN | Backend Development

GitHub:
https://github.com/nikhilpratapgit


So this README now reflects your **actual backend routing**, rather than an assumed API structure.
