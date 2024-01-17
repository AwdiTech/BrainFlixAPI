const express = require('express');
const app = express();
const fs = require('fs')
const videoRoutes = require("./routes/videos.js")

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use('/videos', videoRoutes);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});