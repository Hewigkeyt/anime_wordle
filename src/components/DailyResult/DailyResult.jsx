import { useState, useEffect } from "react";
import { submitScore, fetchTop3, hasPlayedToday, todayString, saveDailySubmitted, loadDailyResult } from "../../lib/daily";
import "./DailyResult.css";

// const MEDALS = ["🥇", "🥈", "🥉"];

export default function DailyResult({ won, guessCount, hintUsed, target, alreadyCompleted = false, onScoreSubmitted, rows, animate = true }) {
  const persistedResult = loadDailyResult();
  const [username, setUsername] = useState(() => localStorage.getItem("aw_username") ?? "");
  const [submitted, setSubmitted] = useState(!!persistedResult?.submitted);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(!!persistedResult?.submitted);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const [countdown, setCountdown] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedMin, setCopiedMin] = useState(false);



  useEffect(() => {
    function update() {
      const now = new Date();
      const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
      const diff = next - now;
      const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      setCountdown(`${h}:${m}:${s}`);
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  // If we have a stored username, check whether they already submitted today
  useEffect(() => {
    if (alreadyCompleted) return;
    if (!username) return;
    hasPlayedToday(username).then((done) => {
      if (done) { setAlreadyDone(true); setSubmitted(true); }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function buildShareTextMin(guessCount, hintUsed) {
    const header = `Anime Wordle ${todayString()}`;
    const result = `✅ ${guessCount} guess${guessCount > 1 ? "es" : ""}${hintUsed ? " (hint)" : ""}`;

    return `${header}\n${result}\nhttps://hewigkeyt.github.io/anime_wordle/`;
  }

  function buildShareText(guessCount, hintUsed, rows) {
    const header = `Anime Wordle ${todayString()}`;
    const result = `✅ ${guessCount} guess${guessCount > 1 ? "es" : ""}${hintUsed ? " (hint)" : ""}`;
    const grid = rows.slice().map(({ cells }) =>
      cells.map((c) => {
        if (c.status === "correct") return "🟩";
        if (c.status === "wrong") return "🟥";
        return "🟨"; // low or high
      }).join("")
    ).join("\n");

    return `${header}\n${result}\n${grid}\nhttps://hewigkeyt.github.io/anime_wordle/`;
  }


  function handleShareMin() {
    const text = buildShareTextMin(guessCount, hintUsed);
    navigator.clipboard.writeText(text).then(() => setCopiedMin(true));
    setTimeout(() => setCopiedMin(false), 2000);
  }

  function handleShare(rows) {
    const text = buildShareText(guessCount, hintUsed, rows);
    navigator.clipboard.writeText(text).then(() => setCopied(true));
    setTimeout(() => setCopied(false), 2000);
  }

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
      setJustSubmitted(true);
      setSubmitted(true);
      saveDailySubmitted();
      onScoreSubmitted?.();
      // await loadTop3();
    }
    setLoading(false);
  }

  return (
    <div className={`daily-result ${animate ? "daily-result--animate" : ""}`}>
      {/* Outcome */}
      <div className={`daily-result__outcome daily-result__outcome--${won ? "win" : "loss"}`}>
        <p className="daily-result__outcome-msg">
          {won && (<>Correct! You guessed {target.name} in {guessCount} attempt{guessCount > 1 ? "s" : ""}{hintUsed ? " (hint used)" : ""}!</>)}
        </p>
      </div>
      <p className="daily-result__countdown">Next character in <strong>{countdown}</strong></p>
      <div className="daily-result__copy-wrapper">
        {!alreadyCompleted && (<button className="daily-result__share-btn" onClick={() => handleShareMin()}>
          {copiedMin ? "Copied! ✓" : "Share result 📋 (no rows)"}
        </button>)}
        {!alreadyCompleted && (<button className="daily-result__share-btn" onClick={() => handleShare(rows)}>
          {copied ? "Copied! ✓" : "Share result 📋"}
        </button>)}
      </div>
      {/* Score submission */}
      {won && (
        <div className="daily-result__submit">
          {submitted ? (
            <p className="daily-result__submitted-msg">
              {justSubmitted
                ? "Score saved!"
                : alreadyCompleted || alreadyDone
                  ? "You already submitted today."
                  : "Score saved!"}
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
    </div>
  );
}
