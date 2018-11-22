var express = require('express');
var router = express.Router();
const DatabaseUtils = require('../utility/DatabaseUtils');

// Smart Contracts API: GET Contract by Name
router.get('/contracts/:name', function (req, res) {

	const connection = DatabaseUtils.connect();
    
	const sql = `SELECT * FROM explorer.contracts WHERE name = '${req.params.name}'`;
    
	// Perform Query
	connection.query(sql, function (err, rows, fields) {
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

// Smart Contracts API: GET Contracts
router.get('/contracts', function (req, res) {
	const colNames = ['object_id', 'statistics_id', 'name', 'suicided', 'balances', 'statistics'];

	const connection = DatabaseUtils.connect();

    
	let sql = 'SELECT * FROM explorer.contracts';
    

	if (req.query.sort) { // Handle sorting and direction
		if (!colNames.includes(req.query.sort)) {
			res.status(400).send('400 Bad Request - Invalid sort parameter, shame on you');
			return;
		}
		sql = `SELECT * FROM explorer.contracts ORDER BY LENGTH(${req.query.sort}) ASC, ${req.query.sort} ASC`; // Natural Sort
		if (req.query.sort == 'balances') {
			sql = `SELECT *, JSON_EXTRACT(balances, "$[0].amount") as amount FROM explorer.contracts
			order by amount ASC, amount ASC`;
		}
		if (req.query.direction) {
			if (req.query.direction !== 'ASC' && (req.query.direction !== 'DESC')) {
				res.status(400).send('400 Bad Request - Invalid direction');
				return;
			} else {
				sql = `SELECT * FROM explorer.contracts ORDER BY LENGTH(${req.query.sort}) ${req.query.direction}, ${req.query.sort} ${req.query.direction}`; // NATURAL SORT;
				if (req.query.sort == 'balances') {
					sql = `SELECT *, JSON_EXTRACT(balances, "$[0].amount") as amount FROM explorer.contracts
					order by amount ${req.query.direction}, amount ${req.query.direction}`;
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

module.exports = router;