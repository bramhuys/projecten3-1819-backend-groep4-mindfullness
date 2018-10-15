'use strict';

const router = require('express').Router();
const config = require('../config/config');
const dbURI = config.dev.db;

const mongoose = require('mongoose');
const fs = require('fs');
const Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;

let conn = mongoose.connection;
let gfs;

conn.once("open", () => {
    gfs = Grid(conn.db);
});

router.get('/', (req, res) => {

    gfs.files.find({}).toArray((err, files) => { 
        res.send(files);
    });

});

//Get track
router.get('/:trackid', (req, res) => {
    let trackid = req.params.trackid;
    gfs.files.find({
        filename: trackid
    }).toArray((err, files) => {

        if (files.length === 0) {
            return res.status(404).send({
                message: 'File not found'
            });
        }
        let data = [];
        let readstream = gfs.createReadStream({
            filename: files[0].filename
        });

        readstream.on('data', (chunk) => {
            data.push(chunk);
        });

        readstream.on('end', () => {
            data = Buffer.concat(data);
            res.end(Buffer(data));
        });

        readstream.on('error', (err) => {
            // if theres an error, respond with a status of 500
            // responds should be sent, otherwise the users will be kept waiting
            // until Connection Time out
            res.status(500).send(err);
            console.log('An error occurred!', err);
        });
    });
});

//Upload track
router.post('/', (req, res) => {
    let part = req.files.file;
    let writeStream = gfs.createWriteStream({
        filename: part.name,
        mode: 'w',
        content_type: part.mimetype
    });

    writeStream.on('close', (file) => {
        // checking for file
        if (!file) {
            res.status(400).send('No file received');
        }
        return res.status(200).send({
            message: 'Success',
            file: file
        });
    });
    // using callbacks is important !
    // writeStream should end the operation once all data is written to the DB 
    writeStream.write(part.data, () => {
        writeStream.end();
    });
});

//Remove track
router.delete('/', (req, res) => {
    gfs.remove({ filename: req.body.name }, function (err) {
        if (err) return "error";
        res.send("success");
    });
});


module.exports = router;
