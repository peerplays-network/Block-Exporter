var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const db = require('../database/constants');
const DatabaseUtils = require('../utility/DatabaseUtils');


// Transactions API: GET # of transactions
router.get('/transactions/length', function (req, res) {
	const connection = DatabaseUtils.connect();


	const sql = 'SELECT COUNT(*) FROM transactions;';

	// Perform Query
	connection.query(sql, function (err, rows, fields) {
		if (err) throw err;

		if (rows) {
			res.send(rows[0]['COUNT(*)'].toString());
		} else {
			res.send('0');
		}
	});

	// Close connection
	connection.end();
});


// Transactions API: GET recent transactions
router.get('/transactions/recent', function (req, res) {
	if (!req.query.limit) {
		res.status(400).send('400 Bad Request');
		return;
	}

	const connection = DatabaseUtils.connect();

	const sql = `SELECT * FROM explorer.transactions ORDER BY expiration DESC LIMIT ${req.query.limit};`;

	// Perform Query
	connection.query(sql, function (err, rows, fields) {
		if (err) throw err;
        
		if (rows.length < 1) {
			return res.status(404).send('404 - NO DATA AVAILABLE');
		}
		res.send(rows);
		  });

	// Close connection
	connection.end();
});

// Transactions API: GET transactions for account
router.get('/transactions/:id', function (req, res) {
	if (!req.params.id.startsWith('1.2')) {
		res.status(400).send('400 Invalid format');
		return;
	}

	const connection = DatabaseUtils.connect();

	// Perform Query
	connection.query('SELECT * FROM explorer.transactions', function (err, rows, fields) {
		if (err) throw err;
		
		// console.log(rows);
		const matches = rows.filter(s => s.operations.includes(req.params.id));

		res.send(matches);
		  });

	// Close connection
	connection.end();
});

// Transactions API: GET transactions range
router.get('/transactions', function (req, res) {
	// Start and End are required.
	if (!req.query.start || !req.query.end) {
		res.status(400).send('400 Bad Request');
		return;
	}

	const start = req.query.start;
	const end = req.query.end;
	const connection = DatabaseUtils.connect();

	let sql = `SELECT * FROM explorer.transactions WHERE parent_block >= ${start} AND parent_block <= ${end}`;

	if (req.query.direction) {
		if (req.query.direction !== 'ASC' && (req.query.direction !== 'DESC')) {
			res.status(400).send('400 Bad Request - Invalid direction');
			return;
		} else {
			console.log(req.query.direction);
			sql = sql + ` ORDER BY parent_block ${req.query.direction}`;
		}
	}

	// Perform Query
	connection.query(sql, function (err, rows, fields) {
		if (err) throw err;
        
		if (rows.length < 1) {
			return res.status(404).send('404 NO DATA AVAILABLE - CHECK YOUR PARAMS');
		}
		  
		res.send(rows);
		  });

	// Close connection
	connection.end();
});




module.exports = router;