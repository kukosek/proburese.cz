var proxy = require('express-http-proxy');
require('dotenv').config()
var app = require('express')();

if (process.env.PRODUCTION == "false") {
	app.use('/api', proxy('localhost:4000/'));
}

module.exports = app
