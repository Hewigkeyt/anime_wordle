import { useState, useEffect, useCallback } from "react";
import { buildResult, pickRandom } from "../utils/gameLogic";

/**
 * Encapsulates all Wordle game state.
 * @param {object[]} db - the full character database
 */
export function useWordle(db) {
  const [target]      = useState(() => pickRandom(db));
  const [query,   setQuery]   = useState("");
  const [selected, setSelected] = useState(null);  // character object highlighted in dropdown
  const [rows,    setRows]    = useState([]);       // array of buildResult() outputs, newest first
  const [won,     setWon]     = useState(false);
  const [lost,    setLost]    = useState(false);
  const [hintUsed, setHintUsed] = useState(false);


  // Derived: names already guessed, used to exclude from suggestions
  const guessedNames = new Set(rows.map((r) => r.character.name));

  // Filtered suggestions from the DB
  const [suggestions, setSuggestions] = useState([]);

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
      setQuery("");
      setSuggestions([]);
      setSelected(null);

      const isWin = result.cells.every((c) => c.status === "correct");
      if (isWin) {
        setWon(true);
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
    target,
    query,
    setQuery,
    selected,
    setSelected,
    suggestions,
    rows,
    won,
    lost,
    guessCount: rows.length,
    submitGuess,
    selectSuggestion,
    hintUsed,
    onHintUsed: () => setHintUsed(true),
  };
}
