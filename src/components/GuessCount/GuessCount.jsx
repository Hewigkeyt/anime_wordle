import "./GuessCount.css";

export default function GuessCount({guessCount}) {
  return (
    <p className="guess__count">
      Tries: {guessCount}
    </p>
  );
}
