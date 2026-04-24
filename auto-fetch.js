const axios = require('axios');
const DB_URL = "https://animeshreet-default-rtdb.firebaseio.com/episodes.json";

async function fetchDubbed() {
    try {
        console.log("Connecting to Anime-API Proxy...");
        // Ye proxy block nahi hoti
        const res = await axios.get('https://api.amvstr.me/api/v2/recent');
        const episodes = res.data.results;

        console.log(`Found ${episodes.length} episodes!`);

        for (let ep of episodes.slice(0, 15)) {
            await axios.post(DB_URL, {
                title: ep.title.english || ep.title.userPreferred,
                episode: ep.episodeNumber,
                image: ep.image,
                link: `https://anitaku.to/${ep.id}-episode-${ep.episodeNumber}`,
                language: "Hindi/Eng Dubbed",
                timestamp: new Date().getTime()
            });
        }
        console.log("Data Synced Successfully!");
    } catch (error) {
        console.log("Proxy failed, using Jikan stable backup...");
        const backup = await axios.get('https://api.jikan.moe/v4/watch/episodes');
        for (let b of backup.data.data.slice(0, 10)) {
            await axios.post(DB_URL, {
                title: b.entry.title,
                episode: b.episodes[0].title,
                image: b.entry.images.jpg.image_url,
                link: b.entry.url,
                language: "Latest Release",
                timestamp: new Date().getTime()
            });
        }
    }
}
fetchDubbed();
