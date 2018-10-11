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
const config_server = require("./config/main");

const BLOCKCHAIN_URL_QA = "wss://qa.5050labs.fun:8091/ws";
const BLOCKCHAIN_URL_DEV = "ws://10.20.10.45:8090/ws";
const BLOCKCHAIN_URL_EXECHAIN= "ws://10.20.10.51:8090/ws";

const app = express();
const compiler = webpack(config);
const router = express.Router();
const port = process.env.PORT || 5000;

// ===== CONFIG =====
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// ===== ROUTES =====
const blocks = require("./routes/blocks");
const accounts = require("./routes/accounts");
const witnesses = require("./routes/witnesses");
const operations = require("./routes/operations");
const transactions = require("./routes/transactions");



app.use("/api", blocks);
app.use("/api", accounts);
app.use("/api", witnesses);
app.use("/api", operations);
app.use("/api", transactions);

// ===== SYNC FUNCTIONS =====

/* Takes in a MYSQL connection and attempts to sync the database non-block tables with the blockchain 
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

	let r1 = await Blockchain.getFullAccounts(nameAry); // accounts

	r1.forEach(async (data, index) => {
		if (data && data[1].account) {

		data = data[1].account;

			const account_name = data.name;
			const membership_expiration_date = data.membership_expiration_date;
			const referrer = data.referrer;
			const owner_key = data.owner.key_auths[0][0];
			const active_key = data.active.key_auths[0][0];
			const memo_key = data.options.memo_key;
			const account_id = data.id;

			// console.log(account_id);
			const member_since = await Blockchain.getRegDate(account_id, '1.11.0');
			// console.log(member_since);

			sql = `SELECT * FROM explorer.accounts WHERE account_name = '${account_name}'`
			connection.query(sql, function (err, result) {
			  if (err) {
				  throw err;
			  }
			//   console.log("Result: " + JSON.stringify(result));

			  if (result.length < 1) { // Insert data
			sql = `INSERT INTO accounts (account_name, membership_expiration, referrer, owner_key, active_key, memo_key, member_since, account_id)
			VALUES ('${account_name}', '${membership_expiration_date}', '${referrer}', '${owner_key}', '${active_key}', '${memo_key}', '${member_since}', '${account_id}')`;

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

	const r2 = await Blockchain.getWitnessObjsById(witnessAry); // witnesses

	// console.log(r2);

	r2.forEach(async (data, index) => {
		// build witness object
		const account_id = witnessNames[index][1];
		const account_name = witnessNames[index][0];
		const witness = data.witness_account;
		const witness_since = await Blockchain.getWitnessDate(witness, '1.11.0');
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
			VALUES ('${account_id}', '${account_name}', '${witness}', '${witness_since}', '${total_votes}', '${total_missed}', '${url}', '${1}');`

			connection.query(sql, function (err, result) {
				if (err) {
					throw err;
				}
				console.log("Result: " + JSON.stringify(result));
		});
	
	}


	})
  });


  let r3 = await Blockchain.getGlobalProperties(); 	// UPDATE ALL FEES

  let feeAry = [];
 	 r3.parameters.current_fees.parameters.map((feeObj) => {
	 console.log(feeObj);
	 if (feeObj.length > 0) {
		feeObj[1] = JSON.stringify(feeObj[1]);
		feeAry.push((feeObj));
	 }

	 
  })
//   sql = `SELECT * FROM explorer.operations`;
  
//   connection.query(sql, function (err, result) {
// 	if (err) {
// 		throw err;
// 	}

	// if (result.length < 1) { // Insert data
		sql = `INSERT IGNORE INTO explorer.operations (id, friendly_name, current_fees) VALUES('${feeAry[0][0]}', 'transfer', '${feeAry[0][1]}'), ('${feeAry[1][0]}', 'limit_order_create', '${feeAry[1][1]}'), ('${feeAry[2][0]}', 'limit_order_cancel', '${feeAry[2][1]}'), ('${feeAry[3][0]}','call_order_update', '${feeAry[3][1]}'), ('${feeAry[4][0]}', 'fill_order', '${feeAry[4][1]}'), ('${feeAry[5][0]}', 'account_create', '${feeAry[5][1]}'), ('${feeAry[6][0]}', 'account_update', '${feeAry[6][1]}'), ('${feeAry[7][0]}', 'account_whitelist', '${feeAry[7][1]}'), ('${feeAry[8][0]}', 'account_upgrade', '${feeAry[8][1]}'), ('${feeAry[9][0]}', 'account_transfer', '${feeAry[9][1]}'), ('${feeAry[10][0]}', 'asset_create', '${feeAry[10][1]}'), ('${feeAry[11][0]}', 'asset_update', '${feeAry[11][1]}'), ('${feeAry[12][0]}', 'asset_update_bitasset', '${feeAry[12][1]}'), ('${feeAry[13][0]}', 'asset_update_feed_producers', '${feeAry[13][1]}'), ('${feeAry[14][0]}', 'asset_issue', '${feeAry[14][1]}'), ('${feeAry[15][0]}', 'asset_reserve', '${feeAry[15][1]}'), ('${feeAry[16][0]}', 'asset_fund_fee_pool', '${feeAry[16][1]}'), ('${feeAry[17][0]}', 'asset_settle', '${feeAry[17][1]}'), ('${feeAry[18][0]}', 'asset_global_settle', '${feeAry[18][1]}'), ('${feeAry[19][0]}', 'asset_publish_feed', '${feeAry[19][1]}'), ('${feeAry[20][0]}', 'witness_create', '${feeAry[20][1]}'), ('${feeAry[21][0]}', 'witness_update', '${feeAry[21][1]}'), ('${feeAry[22][0]}', 'proposal_create', '${feeAry[22][1]}'), ('${feeAry[23][0]}', 'proposal_update', '${feeAry[23][1]}'), ('${feeAry[24][0]}', 'proposal_delete', '${feeAry[24][1]}'), ('${feeAry[25][0]}', 'withdraw_permission_create', '${feeAry[25][1]}'), ('${feeAry[26][0]}', 'withdraw_permission_update', '${feeAry[26][1]}'), ('${feeAry[27][0]}', 'withdraw_permission_claim', '${feeAry[27][1]}'), ('${feeAry[28][0]}', 'withdraw_permission_delete', '${feeAry[28][1]}'), ('${feeAry[29][0]}', 'committee_member_create', '${feeAry[29][1]}'), ('${feeAry[30][0]}', 'committee_member_update', '${feeAry[30][1]}'), ('${feeAry[31][0]}', 'committee_member_update_global_parameters', '${feeAry[31][1]}'), ('${feeAry[32][0]}', 'vesting_balance_create', '${feeAry[32][1]}'), ('${feeAry[33][0]}', 'vesting_balance_withdraw', '${feeAry[33][1]}'), ('${feeAry[34][0]}', 'worker_create', '${feeAry[34][1]}'), ('${feeAry[35][0]}', 'custom', '${feeAry[35][1]}'), ('${feeAry[36][0]}', 'assert', '${feeAry[36][1]}'), ('${feeAry[37][0]}', 'balance_claim', '${feeAry[37][1]}'), ('${feeAry[38][0]}', 'override_transfer', '${feeAry[38][1]}'), ('${feeAry[39][0]}', 'transfer_to_blind', '${feeAry[39][1]}'), ('${feeAry[40][0]}', 'blind_transfer', '${feeAry[40][1]}'), ('${feeAry[41][0]}', 'transfer_from_blind', '${feeAry[41][1]}'), ('${feeAry[42][0]}', 'asset_settle_cancel', '${feeAry[42][1]}'), ('${feeAry[43][0]}', 'asset_claim_fees', '${feeAry[43][1]}'), ('${feeAry[44][0]}', 'fba_distribute_operation', '${feeAry[44][1]}'), ('${feeAry[45][0]}', 'tournament_create', '${feeAry[45][1]}'), ('${feeAry[46][0]}', 'tournament_join', '${feeAry[46][1]}'), ('${feeAry[47][0]}','game_move', '${feeAry[47][1]}'), ('${feeAry[48][0]}', 'asset_update_dividend', '${feeAry[48][1]}')`;
  
		connection.query(sql, function (err, result) {
			if (err) {
				throw err;
			}
	});
	// }
//   });




let r4 = await Blockchain.getCommittee();

r4.forEach(async (data, index) => {
	console.log(data);
	sql = `INSERT IGNORE INTO explorer.committee (committee_id, committee_member_account, vote_id, total_votes, url) VALUES ('${data.id}', '${data.committee_member_account}', '${data.vote_id}', '${data.total_votes}', '${data.url}') ON DUPLICATE KEY UPDATE    
	committee_id='${data.id}', committee_member_account='${data.committee_member_account}', vote_id='${data.vote_id}', total_votes='${data.total_votes}', url='${data.url}'`

	connection.query(sql, function (err, result) {
		if (err) {
			throw err;
		}

});
})

console.log('Exeplorer Server> Done sync.')
return;
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

  Blockchain.connect(config_server.BLOCKCHAIN_URL).then(async () => {

	if (config_server.SYNC_DATABASE) {
		await syncDatabase(connection);

		let sql = `SELECT block_number FROM explorer.blocks ORDER BY ID DESC LIMIT 1`;
		connection.query(sql, function (err, result) {
			if (result[0]) {
				result = result[0].block_number;
	
			} else {
				result = 0;
			}
	
			if (err) {
				throw err;
			}
			console.log('\x1b[36m Exeplorer Server> Starting from block #: ' + result+1)
			Blockchain.populateBlocks(connection, result, '');
			
		});

	}

});
	

});

module.exports = app;
