const axios = require('axios');

const PROJECT_ID = "animeshreet"; 
const API_KEY = process.env.FIREBASE_API_KEY;

async function autoUpload() {
    try {
        console.log("Fetching latest anime...");
        // Consumet API for GogoAnime recent episodes
        const res = await axios.get('https://api.consumet.org/anime/gogoanime/recent-episodes');
        const episodes = res.data.results;

        for (let ep of episodes) {
            // Realtime Database Endpoint
            const dbUrl = `https://${PROJECT_ID}-default-rtdb.firebaseio.com/episodes.json?key=${API_KEY}`;
            
            await axios.post(dbUrl, {
                animeName: ep.title.toLowerCase(),
                episodeNo: ep.episodeNumber,
                watch: ep.url,
                image: ep.image,
                source: 'auto',
                timestamp: new Date().getTime()
            });
            console.log("Successfully Uploaded: " + ep.title);
        }
    } catch (error) {
        console.log("Error:", error.message);
    }
}

autoUpload();
