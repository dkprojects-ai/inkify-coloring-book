import { STYLES, LINE_WIDTHS } from '../utils/constants.js';

/**
 * StyleSelector — Grid of style cards + line-width toggle.
 *
 * Props:
 *   style        — selected style value
 *   lineWidth    — selected lineWidth value
 *   onStyleChange(value)
 *   onLineWidthChange(value)
 */
export default function StyleSelector({ style, lineWidth, onStyleChange, onLineWidthChange }) {
  return (
    <div>
      {/* ── Style grid ──────────────────────────────────────────────────── */}
      <label className="block text-xs font-semibold uppercase tracking-widest mb-3"
             style={{ color: 'rgba(28,24,20,0.4)' }}>
        Art Style
      </label>
      <div className="grid grid-cols-3 gap-3">
        {STYLES.map((s) => (
          <button
            key={s.value}
            className={`style-card p-4 text-left ${style === s.value ? 'selected' : ''}`}
            onClick={() => onStyleChange(s.value)}
            type="button"
          >
            <div className="text-2xl mb-2">{s.emoji}</div>
            <div className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>
              {s.label}
            </div>
            <div className="text-xs mt-0.5 leading-snug" style={{ color: 'rgba(28,24,20,0.45)' }}>
              {s.description}
            </div>
          </button>
        ))}
      </div>

      {/* ── Line Width toggle ────────────────────────────────────────────── */}
      <label className="block text-xs font-semibold uppercase tracking-widest mt-5 mb-3"
             style={{ color: 'rgba(28,24,20,0.4)' }}>
        Line Weight
      </label>
      <div
        className="flex rounded-xl p-1 gap-1"
        style={{ background: 'rgba(28,24,20,0.06)' }}
      >
        {LINE_WIDTHS.map((w) => (
          <button
            key={w.value}
            className="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all"
            style={{
              background: lineWidth === w.value ? '#FFFEF5' : 'transparent',
              color: lineWidth === w.value ? 'var(--forest)' : 'rgba(28,24,20,0.45)',
              boxShadow: lineWidth === w.value ? '0 1px 6px rgba(0,0,0,0.08)' : 'none',
              border: lineWidth === w.value ? '1px solid rgba(46,107,62,0.2)' : '1px solid transparent',
            }}
            onClick={() => onLineWidthChange(w.value)}
            type="button"
          >
            {w.label}
          </button>
        ))}
      </div>
    </div>
  );
}
