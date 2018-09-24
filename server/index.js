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

const BLOCKCHAIN_URL = "ws://10.20.10.45:8090/ws"

const app = express();
const compiler = webpack(config);
const router = express.Router();
const port = process.env.PORT || 5000;


app.use(bodyParser.json());

app.use('/api', router);
require('./routes')(router);

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

  Blockchain.connect(BLOCKCHAIN_URL).then(async (r) => {
	// connected -- do stuff 



		// Blockchain.getAccountNamesRecursively('', 1000).then((y) => {
		// 	console.log(y);
		// })

		// let n = await Blockchain.getAccountByName(['alpha']);
		// console.log(n);


		// let r2 = await Blockchain.getAccountNamesRecursively('', 1000);
		// let nameAry = [];
		// for (const name of r2) {
		// 	// console.log(name[0])
		// 	nameAry.push(name[0]);
		// }

		// console.log(nameAry);


		let r3 = await Blockchain.getFullAccounts(['alpha', 'com0', 'com1']);
		
		r3.forEach((data, index) => {
			// console.log(data[1]);
			const { id } = data[1].account
			console.log(id);
		});

	
	// Blockchain.getWitnessObjsById(['1.6.1', '1.6.2']).then((w) => {
	// 	console.log(w);
	// })

	// let witnessAry;
	// Blockchain.getWitnessesRecursively('', 1000).then((r) => {
	// 	witnessAry = r;
	// 	console.log(witnessAry);
	// })

	// blockchainWS.Apis.instance().db_api().exec( "set_subscribe_callback", [ updateListener, true ] );

	// wsMonitor.subscribeToNewTransactions();
	// wsMonitor.subscribeToAccount(["committee-account", "1.2.0"]);

	// const connection = mysql.createConnection({
	// 	host     : db.HOST,
	// 	user     : db.USER,
	// 	password : db.PASSWORD,
	// 	database : db.DATABASE
	//   });

	//   connection.connect(function(err) {
	// 	if (err) {
	// 	  console.error('error connecting: ' + err.stack);
	// 	  return;
	// 	}

	  
	// 	console.log('connected as id ' + connection.threadId);
	// 	});
		
	//   sql = 'SELECT * FROM explorer.accounts'
	//   connection.query(sql, function (err, result) {
	// 	if (err) throw err;
	// 	console.log("Result: " + result);
	//   });
	  
	});
	

});

module.exports = app;
