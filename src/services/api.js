/**
 * services/api.js
 * All calls go through /api/proxy (Vercel serverless) to avoid CORS.
 */

const PROXY_URL = '/api/proxy';

async function post(body) {
  const response = await fetch(PROXY_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (_) {
    throw new Error('Unexpected server response: ' + text.substring(0, 200));
  }

  // Surface debug info from proxy if present
  if (data.status === 'error') {
    const detail = data.debug ? ` | Debug: ${data.debug.substring(0, 120)}` : '';
    const err = new Error((data.message || 'Unknown error') + detail);
    err.code = data.code;
    throw err;
  }

  return data;
}

export async function generateColoringPage(imageBase64, userId, style, lineWidth, imageSizeBytes) {
  return post({
    action: 'generate-coloring-page',
    image:  imageBase64,
    userId,
    style,
    lineWidth,
    imageSizeBytes,
  });
}

export async function checkJobStatus(jobId, userId) {
  return post({ action: 'check-status', jobId, userId });
}

export async function listMyColoringBooks(userId) {
  return post({ action: 'list-my-pdfs', userId });
}
