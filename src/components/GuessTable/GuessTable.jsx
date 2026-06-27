import GuessRow from "./GuessRow";
import "./GuessTable.css";
import { HEADERS } from "../../utils/gameLogic";

export default function GuessTable({ rows }) {
  if (rows.length === 0) {
    return (
      <>
      <div className="guess-table">
      {/* Column headers */}
      <div className="guess-table__headers">
        {HEADERS.map((h) => (
          <div key={h} className="guess-table__header-cell">{h}</div>
        ))}
      </div>
      </div>
      <div className="guess-table__empty">
        <div className="db-wrapper">
          <div className="db-arrow">
            <div className="star">★</div>
          </div>
          <div className="db-arrow_outline"></div>
        </div>
        <p>Search for a character above to start guessing.</p>
        
      </div>
      </>
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
      {rows.map((row, i) => (
        <GuessRow key={row.character.name} cells={row.cells} isWin={i === 0 && row.cells.every(c => c.status === "correct")} isFirst={i === 0}/>
      ))}
    </div>
  );
}
