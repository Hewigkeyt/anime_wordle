import Cell from "./Cell";
import "./GuessRow.css";

export default function GuessEmptyRow({length}) {
  return (
    
    <div className="guess-row guess-row--empty">
      {Array.from({ length: length }, (_,index) => (
        <Cell
          key={index}
          status="empty"
          display="?"
          numeric="false"
          animDelay="0.5s"
        />
      ))}
    </div>
    
  );
}
