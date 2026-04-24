const axios = require('axios');
const DB_URL = "https://animeshreet-default-rtdb.firebaseio.com/episodes.json";

async function fetchDubbedAnime() {
    try {
        console.log("Fetching Dubbed Anime episodes...");
        
        // Dubbed episodes nikalne ke liye specific endpoint
        const res = await axios.get('https://api.consumet.org/anime/gogoanime/recent-episodes?type=2'); 
        const episodes = res.data.results;

        console.log(`Found ${episodes.length} dubbed episodes!`);

        for (let ep of episodes.slice(0, 15)) {
            await axios.post(DB_URL, {
                title: ep.title,
                episode: ep.episodeNumber,
                image: ep.image,
                link: ep.url,
                language: "Hindi/Eng Dub", 
                timestamp: new Date().getTime()
            });
            console.log("Synced: " + ep.title);
        }
    } catch (error) {
        console.log("Primary API failed, trying stable proxy...");
        // Backup: Agar primary fail ho toh Jikan se latest updates le
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
fetchDubbedAnime();
