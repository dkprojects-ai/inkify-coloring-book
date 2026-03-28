/**
 * ProgressBar — Animated shimmer bar showing elapsed processing time.
 *
 * Props:
 *   elapsedSeconds — how many seconds have passed
 *   totalSeconds   — estimated total duration (default 25)
 */
export default function ProgressBar({ elapsedSeconds = 0, totalSeconds = 25 }) {
  const pct = Math.min(Math.round((elapsedSeconds / totalSeconds) * 100), 95); // cap at 95 until truly done

  return (
    <div>
      <div className="flex justify-between text-xs font-semibold mb-2"
           style={{ color: 'rgba(28,24,20,0.4)' }}>
        <span>Processing…</span>
        <span>{pct}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
