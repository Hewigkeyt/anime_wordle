import "./Header.css";
// import { MAX_GUESSES } from "../../utils/gameLogic";

export default function Header({ guessCount, mode, dailyBoardVisible, yesterday, warning }) {
  return (
    <header className="header">
      <h1 className="header__title"><span className="shine">ANIME WORDLE</span>ANIME WORDLE</h1>
      <p className="header__subtitle">
        {/* {(mode === "infinite" || dailyBoardVisible) && (<>Guess the character · Number of attempts {guessCount}</>)} */}
        {(mode === "infinite" || dailyBoardVisible) && ("Guess the mystery character!\nEach try gives you clues to help you get closer.")}
      </p>
      <p className="header__subtitle">
        {mode === "daily" && yesterday ? (<>Yesterday's character was {yesterday.name} from {yesterday.anime.name}.</>):'' }
        {warning && ( <><br/><span className="header__warning">{warning}</span></>)}
      </p>
    </header>
  );
}
