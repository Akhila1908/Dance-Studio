const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const User = require('./models/User');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());

// Serve static files from the frontend folder (one level up from backend)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// CORS setup
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ MONGO_URI is missing!');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully.');
    seedUser();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// API Routes
app.use('/api/auth', authRoutes);

// Serve frontend for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'home1.html'));
});

// Seeding Function
async function seedUser() {
  try {
    const email = 'akhilareddyevuri1908@gmail.com';
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      await User.create({
        firstName: 'Akhila',
        lastName: 'Evuri',
        email: email,
        password: '1234',
        phone: '1234567890',
        streetAddress1: '123 Seed St',
        city: 'Seed City',
        region: 'Region',
        zipCode: '10001',
        country: 'India',
        danceType: 'Bharatanatyam',
        startDate: new Date(),
        startTime: '10:00',
        isPaid: true
      });
      console.log('✅ Seed user created successfully.');
    } else {
      console.log('✅ Seed user already exists.');
    }
  } catch (error) {
    console.error('❌ Error seeding user:', error);
  }
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Frontend served from: ${path.join(__dirname, '..', 'frontend')}`);
});