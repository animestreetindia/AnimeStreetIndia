const axios = require('axios');

// Direct URL bina kisi password (auth) ke, kyunki rules true hain
const DB_URL = "https://animeshreet-default-rtdb.firebaseio.com/episodes.json";

async function autoUpload() {
    try {
        console.log("Fetching latest anime from GogoAnime...");
        const res = await axios.get('https://api.consumet.org/anime/gogoanime/recent-episodes');
        const episodes = res.data.results;

        if (!episodes || episodes.length === 0) {
            console.log("No new episodes found.");
            return;
        }

        for (let ep of episodes) {
            await axios.post(DB_URL, {
                animeName: ep.title,
                episodeNo: ep.episodeNumber,
                watch: ep.url,
                image: ep.image,
                timestamp: new Date().getTime()
            });
            console.log("Uploaded: " + ep.title);
        }
        console.log("All episodes synced successfully!");
    } catch (error) {
        console.log("Error logic: " + error.message);
    }
}

autoUpload();

