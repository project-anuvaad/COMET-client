const fs = require('fs');
const path = require('path');
const express = require('express');
const staticFiles = ['js', 'css', 'img']
const app = express();

// Add the environment variables of the deployment to a json file in the build/public folder for the build to fetch it

const {
    API_ROOT,
    WEBSOCKET_SERVER_URL,
    VIDEOWIKI_WHATSAPP_NUMBER,
    FRONTEND_HOST_NAME,
} = process.env;

const jsonContent = JSON.stringify({
    API_ROOT,
    WEBSOCKET_SERVER_URL,
    VIDEOWIKI_WHATSAPP_NUMBER,
    FRONTEND_HOST_NAME
});

fs.writeFileSync('./build/app_env.json', jsonContent);


app.use(express.static(path.join(__dirname, 'build')))
// frontend routes =========================================================
app.get('/*', (req, res) => {
    const dest = req.url.indexOf('/static') === 0 ? req.url : 'index.html';
    res.sendFile(path.resolve(__dirname, 'build', dest))
})

app.listen(3000, () => {
    console.log('started listening on port 3000')
})
