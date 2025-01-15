const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config(); // For securing sensitive data with environment variables

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to handle form submission
app.post('/send-mail', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Use your email provider (e.g., Outlook, Yahoo)
        auth: {
            user: process.env.EMAIL_USER ,  
            pass: process.env.EMAIL_PASS  
        },
    });

    // Email options
    const mailOptions = {
        from: email,
        to: process.env.RECIPIENT_EMAIL || 'recipient-email@gmail.com', // Email to receive messages
        subject: `Message from ${name}`,
        text: `from: ${email} \n\n` +message,
    };

    const reply = {
        from: process.env.RECIPIENT_EMAIL,
        to:  email,
        subject: `Message Recived `,
        text: `Hi ${name} , Thank you for reaching out to us. Your message has been received, and our team will get in touch with you shortly. \n\n Best regards , \n Team Tacosoft `,
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Status</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    .success { color: green; }
                </style>
            </head>
            <body>
                <h1 class="success">Email sent successfully!</h1>
                 
            </body>
            </html>
        `);

        transporter.sendMail(reply);
    } catch (error) {
        console.error('Error sending email:', error);
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Status</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    .error { color: red; }
                </style>
            </head>
            <body>
                <h1 class="error">Failed to send email.</h1>
                <p>Please try again later.</p>
                 
            </body>
            </html>
        `);
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
