var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const db = require('../database/constants');

// Smart Contracts API: GET Contracts
router.get('/contracts', function (req, res) {
	const colNames = ['object_id', 'statistics_id', 'name', 'suicided'];

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
    
	let sql = 'SELECT * FROM explorer.contracts';

	if (req.query.sort) { // Handle sorting and direction
		if (!colNames.includes(req.query.sort)) {
			res.status(400).send('400 Bad Request - Invalid sort parameter, shame on you');
			return;
		}
		sql = `SELECT * FROM explorer.contracts ORDER BY ${req.query.sort}`;
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