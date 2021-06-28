require('dotenv').config();
var express = require('express');
var db = require('./db');
var app = express();
var authController = require('./auth/AutheController');
var transactionController = require('./auth/transaction');
var cors = require('cors');
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-access-token');
	next();
});
app.use('/auth', authController);
app.use('/api', transactionController);
module.exports = app;
