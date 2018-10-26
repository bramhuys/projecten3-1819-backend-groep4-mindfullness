var express = require('express');
var router = express.Router();
const config = require('../config/config');
const sqlconfig = config.dev.sqlconfig;
const sql = require('mssql');

/* GET users listing. */
router.get('/', (req, res) => {

  // create Request object
  var request = new sql.Request();

  // query to the database and get the records
  request.query('select * from [User]', function (err, recordset) {

    if (err) {
      console.log(err.message);
      res.send(err.message);
    }

    // send records as a response
    res.send(recordset.recordset);

  });

});

router.post('/register', (req, res) => {
  
  
  // create Request object
  var request = new sql.Request();

  var fields = req.fields;
  request.input('email', sql.NVarChar, fields.email);
  request.input('token', sql.NVarChar, fields.token);

  // query to the database and get the records
  request.query('INSERT INTO [User] VALUES (@email,@token)', function (err, recordset) {

    if (err) {
      console.log(err.message);
      res.send(err.message);
    }

    // send records as a response
    res.send(recordset);

  });

});

module.exports = router;
