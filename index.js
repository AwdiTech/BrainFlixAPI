const express = require('express');
const app = express();
const fs = require('fs')
const videoRoutes = require("./routes/videos.js")
const cors = require('cors');

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use('/videos', videoRoutes);
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});