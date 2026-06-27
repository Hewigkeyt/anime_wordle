import { useState, useEffect, useCallback } from "react";
import { buildResult } from "../utils/gameLogic";
import { saveGuessRows, loadGuessRows, clearGuessRows, clearInfiniteTarget } from "../lib/daily";


/**
 * Encapsulates all Wordle game state.
 * @param {object[]} db     - the full character database
 * @param {object}   target - the secret character (daily or random, resolved by the caller)
 */
export function useWordle(db, target, mode = null) {
  const [query,    setQuery]    = useState("");
  const [selected, setSelected] = useState(null);
  const [rows,     setRows]     = useState(() => mode ? (loadGuessRows(mode) ?? []) : []);
  const [won,      setWon]      = useState(false);
  const [lost,     setLost]     = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  const guessedNames = new Set(rows.map((r) => r.character.name));
  const [suggestions, setSuggestions] = useState([]);

  // Reset state whenever the target changes (mode switch)
  useEffect(() => {
    setQuery("");
    setSelected(null);
    setRows([]);
    setWon(false);
    setLost(false);
    setSuggestions([]);
    if (!mode) setRows([]);
    else setRows(loadGuessRows(mode) ?? []);
  }, [target]);

  useEffect(() => {
    if (!query.trim() || won || lost) {
      setSuggestions([]);
      return;
    }
    const q = query.toLowerCase();
    const matches = db
      .filter(
        (c) =>
          !guessedNames.has(c.name) &&
          (c.name.toLowerCase().includes(q) ||
            c.anime.name.toLowerCase().includes(q))
      )
      .slice(0, 8);
    setSuggestions(matches);
  }, [query, rows, won, lost, db]); // eslint-disable-line react-hooks/exhaustive-deps

  const submitGuess = useCallback(
    (char) => {
      if (!char || won || lost) return;
      const result  = buildResult(char, target);
      const newRows = [result, ...rows];
      setRows(newRows);
      if (mode) saveGuessRows(newRows, mode);

      setQuery("");
      setSuggestions([]);
      setSelected(null);

      const isWin = result.cells.every((c) => c.status === "correct");
      if (isWin) {
        setWon(true);    
        if (mode === "infinite") {
          clearGuessRows("infinite");
          clearInfiniteTarget()
        }
      }
      // else if (newRows.length >= MAX_GUESSES) {
      //   setLost(true);
      // }
    },
    [won, lost, rows, target]
  );

  const selectSuggestion = useCallback((char) => {
    setSelected(char);
    setQuery(char.name);
    setSuggestions([]);
  }, []);

  return {
    query,    setQuery,
    selected, setSelected,
    suggestions,
    rows,
    won,
    lost,
    hintUsed,
    onHintUsed: () => setHintUsed(true),
    guessCount: rows.length,
    submitGuess,
    selectSuggestion,
  };
}