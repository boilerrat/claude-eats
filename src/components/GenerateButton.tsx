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
      className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Generating…' : hasPlan ? 'Regenerate Week' : 'Generate Week'}
    </button>
  );
}
