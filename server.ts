import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import nodemailer from 'nodemailer';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Initialize Firebase Admin
const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
admin.initializeApp({
  projectId: firebaseConfig.projectId,
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // In-memory store for OTPs
  const otpStore = new Map<string, { otp: string; expires: number }>();

  // API Routes
  app.post('/api/auth/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

    otpStore.set(email, { otp, expires });

    try {
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const info = await transporter.sendMail({
        from: '"EcoChamps Auth" <auth@ecochamps.eco>',
        to: email,
        subject: 'Your EcoChamps Login Code',
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #059669;">EcoChamps Verification</h2>
            <p>Hello!</p>
            <p>Use the following code to sign in to your EcoChamps account:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #059669; padding: 20px; text-align: center; background: #f0fdf4; border-radius: 8px;">
              ${otp}
            </div>
            <p style="font-size: 12px; color: #666; margin-top: 20px;">This code will expire in 5 minutes. If you didn't request this, please ignore this email.</p>
          </div>
        `,
      });

      res.json({ 
        success: true, 
        previewUrl: nodemailer.getTestMessageUrl(info) 
      });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });

  app.post('/api/auth/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

    const storedData = otpStore.get(email);

    if (!storedData || Date.now() > storedData.expires || storedData.otp !== otp) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    try {
      // Success! Generate a custom token for the user
      // We use the email as the UID (or a hash of it)
      const uid = `email-otp-${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
      
      // Ensure user exists or update their email
      try {
        await admin.auth().getUser(uid);
      } catch (e) {
        await admin.auth().createUser({
          uid,
          email,
        });
      }

      const customToken = await admin.auth().createCustomToken(uid);
      
      otpStore.delete(email);
      res.json({ success: true, customToken });
    } catch (error) {
      console.error('Error creating custom token:', error);
      res.status(500).json({ error: 'Failed to create authentication token' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
