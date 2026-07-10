import Cell from "./Cell";
import "./GuessRow.css";

export default function GuessEmptyRow({length}) {
  return (
    
    <div className="guess-row guess-row--empty">
      {Array.from({ length: length }, (_) => (
        <Cell
          status="empty"
          display="?"
          numeric="false"
          animDelay="0.5s"
        />
      ))}
    </div>
    
  );
}
