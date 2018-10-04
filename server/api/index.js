const blockchainWS = require('peerplaysjs-ws');
const Exeblock = require('peerplaysjs-lib');
const ChainStore = Exeblock.ChainStore;

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
			this.api = blockchainWS.Apis.instance(BLOCKCHAIN_URL, true);
			this.api.init_promise.then((res) => {
				ChainStore
					.init()
					.then(() => {
				  console.log(`Exeplorer Server> Connected to ${BLOCKCHAIN_URL}`);
				  resolve();
					});
				
				// resolve();
			}).catch(e => {
				console.error('\x1b[31m', '\n Connection FAILED to ' + BLOCKCHAIN_URL);
				reject(e);
			});
		});
	},


	/* Sync blocks table recursively

	WARNING: this is expensive and should only be used for initial sync

	connection: MYSQL connection
	start: start index
	sql: used for recursion, should be empty if calling manually

    */
	populateBlocks: (connection, start, sql) => {
		if (!start) {
			start = 1;
		}

		blockchainWS.Apis.instance().db_api().exec('get_block', [start]).then(block => {
			// When a block is not found we assume we are up to date.
			if (!block) {
				console.log('Exeplorer Server> DONE inserting blocks - no block found');
				api.startMonitor(connection);
				  return;
			}
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
			} else if (start % 2000 == 0) {
			} else {
				sql = sql + `, ('${start}', '${transaction_count}', '${operation_count}', '${witness}', '${signature}', '${previous_block_hash}', '${merkle_root}', '${timestamp}')`;
				// console.log(sql);
			}
  
			// Run Query
			// console.log(start);
			if (start % 2000 == 0) {
				connection.query(sql, function (err, result) {
					if (err) {
						throw err;
					}
				  //   console.log('Result: ' + JSON.stringify(result));
				  console.log(start);
				});
				// return;
			}

			if (start % 2000 == 0) {
				sql = `INSERT INTO explorer.blocks (block_number, transaction_count, operation_count, witness, signature, previous_block_hash, merkle_root, timestamp)
				VALUES('${start}', '${transaction_count}', '${operation_count}', '${witness}', '${signature}', '${previous_block_hash}', '${merkle_root}', '${timestamp}')`;
			}

			//   start++;

			  api.populateBlocks(connection, start+1, sql);
		  });
	},

	/* Start listening for new blocks
	connection: A valid MYSQL connection

	*/

	startMonitor: (connection) => {
		console.log('Exeplorer Server> Monitoring for new blocks!');
		ChainStore.subscribe(() => api.updateDatabase(connection));
	  },

	/* Update the DB
	connection: A valid MYSQL connection
	*/

	updateDatabase: (connection) => {
		api.getObject('2.1.0', (error, dynamicGlobal) => {
			console.log(`Pushed: ${JSON.stringify(dynamicGlobal)}`);
			const sql = `INSERT INTO explorer.variables (var_name, value) VALUES('next_maintenance_time', '${dynamicGlobal.next_maintenance_time}') ON DUPLICATE KEY UPDATE    
			var_name='next_maintenance_time', value='${dynamicGlobal.next_maintenance_time}'`;

			connection.query(sql, function (err, result) {
				if (err) {
					throw err;
				}
				// console.log('Result: ' + JSON.stringify(result));
			});


			// Get the latest block reference in the dynamicGlobal.
			api.insertBlock(connection, dynamicGlobal, (error, block) => {
				if (error) {
				  return console.error(`Error inserting block : ${error.message}`);
				}
			});
		});

		/* Fetch and insert block into DB
			connection: A valid MYSQL connection
		*/
	  },

	  insertBlock: (connection, dynamicGlobal, callback) => {
		  const block_id = dynamicGlobal.head_block_id;
		  const block_number = dynamicGlobal.head_block_number;

		  blockchainWS.Apis.instance().db_api().exec('get_block', [block_number]).then(block => {
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


		  console.log(block);
		  

			  // Create SQL Query
			  const sql = `INSERT INTO explorer.blocks (block_id, block_number, transaction_count, operation_count, witness, signature, previous_block_hash, merkle_root, timestamp)
VALUES('${block_id}', '${block_number}', '${transaction_count}', '${operation_count}', '${witness}', '${signature}', '${previous_block_hash}', '${merkle_root}', '${timestamp}')`;

		  // Run Query
		  connection.query(sql, function (err, result) {
				if (err) {
					throw err;
				}
				console.log('Result: ' + JSON.stringify(result));
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
			blockchainWS.Apis.instance().db_api().exec('get_accounts', [acc]).then(w => {
				resolve(w);
			});
		});
	},

	
	/* Retrieve global properties

    */
	getGlobalProperties: () => {
		return new Promise((resolve, reject) => {
			blockchainWS.Apis.instance().db_api().exec('get_global_properties', []).then(w => {
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
			blockchainWS.Apis.instance().db_api().exec('lookup_account_names', [acc]).then(w => {
				resolve(w);
			});
		});
	},


	/* Obtain account objects from account name OR id
    acc: An array of account name(s) or account ID(s) (1.2.x)

    returns: Array of account object(s)
    */

	getFullAccounts: acc => {
		return new Promise((resolve, reject) => {
			blockchainWS.Apis.instance().db_api().exec('get_full_accounts', [acc, true]).then(w => {
				resolve(w);
			});
		});
	},



	/* Recursively obtain all user names/ids on the blockchain
    startChar: Last user, for recursion. If calling this manually, startChar should ALWAYS be set to ''
    limit: Bitshares limits each call to 1000

    returns: Array containing names and ids.
    */
	getAccountNamesRecursively: (startChar, limit) => {
		return blockchainWS.Apis.instance().db_api().exec('lookup_accounts', [
			startChar, limit
		]).then(accounts => {
			if (accounts.length > 1) {
				console.log('Recursively calling function... ');

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
    
	/* Get an account’s balances in various assets
    name: Account name
    assets: An array of asset(s) type IDs

    returns: An array containing balances in various asset(s)
    */
	getAccountBalanceFromName: (name, assets) => {
		return new Promise((resolve, reject) => {
			blockchainWS.Apis.instance().db_api().exec('get_named_account_balances', [name, assets]).then(b => {
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
		return blockchainWS.Apis.instance().db_api().exec('lookup_witness_accounts', [
			startChar, limit
		]).then(accounts => {
			if (accounts.length > 1) {
				console.log('Recursively calling function... ');

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
			blockchainWS.Apis.instance().db_api().exec('get_witness_by_account', [acc]).then(w => {
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
			blockchainWS.Apis.instance().db_api().exec('get_witnesses', [witnessIds]).then(w => {
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
			blockchainWS.Apis.instance().db_api().exec('get_block', [blockNum]).then(b => {
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
			blockchainWS.Apis.instance().db_api().exec('get_block_header', [blockNum]).then(b => {
				resolve(b);
			});
		});
	}
};

module.exports = api;