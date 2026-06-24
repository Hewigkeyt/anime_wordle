import { useState, useEffect } from "react";
import "./App.css";

import { useWordle } from "./hooks/useWordle";
import { getDailyTarget, saveDailyResult, loadDailyResult } from "./lib/daily";
import { pickRandom } from "./utils/gameLogic";

import Header from "./components/Header/Header";
import ModeSelector from "./components/ModeSelector/ModeSelector";
import SearchBar from "./components/SearchBar/SearchBar";
import GuessTable from "./components/GuessTable/GuessTable";
import Legend from "./components/Legend/Legend";
import ResultBanner from "./components/ResultBanner/ResultBanner";
import DailyResult from "./components/DailyResult/DailyResult";
import Sakura from "./components/Sakura/Sakura";
import HintPanel from "./components/HintPanel/HintPanel";
import BottomAd from "./components/adsense/Adsense";

// ── Drop your JSON file at src/data/characters.json ──────────────────────────
import DB from "./data/characters.json";

export default function App() {

  const [mode, setMode] = useState("daily");
  const [persistedDaily] = useState(() => loadDailyResult());

  const [dailyDone,   setDailyDone]   = useState(!!persistedDaily);
  const [showBanner,  setShowBanner]  = useState(!!persistedDaily);
  
  const [showSakura, setShowSakura] = useState(false);
  const [dailyTarget, setDailyTarget] = useState(null);
  const [infiniteTarget, setInfiniteTarget] = useState(() => pickRandom(DB));

  useEffect(() => {
    getDailyTarget(DB).then(setDailyTarget);
  }, []);

  const daily = useWordle(DB, dailyTarget);
  const infinite = useWordle(DB, infiniteTarget);

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
    if ((won || lost) && mode === "daily") {
      setDailyDone(true);
      saveDailyResult(won, guessCount, hintUsed);
    }
  }, [won, lost, mode]);

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

  if (!dailyTarget) {
    return (
      <div className="app app--loading">
        <span>Loading today's challenge…</span>
      </div>
    );
  }

  return (
    <div className="app">
      {showSakura && <Sakura />}

      <Header guessCount={guessCount} mode={mode} />
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
        />
      )}
      {showBanner && mode === "infinite" && (<ResultBanner won={won} lost={lost} target={target} attempts={guessCount} onPlayAgain={() => {
            setShowBanner(false);
            setShowSakura(false);
            setInfiniteTarget(pickRandom(DB));}}/>)}

      {(mode === "infinite" || dailyBoardVisible) && (
        <Legend />
      )}

      {rows.length > 0 && (<HintPanel db={DB} guessedRows={rows} onHintUsed={onHintUsed} />)}

      {(mode === "infinite" || dailyBoardVisible) && (
        <GuessTable rows={rows} />
      )}

      <BottomAd />
    </div>
  );
}
