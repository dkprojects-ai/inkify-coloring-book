import { useState, useRef, useCallback } from 'react';
import { validateFile } from '../utils/validators.js';
import { createPreviewURL, formatBytes } from '../utils/fileHelpers.js';

/**
 * ImageUpload — Drag-and-drop + click-to-browse file input.
 *
 * Props:
 *   onFileSelected(file, previewUrl) — called when a valid file is chosen
 *   onError(message)                 — called on validation failure
 *   selectedFile                     — currently selected File (or null)
 *   previewUrl                       — object URL for preview (or null)
 *   onClear()                        — called when user removes the image
 */
export default function ImageUpload({ onFileSelected, onError, selectedFile, previewUrl, onClear }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = useCallback((file) => {
    const { valid, error } = validateFile(file);
    if (!valid) { onError(error); return; }
    const url = createPreviewURL(file);
    onFileSelected(file, url);
  }, [onFileSelected, onError]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = ()  => setIsDragging(false);

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  // ── Preview state ──────────────────────────────────────────────────────────
  if (selectedFile && previewUrl) {
    return (
      <div className="paper-card p-4 animate-fade-up">
        <div className="flex items-start gap-4">
          {/* Thumbnail */}
          <div className="relative flex-shrink-0">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-xl shadow-sm"
              style={{ border: '1.5px solid rgba(28,24,20,0.1)' }}
            />
            <div
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs shadow"
              style={{ background: 'var(--forest)', color: 'white' }}
            >
              ✓
            </div>
          </div>

          {/* File info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate" style={{ color: 'var(--ink)' }}>
              {selectedFile.name}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(28,24,20,0.45)' }}>
              {formatBytes(selectedFile.size)} · {selectedFile.type.split('/')[1].toUpperCase()}
            </p>
            <p className="text-xs mt-2 font-medium" style={{ color: 'var(--forest)' }}>
              Image ready for processing
            </p>
          </div>

          {/* Clear button */}
          <button
            onClick={onClear}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold transition-all hover:opacity-80"
            style={{
              background: 'rgba(28,24,20,0.07)',
              color: 'rgba(28,24,20,0.5)',
            }}
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  // ── Drop zone ──────────────────────────────────────────────────────────────
  return (
    <div
      className={`drop-zone p-10 text-center cursor-pointer ${isDragging ? 'drag-over' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      aria-label="Upload image"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Icon */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm"
        style={{
          background: isDragging
            ? 'rgba(46,107,62,0.15)'
            : 'rgba(46,107,62,0.08)',
          border: '1.5px solid rgba(46,107,62,0.2)',
          transition: 'all 0.25s ease',
        }}
      >
        {isDragging ? '✅' : '🖼️'}
      </div>

      <p className="font-display font-semibold text-lg mb-1" style={{ color: 'var(--ink)' }}>
        {isDragging ? 'Release to upload' : 'Drop your image here'}
      </p>
      <p className="text-sm" style={{ color: 'rgba(28,24,20,0.45)' }}>
        or{' '}
        <span className="underline font-semibold" style={{ color: 'var(--forest)' }}>
          browse files
        </span>
      </p>
      <p className="text-xs mt-3" style={{ color: 'rgba(28,24,20,0.35)' }}>
        JPG or PNG · Max 5MB
      </p>
    </div>
  );
}
