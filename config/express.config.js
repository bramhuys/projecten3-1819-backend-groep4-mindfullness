"use strict";

const logger = require('morgan');
const config = require('../config/config');
const sqlconfig = config.dev.sqlconfig;
const sql = require('mssql');
const express = require('express');
const formidable = require('express-formidable');

module.exports = (app) => {

    app.use(logger('dev'));

    app.use(formidable());

    //[*]Routes Configuration
    let exerciseRouter = require('../routes/exercises.js');
    let userRouter = require('../routes/users.js');
    app.use('/exercises', exerciseRouter);
    app.use('/users', userRouter);

    var connection = sql.connect(sqlconfig, function (err) {
        if (err)
            throw err;
    });

    app.get('/favicon.ico', (req, res) => res.status(204));

    module.exports = connection;
};
