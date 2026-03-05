// ====================================
// server.js — The heart of our backend
// ====================================

// Step 1: Import all the tools we installed
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Step 2: Load our secret keys from .env file
dotenv.config();

// Step 3: Create our Express app (this IS our server)
const app = express();

// Step 4: Tell the server what port to run on
const PORT = process.env.PORT || 5000;

// ====================================
// MIDDLEWARE — Think of these as security
// guards that process every request
// ====================================

// Allows frontend to talk to backend
app.use(cors());

// Allows server to understand JSON data
app.use(express.json());

// Serve frontend files to the browser
app.use(express.static(path.join(__dirname, '../frontend')));

// ====================================
// ROUTES — Different URLs for different features
// ====================================

// Import our route files
const chatRoute = require('./routes/chat');
const contactRoute = require('./routes/contact');
const visitorsRoute = require('./routes/visitors');

// Tell Express to use these routes
app.use('/api/chat', chatRoute);
app.use('/api/contact', contactRoute);
app.use('/api/visitors', visitorsRoute);

// ====================================
// HOME ROUTE — Just to test server works
// ====================================
app.get('/api', (req, res) => {
  res.json({ message: 'Chowhan Portfolio Backend is Running! 🚀' });
});

// ====================================
// START THE SERVER
// ====================================
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});