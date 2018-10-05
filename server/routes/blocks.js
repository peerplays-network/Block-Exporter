var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const db = require('../database/constants');

// Check API status
router.get('/healthcheck', function (req, res) {
	res.send('OK!');
});

// BlockAPI API: GET last block
router.get('/blocks/last', function (req, res) {
	console.log('GET request made to /blocks/last');

	const connection = mysql.createConnection({
		host     : db.HOST,
		user     : db.USER,
		password : db.PASSWORD,
		database : db.DATABASE
	});

		  // Establish connection
		  connection.connect(function(err) {
		if (err) {
			console.error('error connecting to DB: ' + err.stack);
			return;
		}
	});

	let sql = 'SELECT * FROM explorer.blocks ORDER BY block_number DESC LIMIT 1';

	if (req.query.transactions == 1) {
		sql = 'SELECT * FROM explorer.blocks WHERE transaction_count >= 1 ORDER BY block_number DESC LIMIT 1';
	}

	// Perform Query
	connection.query(sql, function (err, rows, fields) {
		if (err) throw err;
	
		if (rows.length < 1) {
			res.status(400).send('400 NO DATA AVAILABLE');
			connection.end();	
			return;
		}
			  
		res.send(rows);
			  });
	
	// Close connection
	connection.end();
});

// BlockAPI API: GET blocks range
router.get('/blocks', function (req, res) {
	// Start and End are required.
	if (!req.query.start || !req.query.end) {
		res.status(400).send('400 Bad Request');
		return;
	}
	

	const start = req.query.start;
	const end = req.query.end;

	console.log(`GET request made to /blocks ${start} to ${end}`);


	const connection = mysql.createConnection({
		host     : db.HOST,
		user     : db.USER,
		password : db.PASSWORD,
		database : db.DATABASE
		  });

		  // Establish connection
		  connection.connect(function(err) {
		if (err) {
			console.error('error connecting to DB: ' + err.stack);
			return;
		}
	});

	let sql = `SELECT * FROM explorer.blocks WHERE block_number >= ${start} AND block_number <= ${end}`;

	if (req.query.sort) { // Handle sorting and direction
		sql = `SELECT * FROM explorer.blocks WHERE block_number >= ${start} AND block_number <= ${end} ORDER BY block_number`;
		if (req.query.direction) {
			if (req.query.direction !== 'ASC' && (req.query.direction !== 'DESC')) {
				res.status(400).send('400 Bad Request - Invalid direction');
				connection.end();
				return;
			} else {
				sql = sql + ` ${req.query.direction}`;
			}
		}
	}

	// Perform Query
	connection.query(sql, function (err, rows, fields) {
		if (err) throw err;

		if (rows.length < 1) {
			res.status(400).send('400 NO DATA AVAILABLE - CHECK YOUR PARAMS');
			connection.end();
			return;
		}
		  
		res.send(rows);
		  });

	// Close connection
	connection.end();
});

// Variables API: GET variables
router.get('/variables', function (req, res) {
	console.log('GET request made to /variables');

	const connection = mysql.createConnection({
		host     : db.HOST,
		user     : db.USER,
		password : db.PASSWORD,
		database : db.DATABASE
		  });

		  // Establish connection
		  connection.connect(function(err) {
		if (err) {
			console.error('error connecting to DB: ' + err.stack);
			return;
		}
	});

	// Perform Query
	connection.query('SELECT * FROM explorer.variables', function (err, rows, fields) {
		if (err) throw err;
		console.log(rows[0]);
		res.send(rows);
		  });

	// Close connection
	connection.end();
});




module.exports = router;