const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const filesDirectory = path.join(__dirname, 'files');

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.post('/createFile', (req, res) => {
    const { filename, content } = req.body;
    console.log("POST MEthod - UPLOAD FILE and Name")
    if (!filename || !content) {
        return res.status(400).send('File and FIlename are required.');
    }

    const filePath = path.join(filesDirectory, filename);

    if (fs.existsSync(filePath)) {
        return res.status(400).send('File already exists.');
    }

    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error creating the file.');
        }
        res.sendStatus(200);
    });
});

app.get('/getFiles', (req, res) => {
    fs.readdir(filesDirectory, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error getting files.');
        }
        res.json(files);
    });
});

app.get('/getFile/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(filesDirectory, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(400).send('File not found.');
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error in Finding THe file.');
        }
        res.send(data);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
