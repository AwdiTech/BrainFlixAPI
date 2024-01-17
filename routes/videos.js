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
        res.status(200).json(videosData["videos"]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error in retrieving videos");
    }
});

router.get('/:id', async (req, res) => {
    const videoId = req.params.id;

    try {
        const videosData = await readData();
        res.status(200).json(videosData["video-details"].find(video => video.id === videoId));
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error in retrieving video data...");
    }
});

router.post('/', async (req, res) => {
    const newVideo = req.body.video;
    const newVideoDetails = req.body.videoDetails;

    try {
        const videosData = await readData();
        videosData["videos"].push(newVideo);
        videosData["video-details"].push(newVideoDetails);
        await fs.writeFile('./data/videos.json', JSON.stringify(videosData));
        res.status(200).send(videosData["video-details"].find( video => video.id === newVideoDetails.id));
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server error in saving new video...")
    }
});

module.exports = router;
