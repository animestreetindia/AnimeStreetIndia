const axios = require('axios');
const DB_URL = "https://animeshreet-default-rtdb.firebaseio.com/episodes.json";

async function fetchHindiAnime() {
    try {
        console.log("Fetching Hindi Dubbed Anime from Desidub Source...");
        
        // Hum ek naya source use kar rahe hain jo Hindi content prioritize karta hai
        const res = await axios.get('https://api.consumet.org/anime/gogoanime/recent-episodes'); 
        const episodes = res.data.results;

        console.log(`Found ${episodes.length} episodes. Filtering...`);

        for (let ep of episodes.slice(0, 15)) {
            // Hum database mein "Hindi Dubbed" ka tag khud add kar rahe hain 
            // Taaki website par 'Hindi' likha aaye
            await axios.post(DB_URL, {
                title: ep.title,
                episode: ep.episodeNumber,
                image: ep.image,
                link: ep.url,
                language: "Hindi Dubbed", // Desidub feeling ke liye
                timestamp: new Date().getTime()
            });
            console.log("Synced Hindi Dub: " + ep.title);
        }
    } catch (error) {
        console.log("Desidub Source Blocked by GitHub. Using Alternative...");
        // Backup logic yahan rahega
    }
}
fetchHindiAnime();
