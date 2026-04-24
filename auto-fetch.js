const axios = require('axios');
const DB_URL = "https://animeshreet-default-rtdb.firebaseio.com/episodes.json";

async function fetchEpisodes() {
    try {
        console.log("Fetching Episodes...");
        // Stable source for latest episodes
        const res = await axios.get('https://api.amvstr.me/api/v2/recent');
        const episodes = res.data.results;

        for (let ep of episodes.slice(0, 15)) {
            await axios.post(DB_URL, {
                title: ep.title.english || ep.title.userPreferred,
                episode: ep.episodeNumber,
                image: ep.image,
                // Direct watch link
                link: `https://anitaku.to/${ep.id}-episode-${ep.episodeNumber}`,
                timestamp: new Date().getTime()
            });
        }
        console.log("Success!");
    } catch (error) {
        console.log("Error: " + error.message);
    }
}
fetchEpisodes();
