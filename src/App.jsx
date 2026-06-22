import { useState, useEffect } from "react";
import "./App.css";

import { useWordle }      from "./hooks/useWordle";
import Header             from "./components/Header/Header";
import SearchBar          from "./components/SearchBar/SearchBar";
import GuessTable         from "./components/GuessTable/GuessTable";
import Legend             from "./components/Legend/Legend";
import ResultBanner       from "./components/ResultBanner/ResultBanner";
import Sakura             from "./components/Sakura/Sakura";

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
  } = useWordle(DB);

  // Show sakura for 7 s after winning
  const [showSakura, setShowSakura] = useState(false);
  useEffect(() => {
    if (!won) return;
    setShowSakura(true);
    const t = setTimeout(() => setShowSakura(false), 7000);
    return () => clearTimeout(t);
  }, [won]);

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

      <ResultBanner won={won} lost={lost} target={target} attempts={guessCount}/>

      <Legend />

      <GuessTable rows={rows} />
    </div>
  );
}
