const blockchainWS = require('peerplaysjs-ws');
const blockchainLib = require('peerplaysjs-lib');

/* Callback for subscribe() */
function updateListener(object) {
	console.log('set_subscribe_callback update:\n', object);
}

/* Callback for subscribeToNewTransactions() */
function updateTransactionListener(object) {
	console.log('\x1b[33m transaction:\n', object);
}

const wsMonitor = {

	/* Global subscribe function */
	subscribe: () => {
		blockchainWS.Apis.instance().db_api().exec( 'set_subscribe_callback', [ updateListener, true ] );
	},
    
	/* Subscribes to incoming transactions --- these will be unconfirmed transactions */
	subscribeToNewTransactions: () => {
		blockchainWS.Apis.instance().db_api().exec( 'set_pending_transaction_callback', [ updateTransactionListener ] );
	},
};

module.exports = wsMonitor;