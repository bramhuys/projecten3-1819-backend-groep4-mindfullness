'use strict';

const router = require('express').Router();
const config = require('../config/config');
const sqlconfig = config.dev.sqlconfig;
const sql = require('mssql');
const fs = require('fs');
var multer = require('multer');
var upload = multer({ dest: '../uploads/' })

//Get all oefeningen
router.get('/', (req, res) => {

    // create Request object
    var request = new sql.Request();

    // query to the database and get the records
    request.query('select * from Oefening', function (err, recordset) {

        if (err) {
            console.log(err.message);
            res.send(err.message);
        }

        // send records as a response
        res.send(recordset.recordset);

    });
});

//Get oefeningen with sessieId
router.get('/:sessieId', (req, res) => {

    // create Request object
    var request = new sql.Request();

    var fields = req.params;
    request.input('sessieId', sql.Int, fields.sessieId);

    // query to the database and get the records
    request.query('select * from Oefening WHERE sessieId = @sessieId', function (err, recordset) {

        if (err) {
            console.log(err.message);
            res.send(err.message);
        }

        // send records as a response
        res.send(recordset.recordset);

    });
});


//Get oefening with oefeningId
router.get('/oef/:oefeningId', (req, res) => {

    // create Request object
    var request = new sql.Request();

    var fields = req.params;
    request.input('oefeningId', sql.Int, fields.oefeningId);

    // query to the db and get the records
    request.query('select * from Oefening WHERE oefeningId = @oefeningId', function (err, recordset) {
        if (err) {
            console.log(err.message);
            res.send(err.message);
        }

        // sends records as a response
        res.send(recordset.recordset);
    })
})

//Get track
router.get('/:trackid', (req, res) => {
    let trackid = req.params.trackid;

});

//Upload track
router.post('/', upload.single('file'), (req, res) => {

    // create Request object
    var request = new sql.Request();

    var fields = req.body;
    request.input('sessieId', sql.Int, fields.sessieId);
    request.input('naam', sql.NVarChar, fields.naam);
    request.input('beschrijving', sql.NVarChar, fields.beschrijving);
    request.input('fileName', sql.NVarChar, req.file.filename);
    request.input('fileMimetype', sql.NVarChar, req.file.mimetype);
    request.input('fileOriginalName', sql.NVarChar, req.file.originalname);
    request.input('fileSize', sql.BigInt, req.file.size);

    // query to the database and insert the recordss
    request.query('INSERT INTO [Oefening] VALUES (@sessieId,@naam,@beschrijving,@fileName,@fileMimetype,@fileOriginalName,@fileSize)', function (err, recordset) {

        if (err) {
            console.log(err.message);
            res.send(err.message);
        }

        // send records as a response
        res.send(recordset);

    });

});

//Remove track
router.delete('/:oefeningId', (req, res) => {

    // create Request object
    var request = new sql.Request();

    var fields = req.params;
    request.input('oefeningId', sql.Int, fields.oefeningId);

    // query to the database and get filename
    request.query('select fileName from Oefening WHERE oefeningId = @oefeningId', function (err, recordset) {

        if (err) {
            console.log(err.message);
            res.send(err.message);
            return;
        }

        //remove audio/video file
        fs.unlink('../uploads/' + recordset.recordset[0].fileName, function (err) {

            if (err) {
                console.log(err.message);
            }
            else {
                //file removed
                console.log('file removed: ' + recordset.recordset[0].fileName);
            }

            // query to the database and delete oefening
            request.query('delete from Oefening WHERE oefeningId = @oefeningId', function (err, recordset) {

                if (err) {
                    console.log(err.message);
                    res.send(err.message);
                    return;
                }

                // send records as a response
                res.send({message: 'success'});
            });
        });

    });

});


module.exports = router;
