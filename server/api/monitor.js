const blockchainWS = require('peerplaysjs-ws');
const blockchainLib = require('peerplaysjs-lib');

/* Callback for subscribe(), this can be used to test */
function updateListener(object) {
	console.log('\x1b[32m block update:\n', object);
}

/* Callback for subscribeToNewTransactions(), this can be used to test */
function updateTransactionListener(object) {
	console.log('\x1b[33m transaction:\n', object);
}

const wsMonitor = {

	/* Global subscribe function, displays all block updates. This function will provide a continuou stream of info 
    cb: callback function to execute onUpdate
    */
	subscribe: (cb) => {
		blockchainWS.Apis.instance().db_api().exec( 'set_subscribe_callback', [ cb, true ] );
	},
    
	/* Subscribes to incoming transactions,these will be unconfirmed transactions 
    cb: callback function to execute onUpdate
    */
	subscribeToNewTransactions: (cb) => {
		blockchainWS.Apis.instance().db_api().exec( 'set_pending_transaction_callback', [ cb ] );
	},
    
	/* Subscribes to account (WIP)
    accAry: Array that includes account names or IDs.
    
    returns: account object
    */
	subscribeToAccount: accAry => {
		blockchainWS.Apis.instance().db_api().exec( 'get_full_accounts', [accAry, true] ).then((accounts) => {
			console.log(accounts);
		});
	},
    
};

module.exports = wsMonitor;