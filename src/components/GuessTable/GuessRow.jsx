import Cell from "./Cell";
import "./GuessRow.css";

export default function GuessRow({ cells, isWin = false }) {
  return (
    
    <div className={`guess-row ${isWin ? "guess-row--win" : ""}`}>
      {cells.map((cell, i) => (
        <Cell
          key={cell.key}
          status={cell.status}
          display={cell.display}
          numeric={cell.numeric}
          animDelay={`${i * 0.1}s`}
        />
      ))}
    </div>
    
  );
}
