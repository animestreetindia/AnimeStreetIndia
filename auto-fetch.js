const axios = require('axios');

// Aapka exact URL (Iske aage .json lagana bahut zaroori hai)
const DB_URL = "https://animeshreet-default-rtdb.firebaseio.com/episodes.json";

async function autoUpload() {
    try {
        console.log("Fetching from Consumet...");
        const res = await axios.get('https://api.consumet.org/anime/gogoanime/recent-episodes');
        const episodes = res.data.results;

        console.log(`Found ${episodes.length} episodes. Now uploading...`);

        for (let ep of episodes) {
            // Hum direct POST request bhej rahe hain
            const response = await axios.post(DB_URL, {
                animeName: ep.title,
                episodeNo: ep.episodeNumber,
                watch: ep.url,
                image: ep.image,
                timestamp: new Date().getTime()
            });
            console.log("Success: " + ep.title);
        }
        console.log("Database Sync Complete!");
    } catch (error) {
        console.error("FAILED! Error details:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error("Message:", error.message);
        }
    }
}

autoUpload();
