var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const db = require('../database/constants');

// Check API status

// BlockAPI API: GET transactions range
router.get('/transactions', function (req, res) {
	// Start and End are required.
	if (!req.query.start || !req.query.end) {
		res.status(400).send('400 Bad Request');
		return;
	}

	const start = req.query.start;
	const end = req.query.end;

	console.log(`GET request made to /transactions ${start} to ${end}`);


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
			res.status(400).send('400 NO DATA AVAILABLE - CHECK YOUR PARAMS');
			connection.end();
			return;
		}
		  
		res.send(rows);
		  });

	// Close connection
	connection.end();
});




module.exports = router;