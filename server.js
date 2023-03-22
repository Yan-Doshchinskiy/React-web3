const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;
const isDev = process.env.NODE_ENV !== 'production';

app.use(express.static(path.join(__dirname, 'build')));

app.listen(PORT, () => {
    console.error(`Node ${isDev ? 'dev server' : `cluster worker ${  process.pid}`}: listening on port ${PORT}`);
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'), (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
});