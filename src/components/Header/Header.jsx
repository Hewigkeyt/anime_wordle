import "./Header.css";
// import { MAX_GUESSES } from "../../utils/gameLogic";

export default function Header({ guessCount, mode, dailyBoardVisible, yesterday }) {
  return (
    <header className="header">
      <h1 className="header__title"><span className="shine">ANIME WORDLE</span>ANIME WORDLE</h1>
      <p className="header__subtitle">
        {(mode === "infinite" || dailyBoardVisible) && (<>Guess the character · Number of attempts {guessCount}</>)}
        {mode === "daily" && yesterday ? (<><br/> Yesterday's character was {yesterday.name} from {yesterday.anime.name}.</>):'' }
      </p>
    </header>
  );
}
