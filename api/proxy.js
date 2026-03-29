/**
 * /api/proxy.js — Vercel Serverless Function (CommonJS)
 *
 * Rewrote as CommonJS + native https module to avoid:
 *  - ES module/CommonJS conflicts in Vercel runtime
 *  - fetch() availability issues across Node versions
 */

const https = require('https');
const url   = require('url');

const APPS_SCRIPT_URL =
  process.env.VITE_APPS_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbwq3HPXl6hrzLeGid9j94VXBjkROqw-D_CQqEJHQsCCm24w9hrsGTTrZC9h5MTO417L/exec';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  try {
    const bodyString = typeof req.body === 'string'
      ? req.body
      : JSON.stringify(req.body);

    console.log('[proxy] action:', req.body?.action);

    // Use httpsPost which follows redirects manually
    const rawText = await httpsPost(APPS_SCRIPT_URL, bodyString);

    console.log('[proxy] raw response (500 chars):', rawText.substring(0, 500));

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (_) {
      console.error('[proxy] non-JSON from GAS:', rawText.substring(0, 500));
      return res.status(200).json({
        status:  'error',
        message: 'Apps Script returned unexpected response. Check deployment settings.',
        code:    'GAS_INVALID_RESPONSE',
        debug:   rawText.substring(0, 300),
      });
    }

    return res.status(200).json(parsed);

  } catch (err) {
    console.error('[proxy] error:', err.message);
    return res.status(500).json({
      status:  'error',
      message: 'Proxy error: ' + err.message,
      code:    'PROXY_ERROR',
    });
  }
};

/**
 * httpsPost — makes a POST request following up to 5 redirects.
 * Returns the final response body as a string.
 */
function httpsPost(targetUrl, body, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error('Too many redirects'));

    const parsed = new url.URL(targetUrl);
    const bodyBuffer = Buffer.from(body, 'utf-8');

    const options = {
      hostname: parsed.hostname,
      path:     parsed.pathname + parsed.search,
      method:   'POST',
      headers:  {
        'Content-Type':   'text/plain;charset=utf-8',
        'Content-Length': bodyBuffer.length,
        'User-Agent':     'Vercel-Proxy/1.0',
      },
    };

    const reqHttp = https.request(options, (response) => {
      // Follow 301 / 302 redirects (GET on redirect, as browsers do)
      if ([301, 302, 303, 307, 308].includes(response.statusCode) && response.headers.location) {
        const nextUrl = response.headers.location.startsWith('http')
          ? response.headers.location
          : `https://${parsed.hostname}${response.headers.location}`;

        console.log(`[proxy] redirect ${response.statusCode} → ${nextUrl}`);

        // GAS redirects to a GET endpoint — switch to GET after 302
        if ([301, 302, 303].includes(response.statusCode)) {
          return httpsGet(nextUrl, redirectCount + 1).then(resolve).catch(reject);
        }
        return httpsPost(nextUrl, body, redirectCount + 1).then(resolve).catch(reject);
      }

      let data = '';
      response.on('data', chunk => { data += chunk; });
      response.on('end',  ()    => resolve(data));
    });

    reqHttp.on('error', reject);
    reqHttp.write(bodyBuffer);
    reqHttp.end();
  });
}

/**
 * httpsGet — makes a GET request (used after 302 redirect from Apps Script).
 */
function httpsGet(targetUrl, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error('Too many redirects'));

    const parsed = new url.URL(targetUrl);

    const options = {
      hostname: parsed.hostname,
      path:     parsed.pathname + parsed.search,
      method:   'GET',
      headers:  { 'User-Agent': 'Vercel-Proxy/1.0' },
    };

    const reqHttp = https.request(options, (response) => {
      if ([301, 302, 303, 307, 308].includes(response.statusCode) && response.headers.location) {
        const nextUrl = response.headers.location.startsWith('http')
          ? response.headers.location
          : `https://${parsed.hostname}${response.headers.location}`;
        return httpsGet(nextUrl, redirectCount + 1).then(resolve).catch(reject);
      }

      let data = '';
      response.on('data', chunk => { data += chunk; });
      response.on('end',  ()    => resolve(data));
    });

    reqHttp.on('error', reject);
    reqHttp.end();
  });
}
