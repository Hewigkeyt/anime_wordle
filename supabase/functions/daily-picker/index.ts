import { createClient } from "jsr:@supabase/supabase-js@2";

const DB_URL =
  "https://raw.githubusercontent.com/Hewigkeyt/anime_wordle/refs/heads/master/src/data/characters.json";

Deno.serve(async (req) => {
  // Verify this is called by the Supabase scheduler, not a random request
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${Deno.env.get("CRON_SECRET")}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // 1. Fetch the current character list from GitHub
    const res = await fetch(DB_URL);
    if (!res.ok) throw new Error(`GitHub fetch failed: ${res.status}`);
    const db: { name: string }[] = await res.json();

    // 2. Pick a random index
    const idx = Math.floor(Math.random() * db.length);

    const body = await req.json().catch(() => ({}));
    const tomorrow = new Date();
    let day: string;
    if (body.day) {
    // use provided date directly
        day = body.day;
    // ... rest of logic
    } else {
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
        day = tomorrow.toISOString().slice(0, 10);
    }
    // 4. Upsert into Supabase (safe to run multiple times)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    
    const char = db[Math.floor(Math.random() * db.length)];

    const { error } = await supabase
    .from("daily_index")
    .upsert({ day, character_name: char.name }, { onConflict: "day", ignoreDuplicates: true });

    return Response.json({ ok: true, day, character: char.name });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
});