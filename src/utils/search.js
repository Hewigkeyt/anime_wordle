/**
 * Ranked search over the character database.
 *
 * The previous implementation was a plain substring filter
 * (`name.includes(q) || anime.includes(q)`) followed by `.slice(0, 8)`:
 * results came back in raw database order, so a query could be flooded by
 * irrelevant mid-word substrings. Searching "naruto" surfaced Boruto
 * characters as early as actual Naruto ones, "dragon ball" returned
 * Dragon Ball Z before Dragon Ball, and "baki" was polluted by Tsu*baki*.
 *
 * This module replaces it with a relevance score:
 *
 *   exact field match        1000   "naruto"  -> anime "Naruto"
 *   field starts with query   700   "one"     -> anime "One Piece"
 *   whole word / phrase       600   "luffy"   -> "Monkey D. Luffy"
 *   word starts with query    500   "uzu"     -> "Naruto Uzumaki"
 *   mid-word substring        100   "baki"    -> "Tsu*baki*" (last resort)
 *
 * The character *name* gets a small bonus (+50) over the anime title, except
 * that an exact anime match (1000) still outranks every weaker name match
 * (prefix 750, whole word 650, word prefix 550, substring 150) — which is
 * the requested behaviour: searching X first returns the characters of the
 * anime X, ahead of characters / animes that merely contain "x".
 * A character matching in both its name and its anime gets +30, so e.g.
 * Naruto Uzumaki leads the Naruto results for the query "naruto".
 *
 * Multi-word queries also work token by token (every token must match
 * somewhere), so "uzumaki naruto" and "monkey luffy" find their character
 * even though the full phrase never appears verbatim.
 *
 * Efficiency: normalisation (case, accents, punctuation) is precomputed
 * once per database in `createSearchIndex`. A search is then a single
 * pass over the index, scoring only, followed by sorting the (usually
 * small) set of candidates — never the whole database.
 */

export const MAX_SUGGESTIONS = 8;

const SCORE = {
  EXACT: 1000,
  PREFIX: 700,
  WORD: 600,
  WORD_PREFIX: 500,
  SUBSTRING: 100,
  NAME_BONUS: 50,
  BOTH_FIELDS_BONUS: 30,
};

/** Lowercase, strip accents and turn punctuation into word separators. */
export function normalizeText(value) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Precompute the searchable form of every character once.
 * Returns entries of `{ character, index, name, anime, nameWords, animeWords }`
 * where `index` is the position in the original database (used as a stable
 * tie-breaker, preserving the curated database order within a score).
 */
export function createSearchIndex(db) {
  return db.map((character, index) => {
    const name = normalizeText(character.name);
    const anime = normalizeText(character.anime?.name);
    return {
      character,
      index,
      name,
      anime,
      nameWords: name ? name.split(" ") : [],
      animeWords: anime ? anime.split(" ") : [],
    };
  });
}

/** Score one normalized field against the full normalized query. */
function scoreField(query, field, words) {
  if (!query || !field) return 0;
  if (field === query) return SCORE.EXACT;
  if (field.startsWith(query)) return SCORE.PREFIX;
  // Whole word, or whole multi-word phrase aligned on word boundaries.
  if (words.includes(query) || ` ${field} `.includes(` ${query} `)) {
    return SCORE.WORD;
  }
  if (words.some((word) => word.startsWith(query))) return SCORE.WORD_PREFIX;
  if (field.includes(query)) return SCORE.SUBSTRING;
  return 0;
}

/**
 * Fallback for multi-word queries: every token must match (in the name or
 * the anime), in any order. Returns the average per-token score, or 0 as
 * soon as one token matches nowhere.
 */
function scoreTokens(queryTokens, entry) {
  let total = 0;
  for (const token of queryTokens) {
    const best = Math.max(
      scoreField(token, entry.name, entry.nameWords),
      scoreField(token, entry.anime, entry.animeWords),
    );
    if (best === 0) return 0;
    total += best;
  }
  return total / queryTokens.length;
}

function scoreEntry(query, queryTokens, entry) {
  const nameScore = scoreField(query, entry.name, entry.nameWords);
  const animeScore = scoreField(query, entry.anime, entry.animeWords);

  let score = Math.max(
    nameScore ? nameScore + SCORE.NAME_BONUS : 0,
    animeScore,
  );

  if (queryTokens.length > 1) {
    score = Math.max(score, scoreTokens(queryTokens, entry));
  }

  if (score === 0) return 0;

  // A one-letter query must match a word boundary ("x" -> anime "X",
  // "Hunter x Hunter"), never a letter buried inside a word.
  if (query.length === 1 && Math.max(nameScore, animeScore) <= SCORE.SUBSTRING) {
    return 0;
  }

  if (nameScore >= SCORE.WORD_PREFIX && animeScore >= SCORE.WORD_PREFIX) {
    score += SCORE.BOTH_FIELDS_BONUS;
  }
  return score;
}

/**
 * Return the `limit` most relevant characters for `query`.
 *
 * @param {ReturnType<typeof createSearchIndex>} index
 * @param {string} query
 * @param {{ limit?: number, isEligible?: (character: object) => boolean }} [options]
 *   `isEligible` lets the caller keep game rules (already guessed, strong
 *   filter, ...) out of the ranking logic.
 */
export function searchCharacters(index, query, options = {}) {
  const { limit = MAX_SUGGESTIONS, isEligible } = options;
  const q = normalizeText(query);
  if (!q) return [];

  const queryTokens = q.split(" ");
  const matches = [];

  for (const entry of index) {
    if (isEligible && !isEligible(entry.character)) continue;
    const score = scoreEntry(q, queryTokens, entry);
    if (score > 0) matches.push({ entry, score });
  }

  matches.sort(
    (a, b) => b.score - a.score || a.entry.index - b.entry.index,
  );

  return matches.slice(0, limit).map(({ entry }) => entry.character);
}
