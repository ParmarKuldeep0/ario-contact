const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create transporter for nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('Error with transporter configuration:', error);
  } else {
    console.log('Server is ready to take messages');
  }
});

// Beautiful HTML email template
const createEmailTemplate = (name, email, phone, message) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #003980 0%, #0066cc 100%);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            padding: 30px;
        }
        .details {
            background-color: #f8f9fa;
            border-left: 4px solid #003980;
            padding: 20px;
            margin-bottom: 25px;
            border-radius: 4px;
        }
        .detail-item {
            margin-bottom: 15px;
            display: flex;
        }
        .detail-label {
            font-weight: 600;
            min-width: 100px;
            color: #003980;
        }
        .message-container {
            background-color: #f0f7ff;
            border: 1px solid #d0e5ff;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }
        .message-container h3 {
            margin-top: 0;
            color: #003980;
            border-bottom: 2px solid #d0e5ff;
            padding-bottom: 10px;
        }
        .message-text {
            white-space: pre-wrap;
            line-height: 1.8;
        }
        .footer {
            background-color: #f5f5f5;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #666;
            border-top: 1px solid #eaeaea;
        }
        .logo {
            font-size: 20px;
            font-weight: bold;
            color: #003980;
            margin-bottom: 10px;
        }
        .timestamp {
            color: #888;
            font-size: 12px;
            text-align: right;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            background-color: #003980;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 New Contact Form Submission</h1>
        </div>
        
        <div class="content">
            <div class="timestamp">Received: ${new Date().toLocaleString()}</div>
            
            <div class="details">
                <div class="detail-item">
                    <span class="detail-label">Name:</span>
                    <span>${name}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Email:</span>
                    <span><a href="mailto:${email}" style="color: #0066cc;">${email}</a></span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Phone:</span>
                    <span>${phone || 'Not provided'}</span>
                </div>
            </div>
            
            <div class="message-container">
                <h3>📝 Message</h3>
                <div class="message-text">${message}</div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:${email}" class="button">Reply to ${name}</a>
            </div>
        </div>
        
        <div class="footer">
            <div class="logo">Ario Shipping</div>
            <p>This email was sent from the contact form on your website.</p>
            <p>© ${new Date().getFullYear()} Ario Shipping. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
  `;
};

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields',
      });
    }

    // Email content with beautiful template
    const mailOptions = {
      from: `"Ario Shipping Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: createEmailTemplate(name, email, phone, message),
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while sending the message. Please try again later.',
    });
  }
});

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'Server is running!',
    service: 'Ario Shipping Contact API',
    status: 'Operational'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Ario Shipping Contact API running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/api/health`);
});