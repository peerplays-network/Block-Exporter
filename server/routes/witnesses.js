var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const db = require('../database/constants');

// Committee API: GET specific committee member
router.get('/committee/:id', function (req, res) {
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
	connection.query(`SELECT * FROM explorer.committee WHERE committee_member_account = '${req.params.id}'`, function (err, rows, fields) {
		if (err) throw err;

		if (rows.length < 1) {
			res.status(404).send('404 - Not Found');
		} else {
			res.send(rows);
		}
		  });

	// Close connection
	connection.end();
});

// Committee API: List all committee members
router.get('/committee', function (req, res) {
	const colNames = ['id', 'committee_id', 'committee_member_account', 'vote_id', 'total_votes', 'url'];

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
    
	let sql = 'SELECT * FROM explorer.committee';

	if (req.query.sort) { // Handle sorting and direction
		if (!colNames.includes(req.query.sort)) {
			res.status(400).send('400 Bad Request - Invalid sort parameter, shame on you');
			return;
		}
		sql = `SELECT * FROM explorer.committee ORDER BY ${req.query.sort}`;
		if (req.query.sort === 'committee_member_account') {
			sql = `SELECT * FROM explorer.committee ORDER BY LENGTH(${req.query.sort}) ASC, ${req.query.sort} ASC`; // Natural Sort
		}
		if (req.query.direction) {
			if (req.query.direction !== 'ASC' && (req.query.direction !== 'DESC')) {
				res.status(400).send('400 Bad Request - Invalid direction');
				return;
			} else {
				sql = `SELECT * FROM explorer.committee ORDER BY ${req.query.sort} ${req.query.direction}`;
				if (req.query.sort === 'committee_member_account') {
					sql = `SELECT * FROM explorer.committee ORDER BY LENGTH(${req.query.sort}) ${req.query.direction}, ${req.query.sort} ${req.query.direction}`; // Natural Sort
				}
			}
		}
	}

	// Perform Query
	connection.query(sql, function (err, rows, fields) {
		if (err) throw err;
		  
		res.send(rows);
		  });

	// Close connection
	connection.end();
});

// Witness API: GET specific witness
router.get('/witnesses/:name', function (req, res) {
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
	connection.query(`SELECT * FROM explorer.witnesses WHERE account_name = '${req.params.name}'`, function (err, rows, fields) {
		if (err) throw err;

		if (rows.length < 1) {
			res.status(404).send('404 - Not Found');
		} else {
			res.send(rows);
		}
		  });

	// Close connection
	connection.end();
});


// Witness API: GET witnesses
router.get('/witnesses', function (req, res) {
	const colNames = ['id', 'account_id', 'account_name', 'witness', 'witness_since', 'total_votes', 'total_missed', 'url', 'is_active'];

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
    
	let sql = 'SELECT * FROM explorer.witnesses';

	if (req.query.sort) { // Handle sorting and direction
		if (!colNames.includes(req.query.sort)) {
			res.status(400).send('400 Bad Request - Invalid sort parameter, shame on you');
			return;
		}
		// sql = `SELECT * FROM explorer.witnesses ORDER BY ${req.query.sort}`;
		sql = `SELECT * FROM explorer.witnesses ORDER BY LENGTH(${req.query.sort}) ASC, ${req.query.sort} ASC`; // Natural Sort

		if (req.query.direction) {
			if (req.query.direction !== 'ASC' && (req.query.direction !== 'DESC')) {
				res.status(400).send('400 Bad Request - Invalid direction');
				return;
			} else {
				sql = `SELECT * FROM explorer.witnesses ORDER BY LENGTH(${req.query.sort}) ${req.query.direction}, ${req.query.sort} ${req.query.direction}`; // Natural Sort
			}
		}
	}

	// Perform Query
	connection.query(sql, function (err, rows, fields) {
		if (err) throw err;
		  
		res.send(rows);
		  });

	// Close connection
	connection.end();
});

module.exports = router;