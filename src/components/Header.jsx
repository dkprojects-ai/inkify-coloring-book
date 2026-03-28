export default function Header() {
  return (
    <header className="w-full px-6 py-5 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-sm"
          style={{ background: 'var(--forest)' }}
        >
          ✏️
        </div>
        <span
          className="font-display font-bold text-xl tracking-tight"
          style={{ color: 'var(--ink)' }}
        >
          Inkify
        </span>
      </div>

      {/* Tagline (desktop only) */}
      <p
        className="hidden md:block text-sm font-medium"
        style={{ color: 'rgba(28,24,20,0.45)' }}
      >
        Turn photos into coloring pages
      </p>

      {/* Badge */}
      <div
        className="text-xs font-semibold px-3 py-1.5 rounded-full"
        style={{
          background: 'rgba(46,107,62,0.1)',
          color: 'var(--forest)',
          border: '1px solid rgba(46,107,62,0.2)',
        }}
      >
        AI Powered
      </div>
    </header>
  );
}
