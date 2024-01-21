# BrainFlixAPI

BrainFlixAPI is a RESTful API server designed to support the BrainFlix video content platform. It provides endpoints for managing video data, including fetching video lists, video details, posting new videos, and handling video likes and comments.

## Features

- Video list retrieval.
- Individual video details retrieval.
- Video upload and persistence.
- Comment addition and deletion.
- Like incrementation for videos and comments.
- Static asset serving for video thumbnails and uploads.
- Data persistence using a JSON file.

## Installation

To get the BrainFlixAPI up and running on your local machine, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/<your-username>/BrainFlixAPI.git
```

Navigate to the project directory:
```
cd BrainFlixAPI
```

Install the necessary dependencies:
```
npm install
```

Start the server:
```
node index.js
```

The API server will start running on http://localhost:8080 by default.

---

## API Endpoints

`GET /videos` - Retrieves a list of all videos.

`GET /videos/:id` - Retrieves details of a single video by ID.

`POST /videos` - Adds a new video to the list (requires a JSON body with video details).

`POST /videos/:videoId/comments` - Adds a new comment to a video.

`DELETE /videos/:videoId/comments/:commentId` - Deletes a comment from a video.

`PUT /videos/:videoId/likes` - Increments the like count for a video.

`PUT /videos/:videoId/comments/:commentId/likes` - Increments the like count for a comment.

---

#### Usage

Here's an example of how to fetch the list of videos using fetch:

```js
fetch('http://localhost:8080/videos')
  .then(response => response.json())
  .then(data => console.log(data));
```
