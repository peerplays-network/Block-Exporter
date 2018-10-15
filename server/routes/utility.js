var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const db = require('../database/constants');

function determineSearchType(term) {
	if (!term.includes('.') && isNaN(term)) { 
		return 'NAME';
	} else if (term.startsWith('1.2')) { // ID - Account Obj
		return 'ACCOUNT';
	} else if (term.startsWith('1.5')) { // ID - Committee Obj
		return 'COMMITTEE';
	} else if (term.startsWith('1.6')) { // ID - Witness Obj
		return 'WITNESS';
	} else if (isNaN(term) === false) {
		return 'BLOCK';
	}
	else {
		return 'UNKNOWN';
	}
}

// Search API
router.get('/search', function (req, res) {
	if (!req.query.input) {
		res.status(400).send('400 Bad Request');
		return;
	}

    
	const searchInput = req.query.input;
	const searchType = determineSearchType(searchInput);
	let sql = '';

	switch (searchType) {
		case 'BLOCK':
			sql = `SELECT * FROM explorer.blocks WHERE block_number = '${searchInput}'`
			break;
		case 'NAME':
			sql =
		`SELECT *, MATCH(account_name) AGAINST ('*${searchInput}*' IN BOOLEAN MODE) score FROM explorer.accounts
		having score > 0
		order by score desc;`;
			break;
		case 'ACCOUNT':
			sql =
			`SELECT * FROM explorer.accounts WHERE account_id = '${searchInput}'`;
			break;
		case 'COMMITTEE':
			sql =
			`SELECT * FROM explorer.committee WHERE committee_id = '${searchInput}'`;
			break;
		case 'WITNESS':
			sql =
			`SELECT * FROM explorer.witnesses WHERE account_id = '${searchInput}'`;
			break;
		default: // Unknown --- search multiple tables
			sql =
		`SELECT *, MATCH(account_name) AGAINST ('*${searchInput}*' IN BOOLEAN MODE) score FROM explorer.accounts
		having score > 0
		order by score desc;`;
			break;
	}


 
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
	connection.query(sql, function (err, rows, fields) {
		if (err) throw err;
		  
		res.send(rows);
		  });

	connection.end();
});
module.exports = router;