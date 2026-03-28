import { useState, useEffect, useRef } from 'react';
import ProgressBar from '../components/ProgressBar.jsx';
import { PROCESSING_TIPS } from '../utils/constants.js';
import { useJobStatus } from '../hooks/useJobStatus.js';

/**
 * ProcessingPage — Shows while the backend is generating the coloring page.
 *
 * Props:
 *   jobId      — active job id
 *   userId     — user id
 *   style      — chosen style (for display copy)
 *   onComplete(downloadUrl) — called when job finishes
 *   onError(message)         — called if job fails
 *   onCancel()               — returns user to home
 */
export default function ProcessingPage({ jobId, userId, style, onComplete, onError, onCancel }) {
  const [elapsed, setElapsed]   = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const timerRef                = useRef(null);

  // Tick elapsed seconds
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Rotate tips every 5 seconds
  useEffect(() => {
    const t = setInterval(() => {
      setTipIndex(i => (i + 1) % PROCESSING_TIPS.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // Poll backend
  useJobStatus(jobId, userId, onComplete, onError);

  const styleLabels = { cartoon: 'cartoon', realistic: 'realistic', sketch: 'sketch' };
  const styleEmojis = { cartoon: '🎨', realistic: '🖋️', sketch: '✏️' };

  const dots = ['', '.', '..', '...'][elapsed % 4];

  return (
    <div className="max-w-lg mx-auto px-4 pb-16 text-center">

      {/* ── Big pencil animation ──────────────────────────────────────── */}
      <div className="mt-4 mb-8 animate-fade-up">
        <div className="pencil-spinner text-6xl select-none" aria-hidden="true">✏️</div>
      </div>

      {/* ── Heading ───────────────────────────────────────────────────── */}
      <div className="animate-fade-up delay-100 mb-2">
        <h2 className="font-display font-bold text-3xl md:text-4xl" style={{ color: 'var(--ink)' }}>
          Drawing your {styleLabels[style] || 'coloring'} page{dots}
        </h2>
        <p className="mt-2 text-sm" style={{ color: 'rgba(28,24,20,0.45)' }}>
          {styleEmojis[style]} {style.charAt(0).toUpperCase() + style.slice(1)} style · Usually takes 15–30 seconds
        </p>
      </div>

      {/* ── Progress card ─────────────────────────────────────────────── */}
      <div className="paper-card p-6 mt-6 animate-fade-up delay-200">
        <ProgressBar elapsedSeconds={elapsed} totalSeconds={25} />

        {/* Elapsed timer */}
        <p className="text-xs mt-3 font-medium" style={{ color: 'rgba(28,24,20,0.35)' }}>
          {elapsed < 5  && 'Sending image to AI model…'}
          {elapsed >= 5  && elapsed < 12 && 'Analysing shapes and edges…'}
          {elapsed >= 12 && elapsed < 20 && 'Generating clean line art…'}
          {elapsed >= 20 && elapsed < 28 && 'Finalising and creating PDF…'}
          {elapsed >= 28 && 'Almost done — saving to Google Drive…'}
        </p>
      </div>

      {/* ── Rotating tip ──────────────────────────────────────────────── */}
      <div className="mt-6 animate-fade-up delay-300">
        <div className="inline-flex items-start gap-3 px-5 py-4 rounded-2xl text-left max-w-sm"
             style={{ background: 'rgba(46,107,62,0.07)', border: '1px solid rgba(46,107,62,0.12)' }}>
          <span className="text-lg flex-shrink-0 mt-0.5">💡</span>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(28,24,20,0.6)' }}>
            {PROCESSING_TIPS[tipIndex]}
          </p>
        </div>
      </div>

      {/* ── Job ID for reference ──────────────────────────────────────── */}
      <p className="text-xs mt-8 font-mono" style={{ color: 'rgba(28,24,20,0.2)' }}>
        Job: {jobId}
      </p>

      {/* ── Cancel ────────────────────────────────────────────────────── */}
      <button
        onClick={onCancel}
        className="mt-4 text-xs font-semibold underline-offset-2 hover:underline transition-all"
        style={{ color: 'rgba(28,24,20,0.3)' }}
      >
        Cancel and start over
      </button>
    </div>
  );
}
