// ─── Backend ──────────────────────────────────────────────────────────────────
// Your live Google Apps Script deployment URL.
// To update: change VITE_APPS_SCRIPT_URL in your Vercel environment variables.
export const APPS_SCRIPT_URL =
  import.meta.env.VITE_APPS_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbwq3HPXl6hrzLeGid9j94VXBjkROqw-D_CQqEJHQsCCm24w9hrsGTTrZC9h5MTO417L/exec';

// ─── Polling ──────────────────────────────────────────────────────────────────
export const POLL_INTERVAL_MS   = 2500;   // how often the frontend checks status
export const POLL_TIMEOUT_MS    = 330000; // 5.5 minutes — slightly over backend timeout

// ─── File Validation ──────────────────────────────────────────────────────────
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ACCEPTED_TYPES      = ['image/jpeg', 'image/png', 'image/jpg'];

// ─── Style Options ────────────────────────────────────────────────────────────
export const STYLES = [
  {
    value:       'cartoon',
    label:       'Cartoon',
    description: 'Bold outlines, great for kids',
    emoji:       '🎨',
    accent:      '#4CAF82',
  },
  {
    value:       'realistic',
    label:       'Realistic',
    description: 'Fine detail for advanced colorists',
    emoji:       '🖋️',
    accent:      '#6B8FCC',
  },
  {
    value:       'sketch',
    label:       'Sketch',
    description: 'Loose, hand-drawn feeling',
    emoji:       '✏️',
    accent:      '#C9954C',
  },
];

export const LINE_WIDTHS = [
  { value: 'thin',   label: 'Thin' },
  { value: 'medium', label: 'Medium' },
  { value: 'thick',  label: 'Thick' },
];

// ─── Processing Tips ──────────────────────────────────────────────────────────
export const PROCESSING_TIPS = [
  'Clear, well-lit photos produce the best line art.',
  'Simple backgrounds give cleaner results.',
  'Portraits and animals work especially well!',
  'Your PDF will be US Letter size and print-ready.',
  'Line art is generated at full resolution.',
  'Try the cartoon style for younger colorists.',
];
