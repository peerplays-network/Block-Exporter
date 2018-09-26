import React, { Component } from 'react';
import TransactionRow from './TransactionRow';
//State will be removed once data feed is established

class TransactionDisplay extends Component {
	constructor() {
		super();
		this.state = {transactionData: [{account: 'codepuncher57', action: 'cancels staking action', time: 8, memo: '', transactionID: 0x39e2b580}, 
										{account: 'speculationman', action: 'wants 200 eXe for 0.43 BTC', time: 8, memo: '', transactionID: 0x52d11dee},
										{account: 'trenchcoattester', action: 'sent 128 eXe to debughero', time: 8, memo: 'payment for killer work', transactionID: 0x0339afbb},
										{account: 'pebkacspecialist', action: 'cancels trade order', time: 8, memo: '', transactionID: 0x2fef3d58},
										{account: 'exewatcher', action: 'recieved 5 eXe for producing a block', time: 9, memo: 'Witness Reward', transactionID: 0xf2c1f6a6},
										{account: 'codepuncher57', action: 'stakes 407 eXe', time: 9, memo: '', transactionID: 0x9b3e0a9b},
								   	   ]};
	}
	
	render() {
		return (
			<div>

				{this.state.transactionData.map(transaction => {
					return <TransactionRow
						account={transaction.account} 
						action={transaction.action}
						time={transaction.time}
						memo={transaction.memo}
						transactionID={transaction.transactionID}
					/>;
				})}

			</div>
		);
	}
}

export default TransactionDisplay;