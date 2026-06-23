import { useState, useMemo } from "react";
import "./HintPanel.css";

export default function HintPanel({ db, guessedRows, onHintUsed }) {
  const [open, setOpen] = useState(false);
  const [section1Open, setSection1Open] = useState(false);
  const [section2Open, setSection2Open] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState(null);

  const guessedStudios = useMemo(
    () => new Set(guessedRows.map((r) => r.character.anime.studio)),
    [guessedRows]
  );

  // Section 1: all studios in DB → list of anime for selected one
  const allStudios = useMemo(
    () => [...new Set(db.map((c) => c.anime.studio))].sort(),
    [db]
  );

  const animeForStudio = useMemo(() => {
    if (!selectedStudio) return [];
    return [...new Set(db.filter((c) => c.anime.studio === selectedStudio).map((c) => c.anime.name))].sort();
  }, [db, selectedStudio]);

  // Section 2: studios not yet guessed, with character count
  const unguessedStudios = useMemo(() => {
    const map = {};
    db.forEach((c) => {
      if (!guessedStudios.has(c.anime.studio)) {
        if (!map[c.anime.studio]) map[c.anime.studio] = new Set();
        map[c.anime.studio].add(c.anime.name);
      }
    });
    return Object.entries(map)
      .map(([studio, animes]) => [studio, animes.size])
      .sort((a, b) => b[1] - a[1]);
  }, [db, guessedStudios]);

  const handleSection1Open = () => {
    const next = !section1Open;
    setSection1Open(next);
    if (next) onHintUsed();
  };

  const handleSection2Open = () => {
    const next = !section2Open;
    setSection2Open(next);
    if (next) onHintUsed();
  };

  return (
    <div className={`hint-panel ${open ? "hint-panel--open" : ""}`}>
      <button className="hint-panel__toggle" onClick={() => setOpen((v) => !v)}>
        <span className="hint-panel__toggle-icon">{open ? "✕" : "💡"}</span>
        {open && <span className="hint-panel__toggle-label">Hints</span>}
      </button>

      {open && (
        <div className="hint-panel__content">
          <p className="hint-panel__title">Hints</p>

          {/* Section 1 — Studio → Anime list */}
          <div className="hint-section">
            <button className="hint-section__header" onClick={handleSection1Open}>
              <span>Anime by studio</span>
              <span className="hint-section__chevron">{section1Open ? "▲" : "▼"}</span>
            </button>
            {section1Open && (
              <div className="hint-section__body">
                <select
                  className="hint-section__select"
                  value={selectedStudio ?? ""}
                  onChange={(e) => setSelectedStudio(e.target.value || null)}
                >
                  <option value="">Select a studio…</option>
                  {allStudios.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {selectedStudio && (
                  <ul className="hint-section__list">
                    {animeForStudio.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Section 2 — Unguessed studios + count */}
          <div className="hint-section">
            <button className="hint-section__header" onClick={handleSection2Open}>
              <span>Studios not yet guessed</span>
              <span className="hint-section__chevron">{section2Open ? "▲" : "▼"}</span>
            </button>
            {section2Open && (
              <div className="hint-section__body">
                {unguessedStudios.length === 0 ? (
                  <p className="hint-section__empty">All studios guessed!</p>
                ) : (
                  <ul className="hint-section__list">
                    {unguessedStudios.map(([studio, count]) => (
                      <li key={studio} className="hint-section__studio-row">
                        <span>{studio}</span>
                        <span className="hint-section__badge">{count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
