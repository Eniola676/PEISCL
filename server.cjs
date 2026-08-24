// ===================================
// SIMPLE NODE.JS BACKEND FOR REGISTRATION
// ===================================
// Run: node server.js
// Install dependencies: npm install express body-parser twilio

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files

// ===================================
// CONFIGURATION
// ===================================

const CONFIG = {
    // WhatsApp API Configuration
    // Choose ONE provider and configure:

    // Option 1: Twilio
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || 'your_twilio_account_sid',
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || 'your_twilio_auth_token',
    TWILIO_WHATSAPP_NUMBER: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',

    // Option 2: WhatsApp Cloud API
    WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN || 'your_access_token',
    WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID || 'your_phone_number_id',

    // Data storage path
    DATA_FILE: path.join(__dirname, 'registrations.json'),
    GUIDANCE_FILE: path.join(__dirname, 'guidance-requests.json'),
    NEWSLETTER_FILE: path.join(__dirname, 'newsletter-subscribers.json')
};

// ===================================
// SAVE REGISTRATION
// ===================================

app.post('/api/register', async (req, res) => {
    try {
        const { name, whatsapp, program, timestamp, track } = req.body;

        // Validate input
        if (!name || !whatsapp || !program) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Load existing registrations
        let registrations = [];
        if (fs.existsSync(CONFIG.DATA_FILE)) {
            const data = fs.readFileSync(CONFIG.DATA_FILE, 'utf8');
            registrations = JSON.parse(data);
        }

        // Add new registration
        const registration = {
            id: Date.now(),
            name,
            whatsapp,
            program,
            track,
            timestamp: timestamp || new Date().toISOString(),
            status: 'pending'
        };

        registrations.push(registration);

        // Save to file
        fs.writeFileSync(
            CONFIG.DATA_FILE,
            JSON.stringify(registrations, null, 2)
        );

        console.log('New registration saved:', registration);

        res.json({
            success: true,
            registration
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// ===================================
// SEND WHATSAPP MESSAGE - TWILIO
// ===================================

app.post('/api/send-whatsapp', async (req, res) => {
    try {
        const { to, name, program } = req.body;

        // OPTION 1: Using Twilio
        // Uncomment and configure if using Twilio:
        /*
        const twilio = require('twilio');
        const client = twilio(CONFIG.TWILIO_ACCOUNT_SID, CONFIG.TWILIO_AUTH_TOKEN);

        const message = await client.messages.create({
            from: CONFIG.TWILIO_WHATSAPP_NUMBER,
            to: `whatsapp:${to}`,
            body: `Hello ${name}! 🎓\n\nThank you for registering for ${program} at PEISCL.\n\nNext Steps:\n1. We'll contact you within 24 hours\n2. Keep this number saved\n3. Watch for course details\n\nQuestions? Reply to this message.\n\n- PEISCL Team`
        });

        console.log('WhatsApp message sent:', message.sid);

        res.json({
            success: true,
            messageId: message.sid
        });
        */

        // OPTION 2: Using WhatsApp Cloud API
        // Uncomment and configure if using Meta's API:
        /*
        const fetch = require('node-fetch');

        const response = await fetch(
            `https://graph.facebook.com/v18.0/${CONFIG.WHATSAPP_PHONE_NUMBER_ID}/messages`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CONFIG.WHATSAPP_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: to.replace(/\+/g, ''),
                    type: 'text',
                    text: {
                        body: `Hello ${name}! 🎓\n\nThank you for registering for ${program} at PEISCL.\n\nNext Steps:\n1. We'll contact you within 24 hours\n2. Keep this number saved\n3. Watch for course details\n\nQuestions? Reply to this message.\n\n- PEISCL Team`
                    }
                })
            }
        );

        const data = await response.json();
        console.log('WhatsApp message sent:', data);

        res.json({
            success: true,
            messageId: data.messages?.[0]?.id
        });
        */

        // TEMPORARY: Log only (remove in production)
        console.log(`Would send WhatsApp to ${to}: Registration confirmation for ${program}`);
        res.json({
            success: true,
            messageId: 'demo_' + Date.now(),
            note: 'Configure WhatsApp API in server.js'
        });

    } catch (error) {
        console.error('WhatsApp error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ===================================
// VIEW REGISTRATIONS (ADMIN)
// ===================================

app.get('/api/registrations', (req, res) => {
    try {
        if (fs.existsSync(CONFIG.DATA_FILE)) {
            const data = fs.readFileSync(CONFIG.DATA_FILE, 'utf8');
            const registrations = JSON.parse(data);
            res.json({
                success: true,
                count: registrations.length,
                registrations
            });
        } else {
            res.json({
                success: true,
                count: 0,
                registrations: []
            });
        }
    } catch (error) {
        console.error('Error reading registrations:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// ===================================
// SAVE COURSE GUIDANCE REQUEST ("Not sure what to learn" form)
// ===================================

app.post('/api/course-guidance', async (req, res) => {
    try {
        const { name, whatsapp, educationLevel, computerLiteracy, interests } = req.body;

        // Validate required fields
        if (!name || !whatsapp || !educationLevel || !computerLiteracy || !interests || !interests.length) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Load existing guidance requests
        let requests = [];
        if (fs.existsSync(CONFIG.GUIDANCE_FILE)) {
            const data = fs.readFileSync(CONFIG.GUIDANCE_FILE, 'utf8');
            requests = JSON.parse(data);
        }

        // Add new guidance request
        const request = {
            id: Date.now(),
            ...req.body,
            timestamp: req.body.timestamp || new Date().toISOString(),
            status: 'pending'
        };

        requests.push(request);

        // Save to file
        fs.writeFileSync(
            CONFIG.GUIDANCE_FILE,
            JSON.stringify(requests, null, 2)
        );

        console.log('New course guidance request saved:', request);

        res.json({
            success: true,
            request
        });

    } catch (error) {
        console.error('Course guidance error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// ===================================
// VIEW COURSE GUIDANCE REQUESTS (ADMIN)
// ===================================

app.get('/api/course-guidance', (req, res) => {
    try {
        if (fs.existsSync(CONFIG.GUIDANCE_FILE)) {
            const data = fs.readFileSync(CONFIG.GUIDANCE_FILE, 'utf8');
            const requests = JSON.parse(data);
            res.json({
                success: true,
                count: requests.length,
                requests
            });
        } else {
            res.json({
                success: true,
                count: 0,
                requests: []
            });
        }
    } catch (error) {
        console.error('Error reading guidance requests:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// ===================================
// NEWSLETTER SIGNUP (footer form)
// ===================================

app.post('/api/newsletter', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Missing email'
            });
        }

        let subscribers = [];
        if (fs.existsSync(CONFIG.NEWSLETTER_FILE)) {
            const data = fs.readFileSync(CONFIG.NEWSLETTER_FILE, 'utf8');
            subscribers = JSON.parse(data);
        }

        if (!subscribers.some(s => s.email.toLowerCase() === email.toLowerCase())) {
            subscribers.push({
                id: Date.now(),
                email,
                timestamp: req.body.timestamp || new Date().toISOString()
            });

            fs.writeFileSync(
                CONFIG.NEWSLETTER_FILE,
                JSON.stringify(subscribers, null, 2)
            );
        }

        console.log('Newsletter signup:', email);

        res.json({ success: true });

    } catch (error) {
        console.error('Newsletter error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// ===================================
// START SERVER
// ===================================

app.listen(PORT, () => {
    console.log(`
========================================
PEISCL Registration Server
========================================
Server running on: http://localhost:${PORT}
Data file: ${CONFIG.DATA_FILE}

API Endpoints:
- POST /api/register - Save registration
- POST /api/send-whatsapp - Send WhatsApp
- GET  /api/registrations - View all

⚠️  CONFIGURE WHATSAPP API:
Edit server.js and set your credentials
========================================
    `);
});
