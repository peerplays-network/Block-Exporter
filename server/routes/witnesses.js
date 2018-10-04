var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const db = require('../database/constants');

// Witness API: GET specific witness
router.get('/accounts/:name', function (req, res) {
	console.log(`GET request made to /witnesses${req.params.name}`);

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
		  
		res.send(rows);
		  });

	// Close connection
	connection.end();
});


// Witness API: GET witnesses
router.get('/witnesses', function (req, res) {
	console.log('GET request made to /witnesses');
    
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
		sql = `SELECT * FROM explorer.witnesses ORDER BY ${req.query.sort}`;
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