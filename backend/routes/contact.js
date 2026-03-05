// ====================================
// contact.js — Sends email when someone
// fills your contact form
// ====================================

const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// ====================================
// POST /api/contact — Send email
// ====================================
router.post('/', async (req, res) => {

  // Step 1: Get the data from the contact form
  const { name, email, message } = req.body;

  // Step 2: Check all fields are filled
  if (!name || !email || !message) {
    return res.status(400).json({ 
      error: 'Please fill all fields!' 
    });
  }

  try {
    // Step 3: Create email transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,   // Your Gmail
        pass: process.env.EMAIL_PASS    // Your app password
      }
    });

    // Step 4: Define the email content
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `📩 New Portfolio Message from ${name}`,
      html: `
        <h2>New message from your portfolio!</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    // Step 5: Send the email
    await transporter.sendMail(mailOptions);

    console.log(`📧 Email received from ${name}`);

    // Step 6: Tell frontend it worked
    res.json({ 
      success: true,
      message: 'Email sent successfully!' 
    });

  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ 
      error: 'Failed to send email. Try again!' 
    });
  }

});

module.exports = router;