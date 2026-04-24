const axios = require('axios');
const DB_URL = "https://animeshreet-default-rtdb.firebaseio.com/episodes.json";

async function fetchEpisodes() {
    try {
        console.log("Fetching Episodes from Stable Source...");
        
        // Ye API GitHub par block nahi hai
        const res = await axios.get('https://api.anify.tv/recent-episodes', {
            timeout: 8000
        });
        
        const episodes = res.data; 

        if (!episodes || episodes.length === 0) {
            throw new Error("No episodes found");
        }

        console.log(`Found ${episodes.length} episodes!`);

        for (let ep of episodes.slice(0, 15)) {
            await axios.post(DB_URL, {
                title: ep.anime.title.english || ep.anime.title.romaji,
                episode: ep.episode,
                image: ep.anime.coverImage || ep.anime.bannerImage,
                link: `https://anify.tv/anime/${ep.animeId}/watch/${ep.episode}`,
                timestamp: new Date().getTime()
            });
            console.log("Uploaded: " + (ep.anime.title.english || ep.anime.title.romaji));
        }
        console.log("Mission Accomplished!");

    } catch (error) {
        console.log("Primary API failed, trying Backup...");
        // Backup: Agar upar wala fail ho toh Jikan se latest updates uthao
        try {
            const backupRes = await axios.get('https://api.jikan.moe/v4/watch/episodes');
            const backupData = backupRes.data.data;
            
            for (let b of backupData.slice(0, 10)) {
                await axios.post(DB_URL, {
                    title: b.entry.title,
                    episode: b.episodes[0].title || "Latest",
                    image: b.entry.images.jpg.large_image_url,
                    link: b.entry.url,
                    timestamp: new Date().getTime()
                });
            }
            console.log("Backup Sync Done!");
        } catch (err) {
            console.log("All sources failed: " + err.message);
        }
    }
}

fetchEpisodes();
