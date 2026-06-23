import { useState, useEffect } from "react";
import "./App.css";

import { useWordle } from "./hooks/useWordle";
import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import GuessTable from "./components/GuessTable/GuessTable";
import Legend from "./components/Legend/Legend";
import ResultBanner from "./components/ResultBanner/ResultBanner";
import Sakura from "./components/Sakura/Sakura";
import HintPanel from "./components/HintPanel/HintPanel";
import BottomAd from "./components/adsense/Adsense";

// ── Drop your JSON file at src/data/characters.json ──────────────────────────
import DB from "./data/characters.json";

export default function App() {
  const {
    target,
    query, setQuery,
    selected, setSelected,
    suggestions,
    rows,
    won, lost,
    guessCount,
    submitGuess,
    selectSuggestion,
    hintUsed,
    onHintUsed
  } = useWordle(DB);

  // Show sakura for 7 s after winning
  const [showSakura, setShowSakura] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

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

  return (
    <div className="app">
      {showSakura && <Sakura />}

      <Header guessCount={guessCount} />

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

      {showBanner && <ResultBanner won={won} lost={lost} target={target} attempts={guessCount} />}

      <Legend />

      {rows.length > 0 && (<HintPanel db={DB} guessedRows={rows} onHintUsed={onHintUsed} />)}

      <GuessTable rows={rows} />

      <BottomAd />
    </div>
  );
}
