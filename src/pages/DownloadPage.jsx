import { useState, useEffect, useCallback } from 'react';
import { listMyColoringBooks } from '../services/api.js';

/* ── Tiny confetti burst (CSS-only, no lib needed) ──────────────────────── */
const CONFETTI_COLORS = ['#2E6B3E', '#D4613F', '#6B8FCC', '#C9954C', '#52A165', '#E8785A'];

function ConfettiDot({ style: extraStyle, color }) {
  return (
    <div
      className="confetti-dot"
      style={{
        background: color,
        ...extraStyle,
      }}
    />
  );
}

function ConfettiBurst() {
  const dots = Array.from({ length: 14 }, (_, i) => ({
    left:  `${10 + Math.random() * 80}%`,
    top:   `${-10 + Math.random() * 30}%`,
    animationDelay: `${Math.random() * 0.6}s`,
    animationDuration: `${1.4 + Math.random() * 0.8}s`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {dots.map((d, i) => (
        <ConfettiDot key={i} color={d.color} style={{ left: d.left, top: d.top, animationDelay: d.animationDelay, animationDuration: d.animationDuration }} />
      ))}
    </div>
  );
}

/* ── History row ─────────────────────────────────────────────────────────── */
function HistoryRow({ pdf }) {
  const date = pdf.createdAt
    ? new Date(pdf.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';

  return (
    <div className="flex items-center justify-between py-3"
         style={{ borderBottom: '1px solid rgba(28,24,20,0.06)' }}>
      <div>
        <p className="text-sm font-semibold truncate max-w-[180px]" style={{ color: 'var(--ink)' }}>
          {pdf.style ? pdf.style.charAt(0).toUpperCase() + pdf.style.slice(1) : 'Coloring'} Page
        </p>
        <p className="text-xs" style={{ color: 'rgba(28,24,20,0.38)' }}>{date}</p>
      </div>
      <a
        href={pdf.downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:opacity-80"
        style={{ background: 'rgba(46,107,62,0.1)', color: 'var(--forest)', border: '1px solid rgba(46,107,62,0.2)' }}
      >
        Open PDF ↗
      </a>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────── */
/**
 * DownloadPage — Success screen shown after a coloring page is generated.
 *
 * Props:
 *   downloadUrl  — Google Drive shareable link to the PDF
 *   style        — chosen style
 *   userId       — for fetching history
 *   onCreateAnother() — returns user to home
 */
export default function DownloadPage({ downloadUrl, style, userId, onCreateAnother }) {
  const [copied, setCopied]     = useState(false);
  const [history, setHistory]   = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showHistory, setShowHistory]       = useState(false);

  // Load user history
  useEffect(() => {
    if (!userId) return;
    listMyColoringBooks(userId)
      .then(res => {
        if (res.status === 'success') setHistory(res.pdfs || []);
      })
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  }, [userId]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(downloadUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }, [downloadUrl]);

  const styleLabel = style ? style.charAt(0).toUpperCase() + style.slice(1) : 'Coloring';
  const styleEmoji = { cartoon: '🎨', realistic: '🖋️', sketch: '✏️' }[style] || '🎨';

  return (
    <div className="max-w-lg mx-auto px-4 pb-16">

      {/* ── Success hero ─────────────────────────────────────────────── */}
      <div className="paper-card relative overflow-visible text-center p-8 mb-6 animate-fade-up">
        <ConfettiBurst />

        {/* Checkmark badge */}
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-5 shadow-lg"
             style={{ background: 'linear-gradient(135deg, #2E6B3E, #52A165)' }}>
          ✓
        </div>

        <h2 className="font-display font-bold text-3xl md:text-4xl mb-2" style={{ color: 'var(--ink)' }}>
          Your coloring page<br />is ready!
        </h2>
        <p className="text-sm mb-6" style={{ color: 'rgba(28,24,20,0.45)' }}>
          {styleEmoji} {styleLabel} style · Print-ready PDF · US Letter
        </p>

        {/* ── Primary download CTA ─────────────────────────────────── */}
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-download"
          style={{ width: '100%', marginBottom: '12px' }}
        >
          <span>⬇</span>
          Download PDF
        </a>

        {/* ── Secondary actions ────────────────────────────────────── */}
        <div className="flex gap-3">
          <button
            className="btn-secondary flex-1"
            onClick={handleCopyLink}
            style={{ fontSize: '13px', padding: '10px 16px' }}
          >
            {copied ? '✅ Copied!' : '🔗 Copy Link'}
          </button>
          <button
            className="btn-secondary flex-1"
            onClick={onCreateAnother}
            style={{ fontSize: '13px', padding: '10px 16px' }}
          >
            ✏️ Make Another
          </button>
        </div>
      </div>

      {/* ── How to print ─────────────────────────────────────────────── */}
      <div className="paper-card p-5 mb-4 animate-fade-up delay-100">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--ink)' }}>
          🖨️ How to print
        </h3>
        <ol className="space-y-1.5">
          {[
            'Click "Download PDF" above to open in Google Drive',
            'In Google Drive, click the print icon (or Ctrl+P / ⌘P)',
            'Choose your printer and select "Fit to page"',
            'Print on white paper for best results',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm"
                style={{ color: 'rgba(28,24,20,0.55)' }}>
              <span className="flex-shrink-0 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                    style={{ background: 'rgba(46,107,62,0.12)', color: 'var(--forest)' }}>
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* ── History section ──────────────────────────────────────────── */}
      {history.length > 1 && (
        <div className="paper-card p-5 animate-fade-up delay-200">
          <button
            className="w-full flex items-center justify-between"
            onClick={() => setShowHistory(v => !v)}
          >
            <h3 className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>
              📚 My Coloring Books ({history.length})
            </h3>
            <span className="text-xs" style={{ color: 'rgba(28,24,20,0.35)' }}>
              {showHistory ? '▲ Hide' : '▼ Show'}
            </span>
          </button>

          {showHistory && (
            <div className="mt-3">
              {loadingHistory ? (
                <p className="text-xs text-center py-3" style={{ color: 'rgba(28,24,20,0.35)' }}>Loading…</p>
              ) : (
                history.map(pdf => <HistoryRow key={pdf.jobId} pdf={pdf} />)
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
