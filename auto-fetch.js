const axios = require('axios');

const DB_URL = "https://animeshreet-default-rtdb.firebaseio.com/episodes.json";

async function autoUpload() {
    try {
        console.log("Connecting to New Source...");
        // Hum doosri open API use kar rahe hain jo block nahi hai
        const res = await axios.get('https://api.amvstr.me/api/v2/recent');
        const episodes = res.data.results;

        console.log(`Found ${episodes.length} episodes. Syncing...`);

        for (let ep of episodes) {
            await axios.post(DB_URL, {
                animeName: ep.title.userPreferred || ep.title.english,
                episodeNo: ep.episodeNumber,
                watch: `https://anitaku.to/${ep.id}-episode-${ep.episodeNumber}`,
                image: ep.image,
                timestamp: new Date().getTime()
            });
            console.log("Synced: " + (ep.title.english || ep.title.userPreferred));
        }
    } catch (error) {
        console.error("Error Code:", error.response ? error.response.status : error.message);
    }
}

autoUpload();

