var express = require('express');
var router = express.Router();

let mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('backend works');
});

/* GET oefeningen */
router.get('/API/oefeningen', function(req, res, next) {
  res.send("oefeningen");
});

module.exports = router;
