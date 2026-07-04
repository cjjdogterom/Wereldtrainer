// Typografisch "embleem" per competitie — vervangt de emoji-iconen en geeft
// elke competitie een eigen, rustig herkenningsteken.
const MONOGRAMS: Record<string, string> = {
  eredivisie: 'ED',
  'knvb-beker': 'KB',
  'champions-league': 'CL',
  wk: 'WK',
  ek: 'EK',
};

export default function CompetitionMark({ id, color, size = 44 }: { id: string; color?: string; size?: number }) {
  return (
    <span
      className="comp-mark"
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.34), background: color ?? 'var(--primary-color)' }}
    >
      {MONOGRAMS[id] ?? id.slice(0, 2).toUpperCase()}
    </span>
  );
}
