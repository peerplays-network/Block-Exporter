import React, { Component } from 'react';
import {Table} from 'reactstrap'; 
import Pagination from 'react-paginate';
import axios from 'axios';
import styles from './styles.css';
import { NavLink } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PaginationCall from '../Account/PaginationCall';
import * as Constants from '../../constants/constants'; 
//State will be removed once data feed is established

class TransactionDisplay extends Component {
	constructor() {
		super();
		this.state = {
			transactionData:[], operations: [], transactionLength: 10, currentPage: 0,
		};
	}

	fetchData() {
		axios.get('/api/transactions/recent?id=&limit=1', {
		}).then(response => {
			return axios.get('/api/transactions/recent?id=&limit=10');
		}).then(response => {
			this.setState({transactionData: response.data});
			return axios.get('/api/transactions/length');
		}).then(response => {
			this.setState({transactionLength: response.data});
		}).catch(error => console.log('error fetching transactions', error));
	}

	findOperations(e) {
		axios.get('/api/operations/', {
		}).then(response => {
			this.setState({ Operations: response.data });
		}).catch(error => {console.log('error is fetching operation data', error);});
	}

	componentDidMount() {
		this.fetchData();
		this.findOperations();
		const gridHeight=31;
		if(!!this.props.calculateComponentHeight)
			this.props.calculateComponentHeight(this.props.id, gridHeight);
	}

	changePage(e, index) {
		e.preventDefault();
		index > this.state.currentPage ? this.loadNextTransactions(index) : this.loadPreviousTransactions(index);
	}

	loadNextTransactions(index) {
		const {transactionData} = this.state;
		this.setState({currentPage: index});
		axios.get(`/api/transactions/recent?id=${transactionData[transactionData.length - 1].id-1}&limit=10`, {
		}).then(response => {
			this.setState({transactionData: response.data});
		}).catch(error => console.log('error fetching transactions'));
	}

	loadPreviousTransactions(index) {
		const {transactionData} = this.state;
		this.setState({currentPage: index});
		axios.get(`/api/transactions/recent?id=${transactionData[0].id+11}&limit=10`, {
		}).then(response => {
			this.setState({transactionData: response.data});
		}).catch(error => console.log('error fetching transactions'));
	}

	findAccountName(id) {
		const accountName = this.props.accounts.find(el => el.account_id === id);
		return !!accountName ? <span><NavLink className="d-inline p-0" tag={RRNavLink} to={`/accountAllDetail/${accountName.account_name}`}>{accountName.account_name}</NavLink></span>  : id;
	}

	displayOperation( operation ) {
		return this.state.Operations[operation].friendly_name;
	}

	renderTransaction(transaction, i) {
		const operationType = JSON.parse(transaction.operations)[0];
		const parsedTransaction = JSON.parse(transaction.operations)[1];
		if(operationType === 0) {
			const senderAccount = this.findAccountName(parsedTransaction.from);
			const receiverAccount = this.findAccountName(parsedTransaction.to);
			return (
				<tr key={i}>
					<td>{parsedTransaction.amount.amount} {this.displayOperation(operationType)} {receiverAccount} from {senderAccount}</td>
				</tr> 
			);
		}
		else if(operationType === 37) {
			return (
				<tr key={i}>
					<td>{parsedTransaction.total_claimed.amount} {this.displayOperation(operationType)} {this.findAccountName(parsedTransaction.deposit_to_account)}</td>
				</tr> 
			);
		}
		else if(operationType === 47) {
			return (
				<tr key={i}><td>{parsedTransaction.fee.amount} {this.displayOperation(operationType)} {this.findAccountName(parsedTransaction.registrar)}</td></tr>
			);
		}
		else {
			return (
				<tr><td>{this.displayOperation(operationType)}</td></tr>
			);
		}
	}

	render() {
		const {transactionData, currentPage, transactionLength} = this.state;

		return (
			<div className="container pt-1 pb-5 mt-4">
				<div className="card-block">

					{!!this.props.history ? //display on browse transaction page, hides it onthe transaction widget
						<h1 className={`${styles['header-contrast-text']} ${styles['header-background']} display-5 text-center pt-3 pb-3 mt-2 mb-2s`}>
							<span className="fa fa-inbox">&nbsp;</span>Browse Transactions</h1>
						: null//display on browse transaction page, hides it on the transaction widget
					}
	
					<PaginationCall currentPage={currentPage} handleClick={this.changePage.bind(this)} pagesCount={Math.ceil(transactionLength/Constants.TRANSACTIONS_PER_PAGE)} />
					<Table responsive>
						<tbody className="text-center">
							{transactionData.map((transaction, i) => {
								return this.renderTransaction(transaction, i);
							})}
						</tbody>
					</Table>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	accounts: state.accounts.accountList
});

export default connect(mapStateToProps)(TransactionDisplay);