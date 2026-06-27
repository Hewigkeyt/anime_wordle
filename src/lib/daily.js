import { supabase } from "./supabase";
import { pickRandom } from "../utils/gameLogic";

/**
 * Returns today's date as "YYYY-MM-DD" in UTC.
 * Using UTC so it matches what the cron job writes.
 */
export function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export function yesterdayString() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Fetches today's character index from Supabase (set by the cron job),
 * then resolves it against the local DB.
 * Caches in sessionStorage so it's one network call per tab per day.
 */
export async function getDailyTarget(db) {
  const today    = todayString();
  const yesterday = yesterdayString();

  const cacheKey = `aw_daily_name_v2${today}`;
  const yCacheKey = `aw_daily_name_v2${yesterday}`;

  const cached = sessionStorage.getItem(cacheKey);
  const cachedYesterday = sessionStorage.getItem(yCacheKey);
  if (cached && cachedYesterday) return {
    target: db.find((c) => c.name === cached) ?? pickRandom(db),
    yesterday: cachedYesterday
        ? db.find((c) => c.name === cachedYesterday) ?? null
        : null,
  }

 const { data, error } = await supabase
    .from("daily_index")
    .select("day, character_name")
    .gte("day", yesterday)
    .lte("day", today);


  if (error || !data) {
    console.warn("daily_index not found for today, using fallback");
    return { target: pickRandom(db), yesterday: null };
  }
  
  const todayRow     = data.find((r) => r.day === today);
  const yesterdayRow = data.find((r) => r.day === yesterday);
 
  if (todayRow) sessionStorage.setItem(cacheKey, todayRow.character_name);
  if (yesterdayRow) sessionStorage.setItem(yCacheKey, yesterdayRow.character_name);
 
  let warning = null;
  let target;
  if (!todayRow) {
    warning = "No daily challenge found for today. Playing with a random character.";
    target = pickRandom(db);
  } else {
    target = db.find((c) => c.name === todayRow.character_name);
    if (!target) {
      warning = "No daily challenge found for today. Playing with a random character.";
      target = pickRandom(db);
    }
  }
 
  const yesterdayChar = yesterdayRow
    ? db.find((c) => c.name === yesterdayRow.character_name) ?? null
    : null;
 
  return { target, yesterday: yesterdayChar, warning };
}

/**
 * Submits a daily score. Silently ignores duplicate (same day + username).
 */
export async function submitScore({ username, guesses, hintUsed }) {
  return supabase.from("daily_scores").insert({
    day:       todayString(),
    username:  username.trim(),
    guesses,
    hint_used: hintUsed,
  });
}

/**
 * Fetches today's top 3 scores.
 * Ranking: fewest guesses → no hint used → earliest submission.
 */
export async function fetchTop3() {
  const { data, error } = await supabase
    .from("daily_scores")
    .select("username, guesses, hint_used, created_at")
    .eq("day", todayString())
    .order("hint_used",  { ascending: true })
    .order("guesses",    { ascending: true })
    .order("created_at", { ascending: true });
    // .limit(3);

  return { data, error };
}

/**
 * Checks whether a username has already submitted today.
 */
export async function hasPlayedToday(username) {
  const { data } = await supabase
    .from("daily_scores")
    .select("id")
    .eq("day", todayString())
    .eq("username", username.trim())
    .maybeSingle();

  return !!data;
}

export function saveDailyResult(won, guessCount, hintUsed) {
  localStorage.setItem("aw_daily_result", JSON.stringify({
    day:        todayString(),
    won,
    guessCount,
    hintUsed,
  }));
}
export function loadDailyResult() {
  try {
    const raw = localStorage.getItem("aw_daily_result");
    if (!raw) return null;
    const data = JSON.parse(raw);
    // discard if it's from a previous day
    if (data.day !== todayString()) {
      localStorage.removeItem("aw_daily_result");
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function saveGuessRows(rows, mode = "daily") {
  localStorage.setItem(`aw_${mode}_rows`, JSON.stringify({
    day: todayString(),
    rows,
  }));
}

export function loadGuessRows(mode = "daily") {
  try {
    const raw = localStorage.getItem(`aw_${mode}_rows`);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // daily rows expire each day, infinite rows don't
    if (mode === "daily" && data.day !== todayString()) {
      localStorage.removeItem(`aw_${mode}_rows`);
      return null;
    }
    return data.rows;
  } catch {
    return null;
  }
}

export function clearGuessRows(mode = "daily") {
  localStorage.removeItem(`aw_${mode}_rows`);
}

export function saveInfiniteTarget(characterName) {
  localStorage.setItem("aw_infinite_target", characterName);
}

export function loadInfiniteTarget(db) {
  const name = localStorage.getItem("aw_infinite_target");
  if (!name) return null;
  return db.find((c) => c.name === name) ?? null;
}

export function clearInfiniteTarget() {
  localStorage.removeItem("aw_infinite_target");
}