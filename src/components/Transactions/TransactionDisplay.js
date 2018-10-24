import React, { Component, Fragment } from 'react';
import {Table} from 'reactstrap'; 
import Pagination from 'react-paginate';
import axios from 'axios';
import styles from './styles.css';
import * as Constants from '../../constants/constants'; 
//State will be removed once data feed is established

class TransactionDisplay extends Component {
	constructor() {
		super();
		this.state = {
			transactionData:[], transactionLength: 0, currentPage: 0,
		};
	}

	fetchData() {
		axios.get('/api/transactions/recent?id=&limit=1', {
		}).then(response => {
			return axios.get('/api/transactions/recent?id=&limit=10');
		}).then(response => {
			console.log('transaction data', response.data);
			this.setState({transactionData: response.data});
			return axios.get('/api/transactions/length')
		}).then(response => {
			this.setState({transactionLength: response.data});
		}).catch(error => console.log('error fetching blocks: ', error));
	}

	componentDidMount() {
		this.fetchData();
		const gridHeight=32;
		this.props.calculateComponentHeight(this.props.id, gridHeight);
	}

	changePage(index) {
		this.setState({currentPage: index.selected});
		//this.loadNextBlocks(index.selected);
	}
	
	findTransaction(transaction, data) {
		
	}

	renderTransaction(transaction, i) {
		const operationType = JSON.parse(transaction.operations)[0];
		const parsedTransaction = JSON.parse(transaction.operations)[1];
		if(operationType === 0) {
			return (
				<tr key={i}>
					<td>{parsedTransaction.from} transfered {parsedTransaction.amount.amount} to {parsedTransaction.to}</td>
				</tr> 
				
			);
		}
		else if(operationType === 37) {
			return (
				<tr key={i}>
					<td>{parsedTransaction.total_claimed.amount} deposited to {parsedTransaction.deposit_to_account}</td>
				</tr> 
			);
		}
		else {

		}
	}

	render() {
		return (
			<div className="pl-1">
				<Pagination
					breakClassName={`${styles['pagination']}`}
					breakLabel={<a className="page-link">...</a>}
					pageClassName={`${styles['pagination']}`}
					previousClassName={`${styles['pagination']}`}
					nextClassName={`${styles['pagination']}`}
					pageLinkClassName="page-link"
					previousLinkClassName="page-link"
					nextLinkClassName="page-link"
					pageCount={this.state.transactionLength/Constants.TRANSACTIONS_PER_PAGE}
					pageRangeDisplayed={2}
					onPageChange={this.changePage.bind(this)}
				/>
				<Table responsive>
					<thead>
						<tr>
							<th style={{cursor:'default'}}>Transaction</th>
						</tr>
					</thead>
					<tbody className="text-center">
						{this.state.transactionData.map((transaction, i) => {
							return this.renderTransaction(transaction, i);
						})}
					</tbody>
				</Table>
			</div>
		);
	}
}

export default TransactionDisplay;