import { useState, useEffect, useCallback } from "react";
import { fetchTop3, yesterdayString } from "../../lib/daily";
import "./Leaderboard.css";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard({ refreshKey, hidden = false, open, onToggle, onClose }) {
  const [top3, setTop3] = useState(null);
  const [yesterdayTop3, setYesterdayTop3] = useState(null);


  const loadTop3 = useCallback(async () => {
    const [today, yesterday] = await Promise.all([
      fetchTop3(),
      fetchTop3(yesterdayString()),
    ]);
    if (!today.error)     setTop3(today.data);
    if (!yesterday.error) setYesterdayTop3(yesterday.data);
  }, []);

  // Load on mount, and again whenever refreshKey changes (e.g. after a submission)
  useEffect(() => {
    loadTop3();
  }, [loadTop3, refreshKey]);


  

  const renderColumns = (data, mobile = false) => {
  const noHint = data?.filter(r => !r.hint_used) ?? [];
  const withHint = data?.filter(r => r.hint_used) ?? [];
    return (<>
    <div className="daily-result__lb-columns">
            <div className="daily-result__lb-col">
              <p className="daily-result__lb-col-title">No hint</p>
              {noHint.length === 0 ? <p className="daily-result__lb-empty">None yet</p> : (
                <ol className="daily-result__lb-list">
                  {noHint.map((row, i) => (
                    <li key={row.username} className={`daily-result__lb-row ${i === 3 ? 'daily-result__lb-row--small margin' : i > 3 ? 'daily-result__lb-row--small' : ''}`}>
                      <span className="daily-result__lb-medal">{i < 3 ? MEDALS[i] : i + 1}</span>
                      <span className="daily-result__lb-name">{row.username}</span>
                      <span className="daily-result__lb-guesses">{row.guesses}{!mobile && ` guess${row.guesses > 1 ? "es" : ""}`}</span>
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
                      <span className="daily-result__lb-guesses">{row.guesses}{!mobile && ` guess${row.guesses > 1 ? "es" : ""}`}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
    </>)
  };

  if (hidden) return null;


  return (
    <>
      {/* Desktop drawer */}
      <div className={`lb-drawer ${open ? "lb-drawer--open" : ""}`}>
        <div className="lb-drawer__panel">
          {top3 === null ? <p className="lb__empty">Loading…</p>
            : top3.length === 0 ? <p className="lb__empty">No scores yet!</p>
            : renderColumns(top3)}
          <p className="yesterday">Yesterday's results</p>
          {yesterdayTop3 === null ? <p className="lb__empty">Loading…</p>
            : yesterdayTop3.length === 0 ? <p className="lb__empty">No scores for yesterday.</p>
            : renderColumns(yesterdayTop3)}
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
            : renderColumns(top3, true)}
          <p className="yesterday">Yesterday's results</p>
          {yesterdayTop3 === null ? <p className="lb__empty">Loading…</p>
            : yesterdayTop3.length === 0 ? <p className="lb__empty">No scores for yesterday.</p>
            : renderColumns(yesterdayTop3, true)}
          </div>
        </div>
      )}
    </>
  );
}
