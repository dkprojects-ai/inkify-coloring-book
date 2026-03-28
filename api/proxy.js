/**
 * /api/proxy.js — Vercel Serverless Function
 *
 * Why this exists:
 *   Google Apps Script Web Apps return a 302 redirect on POST requests.
 *   Browsers block following cross-origin redirects (CORS policy), so
 *   direct fetch() calls from the React app silently fail with "Failed to fetch".
 *
 *   This proxy runs server-side on Vercel — no CORS restrictions apply.
 *   The React app calls /api/proxy (same origin), Vercel forwards to Apps Script.
 */

const APPS_SCRIPT_URL =
  process.env.VITE_APPS_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbwq3HPXl6hrzLeGid9j94VXBjkROqw-D_CQqEJHQsCCm24w9hrsGTTrZC9h5MTO417L/exec';

export default async function handler(req, res) {
  // Allow the React frontend (same Vercel domain) to call this
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Forward the request body to Apps Script
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    const response = await fetch(APPS_SCRIPT_URL, {
      method:   'POST',
      redirect: 'follow',  // follow the 302 — fine server-side
      headers:  { 'Content-Type': 'text/plain' },
      body:     body,
    });

    const text = await response.text();

    // Parse JSON if possible, otherwise return raw text
    try {
      const json = JSON.parse(text);
      return res.status(200).json(json);
    } catch (_) {
      return res.status(200).send(text);
    }

  } catch (err) {
    console.error('[proxy] fetch error:', err.message);
    return res.status(500).json({
      status:  'error',
      message: 'Proxy could not reach Apps Script: ' + err.message,
      code:    'PROXY_ERROR',
    });
  }
}
