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
        
        <ul>
          <li>Use the clues from each guess to find the mystery character!</li>
          <li>A character's data is based on their first major anime appearance.</li>
          <li>Hair colors are simplified to basic shades (e.g., navy and cyan are both 'Blue') to allow better character matching.</li>
          <li>Short introductions are ignored (e.g. Eren Yeager is 15 y.o.).</li>
          <li>For instance Naruto Uzumaki is a 12-year-old character from Naruto (2002), not Naruto Shippuden (2007).</li>
          <li>If you notice an error please fill an issue <a href="https://github.com/Hewigkeyt/anime_wordle/issues">here</a>.</li>
        </ul>
        <br />
        <p>Updates to come:</p>
        <ul>
          <li>Addition/fix of characters in the database.</li>
        </ul>
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
        <GuessRow key={row.character.name} cells={row.cells} isWin={i === 0 && row.cells.every(c => c.status === "correct")}/>
      ))}
    </div>
  );
}
