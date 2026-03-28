import { MAX_FILE_SIZE_BYTES, ACCEPTED_TYPES } from './constants.js';

/**
 * validateFile — Checks size and mime type.
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateFile(file) {
  if (!file) {
    return { valid: false, error: 'Please select an image.' };
  }
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Please upload a JPG or PNG image.' };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    return { valid: false, error: `Image too large (${mb}MB). Maximum size is 5MB.` };
  }
  return { valid: true };
}
