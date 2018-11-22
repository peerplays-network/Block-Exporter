var express = require('express');
var router = express.Router();

const DatabaseUtils = require('../utility/DatabaseUtils');

// Check API status
router.get('/healthcheck', function (req, res) {
	res.send('OK!');
});


// BlockAPI API: GET number of blocks in the blockchain
router.get('/blocks/length', function (req, res) {
	const connection = DatabaseUtils.connect();

	const sql = 'SELECT COUNT(*) FROM blocks;';

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

// BlockAPI API: GET last block
router.get('/blocks/last', function (req, res) {
	const connection = DatabaseUtils.connect();

	let sql = 'SELECT * FROM explorer.blocks ORDER BY block_number DESC LIMIT 1';

	if (req.query.transactions == 1) {
		sql = 'SELECT * FROM explorer.blocks WHERE transaction_count >= 1 ORDER BY block_number DESC LIMIT 1';
	}

	// Perform Query
	connection.query(sql, function (err, rows, fields) {
		if (err) throw err;

		if (rows.length < 1) {
			return res.status(404).send('400 NO DATA AVAILABLE');
		}

		res.send(rows);
	});

	// Close connection
	connection.end();
});

// BlockAPI API: GET blocks (SORTED)
router.get('/blocks/sorted', function (req, res) {
	const colNames = ['block_number', 'transaction_count', 'operation_count', 'witness', 'timestamp'];

	// Err handling

	if (!req.query.x || !req.query.y) {
		res.status(400).send('400 Bad Request - Specify x and y boundaries');
		return;
	}

	if (!req.query.sort || !req.query.direction) {
		res.status(400).send('400 Bad Request - check your params');
		return;
	}

	if (!colNames.includes(req.query.sort)) {
		res.status(400).send('400 Bad Request - Invalid sort parameter, shame on you');
		return;
	}

	const connection = DatabaseUtils.connect();

	let sql = `SELECT * FROM explorer.blocks ORDER BY ${req.query.sort} ${req.query.direction} LIMIT ${req.query.x}, ${req.query.y}`;

	if (req.query.sort === 'witness') { // Need to use a JOIN if the column is witness, because we store them as IDs -- not names
		sql = `SELECT b.*, w.account_name FROM explorer.blocks b
		JOIN explorer.witnesses w on b.witness = w.account_id
		order by account_name ${req.query.direction}
		LIMIT ${req.query.x} , ${req.query.y};`;
	}


	// Perform Query
	connection.query(sql, function (err, rows, fields) {
		if (err) throw err;

		if (rows.length < 1) {
			return res.status(404).send('404 NO DATA FOUND');
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


	const connection = DatabaseUtils.connect();

	let sql = `SELECT * FROM explorer.blocks WHERE block_number >= ${start} AND block_number <= ${end}`;

	if (req.query.sort) { // Handle sorting and direction
		sql = `SELECT * FROM explorer.blocks WHERE block_number >= ${start} AND block_number <= ${end} ORDER BY block_number`;
		if (req.query.direction) {
			if (req.query.direction !== 'ASC' && (req.query.direction !== 'DESC')) {
				return res.status(400).send('400 Bad Request - Invalid direction');
			} else {
				sql = sql + ` ${req.query.direction}`;
			}
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

// Variables API: GET variables
router.get('/variables', function (req, res) {

	const connection = DatabaseUtils.connect();

	// Perform Query
	connection.query('SELECT * FROM explorer.variables', function (err, rows, fields) {
		if (err) throw err;
		res.send(rows);
	});

	// Close connection
	connection.end();
});




module.exports = router;