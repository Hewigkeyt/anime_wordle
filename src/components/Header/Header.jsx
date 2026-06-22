import "./Header.css";
// import { MAX_GUESSES } from "../../utils/gameLogic";

export default function Header({ guessCount }) {
  return (
    <header className="header">
      <h1 className="header__title">ANIME WORDLE</h1>
      <p className="header__subtitle">
        Guess the character · Number of attempts {guessCount}
      </p>
    </header>
  );
}
