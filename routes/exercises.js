'use strict';

const router = require('express').Router();
const config = require('../config/config');
const sqlconfig = config.dev.sqlconfig;
const sql = require('mssql');
const fs = require('fs');

//Multer settings
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, Date.now() + ext)
    }
})

var upload = multer({ storage: storage })

//Get all oefeningen
router.get('/', (req, res) => {

    // create Request object
    var request = new sql.Request();

    // query to the database and get the records
    request.query('select * from Oefening', function (err, recordset) {

        if (err) {
            console.log(err.message);
            res.send(err.message);
            return;
        }

        // send records as a response
        res.send(recordset.recordset);

    });
});

//Get oefeningen with sessieId
router.get('/:sessieId', (req, res) => {

    //store parameters
    var fields = req.params;

    // create Request object
    var request = new sql.Request();

    request.input('sessieId', sql.Int, fields.sessieId);

    // query to the database and get the records
    request.query('select * from Oefening WHERE sessieId = @sessieId', function (err, recordset) {

        if (err) {
            console.log(err.message);
            res.send(err.message);
            return;
        }

        // send records as a response
        res.send(recordset.recordset);

    });
});


//Get oefening with oefeningId
router.get('/oef/:oefeningId', (req, res) => {

    //store parameters
    var fields = req.params;

    // create Request object
    var request = new sql.Request();

    request.input('oefeningId', sql.Int, fields.oefeningId);

    // query to the db and get the records
    request.query('select * from Oefening WHERE oefeningId = @oefeningId', function (err, recordset) {
        if (err) {
            console.log(err.message);
            res.send(err.message);
            return;
        }

        // sends records as a response
        res.send(recordset.recordset);
    })
})

//Add feedback to oefening
router.post('/oef/:oefeningId/feedback', (req, res) => {
    // create Request object
    var request = new sql.Request();

    var fields = req.body;
    request.input('oefeningId', sql.Int, req.params.oefeningId);
    request.input('beschrijving', sql.NVarChar, fields.beschrijving);
    request.input('score', sql.NVarChar, fields.score);

    // query to the database and get the records
    request.query('INSERT INTO [Feedback] VALUES (@oefeningId,@beschrijving,@score)', function (err, recordset) {

        if (err) {
            console.log(err.message);
            res.send(JSON.stringify({ error: err.message }));
            return;
        }

        // send records as a response
        res.send(recordset);

    });
})

//Remove feedback from oefening
router.delete('/oef/:oefeningId/feedback', (req, res) => {

    // create Request object
    var request = new sql.Request();

    request.input('oefeningId', sql.Int, req.params.oefeningId);

    // query to the database and get the records
    request.query('DELETE FROM Feedback WHERE oefeningId = @oefeningId', function (err, recordset) {

        if (err) {
            console.log(err.message);
            res.status = 500
            res.send(JSON.stringify({ error: err.message }));
            return;
        }

        // send records as a response
        res.send(recordset);

    });
})

//Get feedback with oefeningId
router.get('/oef/:oefeningId/feedback', (req, res) => {

    //store parameters
    var fields = req.params;

    // create Request object
    var request = new sql.Request();

    request.input('oefeningId', sql.Int, fields.oefeningId);

    // query to the db and get the records
    request.query('select * from Feedback WHERE oefeningId = @oefeningId', function (err, recordset) {
        if (err) {
            res.status = 500
            console.log(err.message);
            res.send(err.message);
            return;
        }

        // sends records as a response
        res.send(recordset.recordset);
    })
})

//Upload track
router.post('/', upload.single('file'), (req, res) => {

    // create Request object
    var request = new sql.Request();

    //Sql parameters
    var fields = req.body;
    request.input('sessieId', sql.Int, fields.sessieId);
    request.input('naam', sql.NVarChar, fields.naam);
    request.input('beschrijving', sql.NVarChar, fields.beschrijving);
    request.input('fileName', sql.NVarChar, req.file.filename);
    request.input('fileMimetype', sql.NVarChar, req.file.mimetype);
    request.input('fileOriginalName', sql.NVarChar, req.file.originalname);
    request.input('fileSize', sql.BigInt, req.file.size);
    request.input('groepen', sql.NVarChar, fields.groepen);

    // query to the database and insert the recordss
    request.query('INSERT INTO [Oefening] VALUES (@sessieId,@naam,@beschrijving,@fileName,@fileMimetype,@fileOriginalName,@fileSize,@groepen)', function (err, recordset) {

        if (err) {
            res.status = 500
            console.log(err.message);
            res.send(JSON.stringify({ error: err.message }));
            return;
        }

        // send records as a response
        res.send(recordset);

    });

});

//Upload track
router.put('/', (req, res) => {
    //TODO change files
    // create Request object
    var request = new sql.Request();

    //Sql parameters
    var fields = req.body;
    request.input('oefeningId', sql.Int, fields.oefeningId)
    request.input('sessieId', sql.Int, fields.sessieId);
    request.input('naam', sql.NVarChar, fields.naam);
    request.input('beschrijving', sql.NVarChar, fields.beschrijving);
    request.input('groepen', sql.NVarChar, fields.groepen);
    // request.input('fileName', sql.NVarChar, req.file.filename);
    // request.input('fileMimetype', sql.NVarChar, req.file.mimetype);
    // request.input('fileOriginalName', sql.NVarChar, req.file.originalname);
    // request.input('fileSize', sql.BigInt, req.file.size);
    console.log(fields.oefeningId);
    // query to the database and insert the recordss
    request.query('UPDATE [Oefening] SET sessieId = @sessieId, naam = @naam, beschrijving = @beschrijving, groepen = @groepen WHERE oefeningId = @oefeningId', function (err, recordset) {

        if (err) {
            res.status = 500
            console.log(err.message);
            res.send(JSON.stringify({ error: err.message }));
            return;
        }

        // send records as a response
        res.send(recordset);

    });

});

//Returns the address of a file
router.get('/files/:fileName', function (req, res, next) {

    //Create stream with filepath
    var fileStream = fs.createReadStream('uploads/' + req.params.fileName);

    fileStream.on('error', err => {
        res.status = 500
        res.send('file not found')
        return;
    });

    //return file data
    fileStream.on('open', function () {
        fileStream.pipe(res);
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
            res.status = 500
            console.log(err.message);
            res.send(JSON.stringify({ error: err.message }));
            return;
        }

        //Return error if no rows were affected, meaning the oefening was not found
        if (recordset.rowsAffected == 0) {
            res.status = 500
            res.send(JSON.stringify({ error: 'No oefening found with id ' + fields.oefeningId }));
            return;
        }

        //remove audio/video file
        if (recordset.recordset[0] != undefined) fs.unlink('uploads/' + recordset.recordset[0].fileName, function (err) {

            if (err) {
                console.log(err.message);
            }
            else {
                //file removed
            }
        });

        // query to the database and delete feedback
        request.query('delete from Feedback WHERE oefeningId = @oefeningId', function (err, recordset) {

            if (err) {
                res.status = 500
                console.log(err.message);
                res.send(JSON.stringify({ error: err.message }));
                return;
            }

            // query to the database and delete oefening
            request.query('delete from Oefening WHERE oefeningId = @oefeningId', function (err, recordset) {

                if (err) {
                    res.status = 500
                    console.log(err.message);
                    res.send(JSON.stringify({ error: err.message }));
                    return;
                }

                // send records as a response
                res.send({ message: 'success' });
            });
        });
    });

});


module.exports = router;
