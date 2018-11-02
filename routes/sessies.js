'use strict';

const router = require('express').Router();
const config = require('../config/config');
const sqlconfig = config.dev.sqlconfig;
const sql = require('mssql');

//Get all sessies
router.get('/', (req, res) => {

    // create Request object
    var request = new sql.Request();

    // query to the database and get the records
    request.query('select * from Sessie s', function (err, recordset) {

        if (err) {
            console.log(err.message);
            res.send(err.message);
        }

        // send records as a response
        res.send(recordset.recordset);
    });
});

//Get sessie with sessieId
router.get('/:sessieId', (req, res) => {

    // create Request object
    var request = new sql.Request();

    var fields = req.params;
    request.input('sessieId', sql.Int, fields.sessieId);

    // query to the database and get the records
    request.query('select * from Sessie WHERE sessieId = @sessieId', function (err, recordset) {

        if (err) {
            console.log(err.message);
            res.send(err.message);
        }

        // send records as a response
        res.send(recordset.recordset);

    });
});

//Sessie toevoegen
router.post('/', (req, res) => {

    // create Request object
    var request = new sql.Request();

    var fields = req.body;
    request.input('naam', sql.NVarChar, fields.naam);
    request.input('beschrijving', sql.NVarChar, fields.beschrijving);

    // query to the database and get the records
    request.query('INSERT INTO [Sessie] VALUES (@naam,@beschrijving)', function (err, recordset) {

        if (err) {
            console.log(err.message);
            res.send(err.message);
        }

        // send records as a response
        res.send(recordset);

    });

});

//Sessie aanpassen
router.put('/', (req, res) => {

    // create Request object
    var request = new sql.Request();

    var fields = req.body;
    request.input('naam', sql.NVarChar, fields.naam);
    request.input('beschrijving', sql.NVarChar, fields.beschrijving);
    request.input('sessieId', sql.Int, fields.sessieId);

    // query to the database and get the records
    request.query('UPDATE [Sessie] SET naam = @naam, beschrijving = @beschrijving WHERE sessieId = @sessieId', function (err, recordset) {

        if (err) {
            console.log(err.message);
            res.send(err.message);
        }

        // send records as a response
        res.send(recordset);

    });

});

module.exports = router;
