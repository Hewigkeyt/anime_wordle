import { supabase } from "./supabase";

/**
 * Returns today's date as "YYYY-MM-DD" in UTC.
 * Using UTC so it matches what the cron job writes.
 */
export function todayString() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Fetches today's character index from Supabase (set by the cron job),
 * then resolves it against the local DB.
 * Caches in sessionStorage so it's one network call per tab per day.
 */
export async function getDailyTarget(db) {
  const today    = todayString();
  const cacheKey = `aw_daily_name_${today}`;

  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return db.find((c) => c.name === cached) ?? pickRandom(db);

  const { data, error } = await supabase
    .from("daily_index")
    .select("character_name")
    .eq("day", today)
    .maybeSingle();

  if (error || !data) {
    console.warn("daily_index not found for today, using fallback");
    return pickRandom(db);
  }

  sessionStorage.setItem(cacheKey, data.character_name);
  return db.find((c) => c.name === data.character_name) ?? pickRandom(db);
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
    .order("guesses",    { ascending: true })
    .order("hint_used",  { ascending: true })
    .order("created_at", { ascending: true })
    .limit(3);

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