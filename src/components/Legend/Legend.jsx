import "./Legend.css";

const ITEMS = [
  { bg: "#166534", border: "#4ade80", label: "✓ Correct" },
  { bg: "#7f1d1d", border: "#f87171", label: "✗ Wrong" },
  { bg: "#78350f", border: "#fcd34d", label: "▲▼ Higher / Lower" },
];

export default function Legend() {
  return (
    <>
    <div className="legend">
      {ITEMS.map(({ bg, border, label }) => (
        <div key={label} className="legend__item">
          <div className="legend__swatch" style={{ background: bg, borderColor: border }} />
          <span>{label}</span>
        </div>
      ))}
    </div>
    <p className="legend__note">A red clue for age indicates that the mystery character has no specified age.</p>
    </>
  );
}
