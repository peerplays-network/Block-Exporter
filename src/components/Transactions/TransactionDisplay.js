import React, { Component } from 'react';
import {Table} from 'reactstrap'; 
import Pagination from 'react-paginate';
import axios from 'axios';
import styles from './styles.css';
import { NavLink } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import { connect } from 'react-redux';
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
			this.setState({transactionData: response.data});
			return axios.get('/api/transactions/length');
		}).then(response => {
			this.setState({transactionLength: response.data});
		}).catch(error => console.log('error fetching transactions', error));
	}

	componentDidMount() {
		this.fetchData();
		const gridHeight=32;
		if(!!this.props.calculateComponentHeight)
			this.props.calculateComponentHeight(this.props.id, gridHeight);
	}

	changePage(index) {
		const {transactionData} = this.state;
		this.setState({currentPage: index.selected});
		axios.get(`/api/transactions/recent?id=${transactionData[transactionData.length - 1]}&limit=10`, {
		}).then(response => {
			this.setState({transactionData: response.data});
		}).catch(error => console.log('error fetching transactions'));
	}

	findAccountName(id) {
		const accountName = this.props.accounts.find(el => el.account_id === id);
		return !!accountName ? <span><NavLink className="d-inline p-0" tag={RRNavLink} to={`/accountAllDetail/${accountName.account_name}`}>{accountName.account_name}</NavLink></span>  : id;
	}

	renderTransaction(transaction, i) {
		const operationType = JSON.parse(transaction.operations)[0];
		const parsedTransaction = JSON.parse(transaction.operations)[1];
		if(operationType === 0) {
			const senderAccount = this.findAccountName(parsedTransaction.from);
			const receiverAccount = this.findAccountName(parsedTransaction.to);
			return (
				<tr key={i}>
					<td>{senderAccount} transfered {parsedTransaction.amount.amount} to {receiverAccount}</td>
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
			<div className="container pt-1 pb-5 mt-4">
				<div className="card-block">

					{!!this.props.history ? //display on browse transaction page, hides it onthe transaction widget
						<div><Pagination
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
					<h1 className={`${styles['header-contrast-text']} ${styles['header-background']} display-5 text-center pt-3 pb-3 mt-2 mb-2s`}>
							<span className="fa fa-inbox">&nbsp;</span>Browse Transactions</h1></div>
						: null//display on browse transaction page, hides it onthe transaction widget
					}
						
					
					<Table responsive>
						<thead>
							<tr>
								<th style={{cursor:'default'}} className={`${styles['header-contrast-text']} ${styles['blocks-header']}  ${styles['text-center']}`}>Transaction</th>
							</tr>
						</thead>
						<tbody className="text-center">
							{this.state.transactionData.map((transaction, i) => {
								return this.renderTransaction(transaction, i);
							})}
						</tbody>
					</Table>

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
				</div>
			
			
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	accounts: state.accounts.accountList
});

export default connect(mapStateToProps)(TransactionDisplay);