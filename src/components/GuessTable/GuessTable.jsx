import GuessRow from "./GuessRow";
import "./GuessTable.css";
import { HEADERS } from "../../utils/gameLogic";

export default function GuessTable({ rows }) {
  if (rows.length === 0) {
    return (
      <div className="guess-table__empty">
        <span className="guess-table__empty-icon">⛩️</span>
        <p>Search for a character above to start guessing</p>
      </div>
    );
  }

  return (
    <div className="guess-table">
      {/* Column headers */}
      <div className="guess-table__headers">
        {HEADERS.map((h) => (
          <div key={h} className="guess-table__header-cell">{h}</div>
        ))}
      </div>

      {/* Guess rows — newest at top */}
      {rows.map((row) => (
        <GuessRow key={row.character.name} cells={row.cells} />
      ))}
    </div>
  );
}
