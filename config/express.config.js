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

    require('crashreporter').configure({
        mailEnabled: true,
        mailTransportName: 'SMTP',
        mailTransportConfig: {
            service: 'Gmail',
            auth: {
                user: "nodemf4@gmail.com",
                pass: "testtesttest123"
            }
        },
        mailSubject: 'advanced.js crashreporter test',
        mailFrom: 'crashreporter <nodemf4@gmail.com>',
        mailTo: 'nodemf4@gmail.com'
    });

    module.exports = connection;
};
