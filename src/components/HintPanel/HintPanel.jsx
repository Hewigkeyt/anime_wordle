import { useState, useMemo, useEffect } from "react";
import "./HintPanel.css";

export default function HintPanel({ db, guessedRows, onHintUsed, variant = "inline", target }) {
  const [open, setOpen] = useState(false);
  const [section1Open, setSection1Open] = useState(false);
  const [section2Open, setSection2Open] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState(null);

  const guessedStudios = useMemo(
    () => new Set(guessedRows.flatMap((r) => Array.isArray(r.character.anime.studio)
      ? r.character.anime.studio
      : [r.character.anime.studio])),
    [guessedRows]
  );

  const correctStudios = useMemo(
    () => new Set(Array.isArray(target.anime.studio) ? target.anime.studio : [target.anime.studio]),
    [target]
  );

  // Section 1: all studios in DB → list of anime for selected one
  // const allStudios = useMemo(
  //   () => [...new Set(db.flatMap((c) => Array.isArray(c.anime.studio) ? c.anime.studio : [c.anime.studio]
  //   ))].sort(),
  //   [db]
  // );

  const animeForStudio = useMemo(() => {
    if (!selectedStudio) return [];
    return [...new Set(db.filter((c) => Array.isArray(c.anime.studio)
      ? c.anime.studio.includes(selectedStudio)
      : c.anime.studio === selectedStudio).map((c) => c.anime.name))].sort();
  }, [db, selectedStudio]);

  // Section 2: studios not yet guessed, with character count
  const unguessedStudiosMap = useMemo(() => {
    const map = {};
    db.forEach((c) => {
      const studios = Array.isArray(c.anime.studio) ? c.anime.studio : [c.anime.studio];
      const allGuessed = studios.every((s) => guessedStudios.has(s) && !correctStudios.has(s));
      if (!allGuessed) {
        studios.forEach((s) => {
          if (!guessedStudios.has(s) || correctStudios.has(s)) {
            if (!map[s]) map[s] = new Map();
            map[s].set(c.anime.name, c.anime);
          }
        });
      }
    });
    return map;
  }, [db, guessedStudios, correctStudios]);

  const unguessedStudios = useMemo(() => {
    return Object.entries(unguessedStudiosMap)
      .map(([studio, animeMap]) => [studio, animeMap.size])
      .sort((a, b) => b[1] - a[1]);
  }, [unguessedStudiosMap]);

  const unguessedStudiosYear = useMemo(() => {
    return Object.entries(unguessedStudiosMap)
      .map(([studio, animeMap]) => {
        const years = Array.from(animeMap.values()).map((a) => a.year);
        return [studio, Math.min(...years), Math.max(...years)];
      })
      .sort((a, b) => a[1] - b[1]);
  }, [unguessedStudiosMap]);

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


  useEffect(() => {
    if (selectedStudio && !unguessedStudios.some(([s]) => s === selectedStudio)) {
      setSelectedStudio(null);
    }
  }, [unguessedStudios, selectedStudio]);

  return (
    <div className={`hint-panel hint-panel--${variant}`}>
      <button className="hint-panel__toggle" onClick={() => setOpen(v => !v)}>
        💡 Hints
      </button>
      {open && (
        <>
          <div className="hint-panel__overlay" onClick={() => setOpen(false)} />
          <div className="hint-panel__content">
            <button className="hint-panel__close" onClick={() => setOpen(false)}>✕</button>

            <p className="hint-panel__title">Using hints affects your leaderboard ranking.</p>

            {/* Section 1 — Studio → Anime list */}
            <div className="hint-section">
              <button className="hint-section__header" onClick={handleSection1Open}>
                <span>Animes by studios</span>
                <span className="hint-section__chevron">{section1Open ? "▲" : "▼"}</span>
              </button>
              {section1Open && (
                <div className="hint-section__body">
                  <p className="hint-panel__details">Ruled out studios are hidden.</p>
                  <select
                    className="hint-section__select"
                    value={selectedStudio ?? ""}
                    onChange={(e) => setSelectedStudio(e.target.value || null)}
                  >
                    <option value="">Select a studio…</option>
                    {unguessedStudios.map(([s, count]) => (
                      <option key={s} value={s}>{s} ({count})</option>
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
            {/* <div className="hint-section">
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
          </div> */}
            {/* Section 2 — year range */}
            {<div className="hint-section">
              <button className="hint-section__header" onClick={handleSection2Open}>
                <span>Year range per studio</span>
                <span className="hint-section__chevron">{section2Open ? "▲" : "▼"}</span>
              </button>
              {section2Open && (
                <div className="hint-section__body">
                  <p className="hint-panel__details">Ruled out studios are hidden.</p>

                  {unguessedStudios.length === 0 ? (
                    <p className="hint-section__empty">All studios guessed!</p>
                  ) : (
                    <ul className="hint-section__list">
                      {unguessedStudiosYear.map(([studio, yearMin, yearMax]) => (
                        <li key={studio} className="hint-section__studio-row">
                          <span>{studio}</span>
                          <span className="hint-section__badge">{yearMin}-{yearMax}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>}
          </div>
        </>
      )}
    </div>

  );
}
