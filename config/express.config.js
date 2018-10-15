"use strict";

const logger           = require('morgan');
const busboybodyparser = require('busboy-body-parser');

module.exports = (app) => {
    app.use(logger('dev'));

    app.use(busboybodyparser({limit: '100mb'}));

    //[*]Routes Configuration
    let trackRouter = require('../routes/tracks.js');
    app.use('/tracks', trackRouter);
};
