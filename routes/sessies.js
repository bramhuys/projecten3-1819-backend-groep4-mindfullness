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
            res.send(JSON.stringify({error: err.message}));
            return;
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
            res.send(JSON.stringify({error: err.message}));
            return;
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
    request.input('sessieCode', sql.NVarChar, fields.sessieCode);

    // query to the database and get the records
    request.query('INSERT INTO [Sessie] VALUES (@naam,@beschrijving,@sessieCode)', function (err, recordset) {

        if (err) {
            console.log(err.message);
            res.send(JSON.stringify({error: err.message}));
            return;
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
    request.input('sessieCode', sql.NVarChar, fields.sessieCode);

    // query to the database and get the records
    request.query('UPDATE [Sessie] SET naam = @naam, beschrijving = @beschrijving, sessieCode = @sessieCode WHERE sessieId = @sessieId', function (err, recordset) {

        if (err) {
            console.log(err.message);
            res.send(JSON.stringify({error: err.message}));
            return;
        }

        // send records as a response
        res.send(recordset);

    });

});

module.exports = router;
