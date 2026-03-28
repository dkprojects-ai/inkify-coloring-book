import { useEffect } from 'react';

const ICONS = { error: '⚠️', success: '✅', info: 'ℹ️' };

/**
 * Toast — Temporary notification bubble.
 *
 * Props:
 *   message  — text to display
 *   type     — 'error' | 'success' | 'info'
 *   onDismiss — called after auto-dismiss (or on click)
 *   duration — ms before auto-dismiss (default 4000)
 */
export default function Toast({ message, type = 'error', onDismiss, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [message, duration, onDismiss]);

  if (!message) return null;

  return (
    <div className={`toast ${type}`} onClick={onDismiss} style={{ cursor: 'pointer' }}>
      <span>{ICONS[type]}</span>
      <span>{message}</span>
    </div>
  );
}
