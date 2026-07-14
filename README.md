# Anime Wordle

A Wordle-inspired guessing game for anime characters.
Try to guess in the minimum number of attempts!

Play directly [here](https://hewigkeyt.github.io/anime_wordle/)!

## Current status

The game has a leaderboard for the daily guess. It is split between no-hint/with-hint players.
You can also see the ranking from the previous day.

The feedback you get is based on Anime, anime year, studio, height, age, hair color, seiyuu (Japanese voice actor) and sex.
Studio and hair color may have multiple values.
Age, height and sex may have unknown value.

> ⚠️ **Note on Character Pool:** 
> The character pool is currently limited and may contain occasional inaccuracies or formatting errors in character attributes. 

If you notice any missing characters, incorrect data, or bugs, please feel free to **open an issue/ticket** in this repository. Community contributions and feedback are highly appreciated to help expand and refine the database!

## Installation & Setup
If you need it locally

```bash
# Clone the repository
git clone https://github.com/Hewigkeyt/anime_wordle.git

# Navigate into the directory
cd anime_wordle

# Install modules
npm install

# Start
npm run dev
```
You would need a .env file with your own VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.