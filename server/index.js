/* eslint-disable */

const path = require('path');

const express = require('express');
const webpack = require('webpack');
const bodyParser = require('body-parser');

const config = require('../webpack.config');

const blockchainWS = require("peerplaysjs-ws");
const blockchainLib = require("peerplaysjs-lib");

const mysql = require('mysql');

const Blockchain = require("./api");
const wsMonitor = require("./api/monitor");
const db = require("./database/constants");

const BLOCKCHAIN_URL = "wss://qa.5050labs.fun:8091/ws"

const app = express();
const compiler = webpack(config);
const router = express.Router();
const port = process.env.PORT || 5000;


// ===== CONFIG =====
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// ===== ROUTES =====
const routes = require("./routes/routes");
app.use("/api", routes);



// ===== FUNCTIONS =====

/* Takes in a MYSQL connection and attempts to sync the database with the blockchain 
	This function should be used sparingly, as it performs a full sync.
*/

async function syncDatabase(connection) {

	let accountNames = await Blockchain.getAccountNamesRecursively('', 1000);
	let nameAry = [];
	for (const name of accountNames) {
		if (!db.RESTRICTED.includes(name[0])) {
			nameAry.push(name[0]);
		}
	}

	let r1 = await Blockchain.getFullAccounts(nameAry);

	r1.forEach((data, index) => {
		if (data && data[1].account) {

		data = data[1].account;

			const account_name = data.name;
			const membership_expiration_date = data.membership_expiration_date;
			const referrer = data.referrer;
			const owner_key = data.owner.key_auths[0][0];
			const active_key = data.active.key_auths[0][0];
			const memo_key = data.options.memo_key;
			const account_id = data.id;

			// console.log(account_name);
			// console.log(membership_expiration_date);
			// console.log(referrer);
			// console.log(owner_key);
			// console.log(active_key);
			// console.log(memo_key);
			// console.log(account_id);

			sql = `SELECT * FROM explorer.accounts WHERE account_name = '${account_name}'`
			connection.query(sql, function (err, result) {
			  if (err) {
				  throw err;
			  }
			//   console.log("Result: " + JSON.stringify(result));

			  if (result.length < 1) { // Insert data
			sql = `INSERT INTO accounts (account_name, membership_expiration, referrer, owner_key, active_key, memo_key, member_since, account_id)
			VALUES ('${account_name}', '${membership_expiration_date}', '${referrer}', '${owner_key}', '${active_key}', '${memo_key}', '2017-11-13 23:32:12', '${account_id}')`;

				connection.query(sql, function(err, result) {
					console.log("Result: " + JSON.stringify(result));

					if (err) {
						throw err;
					}

				})
			  }
			});
		}
	});

	let witnessNames = await Blockchain.getWitnessesRecursively('', 1000);
	let witnessAry = [];
	for (const witness of witnessNames) {
		witnessAry.push(witness[1]); // 0 = name, 1 = id
	}

	const r2 = await Blockchain.getWitnessObjsById(witnessAry);

	r2.forEach((data, index) => {
		console.log(data);

		// build witness object
		const account_id = witnessNames[index][1];
		const account_name = witnessNames[index][0];
		const witness = data.witness_account;
		// const witness_since = ""
		const total_votes = data.total_votes;
		const url = data.url;
		// const is_active = 
		const total_missed = data.total_missed;

		sql = `SELECT * FROM explorer.witnesses WHERE account_name = '${account_name}'`
		connection.query(sql, function (err, result) {
		if (err) {
			throw err;
		}
		// console.log("Result: " + JSON.stringify(result));

		if (result.length < 1) { // Insert witness data
			sql = `INSERT INTO witnesses (account_id, account_name, witness, witness_since, total_votes, total_missed, url, is_active)
			VALUES ('${account_id}', '${account_name}', '${witness}', '2017-11-13 23:32:12', '${total_votes}', '${total_missed}', '${url}', '${1}');`
		}

		connection.query(sql, function (err, result) {
			if (err) {
				throw err;
			}
			console.log("Result: " + JSON.stringify(result));
	});

	})
	


  });


}

// ===== SERVER STARTUP =====
if (process.env.NODE_ENV !== 'production') {
	require('./config/dev.js')(app);
} else {
	app.use(express.static(path.resolve(__dirname, '..', 'build')));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(compiler.outputPath, 'index.html'));
	});
}

app.listen(port, err => {
	if (err) {
		return console.error(err);
	} 
  console.log('App is listening on', port); 

  const connection = mysql.createConnection({
	host     : db.HOST,
	user     : db.USER,
	password : db.PASSWORD,
	database : db.DATABASE
  });

connection.connect(function(err) {
	if (err) {
	console.error('error connecting to DB: ' + err.stack);
	return;
}
  
	console.log('Connected to DB: id ' + connection.threadId);
	});

  Blockchain.connect(BLOCKCHAIN_URL).then((r) => {
	// syncDatabase(connection);

	// connection.end();
});
	

});

module.exports = app;
