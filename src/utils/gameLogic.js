export const HEADERS = ["Character",  "Sex", "Seiyuu", "Anime", "Year", "Studio", "Age", "Height", "Hair color",];
// export const MAX_GUESSES = 8;

/**
 * Compares two numbers and returns a cell status.
 * @param {number} guess
 * @param {number} target
 * @returns {"correct"|"low"|"high"}
 */
export function compareNum(guess, target) {
  if (guess === target) return "correct";
  return guess < target ? "low" : "high";
}

/**
 * Builds a result row by comparing a guessed character against the target.
 * @param {object} guess  - character from DB
 * @param {object} target - the secret character
 * @returns {{ character: object, cells: Cell[] }}
 */
export function buildResult(guess, target) {
  //Logic for partial studio matching
  const guessStudios  = Array.isArray(guess.anime.studio)  ? guess.anime.studio  : [guess.anime.studio];
  const targetStudios = Array.isArray(target.anime.studio) ? target.anime.studio : [target.anime.studio];
  const exactStudio   = guessStudios.length === targetStudios.length &&
  guessStudios.every(s => targetStudios.includes(s));
  const partialStudio = !exactStudio && guessStudios.some(s => targetStudios.includes(s));

  //Logic for partial hair color matching
  const guessHair  = Array.isArray(guess.hair_color)  ? guess.hair_color  : [guess.hair_color];
  const targetHair = Array.isArray(target.hair_color) ? target.hair_color : [target.hair_color];

  const hairExact   = guessHair.length === targetHair.length &&
    guessHair.every(h => targetHair.includes(h));
  const hairPartial = !hairExact && guessHair.some(h => targetHair.includes(h));

  return {
    character: guess,
    cells: [
      {
        key: "name",
        display: guess.name,
        status: guess.name === target.name ? "correct" : "wrong",
      },
      {
        key: "sex",
        display: guess.sex ?? "?",
        status: guess.sex === null && target.sex === null ? "correct"
              : guess.sex === null || target.sex === null ? "wrong"
              : guess.sex === target.sex ? "correct" : "wrong",
      },
      {
        key: "seiyuu",
        display: guess.seiyuu ?? "?",
        status: guess.seiyuu === target.seiyuu ? "correct" : "wrong",
      },
      {
        key: "anime",
        display: guess.anime.name,
        status: guess.anime.name === target.anime.name ? "correct" : "wrong",
      },
      {
        key: "year",
        display: String(guess.anime.year),
        status: compareNum(guess.anime.year, target.anime.year),
        numeric: true,
      },
      {
        key: "studio",
        display: guessStudios.join(" / "),
        status: exactStudio ? "correct" : partialStudio ? "partial" : "wrong",
      },
      {
        key: "age",
        display: guess.age === null ? "?" : String(guess.age),
        status: guess.age === null && target.age === null ? "correct"
          : guess.age === null || target.age === null ? "wrong"
            : compareNum(guess.age, target.age),
        numeric: guess.age !== null && target.age !== null,
      },
      {
        key: "height",
        display: guess.height === null ? "?" : `${guess.height} cm`,
        status: guess.height === null && target.height === null ? "correct"
          : guess.height === null || target.height === null ? "wrong"
            : compareNum(guess.height, target.height),
        numeric: guess.height !== null && target.height !== null,
      },
      {
        key: "hair",
        display: guessHair.join(" / "),
        status: hairExact ? "correct" : hairPartial ? "partial" : "wrong",
      },
      
    ],
  };
}

/**
 * Picks a random entry from an array.
 * @param {any[]} arr
 * @returns {any}
 */
export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
