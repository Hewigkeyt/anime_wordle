import { useState, useEffect, useCallback } from "react";
import { fetchTop3 } from "../../lib/daily";
import "./Leaderboard.css";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard({ refreshKey }) {
  const [top3, setTop3] = useState(null);

  const loadTop3 = useCallback(async () => {
    const { data, error } = await fetchTop3();
    if (!error) setTop3(data);
  }, []);

  // Load on mount, and again whenever refreshKey changes (e.g. after a submission)
  useEffect(() => {
    loadTop3();
  }, [loadTop3, refreshKey]);

  return (
    <div className="daily-result__leaderboard">
      <p className="daily-result__lb-title">Today's top 3</p>
      {top3 === null ? (
        <p className="daily-result__lb-empty">Loading…</p>
      ) : top3.length === 0 ? (
        <p className="daily-result__lb-empty">No scores yet — be the first!</p>
      ) : (
        <ol className="daily-result__lb-list">
          {top3.map((row, i) => (
            <li key={row.username} className="daily-result__lb-row">
              <span className="daily-result__lb-medal">{MEDALS[i]}</span>
              <span className="daily-result__lb-name">{row.username}</span>
              <span className="daily-result__lb-guesses">
                {row.guesses} guess{row.guesses > 1 ? "es" : ""}
              </span>
              {row.hint_used && <span className="daily-result__lb-hint">hint</span>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
