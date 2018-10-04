import React, { Component } from 'react';
import TransactionRow from './TransactionRow';
import { Card, CardBody, CardHeader, Col, Input, InputGroup } from 'reactstrap';
import PaginationCall from '../Account/PaginationCall';
import axios from 'axios';

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
			searchData: [{account: 'codepuncher57', action: 'cancels staking action', time: 8, memo: '', transactionID: 0x39e2b580}, 
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
		 transaction: '', currentPage: 0, pageSize: 20, pagesCount: 0, sortType: 'DESC'};
	}

	fetchData() {
		//API call to search for transactions
		axios.get('/api/transactions/', {
		}).then(response => {
			const transactionData = response.data;
			
			this.setState({transactionData: transactionData});
			this.setState({searchData: transactionData});
			this.refreshPagination(transactionData);
		}).catch(error => {console.log('error fetching transaction data', error);});
	}

	componentDidMount () {
		//this.fetchData();
		this.refreshPagination(this.state.transactionData);
	}

	refreshPagination (data) {
		this.setState({pagesCount: Math.ceil(data.length / this.state.pageSize) });
		this.setState({currentPage: 0});
	}
	
	onTransactionEnter(e) {
		e.preventDefault();
		this.setState({transaction: e.target.value});
		this.findTransaction(e.target.value, this.state.transactionData);
	}

	changePage(e, index) {
		e.preventDefault();
		this.setState({ currentPage: index  });
	}

	findTransaction(transaction, data) {
		var temp_data = [];
		//if the data.id matches witness name add to data
		for (var number in data) {
			if (data[number].account.indexOf(transaction) >= 0 ) 
				temp_data.push(data[number]);
		}
		if (temp_data.length <= 0)
			temp_data = data;
		this.setState({ searchData: temp_data });
		//this.data = temp_data;
		this.refreshPagination(temp_data);
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
		const { currentPage, transaction, searchData, pageSize } = this.state;

		return (
			<Col sm="9">
				<Card>
					<CardHeader>
						<span>Account Name &nbsp; Action</span>
						<div className="col-2" style={{float:'right', textAlign: 'right', margin:'0px', padding:'0px'}}>
							<span>TransactionID</span>	
						</div>
					</CardHeader>
					<InputGroup>
						<Input type="text" value={transaction} onChange={this.onTransactionEnter.bind(this)} placeholder="Account" />
					</InputGroup>
					<PaginationCall currentPage={currentPage} handleClick={this.changePage.bind(this)} pagesCount={this.state.pagesCount} />
					<CardBody>
						{searchData.slice( currentPage * pageSize, (currentPage + 1) * pageSize).map((transaction, i) => {
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