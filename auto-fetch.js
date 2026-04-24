const axios = require('axios');

// Aapka exact Database URL jo photo mein dikh raha hai
const DB_URL = "https://animeshreet-default-rtdb.firebaseio.com/episodes.json";
const API_KEY = process.env.FIREBASE_API_KEY;

async function autoUpload() {
    try {
        console.log("Fetching latest anime...");
        const res = await axios.get('https://api.consumet.org/anime/gogoanime/recent-episodes');
        const episodes = res.data.results;

        if (!episodes || episodes.length === 0) {
            console.log("No episodes found from API.");
            return;
        }

        for (let ep of episodes) {
            // Seedha URL use kar rahe hain auth key ke saath
            const finalUrl = `${DB_URL}?auth=${API_KEY}`;
            
            await axios.post(finalUrl, {
                animeName: ep.title,
                episodeNo: ep.episodeNumber,
                watch: ep.url,
                image: ep.image,
                timestamp: new Date().getTime()
            });
            console.log("Successfully Uploaded: " + ep.title);
        }
    } catch (error) {
        console.log("Error details:", error.response ? error.response.data : error.message);
    }
}

autoUpload();
