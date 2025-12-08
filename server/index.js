import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, deleteDoc, Timestamp } from 'firebase/firestore';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Minimal Firebase client setup for Firestore storage of codes
const firebaseConfig = {
  apiKey: "AIzaSyBKxsXHVlr5bC9CKUfDuzHkXxrxCmxosz8",
  authDomain: "prothumbgenerator.firebaseapp.com",
  projectId: "prothumbgenerator",
  storageBucket: "prothumbgenerator.appspot.com",
  messagingSenderId: "713187207288",
  appId: "1:713187207288:web:a80019a89cb37ce474e58d"
};
const fbApp = initializeApp(firebaseConfig);
const db = getFirestore(fbApp);

// Nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const isEmail = (v) => /.+@.+\..+/.test(v);
const generateCode = () => String(Math.floor(100000 + Math.random() * 900000));

app.post('/api/send-verification', async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email || !isEmail(email)) return res.status(400).json({ error: 'Invalid email' });

    const code = generateCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store in Firestore under collection emailVerifications
    await setDoc(doc(db, 'emailVerifications', email), {
      code,
      expiresAt: Timestamp.fromMillis(expiresAt),
      createdAt: Timestamp.now(),
    });

    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    await transporter.sendMail({
      from,
      to: email,
      subject: 'Your verification code',
      text: `Your verification code is ${code}. It expires in 10 minutes.`,
      html: `<p>Your verification code is <strong>${code}</strong>.</p><p>This code expires in 10 minutes.</p>`,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('send-verification error', err);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});

app.post('/api/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body || {};
    if (!email || !isEmail(email) || !code) return res.status(400).json({ error: 'Invalid request' });

    const snap = await getDoc(doc(db, 'emailVerifications', email));
    if (!snap.exists()) return res.status(400).json({ error: 'Code not found' });
    const data = snap.data();
    const expiresAt = data.expiresAt?.toMillis?.() ?? 0;
    if (Date.now() > expiresAt) {
      await deleteDoc(doc(db, 'emailVerifications', email));
      return res.status(400).json({ error: 'Code expired' });
    }
    if (String(data.code) !== String(code)) {
      return res.status(400).json({ error: 'Invalid code' });
    }

    // Consume the code
    await deleteDoc(doc(db, 'emailVerifications', email));
    res.json({ ok: true });
  } catch (err) {
    console.error('verify-code error', err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

const port = process.env.VERIFY_PORT ? Number(process.env.VERIFY_PORT) : (process.env.PORT ? Number(process.env.PORT) : 5000);
app.listen(port, () => {
  console.log(`Verification server running on http://localhost:${port}`);
});
