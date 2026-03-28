import { APPS_SCRIPT_URL } from '../utils/constants.js';

/**
 * post — Generic POST helper for the Apps Script backend.
 * Apps Script Web Apps sometimes redirect POST → GET, so we follow redirects.
 *
 * @param {Object} body - JSON payload
 * @returns {Promise<Object>} - Parsed JSON response
 */
async function post(body) {
  const response = await fetch(APPS_SCRIPT_URL, {
    method:   'POST',
    redirect: 'follow',
    headers:  { 'Content-Type': 'text/plain' }, // 'text/plain' avoids CORS preflight with Apps Script
    body:     JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (_) {
    throw new Error('Invalid JSON response from server: ' + text.substring(0, 200));
  }
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * generateColoringPage — Submits a new coloring-page generation job.
 *
 * @param {string} imageBase64 - Pure base64 image (no data-URI prefix)
 * @param {string} userId
 * @param {string} style       - 'cartoon' | 'realistic' | 'sketch'
 * @param {string} lineWidth   - 'thin' | 'medium' | 'thick'
 * @param {number} imageSizeBytes
 * @returns {Promise<{ status: string, jobId: string, estimatedTime: number, message: string }>}
 */
export async function generateColoringPage(imageBase64, userId, style, lineWidth, imageSizeBytes) {
  const data = await post({
    action:         'generate-coloring-page',
    image:          imageBase64,
    userId:         userId,
    style:          style,
    lineWidth:      lineWidth,
    imageSizeBytes: imageSizeBytes,
  });

  if (data.status === 'error') {
    const err = new Error(data.message || 'Failed to start generation.');
    err.code = data.code;
    throw err;
  }

  return data;
}

/**
 * checkJobStatus — Polls the backend for a job's current status.
 *
 * @param {string} jobId
 * @param {string} userId
 * @returns {Promise<{ status: string, jobId: string, downloadUrl?: string, eta?: number, errorMessage?: string }>}
 */
export async function checkJobStatus(jobId, userId) {
  const data = await post({
    action: 'check-status',
    jobId:  jobId,
    userId: userId,
  });
  return data;
}

/**
 * listMyColoringBooks — Returns all completed PDFs for the given user.
 *
 * @param {string} userId
 * @returns {Promise<{ status: string, pdfs: Array, totalCount: number }>}
 */
export async function listMyColoringBooks(userId) {
  const data = await post({
    action: 'list-my-pdfs',
    userId: userId,
  });
  return data;
}
