require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const homepageDetailsRoutes = require('./routes/homepageDetails');
const aboutDetailsRoutes = require('./routes/aboutDetails');
const galleryDetailsRoutes = require('./routes/galleryDetails');
const ahvalDetailsRoutes = require('./routes/ahvalDetails');
const leaderDetailsRoutes = require('./routes/leaderDetails');

// Import models
const User = require('./models/User');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect DB
connectDB()
  .then(async () => {
    console.log('MongoDB connected...');

    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

    const PORT = process.env.PORT || 5000;

    const server = app.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
      console.error(`Error: ${err.message}`);
      // Close server & exit process
      server.close(() => process.exit(1));
    });
  })
  .catch((err) => console.error('Error:', err));

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/homepage-details', homepageDetailsRoutes);
app.use('/api/about-details', aboutDetailsRoutes);
app.use('/api/gallery-details', galleryDetailsRoutes);
app.use('/api/ahval-details', ahvalDetailsRoutes);
app.use('/api/leader-details', leaderDetailsRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  // Basic route for development
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Admin Dashboard API' });
  });
}

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Server Error' : err.message
  });
};

app.use(errorHandler);
