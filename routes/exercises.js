'use strict';

const router = require('express').Router();
const config = require('../config/config');
const sqlconfig = config.dev.sqlconfig;
const sql = require('mssql');

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
router.post('/', (req, res) => {
    let part = req.files.file;

});

//Remove track
router.delete('/', (req, res) => {

});


module.exports = router;
