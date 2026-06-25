import { useState, useEffect, useCallback } from "react";
import { fetchTop3 } from "../../lib/daily";
import "./Leaderboard.css";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard({ refreshKey, hidden = false }) {
  const [top3, setTop3] = useState(null);

  const [showAll, setShowAll] = useState(false);

  const loadTop3 = useCallback(async () => {
    const { data, error } = await fetchTop3();
    if (!error) setTop3(data);
  }, []);

  // Load on mount, and again whenever refreshKey changes (e.g. after a submission)
  useEffect(() => {
    loadTop3();
  }, [loadTop3, refreshKey]);

  const displayedRows = top3 && showAll ? top3 : (top3 ? top3.slice(0, 3) : []);

  return (
    <div className="daily-result__leaderboard" hidden={hidden}>
      <p className="daily-result__lb-title">Today's top 3</p>
      {top3 === null ? (
        <p className="daily-result__lb-empty">Loading…</p>
      ) : top3.length === 0 ? (
        <p className="daily-result__lb-empty">No scores yet — be the first!</p>
      ) : (
        <>
        <ol className="daily-result__lb-list">
          {displayedRows.map((row, i) => (
            <li key={row.username} className={`daily-result__lb-row ${i == 3 ? 'daily-result__lb-row--small margin' : i > 3 ? 'daily-result__lb-row--small' : ''}`}>
              <span className="daily-result__lb-medal">{i < 3 ? MEDALS[i]: `${i + 1}`}</span>
              <span className="daily-result__lb-name">{row.username}</span>
              <span className="daily-result__lb-guesses">
                {row.guesses} guess{row.guesses > 1 ? "es" : ""}
              </span>
              {row.hint_used && <span className="daily-result__lb-hint">hint</span>}
            </li>
          ))}
        </ol>
        {/* Le bouton s'affiche uniquement s'il y a plus de 3 éléments au total */}
        {top3.length > 3 && !showAll && (
          <button 
            onClick={() => setShowAll(!showAll)} 
            className="daily-result__see-all-btn"
          >See all</button>
        )}
        </>
      )}
    </div>
  );
}
