var express = require('express');
var router = express.Router();
const config = require('../config/config');
const sqlconfig = config.dev.sqlconfig;
const sql = require('mssql');
var admin = require("firebase-admin");

// Get a database reference to our posts
var db = admin.database();
var ref = db.ref("Users");


/* GET users listing. */
router.get('/', (req, res) => {

  // Attach an asynchronous callback to read the data at our posts reference
  var u = [];
  ref.on("value", function (snapshot) {
    //format the data to an array
    snapshot.forEach(function (data) {
      var d = data.val()
      d.uid = data.key
      u.push(d)
    })
    return res.send(u)
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
    return res.send("The read failed: " + errorObject.code)
  });

});

/* GET users listing. */
router.get('/:uid', (req, res) => {

   var uid = req.params.uid;


  // Attach an asynchronous callback to read the data at our posts reference
  ref.child(uid).on("value", function (snapshot) {
    res.send('dd')
    res.send('dd')
    return res.send(snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
    return res.send("The read failed: " + errorObject.code)
  });

});

/* PUT user details. */
router.put('/:uid', (req, res) => {

  var uid = req.params.uid;
  var email = req.body.email;
  var name = req.body.name;
  var groepnr = req.body.groepnr;

  //Null checks
  if (email == undefined) { res.send({ error: "email can't be null" }); return; }
  if (name == undefined) { res.send({ error: "name can't be null" }); return; }
  if (groepnr == undefined) { res.send({ error: "groepnr can't be null" }); return; }

  // Attach an asynchronous callback to read the data at our posts reference
  ref.child(uid).set({
    'email': email,
    'name': name,
    'groepnr': groepnr
  }, function (error) {
    if (error) {
      res.send("Data could not be saved." + error);
      return;
    } else {
      res.send("Data saved successfully.");
      return;
    }
  });



});

router.post('/register', (req, res) => {


  // create Request object
  var request = new sql.Request();

  var fields = req.body;
  request.input('email', sql.NVarChar, fields.email);
  request.input('token', sql.NVarChar, fields.token);
  request.input('voornaam', sql.NVarChar, fields.voornaam);
  request.input('achternaam', sql.NVarChar, fields.achternaam);
  request.input('geboorteDatum', sql.Date, fields.geboorteDatum);

  // query to the database and get the records
  request.query('INSERT INTO [User] VALUES (@email,@token,@voornaam,@achternaam,@geboorteDatum)', function (err, recordset) {

    if (err) {
      console.log(err.message);
      res.send(err.message);
    }

    // send records as a response
    res.send(recordset);

  });

});

module.exports = router;
