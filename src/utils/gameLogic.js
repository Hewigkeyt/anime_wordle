export const HEADERS = ["Character", "Anime", "Year", "Studio", "Age", "Height", "Hair color"];
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
  return {
    character: guess,
    cells: [
      {
        key: "name",
        display: guess.name,
        status: guess.name === target.name ? "correct" : "wrong",
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
        display: guess.anime.studio,
        status: guess.anime.studio === target.anime.studio ? "correct" : "wrong",
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
        display: guess.hair_color,
        status: guess.hair_color === target.hair_color ? "correct" : "wrong",
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
