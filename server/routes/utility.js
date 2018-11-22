var express = require('express');
var router = express.Router();
const Blockchain = require('../api');
const DatabaseUtils = require('../utility/DatabaseUtils');

function determineSearchType(term) {
	if (!term.includes('.') && isNaN(term)) { 
		return 'NAME';
	} else if (term.startsWith('1.2')) { // ID - Account Obj
		return 'ACCOUNT';
	} else if (term.startsWith('1.5')) { // ID - Committee Obj
		return 'COMMITTEE';
	} else if (term.startsWith('1.6')) { // ID - Witness Obj
		return 'WITNESS';
	} else if (term.startsWith('1.16')) {
		return 'CONTRACT';
	} else if (isNaN(term) === false) {
		return 'BLOCK';
	}
	else {
		return 'UNKNOWN';
	}
}


// Resources API
router.get('/resources', function (req, res) {
	// const colNames = ['id', 'committee_id', 'committee_member_account', 'vote_id', 'total_votes', 'url'];

	const connection = DatabaseUtils.connect();

	const sql = 'SELECT * FROM explorer.resources';

	// Perform Query
	connection.query(sql, function (err, rows, fields) {
		if (err) throw err;
		  
		if (rows.length < 1) {
			res.status(204).send('204 - No content (DB empty?)');
		} else {
			res.send(rows);
		}
		  });

	// Close connection
	connection.end();
});

// Balances API
router.get('/balance/:name', function (req, res, next) {
	if (!req.params.name) {
		res.status(400).send('400 - Name required');
		return;
	}

	Blockchain.getAccountBalanceFromName(req.params.name, []).then((r) => {
		res.send(r);
	});
});

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
			sql = `SELECT * FROM explorer.blocks WHERE block_number = '${searchInput}'`;
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
		case 'CONTRACT':
			sql =
			`SELECT * FROM explorer.contracts WHERE object_id = '${searchInput}'`;
			break;
		default: // Unknown --- search multiple tables
			sql =
		`SELECT *, MATCH(account_name) AGAINST ('*${searchInput}*' IN BOOLEAN MODE) score FROM explorer.accounts
		having score > 0
		order by score desc;`;
			break;
	}


 
	const connection = DatabaseUtils.connect();

	connection.query(sql, function (err, rows, fields) {
		if (err) throw err;

		if (rows.length < 1) {
			res.status(404).send('404 - Not found');
		} else {
			res.send(rows);
		}
		  });

	connection.end();
});
module.exports = router;