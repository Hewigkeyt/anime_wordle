import "./ResultBanner.css";

export default function ResultBanner({ won, lost, target, attempts }) {
  if (!won && !lost) return null;

  return (
    <div className={`result-banner result-banner--${won ? "win" : "loss"}`}>
      <p className="result-banner__message">
        {won
          ? `🎉 Correct! You guessed ${target.name} in ${attempts} attempts!`
          : `💀 Game over! It was ${target.name} from ${target.anime.name}.`}
      </p>
      <button
        className="result-banner__btn"
        onClick={() => window.location.reload()}
      >
        PLAY AGAIN
      </button>
    </div>
  );
}
