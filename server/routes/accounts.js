var express = require('express');
var router = express.Router();
const DatabaseUtils = require('../utility/DatabaseUtils');

// Accounts API: GET specific account
router.get('/accounts/:name', function (req, res, next) {

	const connection = DatabaseUtils.connect();

	// Perform Query
	connection.query(`SELECT * FROM accounts WHERE account_name = '${req.params.name}'`, function (err, rows, fields) {
		if (err) throw err;

		// Determine what to send
		if (rows.length < 1) {
			res.status(404).send('404 - Not Found');
		} else {
			res.send(rows);
		}
		  });

	// Close connection
	connection.end();
});

// Accounts API: GET accounts
router.get('/accounts', function (req, res, next) {
	const colNames = ['id', 'account_name', 'active_key', 'owner_key', 'memo_key', 'member_since', 'membership_expiration', 'lifetime_fees_paid', 'pending_fees', 'network_fees_paid', 'registar', 'referrer', 'account_id'];

	let sql = 'SELECT * FROM accounts';

	if (req.query.sort) { // Handle sorting and direction
		if (!colNames.includes(req.query.sort)) {
			res.status(400).send('400 Bad Request - Invalid sort parameter, shame on you');
			return;
		} else if (req.query.direction) { // Sort is valid 
			sql = `SELECT * FROM accounts ORDER BY LENGTH(${req.query.sort}) ASC, ${req.query.sort} ASC`; // NATURAL SORT
			if (req.query.sort === 'account_name') {
				sql = `SELECT * FROM accounts ORDER BY ${req.query.sort}`;
			}
			if (req.query.direction !== 'ASC' && (req.query.direction !== 'DESC')) {
				res.status(400).send('400 Bad Request - Invalid direction');
				return;
			} else {
				sql = `SELECT * FROM accounts ORDER BY LENGTH(${req.query.sort}) ${req.query.direction}, ${req.query.sort} ${req.query.direction}`;
				if (req.query.sort === 'account_name') {
					sql = `SELECT * FROM accounts ORDER BY ${req.query.sort} ${req.query.direction}`;
				}
			}
		}
	}


	const connection = DatabaseUtils.connect();


	// Perform Query
	connection.query(sql, function (err, rows, fields) {
		if (err) throw err;
		  
		res.send(rows);
		  });

	// Close connection
	connection.end();
});

// Accounts API: GET count of accounts
router.get('/acccountCount', function (req, res) {
	const connection = DatabaseUtils.connect();


	const sql = 'SELECT COUNT(*) FROM accounts;';

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

module.exports = router;
