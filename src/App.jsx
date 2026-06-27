import { useState, useEffect } from "react";
import "./App.css";

import { useWordle } from "./hooks/useWordle";
import { getDailyTarget, saveDailyResult, loadDailyResult, saveInfiniteTarget,loadInfiniteTarget, clearInfiniteTarget } from "./lib/daily";
import { pickRandom } from "./utils/gameLogic";

import Header from "./components/Header/Header";
import ModeSelector from "./components/ModeSelector/ModeSelector";
import SearchBar from "./components/SearchBar/SearchBar";
import GuessTable from "./components/GuessTable/GuessTable";
import Legend from "./components/Legend/Legend";
import ResultBanner from "./components/ResultBanner/ResultBanner";
import DailyResult from "./components/DailyResult/DailyResult";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import Sakura from "./components/Sakura/Sakura";
import HintPanel from "./components/HintPanel/HintPanel";
import BottomAd from "./components/adsense/Adsense";
import Footer from "./components/Footer/Footer";

// ── Drop your JSON file at src/data/characters.json ──────────────────────────
import DB from "./data/characters.json";

export default function App() {

  const [mode, setMode] = useState("daily");
  const [persistedDaily] = useState(() => loadDailyResult());

  const [dailyDone,   setDailyDone]   = useState(!!persistedDaily);
  const [showBanner,  setShowBanner]  = useState(!!persistedDaily);
  
  const [showSakura, setShowSakura] = useState(false);
  const [leaderboardRefreshKey, setLeaderboardRefreshKey] = useState(0);
  const [dailyTarget, setDailyTarget] = useState(null);
  const [yesterdayTarget, setYesterdayTarget] = useState(undefined);
  const [infiniteTarget, setInfiniteTarget] = useState(() => loadInfiniteTarget(DB) ?? pickRandom(DB));

  const [dailyWarning, setDailyWarning] = useState(null);

  useEffect(() => {
    getDailyTarget(DB).then(
      ({ target, yesterday, warning }) => {
      setDailyTarget(target);
      setYesterdayTarget(yesterday);
      if (warning) setDailyWarning(warning);
  });
  }, []);

  const daily = useWordle(DB, dailyTarget, "daily");
  const infinite = useWordle(DB, infiniteTarget, "infinite");

  const target = mode === "daily" ? dailyTarget : infiniteTarget;

  const {
    query, setQuery,
    selected, setSelected,
    suggestions,
    rows,
    won, lost,
    hintUsed, onHintUsed,
    guessCount,
    submitGuess,
    selectSuggestion
  } = mode === "daily" ? daily : infinite;

  useEffect(() => {
    if (infiniteTarget) saveInfiniteTarget(infiniteTarget.name);
  }, [infiniteTarget]);

  useEffect(() => {
    if ((won || lost) && mode === "daily") {
      setDailyDone(true);
      saveDailyResult(won, guessCount, hintUsed);
    }
  }, [won, lost, mode, guessCount, hintUsed]);

  useEffect(() => {
    if (!won && !lost) return;
    const t = setTimeout(() => {
      setShowBanner(true);
      if (won) {
        setShowSakura(true);
        setTimeout(() => setShowSakura(false), 7000);
      }
    }, 1100);
    return () => clearTimeout(t);
  }, [won, lost]);

  const handleModeSelect = (next) => {
    setMode(next);
    if (next === "daily" && dailyDone) {
      setShowBanner(true);
    } else if (next === "infinite") {
      setShowBanner(infinite.won || infinite.lost);
      setShowSakura(false);
    } else {
      setShowBanner(false);
      setShowSakura(false);
    }
  };

  const dailyBoardVisible = mode === "daily" && (!persistedDaily) ;

  const dailyWon       = persistedDaily ? persistedDaily.won        : won;
  const dailyGuesses   = persistedDaily ? persistedDaily.guessCount : guessCount;
  const dailyHintUsed  = persistedDaily ? persistedDaily.hintUsed   : hintUsed;

  if (!dailyTarget || yesterdayTarget === undefined) {
    return (
      <div className="app">
        <Header guessCount={0} mode={mode} dailyBoardVisible={false} yesterday={null} warning={null} />
        <span style={{ color: "var(--color-muted)", fontSize: "14px" }}>Loading today's challenge…</span>
        <Footer />
        <BottomAd />
      </div>
    );
  }
  
  return (
    <div className="app">
      {showSakura && <Sakura />}

      <Header guessCount={guessCount} mode={mode} dailyBoardVisible={dailyBoardVisible} yesterday={yesterdayTarget} warning={dailyWarning} />
      {/* <p> daily won : {dailyWon? "won":"lost"}<br/>hint used: {dailyHintUsed?"used":"not"}<br/>daily guesses {dailyGuesses}</p> */}
      <ModeSelector
        mode={mode}
        onSelect={handleModeSelect}
        dailyDone={dailyDone}
      />
      {/* Hide search when game is over or daily already completed */}
      {!won && !lost && (mode ==="infinite" || dailyBoardVisible) && (
      <SearchBar
        query={query}
        setQuery={setQuery}
        selected={selected}
        setSelected={setSelected}
        suggestions={suggestions}
        onSelectSuggestion={selectSuggestion}
        onSubmit={submitGuess}
        disabled={won || lost}
      />
      )}

      {showBanner && mode === "daily" && (
        <DailyResult
          won={dailyWon}
          guessCount={dailyGuesses}
          hintUsed={dailyHintUsed}
          target={target}
          alreadyCompleted={!!persistedDaily}
          onScoreSubmitted={() => setLeaderboardRefreshKey((k) => k + 1)}
          rows={daily.rows}
          animate={!persistedDaily}
        />
      )}
      {showBanner && mode === "infinite" && (<ResultBanner won={won} lost={lost} target={target} attempts={guessCount} onPlayAgain={() => {
            setShowBanner(false);
            setShowSakura(false);
            clearInfiniteTarget();
            const next = pickRandom(DB);
            saveInfiniteTarget(next.name);
            setInfiniteTarget(next);}}/>)}

     

      {(mode === "infinite" || dailyBoardVisible) && (
        <Legend />
      )}

       

      {rows.length > 0 && (<HintPanel db={DB} guessedRows={rows} onHintUsed={onHintUsed} top={mode === "daily" ? 160 : 120}/>)}
      <div className={`push__footer ${((!dailyBoardVisible && mode === "daily") || (rows.length > 0 && (dailyBoardVisible || mode === "infinite"))) ? "push__footer--started" : ""}`}>
        {(mode === "infinite" || dailyBoardVisible) && (
          <GuessTable rows={rows} />
        )}
        <Leaderboard refreshKey={leaderboardRefreshKey} hidden={mode !== "daily"}/>
      </div>

      
      <Footer />

      <BottomAd />
    </div>
  );
}
