import "./ModeSelector.css";

export default function ModeSelector({ mode, onSelect, dailyDone }) {
  return (
    <div className="mode-selector">
      <button
        className={`mode-selector__btn ${mode === "daily" ? "mode-selector__btn--active" : ""}`}
        onClick={() => onSelect("daily")}
      >
        Daily mode
      </button>
      <button
        className={`mode-selector__btn ${mode === "infinite" ? "mode-selector__btn--active" : ""}`}
        onClick={() => onSelect("infinite")}
        disabled={!dailyDone}
        title={!dailyDone ? "Finish today's daily first" : ""}
      >
        ∞ Infinite mode
      </button>
    </div>
  );
}
