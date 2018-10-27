"use strict";

const logger = require('morgan');
const config = require('../config/config');
const sqlconfig = config.dev.sqlconfig;
const sql = require('mssql');
const express = require('express');
const formidable = require('express-formidable');
const bodyParser = require('body-parser')
const cors = require('cors');

module.exports = (app) => {

    app.use(logger('dev'));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(formidable());
    app.use(cors({credentials: true, origin: true}));

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

    module.exports = connection;
};
