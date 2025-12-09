import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
// Firestore removed to avoid client SDK permission issues on server

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// In-memory store for verification codes (dev-friendly)
const codes = new Map();
setInterval(() => {
  const now = Date.now();
  for (const [email, record] of codes.entries()) {
    if (!record || now > record.expiresAt) codes.delete(email);
  }
}, 60 * 1000);

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

const buildOtpEmail = (code) => {
  const product = 'Pro Thumbnail Generator';
  const brand = 'ProThumbnail';
  const accent = '#FBBF24';
  const base = '#0B0F1A';
  const textMuted = '#8A8F98';
  const codeSpaced = String(code).split('').join(' ');
  const subject = `${brand} • Your verification code`;
  const preheader = `Use code ${code} to complete sign up. This code expires in 10 minutes.`;
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${subject}</title></head><body style="margin:0;padding:0;background:${base};font-family:Inter,Segoe UI,Arial,sans-serif;color:#E5E7EB;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${preheader}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${base};">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="width:100%;max-width:600px;margin:0 auto;background:#0F1525;border:1px solid #1F2937;border-radius:12px;">
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="display:inline-block;background:${accent};color:#111827;font-weight:800;border-radius:8px;padding:8px 12px;letter-spacing:0.4px">${brand}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 28px 0 28px;">
              <h1 style="margin:0;font-size:22px;line-height:1.4;color:#F9FAFB;font-weight:800">Verify your email</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 0 28px;">
              <p style="margin:0;font-size:14px;line-height:1.7;color:${textMuted}">Use the verification code below to finish creating your ${product} account.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 28px;">
              <div style="background:#0B1220;border:1px solid #1F2A37;border-radius:12px;padding:24px;text-align:center">
                <div style="font-size:13px;color:${textMuted};margin-bottom:10px">Your code</div>
                <div style="font-size:36px;font-weight:900;letter-spacing:8px;color:#FFFFFF;">${codeSpaced}</div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 8px 28px;">
              <p style="margin:0;font-size:12px;color:${textMuted}">This code expires in 10 minutes. If you didn’t request this, you can safely ignore this email.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px 28px;border-top:1px solid #1F2937">
              <p style="margin:0;font-size:11px;color:${textMuted}">© ${new Date().getFullYear()} ${product}. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  </body></html>`;
  const text = `${brand} — Verification Code\n\nYour code: ${code}\n\nThis code expires in 10 minutes. If you didn’t request this, please ignore this email.`;
  return { subject, html, text };
};

const isEmail = (v) => /.+@.+\..+/.test(v);
const generateCode = () => String(Math.floor(100000 + Math.random() * 900000));

app.post('/api/send-verification', async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email || !isEmail(email)) return res.status(400).json({ error: 'Invalid email' });

    const code = generateCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store code in memory with expiry
    codes.set(email, { code, expiresAt });

    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    const tpl = buildOtpEmail(code);
    await transporter.sendMail({ from, to: email, subject: tpl.subject, text: tpl.text, html: tpl.html });

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

    const record = codes.get(email);
    if (!record) return res.status(400).json({ error: 'Code not found' });
    if (Date.now() > record.expiresAt) {
      codes.delete(email);
      return res.status(400).json({ error: 'Code expired' });
    }
    if (String(record.code) !== String(code)) {
      return res.status(400).json({ error: 'Invalid code' });
    }
    codes.delete(email);
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
