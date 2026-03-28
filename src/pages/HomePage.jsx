import { useState, useCallback } from 'react';
import ImageUpload from '../components/ImageUpload.jsx';
import StyleSelector from '../components/StyleSelector.jsx';
import { fileToBase64 } from '../utils/fileHelpers.js';
import { generateColoringPage } from '../services/api.js';

/**
 * HomePage — Upload, configure, and submit a new coloring-page job.
 *
 * Props:
 *   userId      — anonymous user id from useAuth
 *   onJobStarted(jobId, style) — called when backend accepts the job
 *   onError(message)           — called on any failure
 */
export default function HomePage({ userId, onJobStarted, onError }) {
  const [file, setFile]           = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [style, setStyle]         = useState('cartoon');
  const [lineWidth, setLineWidth] = useState('medium');
  const [loading, setLoading]     = useState(false);

  const handleFileSelected = useCallback((f, url) => {
    setFile(f);
    setPreviewUrl(url);
  }, []);

  const handleClear = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
  }, [previewUrl]);

  const handleSubmit = async () => {
    if (!file || !userId || loading) return;
    setLoading(true);
    try {
      const base64 = await fileToBase64(file);
      const result = await generateColoringPage(base64, userId, style, lineWidth, file.size);
      onJobStarted(result.jobId, style);
    } catch (err) {
      onError(err.message || 'Failed to start processing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = !!file && !loading;

  return (
    <div className="max-w-xl mx-auto px-4 pb-16">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="text-center mb-10 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-5"
             style={{ background: 'rgba(46,107,62,0.1)', color: 'var(--forest)', border: '1px solid rgba(46,107,62,0.18)' }}>
          ✨ Powered by Nano Banana AI
        </div>
        <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight mb-3"
            style={{ color: 'var(--ink)' }}>
          Turn any photo into a<br />
          <em className="not-italic" style={{ color: 'var(--forest)' }}>coloring masterpiece</em>
        </h1>
        <p className="text-base leading-relaxed" style={{ color: 'rgba(28,24,20,0.5)' }}>
          Upload a photo, choose your style, and get a print-ready PDF in seconds.
        </p>
      </div>

      {/* ── Main Card ─────────────────────────────────────────────────── */}
      <div className="paper-card p-6 space-y-6 animate-fade-up delay-100">

        {/* Upload */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-3"
                 style={{ color: 'rgba(28,24,20,0.4)' }}>
            Your Photo
          </label>
          <ImageUpload
            onFileSelected={handleFileSelected}
            onError={onError}
            selectedFile={file}
            previewUrl={previewUrl}
            onClear={handleClear}
          />
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(28,24,20,0.07)' }} />

        {/* Style selector */}
        <StyleSelector
          style={style}
          lineWidth={lineWidth}
          onStyleChange={setStyle}
          onLineWidthChange={setLineWidth}
        />

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(28,24,20,0.07)' }} />

        {/* Submit */}
        <button
          className="btn-primary w-full"
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{ padding: '16px 32px', fontSize: '16px' }}
        >
          {loading ? (
            <>
              <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
              Sending to AI…
            </>
          ) : (
            <>
              <span>✏️</span>
              Generate Coloring Page
            </>
          )}
        </button>

        {!file && (
          <p className="text-center text-xs" style={{ color: 'rgba(28,24,20,0.35)', marginTop: '-4px' }}>
            Select an image above to get started
          </p>
        )}
      </div>

      {/* ── Feature highlights ────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mt-8 animate-fade-up delay-300">
        {[
          { icon: '⚡', label: 'Fast',        sub: '15–30 seconds' },
          { icon: '🖨️', label: 'Print-ready', sub: 'US Letter PDF'  },
          { icon: '🎨', label: '3 Styles',    sub: 'Cartoon · Realistic · Sketch' },
        ].map(({ icon, label, sub }) => (
          <div key={label} className="text-center p-4 rounded-2xl"
               style={{ background: 'rgba(255,254,245,0.8)', border: '1px solid rgba(28,24,20,0.07)' }}>
            <div className="text-2xl mb-1">{icon}</div>
            <div className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>{label}</div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(28,24,20,0.4)' }}>{sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
