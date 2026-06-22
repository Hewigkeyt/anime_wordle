import Cell from "./Cell";
import "./GuessRow.css";

export default function GuessRow({ cells }) {
  return (
    <div className="guess-row">
      {cells.map((cell, i) => (
        <Cell
          key={cell.key}
          status={cell.status}
          display={cell.display}
          numeric={cell.numeric}
          animDelay={`${i * 0.07}s`}
        />
      ))}
    </div>
  );
}
