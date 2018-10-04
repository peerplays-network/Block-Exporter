import React, { Component } from 'react';
import TransactionRow from './TransactionRow';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';

class TransactionLarge extends Component {
	constructor() {
		super();
		this.state = {
			transactionData: [{account: 'codepuncher57', action: 'cancels staking action', time: 8, memo: '', transactionID: 0x39e2b580}, 
				{account: 'speculationman', action: 'wants 200 eXe for 0.43 BTC', time: 800, memo: '', transactionID: 0x52d11dee},
				{account: 'trenchcoattester', action: 'sent 128 eXe to debughero', time: 8000, memo: 'payment for killer work', transactionID: 0x0339afbb},
				{account: 'pebkacspecialist', action: 'cancels trade order', time: 10000, memo: '', transactionID: 0x2fef3d58},
				{account: 'exewatcher', action: 'recieved 5 eXe for producing a block', time: 60000, memo: 'Witness Reward', transactionID: 0xf2c1f6a6},
				{account: 'codepuncher57', action: 'stakes 407 eXe', time: 80000, memo: '', transactionID: 0x9b3e0a9b},
				{account: 'speculationwoman', action: 'wants 200 eXe for 0.43 BTC', time: 200, memo: '', transactionID: 0x52d11def},
				{account: 'trenchcoatgoing', action: 'sent 128 eXe to debughero', time: 9000, memo: 'payment for killer work', transactionID: 0x0339afbe},
				{account: 'pebkacspecialistate', action: 'cancels trade order', time: 15000, memo: '', transactionID: 0x2fef3d59},
				{account: 'nightswatch', action: 'recieved 5 eXe for producing a block', time: 60500, memo: 'Witness Reward', transactionID: 0xf2c1f6a8},
				{account: 'codepuncher69', action: 'stakes 407 eXe', time: 89000, memo: '', transactionID: 0x9b3e0a9c},
				{account: 'codepuncher57', action: 'cancels staking action', time: 8, memo: '', transactionID: 0x39e2b580}, 
				{account: 'speculationman', action: 'wants 200 eXe for 0.43 BTC', time: 800, memo: '', transactionID: 0x52d11dee},
				{account: 'trenchcoattester', action: 'sent 128 eXe to debughero', time: 8000, memo: 'payment for killer work', transactionID: 0x0339afbb},
				{account: 'pebkacspecialist', action: 'cancels trade order', time: 10000, memo: '', transactionID: 0x2fef3d58},
				{account: 'exewatcher', action: 'recieved 5 eXe for producing a block', time: 60000, memo: 'Witness Reward', transactionID: 0xf2c1f6a6},
				{account: 'codepuncher57', action: 'stakes 407 eXe', time: 80000, memo: '', transactionID: 0x9b3e0a9b},
				{account: 'speculationwoman', action: 'wants 200 eXe for 0.43 BTC', time: 200, memo: '', transactionID: 0x52d11def},
				{account: 'trenchcoatgoing', action: 'sent 128 eXe to debughero', time: 9000, memo: 'payment for killer work', transactionID: 0x0339afbe},
				{account: 'pebkacspecialistate', action: 'cancels trade order', time: 15000, memo: '', transactionID: 0x2fef3d59},
				{account: 'nightswatch', action: 'recieved 5 eXe for producing a block', time: 60500, memo: 'Witness Reward', transactionID: 0xf2c1f6a8},
				{account: 'codepuncher69', action: 'stakes 407 eXe', time: 89000, memo: '', transactionID: 0x9b3e0a9c},
			],
		};
	}

	computeTime(time) {
		// assume time is in milliseconds for now
		if (time < 1000) {
			return 'less than a second ago...';
		} else if ((1000 <= time) && (time < 60000)) {
			return Math.floor(time/1000) + 'second(s) ago...';
		} else {
			return Math.floor(time/60000) + 'minute(s) ago...';
		}
	}
	
	render() {
		return (
			<Col sm="9">
				<Card>
					<CardHeader>
						<span>Account Name &nbsp; Action</span>
						<div className="col-2" style={{float:'right', textAlign: 'right', margin:'0px', padding:'0px'}}>
							<span>TransactionID</span>	
						</div>
					</CardHeader>
					<CardBody>
						{this.state.transactionData.map((transaction, i) => {
							return <TransactionRow
								account={transaction.account} 
								action={transaction.action}
								memo={transaction.memo}
								time={this.computeTime(transaction.time)}
								transactionID={(transaction.transactionID).toString(16)} /* must convert the hex to string to display properly */
								key ={i}
							/>;
						})}
					</CardBody>
				</Card>
			</Col>
		);
	}
}

export default TransactionLarge;