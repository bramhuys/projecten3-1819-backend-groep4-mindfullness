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
  ref.once("value", function (snapshot) {
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
  ref.child(uid).once("value", function (snapshot) {
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
  var telnr = req.body.tel;
  var username = req.body.username;

  //Null checks
  if (email == undefined) { res.send({ error: "email can't be null" }); return; }
  if (name == undefined) { res.send({ error: "name can't be null" }); return; }
  if (groepnr == undefined) { res.send({ error: "groepnr can't be null" }); return; }
  if (telnr == undefined) { res.send({ error: "telnr can't be null" }); return; }
  if (username == undefined) { res.send({ error: "username can't be null" }); return; }

  // Attach an asynchronous callback to read the data at our posts reference
  ref.child(uid).set({
    'email': email,
    'name': name,
    'groepnr': groepnr,
    'telnr' : telnr,
    'username' : username
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

router.post('/:uid', (req, res) => {


  var uid = req.params.uid;
  var email = req.body.email;
  var name = req.body.name;
  var groepnr = req.body.groepnr;
  var telnr = req.body.tel;
  var username = req.body.username;

  //Null checks
  if (email == undefined) { res.send({ error: "email can't be null" }); return; }
  if (name == undefined) { res.send({ error: "name can't be null" }); return; }
  if (groepnr == undefined) { res.send({ error: "groepnr can't be null" }); return; }
  if (telnr == undefined) { res.send({ error: "telnr can't be null" }); return; }
  if (username == undefined) { res.send({ error: "username can't be null" }); return; }

  // Attach an asynchronous callback to read the data at our posts reference
  ref.child(uid).set({
    'email': email,
    'name': name,
    'groepnr': groepnr,
    'telnr' : telnr,
    'username' : username
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

module.exports = router;
