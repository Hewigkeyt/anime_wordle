import "./Cell.css";

const ARROW = { low: "▲", high: "▼" };

export default function Cell({ status, display, numeric, animDelay }) {
  return (
    <div
      className={`cell cell--${status}`}
      style={{ animationDelay: animDelay }}
    >
      <span className="cell__value">{display}</span>
      {numeric && ARROW[status] && (
        <span className="cell__arrow">{ARROW[status]}</span>
      )}
    </div>
  );
}
