"use strict";

const logger = require('morgan');
const busboybodyparser = require('busboy-body-parser');
const config = require('../config/config');
const sqlconfig = config.dev.sqlconfig;
const sql = require('mssql');

module.exports = (app) => {
    app.use(logger('dev'));

    app.use(busboybodyparser({ limit: '100mb' }));

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
