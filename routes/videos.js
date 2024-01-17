const express = require('express');
const router = express.Router();
const fs = require('fs').promises;

async function readData() {
    try {
        const data = await fs.readFile('./data/videos.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        throw err; 
    }
}

router.get('/', async (req, res) => {
    try {
        const videosData = await readData();
        res.json(videosData["videos"]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error in retrieving videos");
    }
});

router.get('/:id', async (req, res) => {
    const videoId = req.params.id;

    try {
        const videosData = await readData();
        res.json(videosData["video-details"].find(video => video.id === videoId));
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error in retrieving videos");
    }
});

module.exports = router;
