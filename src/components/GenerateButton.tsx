'use client';

interface Props {
  hasPlan: boolean;
  loading: boolean;
  onClick: () => void;
}

export default function GenerateButton({ hasPlan, loading, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber text-bg text-sm font-semibold transition-all duration-150 hover:bg-amber-light active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber/20 hover:shadow-amber/30"
    >
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
            <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Generating…
        </>
      ) : hasPlan ? (
        <>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
            <path d="M4 10h12M14 6l4 4-4 4" />
          </svg>
          Regenerate
        </>
      ) : (
        <>
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          Generate Week
        </>
      )}
    </button>
  );
}
