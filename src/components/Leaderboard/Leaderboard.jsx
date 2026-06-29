import { useState, useEffect, useCallback } from "react";
import { fetchTop3 } from "../../lib/daily";
import "./Leaderboard.css";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard({ refreshKey, hidden = false, open, onToggle, onClose }) {
  const [top3, setTop3] = useState(null);

  const loadTop3 = useCallback(async () => {
    const { data, error } = await fetchTop3();
    if (!error) setTop3(data);
  }, []);

  // Load on mount, and again whenever refreshKey changes (e.g. after a submission)
  useEffect(() => {
    loadTop3();
  }, [loadTop3, refreshKey]);


  const noHint = top3?.filter(r => !r.hint_used) ?? [];
  const withHint = top3?.filter(r => r.hint_used) ?? [];

  const renderColumns = () => (
    <div className="daily-result__lb-columns">
            <div className="daily-result__lb-col">
              <p className="daily-result__lb-col-title">No hint</p>
              {noHint.length === 0 ? <p className="daily-result__lb-empty">None yet</p> : (
                <ol className="daily-result__lb-list">
                  {noHint.map((row, i) => (
                    <li key={row.username} className={`daily-result__lb-row ${i === 3 ? 'daily-result__lb-row--small margin' : i > 3 ? 'daily-result__lb-row--small' : ''}`}>
                      <span className="daily-result__lb-medal">{i < 3 ? MEDALS[i] : i + 1}</span>
                      <span className="daily-result__lb-name">{row.username}</span>
                      <span className="daily-result__lb-guesses">{row.guesses} guess{row.guesses > 1 ? "es" : ""}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <div className="daily-result__lb-divider" />

            <div className="daily-result__lb-col">
              <p className="daily-result__lb-col-title">With hint</p>
              {withHint.length === 0 ? <p className="daily-result__lb-empty">None yet</p> : (
                <ol className="daily-result__lb-list">
                  {withHint.map((row, i) => (
                    <li key={row.username} className={`daily-result__lb-row ${i === 3 ? 'daily-result__lb-row--small margin' : i > 3 ? 'daily-result__lb-row--small' : ''}`}>
                      <span className="daily-result__lb-medal">{i < 3 ? MEDALS[i] : i + 1}</span>
                      <span className="daily-result__lb-name">{row.username}</span>
                      <span className="daily-result__lb-guesses">{row.guesses} guess{row.guesses > 1 ? "es" : ""}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
  );

  if (hidden) return null;


  return (
    <>
      {/* Desktop drawer */}
      <div className={`lb-drawer ${open ? "lb-drawer--open" : ""}`}>
        <div className="lb-drawer__panel">
          {top3 === null ? <p className="lb__empty">Loading…</p>
            : top3.length === 0 ? <p className="lb__empty">No scores yet!</p>
            : renderColumns()}
        </div>
        <button className="lb-drawer__tab" onClick={() => onToggle(v => !v)}>
          <span>LEADERBOARD {open?"▲":"▼"}</span>
        </button>
        
      </div>

      {/* Mobile modal */}
      {open && (
        <div className="lb-modal__overlay" onClick={() => onToggle(false)}>
          <div className="lb-modal__content" onClick={e => e.stopPropagation()}>
            <button className="lb-modal__close" onClick={() => onToggle(false)}>✕</button>
            {top3 === null ? <p className="lb__empty">Loading…</p>
              : top3.length === 0 ? <p className="lb__empty">No scores yet!</p>
              : renderColumns()}
          </div>
        </div>
      )}
    </>
  );
}
