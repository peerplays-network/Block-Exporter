var express = require('express');
var router = express.Router();
const DatabaseUtils = require('../utility/DatabaseUtils');

// Operations API: Get specific OPERATION
router.get('/operations/:id', function (req, res) {
	const connection = DatabaseUtils.connect();

	// Perform Query
	connection.query(`SELECT * FROM explorer.operations WHERE id=${req.params.id}`, function (err, rows, fields) {
		if (err) throw err;
		// console.log(rows[0])
		res.send(rows);
		  });

	// Close connection
	connection.end();
});



// Operations API: Get OPERATIONS
router.get('/operations', function (req, res) {
	const connection = DatabaseUtils.connect();

	// Perform Query
	connection.query('SELECT * FROM explorer.operations', function (err, rows, fields) {
		if (err) throw err;
		res.send(rows);
		  });

	// Close connection
	connection.end();
});

module.exports = router;