import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <p>Information:</p>
            <ul>
                <li>Use the clues from each guess to find the mystery character!</li>
                <li>A character's data is based on their first major anime appearance.</li>
                <li>Hair colors are simplified to basic shades (e.g., navy and cyan are both 'Blue').</li>
                <li>Short introductions are ignored (e.g. Eren Yeager is 15 y.o.).</li>
                <li>For instance Naruto Uzumaki is a 12-year-old character from Naruto (2002), not Naruto Shippuden (2007).</li>
                <li>If you notice an error please fill an issue <a href="https://github.com/Hewigkeyt/anime_wordle/issues">here</a>.</li>
            </ul>
            <br />
            <p>Updates to come:</p>
            <ul>
                <li>Addition/fix of characters in the database.</li>
            </ul>
            <br />
            <p>Privacy Policy:</p>
            <p className="privacy">Your privacy is important to us. This website uses Google AdSense to serve advertisements. Google and its partners use cookies to serve ads based on your prior visits to this website or other websites on the Internet.</p>
            <p className="privacy">Google’s use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>Google Ads Settings</a>.</p>
            <p className="privacy">By continuing to use this website and playing Anime Wordle, you consent to the use of these cookies for advertising and analytics purposes.</p>
        </footer>
    );
}