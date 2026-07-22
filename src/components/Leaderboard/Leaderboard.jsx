import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchTop3, yesterdayString, monthly } from "../../lib/daily";
import "./Leaderboard.css";

const MEDALS = ["🥇", "🥈", "🥉"];

function computeMonthlyRanking(scores) {
  if (!scores || scores.length === 0) return { ranking: [], numberDays: 0 };

  const names_set = new Set();
  const max_score = new Map();
  const dates_array = [];
  const seen_dates = new Set();

  for (const score of scores) {
    names_set.add(score.username);

    const total = score.guesses + (score.hint_used ? 5 : 0);
    if (!max_score.has(score.day) || total > max_score.get(score.day)) {
      max_score.set(score.day, total);
    }

    if (!seen_dates.has(score.day)) {
      seen_dates.add(score.day);
      dates_array.push(score.day);
    }
  }

  const numberDays = dates_array.length;

  const dayPenalty = new Map();
  for (const date of dates_array) {
    dayPenalty.set(date, max_score.get(date) + 1);
  }
  const totalPenaltyIfAllMissing = [...dayPenalty.values()].reduce((a, b) => a + b, 0);

  const names_map = new Map();
  for (const name of names_set) names_map.set(name, totalPenaltyIfAllMissing);

  for (const score of scores) {
    const actual = score.guesses + (score.hint_used ? 5 : 0);
    const penalty = dayPenalty.get(score.day);
    names_map.set(score.username, names_map.get(score.username) - penalty + actual);
  }

  const ranking = [...names_map.entries()].sort((a, b) => a[1] - b[1]);

  return { ranking, numberDays };
}

export default function Leaderboard({ refreshKey, hidden = false, open, onToggle, onClose }) {
  const [top3, setTop3] = useState(null);
  const [yesterdayTop3, setYesterdayTop3] = useState(null);

  const [monthlyScores, setMonthlyScores] = useState(null);
  const [monthlyError, setMonthlyError] = useState(null);
  const [mode, setMode] = useState("daily");
  

  const loadTop3 = useCallback(async () => {
    const [today, yesterday, month] = await Promise.all([
      fetchTop3(),
      fetchTop3(yesterdayString()),
      monthly()
    ]);
    if (!today.error)     setTop3(today.data);
    if (!yesterday.error) setYesterdayTop3(yesterday.data);
    if (!month.error) {
      setMonthlyScores(month.data);
      setMonthlyError(null);
    } else {
      setMonthlyError(month.error.message);
    }
  }, []);

  // Load on mount, and again whenever refreshKey changes (e.g. after a submission)
  useEffect(() => {
    loadTop3();
  }, [loadTop3, refreshKey]);


  const { ranking: monthlyRanking, numberDays } = useMemo(
    () => computeMonthlyRanking(monthlyScores),
    [monthlyScores]
  );

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

  const renderMonthly = () => {
    if (monthlyError) return <p className="lb__empty">Couldn't load monthly scores.</p>;
    if (monthlyScores === null) return <p className="lb__empty">Loading…</p>;
    if (monthlyRanking.length === 0) return <p className="lb__empty">No scores yet this month.</p>;

    return (
      <ol className="daily-result__lb-list">
        {monthlyRanking.map(([name, value], i) => (
          <li key={name} className={`daily-result__lb-row ${i === 3 ? 'daily-result__lb-row--small margin' : i > 3 ? 'daily-result__lb-row--small' : ''}`}>
            <span className="daily-result__lb-medal">{i < 3 ? MEDALS[i] : i + 1}</span>
            <span className="daily-result__lb-name">{name}</span>
            <span className="daily-result__lb-guesses">{(value / numberDays).toFixed(3)}</span>
          </li>
        ))}
      </ol>
    );
  };

  if (hidden) return null;


  return (
    <>
      {/* Desktop drawer */}
      <div className={`lb-drawer ${open ? "lb-drawer--open" : ""}`}>
        <div className="lb-drawer__panel-wrapper">
          <div className="lb-drawer__panel">
            <p className="today">Monthly average!</p>
            {renderMonthly()}
          </div>
          <div className="lb-drawer__panel">
            <p className="today">Today's results</p>
            {top3 === null ? <p className="lb__empty">Loading…</p>
              : top3.length === 0 ? <p className="lb__empty">No scores yet!</p>
              : renderColumns(top3)}
            <p className="yesterday">Yesterday's results</p>
            {yesterdayTop3 === null ? <p className="lb__empty">Loading…</p>
              : yesterdayTop3.length === 0 ? <p className="lb__empty">No scores for yesterday.</p>
              : renderColumns(yesterdayTop3)}
          </div>
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
            <div className="mode-selector">
              <button
                className={`mode-selector__btn ${mode === "daily" ? "mode-selector__btn--active" : ""}`}
                onClick={() => setMode("daily")}
              >
                Daily
              </button>
              <button
                className={`mode-selector__btn ${mode === "monthly" ? "mode-selector__btn--active" : ""}`}
                onClick={() => setMode("monthly")}
              >
                Monthly avg.            
              </button>
            </div>
            <div className={mode==="daily"?"modal__content__show":"modal__content__hide"}>
            <p className="today">Today's results</p>
            {top3 === null ? <p className="lb__empty">Loading…</p>
            : top3.length === 0 ? <p className="lb__empty">No scores yet!</p>
            : renderColumns(top3, true)}
          <p className="yesterday">Yesterday's results</p>
          {yesterdayTop3 === null ? <p className="lb__empty">Loading…</p>
            : yesterdayTop3.length === 0 ? <p className="lb__empty">No scores for yesterday.</p>
            : renderColumns(yesterdayTop3, true)}
            </div>
            <div className={mode==="monthly"?"modal__content__show":"modal__content__hide"}>
              {renderMonthly()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
