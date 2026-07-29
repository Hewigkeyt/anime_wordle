import { useState } from "react";
import "./Footer.css";

export default function Footer() {
    const [CLopen, CLsetOpen] = useState(false);

    return (
        <footer className="footer">
            <p>Information:</p>
            <ul>
                <li>A character's data is based on their first major anime appearance.</li>
                <li>Hair colors are simplified to basic shades (e.g., navy and cyan are both 'Blue').<br/>Brown is still split into 3 shades because the range is too wide.</li>
                <li>Short introductions are ignored (e.g. Eren Yeager is 15 y.o.).</li>
                <li>For instance Naruto Uzumaki is a 12-year-old character from Naruto (2002), not Naruto Shippuden (2007).</li>
                <li>For variety, the same character cannot be the target twice within 3 months, and the same anime cannot appear more than once a month.</li>
                <li>If you notice an error please fill an issue <a href="https://github.com/Hewigkeyt/anime_wordle/issues">here</a>.</li>
            </ul>
            <br />
            <p>Updates to come:</p>
            <ul>
                <li>Addition/fix of characters in the database.</li>
                <li>Revamp of hair brown color (too much variation).</li>
            </ul>
            <br />
            <p>Changelog:</p>
            <button className="hint-section__header" onClick={() => CLsetOpen(v => !v)}>{CLopen ? "Hide" : "See"} full changelog {CLopen ? "▲" : "▼"}</button>
            {CLopen && (
                <table className="change-log">
                    <tr><td>2026-07-29</td><td>Big DB update. Brown hair split into brown, dark brown and light brown.</td></tr>
                    <tr><td>2026-07-27</td><td>Filter out from hints studios ruled out by year.</td></tr>
                    <tr><td>2026-07-23</td><td>Added a button to copy only the number of guesses without the rows. For spam detection bots.</td></tr>
                    <tr><td>2026-07-22</td><td>Added a monthly ranking! The average is calculated with the following weights.<br/>Hints used = +5. Missed day = worst score of the day +1.</td></tr>
                    <tr><td>2026-07-19</td><td>Removed by default suggestions from animes already ruled out.</td></tr>
                    <tr><td>2026-07-19</td><td>Revamped the hint panel to filter directly the ruled out studios, and to show studios' year range.</td></tr>
                    <tr><td>2026-07-14</td><td>Updated in the daily picker so the same character cannot be picked twice in 3 months.</td></tr>
                    <tr><td>2026-07-10</td><td>Added multi-value for hair color (removed "bicolor" value) and studio.</td></tr>
                    <tr><td>2026-07-09</td><td>Changed the leaderboard layout and added results for previous daily.</td></tr>
                    <tr><td>2026-07-02</td><td>Added seiyuu and sex data in the clues.</td></tr>
                </table>
            )}
            <br />
            <p>Privacy Policy:</p>
            <p className="privacy">Your privacy is important to us. This website uses Google AdSense to serve advertisements. Google and its partners use cookies to serve ads based on your prior visits to this website or other websites on the Internet.</p>
            <p className="privacy">Google’s use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>Google Ads Settings</a>.</p>
            <p className="privacy">By continuing to use this website and playing Anime Wordle, you consent to the use of these cookies for advertising and analytics purposes.</p>
        </footer>
    );
}