const moment = require('moment');
const {Apis, ChainStore} = require('peerplaysjs-lib');
const db = require('../database/constants');
const chalk = require('chalk');

const accList = [];
const witnessList = [];

// This file holds the API that facilitates the Server to Blockchain connection.
// This is NOT intended to be used by the client.

const api = {

	/* Create a server -> blockchain connection 
    BLOCKCHAIN_URL: WS string

    returns: Promise
    */
	connect: BLOCKCHAIN_URL => {
		return new Promise((resolve, reject) => {
			this.api = Apis.instance(BLOCKCHAIN_URL, true);
			this.api.init_promise.then((res) => {
				ChainStore
					.init()
					.then(() => {
				  console.log(chalk.green(`Exeplorer Server> Connected to ${BLOCKCHAIN_URL}`));
				  resolve();
					});
				
				// resolve();
			}).catch(e => {
				console.error('\x1b[31m', '\n Connection FAILED to ' + BLOCKCHAIN_URL);
				reject(e);
			});
		}).catch(e => {
			console.error(e);
		});
	},

	/* Sync blocks table recursively

	WARNING: this is expensive and should only be used for initial sync

	connection: MYSQL connection
	start: start index
	sql: used for recursion, should be empty if calling manually

    */
	populateBlocks: (connection, start, sql, streaming) => {
		Apis.instance().db_api().exec('get_block', [start]).then(block => {
			console.log(chalk.cyan(start));
			// When a block is not found we assume we are up to date.
			if (!block) {
				console.log(chalk.green('Exeplorer Server> DONE inserting blocks - no block found'));
				api.startMonitor(connection, streaming);
				return;
			}


			api.parseBlock(block, connection, 0);


			// Build block object to be inserted
			
			const transaction_count = block.transactions.length;
			const operation_count = block.extensions.length;
			const witness = block.witness;
			const signature = block.witness_signature;
			const previous_block_hash = block.previous;
			const merkle_root = block.transaction_merkle_root;
			const timestamp = block.timestamp;
			
			// Create SQL Query
			if (sql === '') {
				sql = `INSERT INTO explorer.blocks (block_number, transaction_count, operation_count, witness, signature, previous_block_hash, merkle_root, timestamp)
	  VALUES('${start}', '${transaction_count}', '${operation_count}', '${witness}', '${signature}', '${previous_block_hash}', '${merkle_root}', '${timestamp}')`;
			} else if (start % 1000 === 0) {
			} else {
				sql = sql + `, ('${start}', '${transaction_count}', '${operation_count}', '${witness}', '${signature}', '${previous_block_hash}', '${merkle_root}', '${timestamp}')`;
				// console.log(sql);
			}
  
			// Run Query
			// console.log(start);
			if (start % 1000 === 0) {
				connection.query(sql, function (err, result) {
					if (err) {
						throw err;
					}
				  //   console.log('Result: ' + JSON.stringify(result));
				  console.log(start);
				});
				// return;itne
			}

			if (start % 1000 === 0) {
				sql = `INSERT INTO explorer.blocks (block_number, transaction_count, operation_count, witness, signature, previous_block_hash, merkle_root, timestamp)
				VALUES('${start}', '${transaction_count}', '${operation_count}', '${witness}', '${signature}', '${previous_block_hash}', '${merkle_root}', '${timestamp}')`;
			}

			  start++;
			  api.populateBlocks(connection, start, sql, streaming);
		  });
	},

	fastSyncBlocks: (connection, start, finish, sql, streaming) => {
		if(start >= finish) {
			return;
		}

		Apis.instance().db_api().exec('get_block', [start]).then(block => {
			console.log(chalk.cyan(start));
			// When a block is not found we assume we are up to date.
			if (!block) {
				console.log(chalk.green('Exeplorer Server> DONE inserting blocks - no block found'));
				// api.startMonitor(connection, streaming);
				// return;
			}


			api.parseBlock(block, connection, 0);


			// Build block object to be inserted
			
			const transaction_count = block.transactions.length;
			const operation_count = block.extensions.length;
			const witness = block.witness;
			const signature = block.witness_signature;
			const previous_block_hash = block.previous;
			const merkle_root = block.transaction_merkle_root;
			const timestamp = block.timestamp;
			
			// Create SQL Query
			if (sql === '') {
				sql = `INSERT INTO explorer.blocks (block_number, transaction_count, operation_count, witness, signature, previous_block_hash, merkle_root, timestamp)
	  VALUES('${start}', '${transaction_count}', '${operation_count}', '${witness}', '${signature}', '${previous_block_hash}', '${merkle_root}', '${timestamp}')`;
			} else if (start % 1000 === 0) {
			} else {
				sql = sql + `, ('${start}', '${transaction_count}', '${operation_count}', '${witness}', '${signature}', '${previous_block_hash}', '${merkle_root}', '${timestamp}')`;
				// console.log(sql);
			}
  
			// Run Query
			// console.log(start);
			if (start % 1000 === 0) {
				connection.query(sql, function (err, result) {
					if (err) {
						throw err;
					}
				  //   console.log('Result: ' + JSON.stringify(result));
				  console.log(start);
				});
				// return;itne
			}

			if (start % 1000 === 0) {
				sql = `INSERT INTO explorer.blocks (block_number, transaction_count, operation_count, witness, signature, previous_block_hash, merkle_root, timestamp)
				VALUES('${start}', '${transaction_count}', '${operation_count}', '${witness}', '${signature}', '${previous_block_hash}', '${merkle_root}', '${timestamp}')`;
			}

			  start++;
			  api.fastSyncBlocks(connection, start, finish, sql, streaming);
		  });
	},

	/* Start listening for new blocks
	connection: A valid MYSQL connection

	*/

	startMonitor: (connection, streaming) => {
		console.log(chalk.green('Exeplorer Server> Monitoring for new blocks!'));
		ChainStore.subscribe(() => api.updateDatabase(connection, streaming));
	  },

	/* Update the DB with data from the monitor
	connection: A valid MYSQL connection
	*/

	updateDatabase: (connection, streaming) => {
		api.getObject('2.1.0', (error, dynamicGlobal) => {
			// console.log(dynamicGlobal);

			const sql = `INSERT INTO explorer.variables (var_name, value) VALUES('next_maintenance_time', '${dynamicGlobal.next_maintenance_time}') ON DUPLICATE KEY UPDATE    
			var_name='next_maintenance_time', value='${dynamicGlobal.next_maintenance_time}'`;


			connection.query(sql, function (err, result) {
				if (err) {
					throw err;
				}
				// console.log('Result: ' + JSON.stringify(result));
			});

			if (!streaming) {
				api.backtrackChain(connection, dynamicGlobal.head_block_number);
			}
			// Get the latest block reference in the dynamicGlobal.
			api.insertBlock(connection, dynamicGlobal, (error, block) => {
				if (error) {
				  return console.error(`Error inserting block : ${error.message}`);
				}
			});
		});

		/* Fetch and insert block into DB DYNAMICALLY
			connection: A valid MYSQL connection
			dynamicGlobal: the block obj
		*/
	  },


	/* Catch and fix desync
			connection: A valid MYSQL connection
			blockNum: starting point
		*/
	  backtrackChain: (connection, blockNum) => {
		const block_number = blockNum; // head block # from CHAIN
		const dynamicGlobal = {head_block_id: '', head_block_number: block_number-1};
		connection.query(`SELECT * FROM explorer.blocks WHERE block_number=${block_number-1}`, function (err, rows, result) { // check the -1
			if (err) {
				throw err;
			}

			if (rows.length < 1) { // if it doesnt exist then get it + populate
				console.log(chalk.red(`DESYNC DETECTED - Backtracking block ${block_number-1}`));
				api.insertBlock(connection, dynamicGlobal, (error, block) => {
					if (error) {
						  return console.error(`Error inserting block : ${error.message}`);
					}
				});
				api.backtrackChain(connection, block_number-1);
			}
		});
	  },

	  insertBlock: (connection, dynamicGlobal, callback) => {
		  const block_id = dynamicGlobal.head_block_id;
		  const block_number = dynamicGlobal.head_block_number;

		//   connection.query(`SELECT * FROM explorer.blocks WHERE block_number=${block_number-1}`, function (err, rows, result) {
		// 	if (err) {
		// 		throw err;
		// 	}

		// 	if (rows.length < 1) {
		// 		Apis.instance().db_api().exec('get_block', [block_number-1]).then(block => { 
					
		// 		});
		// 	}
		// });


		  Apis.instance().db_api().exec('get_block', [block_number]).then(block => {
			console.log(chalk.cyan(block_number));
		  // When a block is not found we assume we are up to date.
		  if (!block) {
			  console.log('Exeplorer Server> DONE inserting blocks - no block found');
				return callback(null);
		  }
		  // Build block object to be inserted
		  const transaction_count = block.transactions.length;
		  const operation_count = block.extensions.length;
		  const witness = block.witness;
		  const signature = block.witness_signature;
		  const previous_block_hash = block.previous;
		  const merkle_root = block.transaction_merkle_root;
		  const timestamp = block.timestamp;

			//   console.log(block);
			//    console.log(block.transactions);
			//    console.log(block.transactions[0].operations);
		  

			  // Create SQL Query
			  const sql = `INSERT INTO explorer.blocks (block_id, block_number, transaction_count, operation_count, witness, signature, previous_block_hash, merkle_root, timestamp)
VALUES('${block_id}', '${block_number}', '${transaction_count}', '${operation_count}', '${witness}', '${signature}', '${previous_block_hash}', '${merkle_root}', '${timestamp}')`;

		  // Run Query
		  connection.query(sql, function (err, result) {
				if (err) {
					throw err;
				}
			});

			api.parseBlock(block, connection, 1); // For transactions
		});		  
	  },


	/* Parse a block and do all necessary live updates.
	block: the block to parse
	connection: valid SQL connection to the DB
	live: 1=live data 0=initial sync

	  */
	parseBlock: (b, connection, live) => {
		let parent_block;
		let expiration;
		let operations;
		let operation_results;
		let extensions;
		let signatures;
		const timestamp = b.timestamp;

		b.transactions.map(async (t) => {
			parent_block = t.ref_block_num;
			expiration = t.expiration;

			// Account and Witness Data
			if (t.operations[0][0] === 5 && live == 1) {
				const data = t.operations[0][1];
					
				const account_name = data.name;
				const referrer = data.referrer;
				const owner_key = data.owner.key_auths[0][0];
				const active_key = data.active.key_auths[0][0];
				const memo_key = data.options.memo_key;
				const member_since = timestamp;

				const accountObj = await api.getAccountByName([account_name]);
				const membership_expiration_date = accountObj[0].membership_expiration_date;
				const account_id = accountObj[0].id;

		
				// console.log(accountObj[0]);
				// console.log(t.operations[0][1]);
				// console.log(t.operations[0][1].name);

				const sql = `INSERT INTO accounts (account_name, membership_expiration, referrer, owner_key, active_key, memo_key, member_since, account_id)
					VALUES ('${account_name}', '${membership_expiration_date}', '${referrer}', '${owner_key}', '${active_key}', '${memo_key}', '${member_since}', '${account_id}')`;
		
				connection.query(sql, function(err, result) {
					if (err) {
						throw err;
					}
				});
			}

			if (t.operations[0][0] === 77) {
				t.operations[0].common_options.description = JSON.parse(t.operations[0].common_options.description);
			} 
			operations = JSON.stringify(t.operations[0]);
				
			operation_results = JSON.stringify(t.operation_results[0]);
			extensions = JSON.stringify(t.extensions);
			signatures = JSON.stringify(t.signatures);

			const sql = `INSERT INTO explorer.transactions (parent_block, expiration, operations, operation_results, extensions, signatures) VALUES('${parent_block}', '${expiration}', '${operations}', '${operation_results}', '${extensions}', '${signatures}') ON DUPLICATE KEY UPDATE    
				parent_block='${parent_block}', expiration='${expiration}', operations='${operations}', operation_results='${operation_results}', extensions='${extensions}', signatures='${signatures}'`;

			connection.query(sql, function (err, result) {
				  if (err) {
					  throw err;
				  }
				//   console.log('Result: ' + JSON.stringify(result));
			  });
			  });	
	  },

	  /* Get a single object from the blockchain

	  */
	getObject: (assetId, callback) => {
		if (typeof assetId === 'function') {
		  callback = assetId;
		  assetId = null;
		} 
	 
		if (!assetId) {
		  return callback(new Error('Missing asset id.'));
		}
	
		this.api.db_api()
		  .exec('get_objects', [[assetId]])
		  .then((blockObject) => {
			// Return the first object that matches the query
				return callback(null, blockObject[0]);
		  });
	  },
    
	/* Obtain account objects from account IDs
    acc: An array of account ID(s) (1.2.x)

    returns: Array of account object(s)
    */
	getAccount: acc => {
		return new Promise((resolve, reject) => {
			Apis.instance().db_api().exec('get_accounts', [acc]).then(w => {
				resolve(w);
			});
		});
	},

	
	/* Retrieve global properties

    */
	getGlobalProperties: () => {
		return new Promise((resolve, reject) => {
			Apis.instance().db_api().exec('get_global_properties', []).then(w => {
				resolve(w);
			});
		});
	},


	/* Obtain account objects from account name
    acc: An array of account name(s)

    returns: Array of account object(s)
    */
	getAccountByName: acc => {
		return new Promise((resolve, reject) => {
			Apis.instance().db_api().exec('lookup_account_names', [acc]).then(w => {
				resolve(w);
			});
		});
	},


	/* Obtain account objects from account name OR id
    acc: An array of account name(s) or account ID(s) (1.2.x)

    returns: Array of account object(s)
    */
	getFullAccountsRecursively: (allAccounts, startIndex, endIndex, fullAccountList) => {
		const accList = allAccounts.slice(startIndex, endIndex);
		return Apis.instance().db_api().exec('get_full_accounts', [accList, false]).then(accounts => {
			if (accounts.length > 1) {
				Array.prototype.push.apply(fullAccountList, accounts);
				return api.getFullAccountsRecursively(allAccounts, startIndex+100, endIndex+100, fullAccountList);
			} else {
				// No more accounts in array. Return full accounts list
				return fullAccountList;
			}
		});
	},



	/* Recursively obtain all user names/ids on the blockchain
    startChar: Last user, for recursion. If calling this manually, startChar should ALWAYS be set to ''
    limit: Bitshares limits each call to 1000

    returns: Array containing names and ids.
    */
	getAccountNamesRecursively: (startChar, limit) => {
		return Apis.instance().db_api().exec('lookup_accounts', [
			startChar, limit
		]).then(accounts => {
			if (accounts.length > 1) {
				if (startChar !== '') {
					accounts.splice(0, 1);
				}

				Array.prototype.push.apply(accList, accounts);
				startChar = accounts[accounts.length - 1][0];
				return api.getAccountNamesRecursively(startChar, limit);
			} else {
				// We're done
				return accList;
			}
		}, error => {
			console.error('Could not retrieve new accs: \n', error.data);
		});
	},
    
	/* Get account balances in various assets
    name: Account name
    assets: An array of asset(s) type IDs

    returns: An array containing balances in various asset(s)
    */
	getAccountBalanceFromName: (name, assets) => {
		return new Promise((resolve, reject) => {
			Apis.instance().db_api().exec('get_named_account_balances', [name, assets]).then(b => {
				resolve(b);
			});
		});
	},

	/* Recursively obtain all witnesses on the blockchain
    startChar: Last witness, for recursion. If calling this manually, startChar should ALWAYS be set to ''
    limit: Bitshares limits each call to 1000

    returns: Array containing names and ids.
    */
	getWitnessesRecursively: (startChar, limit) => {
		return Apis.instance().db_api().exec('lookup_witness_accounts', [
			startChar, limit
		]).then(accounts => {
			if (accounts.length > 1) {
				if (startChar !== '') {
					accounts.splice(0, 1);
				}

				Array.prototype.push.apply(witnessList, accounts);
				startChar = accounts[accounts.length - 1][0];
				return api.getWitnessesRecursively(startChar, limit);
			} else {
				// We're done
				return witnessList;
			}
		}, error => {
			console.error('Could not retrieve new accs: \n', error.data);
		});
	},

	/* Obtain the witness object from account ID
    acc: The account ID to perform the query on (1.2.x)

    returns: Witness object
    */
	getWitnessByAcc: acc => {
		return new Promise((resolve, reject) => {
			Apis.instance().db_api().exec('get_witness_by_account', [acc]).then(w => {
				resolve(w);
			});
		});
	},

	/* Obtain the witness object from witness ID(s)
    witnessIds: An array of witness IDs (1.6.x) - MUST be an array.

    returns: Array of witness objects
    */
	getWitnessObjsById: witnessIds => {
		return new Promise((resolve, reject) => {
			Apis.instance().db_api().exec('get_witnesses', [witnessIds]).then(w => {
				resolve(w);
			});
		});
	},


	/* Obtain block from block number
    blockNum: Height of the block to be returned

    returns: Block object
    */
	getBlock: blockNum => {
		return new Promise((resolve, reject) => {
			Apis.instance().db_api().exec('get_block', [blockNum]).then(b => {
				resolve(b);
			});
		});
	},

	/* Obtain block header from block number
    blockNum: Height of the block to be returned

    returns: Block header object
    */
	getBlockHeader: blockNum => {
		return new Promise((resolve, reject) => {
			Apis.instance().db_api().exec('get_block_header', [blockNum]).then(b => {
				resolve(b);
			});
		});
	},


	/* Obtain block header from block number
    blockNum: Height of the block to be returned

    returns: Block header object
    */
	getAccountHistory: (name, stop, limit, start)=> {
		return new Promise((resolve, reject) => {
			Apis.instance().history_api().exec('get_account_history', [name, stop, limit, start]).then(r => {
				resolve(r);
			});
		});
	},


	/* Obtain Registration date of an ACCOUNT
	name: id
	start: starting object

    returns: date
    */
	getRegDate: (name, start) => {
		return Apis.instance().history_api().exec('get_account_history', [name, start, 100, '1.11.0']).then(r => {
			for (const op of r) {
				if (op.op[0] == 5) {
					return api.convertNumberToDate(op.block_num).then((blockTime) => {
						return moment(blockTime).format('YYYY-MM-DD HH:mm:ss');
					});
				}
			}
			if (r.length <= 1) {
				return '1900-01-01 00:00:00';
			}
			return api.getRegDate(name, r[0].id);
		});
	},


	/* Obtain Date of when an account became a witness
	name: id
	start: starting object

    returns: date
    */
	getWitnessDate: (name, start) => {
		return Apis.instance().history_api().exec('get_account_history', [name, '1.11.0', 100, start]).then(r => {
			for (const op of r) {
				if (op.op[0] == 20) {
					return api.convertNumberToDate(op.block_num).then((blockTime) => {
						return moment(blockTime).format('YYYY-MM-DD HH:mm:ss');
					});
				}
			}
			if (r.length <= 1) {
				return '1900-01-01 23:32:12';
			}
			return api.getWitnessDate(name, r[r.length - 1].id);
		});
	},

	/* Utility function for date calculation
	blockNumber: the block num to calc date for

    */
	convertNumberToDate: (blockNumber) => {
		return new Promise((resolve, reject) => {
			if (!blockNumber) {
				return resolve({
					blockTime: null
				});
			}

			const object210 = ChainStore.getObject('2.1.0', false);
			const object200 = ChainStore.getObject('2.0.0', false);

			if (typeof object200 !== 'object' || typeof object210 !== 'object') {
				return setTimeout(() => api.convertNumberToDate(blockNumber).then(resolve).catch(reject), 500);
			}

			const blockInterval = object200.getIn(['parameters', 'block_interval']);
			const headBlockNumber = object210.get('head_block_number');
			const headBlockTime = object210.get('time');

			resolve(
				Number(moment.utc(headBlockTime).subtract((headBlockNumber - blockNumber) * blockInterval, 'second').format('x'))
			);
		});
	},

	/* Return committee object
	id: the account id to get the committee obj from

    */
	getCommittee: () => {
		const committeeAry = [];
		return new Promise(async (resolve, reject) => {
			const com = await api.listCommittee();
			com.map((c) => {
				if (c.length > 1) {
					committeeAry.push(c[1]);
				}
			});

			Apis.instance().db_api().exec('get_committee_members', [committeeAry]).then(w => {
				resolve(w);
			});
		});
	},

	// helper function to get a list of committee members
	listCommittee: () => {
		return new Promise((resolve, reject) => {
			Apis.instance().db_api().exec('lookup_committee_member_accounts', ['', 1000]).then(w => {
				resolve(w);
			});
		});
	},
};

module.exports = api;