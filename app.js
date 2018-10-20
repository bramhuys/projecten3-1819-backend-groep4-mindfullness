'use strict';

const app = require('express')();
const config = require('./config/config');

// Express conf !
require('./config/express.config')(app);

module.exports = app;
