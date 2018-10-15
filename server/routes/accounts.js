var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const db = require('../database/constants');

// Accounts API: GET specific account
router.get('/accounts/:name', function (req, res) {

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
	connection.query(`SELECT * FROM explorer.accounts WHERE account_name = '${req.params.name}'`, function (err, rows, fields) {
		if (err) throw err;
		  
		res.send(rows);
		  });

	// Close connection
	connection.end();
});

// Accounts API: GET accounts
router.get('/accounts', function (req, res) {
	const colNames = ['id', 'account_name', 'active_key', 'owner_key', 'memo_key', 'member_since', 'membership_expiration', 'lifetime_fees_paid', 'pending_fees', 'network_fees_paid', 'registar', 'referrer', 'account_id']

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

	let sql = 'SELECT * FROM explorer.accounts';

	if (req.query.sort) { // Handle sorting and direction
		if (!colNames.includes(req.query.sort)) {
			res.status(400).send('400 Bad Request - Invalid sort parameter, shame on you');
			return;
		}
		sql = `SELECT * FROM explorer.accounts ORDER BY ${req.query.sort}`;
		if (req.query.direction) {
			if (req.query.direction !== 'ASC' && (req.query.direction !== 'DESC')) {
				res.status(400).send('400 Bad Request - Invalid direction');
				return;
			} else {
				sql = sql + ` ${req.query.direction}`;
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