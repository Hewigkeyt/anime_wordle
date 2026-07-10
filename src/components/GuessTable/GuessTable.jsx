import GuessRow from "./GuessRow";
import GuessEmptyRow from "./GuessEmptyRow";
import "./GuessTable.css";
import { HEADERS } from "../../utils/gameLogic";

export default function GuessTable({ rows }) {
  return (
    <div className="guess-table">
      {/* Column headers */}
      <div className="guess-table__headers">
        {HEADERS.map((h) => (
          <div key={h} className="guess-table__header-cell">{h}</div>
        ))}
      </div>
      {rows.length === 0 && (
        <GuessEmptyRow length={HEADERS.length}/>
      )}{
      rows.map((row, i) => (
        <GuessRow key={row.character.name} cells={row.cells} isWin={i === 0 && row.cells.every(c => c.status === "correct")} isFirst={i === 0}/>
      ))}
    </div>
  );
}
