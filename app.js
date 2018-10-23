const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const mongoose = require('mongoose');
require('dotenv').config()

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const sellingRouter = require('./routes/selling');
const reportRouter = require('./routes/report');
const itemRouter = require('./routes/item');
const fcmRouter = require('./routes/fcm')

console.log("node env =", process.env.NODE_ENV)
let MONGO_URI = {
  pro: process.env.MONGO_URI_PRO,
  test: process.env.MONGO_URI_TEST
}


mongoose.connect(MONGO_URI[process.env.NODE_ENV], { useNewUrlParser: true, reconnectTries: Number.MAX_VALUE })
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to db',process.env.NODE_ENV)
});

const app = express();

app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/selling', sellingRouter)
app.use('/reports', reportRouter)
app.use('/items', itemRouter)
app.use('/fcm', fcmRouter)


module.exports = app;
