import React, { Component } from 'react';
import {Table} from 'reactstrap';
import axios from 'axios';
import styles from './styles.css';
import { NavLink } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PaginationCall from '../Account/PaginationCall';
import * as Constants from '../../constants/constants'; 
import TransactionApi from '../../api/TransactionApi';
//State will be removed once data feed is established

class TransactionDisplay extends Component {
	constructor() {
		super();
		this.state = {
			transactionData:[], operations: [], transactionLength: 10, currentPage: 0,
		};
	}

	async fetchData() {
		try{
			const transaction = await TransactionApi.getTransactions();
			const length = await TransactionApi.getTransactionLength();
			this.setState({transactionLength: length.data, transactionData: transaction.data});
		} catch(error) {
			console.warn(error);
		}
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

	async loadNextTransactions(index) {
		const {transactionData} = this.state;
		this.setState({currentPage: index});
		try{
			const transaction = await TransactionApi.getTransactionsId(transactionData[transactionData.length - 1].id-1);
			this.setState({transactionData: transaction.data});
		} catch(error) {
			console.warn(error);
		}
	}

	async loadPreviousTransactions(index) {
		const {transactionData} = this.state;
		this.setState({currentPage: index});
		try{
			const transaction = await TransactionApi.getTransactionsId(transactionData[0].id+11);
			this.setState({transactionData: transaction.data});
		} catch(error) {
			console.warn(error);
		}
	}

	findAccountName(id) {
		const accountName = this.props.accounts.find(el => el.account_id === id);
		return !!accountName ? <span><NavLink className="d-inline p-0" tag={RRNavLink} to={`/accountAllDetail/${accountName.account_name}`}>{accountName.account_name}</NavLink></span>  : id;
	}
	
	linkAccountName(accountName) {
		return !!accountName ? <span><NavLink className="d-inline p-0" tag={RRNavLink} to={`/accountAllDetail/${accountName}`}>{accountName}</NavLink></span> : accountName;
	}

	displayOperation( operation ) {
		return this.state.Operations[operation].friendly_name;
	}

	renderOther(transaction, operationType, parsedTransaction, i) {
		console.log('operation and parsedTransaction', operationType, parsedTransaction);
		return (
			<tr key={i}>
				<td sm="5"> <strong> {parsedTransaction.fee.amount}</strong> {this.displayOperation(operationType)} <strong> {this.findAccountName(parsedTransaction.account)}</strong></td>
			</tr> 
		);
	}

	renderTransaction(transaction, i) {
		const operationType = JSON.parse(transaction.operations)[0];
		const parsedTransaction = JSON.parse(transaction.operations)[1];
		switch(operationType) {
			case 0:
				const senderAccount = this.findAccountName(parsedTransaction.from);
				const receiverAccount = this.findAccountName(parsedTransaction.to);
				return (
					<tr key={i}>
						<td><strong>{parsedTransaction.amount.amount}</strong> {this.displayOperation(operationType)} <strong>{receiverAccount}</strong> from <strong>{senderAccount}</strong></td>
					</tr> 
				);
			case 5:
				return (
					<tr key={i}>
						<td><strong>{parsedTransaction.fee.amount}</strong> {this.displayOperation(operationType)} <strong>{this.linkAccountName(parsedTransaction.name)}</strong></td>
					</tr> 
				);
			case 6:
				return (
					<tr key={i}>
						<td><strong>{parsedTransaction.fee.amount}</strong> {this.displayOperation(operationType)} <strong>{this.findAccountName(parsedTransaction.account)}</strong></td>
					</tr> 
				);
			case 8:
				return (
					<tr key={i}>
						<td><strong>{parsedTransaction.fee.amount}</strong> {this.displayOperation(operationType)} <strong>{this.findAccountName(parsedTransaction.account_to_upgrade)}</strong></td>
					</tr> 
				);
			case 20:
				return (
					<tr key={i}>
						<td><strong>{parsedTransaction.fee.amount}</strong> {this.displayOperation(operationType)} <strong>{this.findAccountName(parsedTransaction.witness_account)}</strong></td>
					</tr> 	
				);
			case 29:
				return (
					<tr key={i}>
						<td><strong>{parsedTransaction.fee.amount}</strong> {this.displayOperation(operationType)} <strong>{this.findAccountName(parsedTransaction.committee_member_account)}</strong></td>
					</tr> 	
				);
			case 37:
				return (
					<tr key={i}>
						<td><strong>{parsedTransaction.total_claimed.amount}</strong> {this.displayOperation(operationType)} <strong>{this.findAccountName(parsedTransaction.deposit_to_account)}</strong></td>
					</tr> 
				);
			case 47:
				return (
					<tr key={i}><td><strong>{parsedTransaction.fee.amount}</strong> {this.displayOperation(operationType)} <strong>{this.findAccountName(parsedTransaction.registrar)}</strong></td></tr>
				);
			default:
				return this.renderOther(transaction, operationType, parsedTransaction, i);
		}
	}

	render() {
		const {transactionData, currentPage, transactionLength} = this.state;

		return (
			<div className="container pt-1 pb-5 mt-4">
				<div className="card-block">

					{!!this.props.history ? //display on browse transaction page, hides it onthe transaction widget
						<h1 className={`${styles['header-contrast-text']} ${styles['header-background']} display-5 text-center pt-3 pb-3 mt-2 mb-2s`}>
							<span className="fa fa-handshake">&nbsp;</span>Browse Transactions</h1>
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