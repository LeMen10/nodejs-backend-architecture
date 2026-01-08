const compression = require('compression');
const express = require('express');
const app = express();
const helmet = require('helmet').default;
const morgan = require('morgan');

// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./db/init.mongodb');
// const { checkOverload } = require("./helpers/check.connect");
// checkOverload()
app.use('', require('./routes'));

module.exports = app;
