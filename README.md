Blog Management System

A Node.js and MongoDB backend project for managing blogs with user authentication, CRUD operations for blogs, and blog search functionality.

Features
User Authentication: Signup, Login with JWT-based authentication.
CRUD for Blogs: Create, Read, Update, and Delete blog posts.
Search Functionality: Search blogs by title.
Middleware: Authentication middleware to secure routes.

Tech Stack
Backend: Node.js, Express.js
Database: MongoDB with Mongoose ORM
Authentication: JWT (JSON Web Tokens)
Validation: express-validator

Project Structure
📁 Blog_Management
├── 📁 config        // Database connection
├── 📁 controllers   // Controllers for User and Blog
├── 📁 middleware    // Authentication middleware
├── 📁 models        // User and Blog schemas
├── 📁 routes        // API routes
├── 📄 .env          // Environment variables
├── 📄 server.js     // Entry point
└── 📄 README.md     // Documentation

Environment Variables
Create a .env file in the root directory and add the following
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
