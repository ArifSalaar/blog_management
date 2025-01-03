const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json()); // Optional if using express.json()
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);

// Database Connection
mongoose.connect('mongodb://localhost:27017/blog-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Server
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});