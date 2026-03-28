import { useState, useCallback } from 'react';
import Header   from './components/Header.jsx';
import Toast    from './components/Toast.jsx';
import HomePage        from './pages/HomePage.jsx';
import ProcessingPage  from './pages/ProcessingPage.jsx';
import DownloadPage    from './pages/DownloadPage.jsx';
import { useAuth }     from './hooks/useAuth.js';

/**
 * App — Root component.
 * Manages page state: 'home' → 'processing' → 'download' (or back to 'home' on error).
 */
export default function App() {
  const { userId }   = useAuth();

  // ── Page routing ──────────────────────────────────────────────────────────
  const [page, setPage]             = useState('home');       // 'home' | 'processing' | 'download'
  const [jobId, setJobId]           = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('cartoon');
  const [downloadUrl, setDownloadUrl]     = useState(null);

  // ── Toast ─────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState({ message: '', type: 'error' });
  const showToast = useCallback((message, type = 'error') => setToast({ message, type }), []);
  const clearToast = useCallback(() => setToast(t => ({ ...t, message: '' })), []);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleJobStarted = useCallback((newJobId, style) => {
    setJobId(newJobId);
    setSelectedStyle(style);
    setPage('processing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleComplete = useCallback((url) => {
    setDownloadUrl(url);
    setPage('download');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleError = useCallback((message) => {
    showToast(message, 'error');
    setPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [showToast]);

  const handleCreateAnother = useCallback(() => {
    setJobId(null);
    setDownloadUrl(null);
    setPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* ── Breadcrumb stepper ──────────────────────────────────────── */}
      <div className="flex justify-center mb-8 px-4">
        <div className="flex items-center gap-2 text-xs font-semibold">
          {[
            { id: 'home',       label: '1. Upload'   },
            { id: 'processing', label: '2. Generate' },
            { id: 'download',   label: '3. Download' },
          ].map((step, i, arr) => (
            <span key={step.id} className="flex items-center gap-2">
              <span
                className="px-3 py-1 rounded-full transition-all"
                style={{
                  background: page === step.id
                    ? 'var(--forest)'
                    : 'rgba(28,24,20,0.07)',
                  color: page === step.id
                    ? 'white'
                    : 'rgba(28,24,20,0.35)',
                }}
              >
                {step.label}
              </span>
              {i < arr.length - 1 && (
                <span style={{ color: 'rgba(28,24,20,0.2)' }}>›</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* ── Pages ───────────────────────────────────────────────────── */}
      <main className="flex-1">
        {page === 'home' && (
          <HomePage
            userId={userId}
            onJobStarted={handleJobStarted}
            onError={(msg) => showToast(msg, 'error')}
          />
        )}

        {page === 'processing' && (
          <ProcessingPage
            jobId={jobId}
            userId={userId}
            style={selectedStyle}
            onComplete={handleComplete}
            onError={handleError}
            onCancel={handleCreateAnother}
          />
        )}

        {page === 'download' && (
          <DownloadPage
            downloadUrl={downloadUrl}
            style={selectedStyle}
            userId={userId}
            onCreateAnother={handleCreateAnother}
          />
        )}
      </main>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="text-center py-6 text-xs" style={{ color: 'rgba(28,24,20,0.25)' }}>
        Inkify · AI Coloring Book · Built with Nano Banana AI + Google Apps Script
      </footer>

      {/* ── Global Toast ────────────────────────────────────────────── */}
      <Toast
        message={toast.message}
        type={toast.type}
        onDismiss={clearToast}
      />
    </div>
  );
}
