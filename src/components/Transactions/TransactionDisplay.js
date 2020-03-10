import React, { Component } from 'react';
import TransactionApi from '../../api/TransactionApi';
import CustomTable from '../Utility/CustomTable';
//State will be removed once data feed is established
const gridHeight=31;
class TransactionDisplay extends Component {
	constructor() {
		super();
		this.state = {
			transactionData: [],
			transactionDataLength: 100,
			limit: 1000
		};
	}

	async fetchTransactions(limit) {
		try {
			const transaction = await TransactionApi.getTransactions(limit);
			this.setState({transactionData: transaction.data});
		} catch(error) {
			console.warn(error);
		}
	}

	async fetchTransactionLength() {
		try {
			const transactionLength = await TransactionApi.getTransactionLength();
			this.setState({transactionDataLength: transactionLength.data});
		} catch(error) {
			console.warn(error);
		}
	}

	async loadNextDataChunk(page, rowsPerPage) {
		if(page * rowsPerPage % this.state.limit === 0) {//only load next data chunk once limit has been reached
			const increasedLimit = this.state.limit + 100;
			this.setState({limit: increasedLimit});
			this.fetchTransactions(increasedLimit);
		}
	}

	componentDidMount() {
		this.fetchTransactions(this.state.limit);
		this.fetchTransactionLength();
		if (!!this.props.calculateComponentHeight)
			this.props.calculateComponentHeight(this.props.id, gridHeight);
	}

	render() {
		const {transactionData, transactionDataLength} = this.state;
		console.log('herpa: ', transactionDataLength);
		return (
			<div>
				{!!this.props.history ? //display on browse transaction page, hides it onthe transaction widget
					<CustomTable data={transactionData} length={transactionDataLength} tableType="transactions" headerLabel="Browse Transactions"
						headerIcon="fa fa-handshake" simpleTable={true} loadNextDataChunk={this.loadNextDataChunk.bind(this)}/>
					:
					<CustomTable data={transactionData} length={transactionDataLength} tableType="transactions" headerLabel="Browse Transactions"
						headerIcon="fa fa-handshake" widget={true} simpleTable={true} loadNextDataChunk={this.loadNextDataChunk.bind(this)}/>
				}
			</div>
		);
	}
}

export default (TransactionDisplay);