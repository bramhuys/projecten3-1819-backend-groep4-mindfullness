"use strict";

const logger = require('morgan');
const config = require('../config/config');
const sqlconfig = config.dev.sqlconfig;
const sql = require('mssql');
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
var admin = require("firebase-admin");

module.exports = (app) => {

    //firebase

    var serviceAccount = require("../config/serviceAccountKey.json");

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://projecten3-1819-android-groep4.firebaseio.com"
    });

    app.use(logger('dev'));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    //app.use(formidable());
    app.use(cors({ credentials: true, origin: true }));

    //[*]Routes Configuration
    let exerciseRouter = require('../routes/exercises.js');
    let userRouter = require('../routes/users.js');
    let sessieRouter = require('../routes/sessies.js');
    app.use('/oefeningen', exerciseRouter);
    app.use('/users', userRouter);
    app.use('/sessies', sessieRouter);

    var connection = sql.connect(sqlconfig, function (err) {
        if (err)
            throw err;
    });

    app.get('/favicon.ico', (req, res) => res.status(204));

    //write errors to files
    process
        .on('unhandledRejection', (reason, p) => {
            var d = new Date();
            fs.writeFile("error/" + d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear() + '-' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds() + ".txt", reason + 'Unhandled Rejection at Promise\n' + p, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("Error exported");
            });
            console.error(reason, 'Unhandled Rejection at Promise', p);
        })
        .on('uncaughtException', err => {
            var d = new Date();
            fs.writeFileSync("error/" + d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear() + '-' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds() + ".txt", 'Uncaught Exception thrown\n' + err.stack, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("Error exported");
            });
            // Use your own logger here
            console.error(err, 'Uncaught Exception thrownAAA');

            // Optional: Ensure process will stop after this
            process.exit(1);
        });

    module.exports = connection;
};
