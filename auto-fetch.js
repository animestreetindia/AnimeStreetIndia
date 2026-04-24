const axios = require('axios');
const http = require('http');

const DB_URL = "https://animeshreet-default-rtdb.firebaseio.com/episodes.json";

// 1. Render ko khush rakhne ke liye Server
http.createServer((req, res) => {
    res.write("Anime Bot is Running!");
    res.end();
}).listen(process.env.PORT || 3000);

async function syncData() {
    try {
        console.log("Connecting to Anime-API Proxy...");
        const res = await axios.get('https://api.amvstr.me/api/v2/recent');
        const episodes = res.data.results;

        console.log(`Found ${episodes.length} episodes!`);
        for (let ep of episodes.slice(0, 15)) {
            await axios.post(DB_URL, {
                title: ep.title.english || ep.title.userPreferred,
                episode: ep.episodeNumber,
                image: ep.image,
                link: `https://anitaku.to/${ep.id}-episode-${ep.episodeNumber}`,
                language: "Hindi/Eng Dub",
                timestamp: new Date().getTime()
            });
        }
        console.log("Sync Done!");
    } catch (error) {
        console.log("Proxy failed, using Jikan backup...");
        const backup = await axios.get('https://api.jikan.moe/v4/watch/episodes');
        for (let b of backup.data.data.slice(0, 10)) {
            await axios.post(DB_URL, {
                title: b.entry.title,
                episode: b.episodes[0] ? b.episodes[0].title : "Latest",
                image: b.entry.images.jpg.image_url,
                link: b.entry.url,
                timestamp: new Date().getTime()
            });
        }
    }
}

// Har 30 minute mein chalega
setInterval(syncData, 1800000);
syncData(); // Pehli baar turant chalega
