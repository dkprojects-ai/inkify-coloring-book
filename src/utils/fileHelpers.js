/**
 * fileToBase64 — Converts a File/Blob to a pure base64 string (no data-URI prefix).
 * @param {File} file
 * @returns {Promise<string>}
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => {
      // result is "data:image/jpeg;base64,XXXXX" — strip the prefix
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

/**
 * formatBytes — Human-readable file size.
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

/**
 * createObjectURL — Wrapper to create a preview URL from a File.
 * @param {File} file
 * @returns {string} Object URL (remember to revoke when done)
 */
export function createPreviewURL(file) {
  return URL.createObjectURL(file);
}
