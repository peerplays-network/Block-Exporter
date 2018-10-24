import React, { Component } from 'react';
import TransactionRow from './TransactionRow';
import axios from 'axios';
//State will be removed once data feed is established

class TransactionDisplay extends Component {
	constructor() {
		super();
		this.state = {
			transactionData:[
				
			]
		};
	}

	fetchData() {
		axios.get('/api/transactions/recent?id=&limit=1', {
		}).then(response => {
			return axios.get('/api/transactions/recent?id=&limit=10');
		}).then(response => {
			this.setState({transactionData: response.data});
		}).catch(error => console.log('error fetching blocks: ', error));
	}

	componentDidMount() {
		this.fetchData();
		const gridHeight=32;
		this.props.calculateComponentHeight(this.props.id, gridHeight);
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
	}

	render() {
		return (
			<div>

				{this.state.transactionData.map((transaction, i) => {
					return <TransactionRow
						account={transaction.account} 
						action={transaction.action}
						memo={transaction.memo}
						time={this.computeTime(transaction.time)}
						transactionID={(transaction.transactionID).toString(16)} /* must convert the hex to string to display properly */
						key={i}
					/>;
				})}

			</div>
		);
	}
}

export default TransactionDisplay;