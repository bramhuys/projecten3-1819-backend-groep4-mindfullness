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

//Get track
router.get('/:trackid', (req, res) => {
    let trackid = req.params.trackid;

});

//Upload track
router.post('/', upload.single('file'), (req, res) => {

    // create Request object
    var request = new sql.Request();
    console.log(req.body)
    var fields = req.body;
    request.input('sessieId', sql.Int, fields.sessieId);
    request.input('naam', sql.NVarChar, fields.naam);
    request.input('beschrijving', sql.NVarChar, fields.beschrijving);
    request.input('path', sql.NVarChar, req.file.filename);

    // query to the database and insert the recordss
    request.query('INSERT INTO [Oefening] VALUES (@sessieId,@naam,@beschrijving,@path)', function (err, recordset) {

        if (err) {
            console.log(err.message);
            res.send(err.message);
        }

        // send records as a response
        res.send(recordset);

    });

    // res.send(req.file);
    // res.send({message: "upload success"});
});

//Remove track
router.delete('/', (req, res) => {

});


module.exports = router;
