// ====================================
// visitors.js — Counts website visitors
// ====================================

const express = require('express');
const router = express.Router();

// Simple visitor counter stored in memory
let visitorCount = 0;

// ====================================
// GET /api/visitors — Get current count
// ====================================
router.get('/', (req, res) => {
  // Every time someone visits, increase count by 1
  visitorCount++;
  
  console.log(`👀 Total visitors: ${visitorCount}`);
  
  // Send the count back to frontend
  res.json({ 
    count: visitorCount,
    message: 'Visitor counted successfully!'
  });
});

module.exports = router;