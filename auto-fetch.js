const axios = require('axios');

const DB_URL = "https://animeshreet-default-rtdb.firebaseio.com/episodes.json";

async function autoUpload() {
    try {
        console.log("Connecting to Jikan API (Stable Source)...");
        // Ye MyAnimeList ka data nikalta hai, jo kabhi block nahi hota
        const res = await axios.get('https://api.jikan.moe/v4/seasons/now');
        const animeList = res.data.data;

        console.log(`Found ${animeList.length} anime. Syncing to Firebase...`);

        for (let anime of animeList.slice(0, 15)) {
            await axios.post(DB_URL, {
                animeName: anime.title,
                episodeNo: anime.episodes || "Ongoing",
                watch: anime.url, 
                image: anime.images.jpg.large_image_url,
                rating: anime.score,
                timestamp: new Date().getTime()
            });
            console.log("Synced: " + anime.title);
        }
        console.log("Mission Successful!");
    } catch (error) {
        console.log("Error: " + error.message);
    }
}

autoUpload();
