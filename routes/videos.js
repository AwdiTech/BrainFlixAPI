/**
 * videos.js
 * 
 * Express router providing video related routes.
 * 
 * @module routes/videos
 * @requires express
 */

const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const multer = require('multer');

async function readData() {
    try {
        const data = await fs.readFile('./data/videos.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function writeData(videosData) {
    try {
        await fs.writeFile('./data/videos.json', JSON.stringify(videosData));
    }
    catch (err) {
        console.error(err);
        throw err;
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage, limits: { fieldSize: 20 * 1024 * 1024 } });


// ---- Endpoint Routes -----

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

router.post('/', upload.single('image'), async (req, res) => {
    console.log(req.body);
    const newVideo = JSON.parse(req.body.newVideo);
    const newVideoDetails = JSON.parse(req.body.newVideoDetails);

    if (req.file) {
        const filePath = req.file.path.replace(`\\`, '/').replace('public', '');
        newVideo.image = filePath;
        newVideoDetails.image = filePath;
    }
    else {
        newVideo.image = "/images/default-thumbnail.webp";
        newVideoDetails.image = "/images/default-thumbnail.webp";
    }

    newVideoDetails.video = "/video/video-default.mp4";


    try {
        const videosData = await readData();
        videosData["videos"].push(newVideo);
        videosData["video-details"].push(newVideoDetails);
        await fs.writeFile('./data/videos.json', JSON.stringify(videosData));
        res.status(200).send(videosData["video-details"].find(video => video.id === newVideoDetails.id));
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server error in saving new video...")
    }
});

router.post('/:videoId/comments', async (req, res) => {
    const videoId = req.params.videoId;
    const newComment = req.body;

    try {
        const videosData = await readData();
        const video = videosData["video-details"].find(video => video.id === videoId);
        video.comments.push(newComment);
        await writeData(videosData);
        res.status(200).send(newComment);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server error in saving new comment...");
    }
});

router.delete('/:videoId/comments/:commentId', async (req, res) => {
    const videoId = req.params.videoId;
    const commentId = req.params.commentId;

    try {
        const videosData = await readData();
        const video = videosData["video-details"].find(video => video.id === videoId);
        video.comments = video.comments.filter(comment => comment.id !== commentId);
        await writeData(videosData);
        res.status(200).send("Successfully deleted comment " + commentId + " for video " + videoId);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error in deleting comment " + commentId + " for video " + videoId);
    }
});


router.put('/:videoId/likes', async (req, res) => {
    const videoId = req.params.videoId;
    
    try {
        const videosData = await readData();
        const video = videosData["video-details"].find(video => video.id === videoId);

        if (video) {
            let newLikes = String(video.likes).replace(',', '');
            newLikes = Number(newLikes) + 1;
            video.likes = newLikes.toLocaleString();
            await writeData(videosData);
            res.status(200).send(`${video.likes}`);
        }
        else {
            res.status(404).send("Video not found");
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server error in updating likes for video " + videoId);
    }
});

router.put('/:videoId/comments/:commentId/likes', async (req, res) => {
    const videoId = req.params.videoId;
    const commentId = req.params.commentId;

    try {
        const videosData = await readData();
        const videoDetails = videosData["video-details"].find(video => video.id === videoId);

        if (videoDetails) {
            const comment = videoDetails.comments.find(comment => comment.id === commentId);

            if (comment) {
                comment.likes++;
                await writeData(videosData);
                res.status(200).send(`${comment.likes}`);
            }
            else {
                res.status(404).send("Comment not found");
            }
        }
        else {
            res.status(404).send("Video not found");
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server error in updating likes for comment " + commentId + " for video " + videoId);
    }
});


module.exports = router;