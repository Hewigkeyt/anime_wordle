import { useState, useEffect } from "react";
import { submitScore, fetchTop3, hasPlayedToday } from "../../lib/daily";
import "./DailyResult.css";

// const MEDALS = ["🥇", "🥈", "🥉"];

export default function DailyResult({ won, guessCount, hintUsed, target, alreadyCompleted = false, onScoreSubmitted }) {
  const [username,    setUsername]    = useState(() => localStorage.getItem("aw_username") ?? "");
  const [submitted,   setSubmitted]   = useState(alreadyCompleted);
  const [alreadyDone, setAlreadyDone] = useState(alreadyCompleted);
  // const [top3,        setTop3]        = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);

  // Load leaderboard immediately
  // useEffect(() => {
  //   loadTop3();
  // }, []);

  // If we have a stored username, check whether they already submitted today
  useEffect(() => {
    if (alreadyCompleted) return;
    if (!username) return;
    hasPlayedToday(username).then((done) => {
      if (done) { setAlreadyDone(true); setSubmitted(true); }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // async function loadTop3() {
  //   const { data, error } = await fetchTop3();
  //   if (!error) setTop3(data);
  // }

  async function handleSubmit() {
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    localStorage.setItem("aw_username", username.trim());

    if (alreadyDone) { setSubmitted(true); setLoading(false); return; } // skip query if mount already checked
  
    const already = await hasPlayedToday(username);
    if (already) {
      setAlreadyDone(true);
      setSubmitted(true);
      setLoading(false);
      return;
    }

    const { error } = await submitScore({
      username,
      guesses: guessCount,
      hintUsed,
    });

    if (error) {
      setError("Could not save score. Try again.");
    } else {
      setSubmitted(true);
      onScoreSubmitted?.();
      // await loadTop3();
    }
    setLoading(false);
  }

  return (
    <div className="daily-result">
      {/* Outcome */}
      <div className={`daily-result__outcome daily-result__outcome--${won ? "win" : "loss"}`}>
        <p className="daily-result__outcome-msg">
          {won
            ? `Correct! You guessed ${target.name} in ${guessCount} attempt${guessCount > 1 ? "s" : ""}${hintUsed ? " (hint used)" : ""}!`
            : `💀 It was ${target.name} from ${target.anime.name}.`}
        </p>
      </div>

      {/* Score submission */}
      {won && (
        <div className="daily-result__submit">
          {submitted ? (
            <p className="daily-result__submitted-msg">
              {alreadyCompleted
                ? "You already played today's challenge."
                :alreadyDone ? "You already submitted today." : "Score saved!"}
            </p>
          ) : (
            <>
              <p className="daily-result__submit-label">Submit your score to the leaderboard:</p>
              <div className="daily-result__submit-row">
                <input
                  className="daily-result__input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Your name…"
                  maxLength={24}
                />
                <button
                  className="daily-result__submit-btn"
                  onClick={handleSubmit}
                  disabled={!username.trim() || loading}
                >
                  {loading ? "…" : "Submit"}
                </button>
              </div>
              {error && <p className="daily-result__error">{error}</p>}
            </>
          )}
        </div>
      )}

      {/* Top 3 */}
      {/* <div className="daily-result__leaderboard">
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
                <span className="daily-result__lb-guesses">{row.guesses} guess{row.guesses > 1 ? "es" : ""}</span>
                {row.hint_used && <span className="daily-result__lb-hint">hint</span>}
              </li>
            ))}
          </ol>
        )}
      </div> */}
    </div>
  );
}
