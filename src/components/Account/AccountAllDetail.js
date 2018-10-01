/*Used in Account*/
import React,  { Component } from 'react';
import { Button, UncontrolledCollapse } from 'reactstrap';
import axios from 'axios';

class AccountAllDetail extends Component {
	constructor(e) {
		super();
		this.state = {
			data: [],
			transactions: []
		};
		this.account = '';
		this.findData = this.findData.bind(this);
		this.findTransactions = this.findTransactions.bind(this);
		this.getAccount = this.getAccount.bind(this);
	}

	getAccount() {
		this.account = this.props.match.url.substring(18);
	}

	findData(e) {
		this.getAccount();
		//API call to search for Account
		axios.get('http://dev.5050labs.fun:5000/api/accounts/'+this.account, {
		}).then(response => {
			this.setState({ data: response.data });
			console.log('', response);
		}).catch(error => {console.log('error is fetching account data', error);});
	}

	findTransactions() {
		axios.get('http://dev.5050labs.fun:5000/api/transactions/'+this.account, {
		}).then(response => {
			this.setState({ transactions: response.data });
		}).catch(error => {
			console.log('error is fetching account data', error); 
			this.setState({ transactions: [] });
		});
	}

	componentDidMount() {
		this.findData();
		//this.findTransactions();
	}

	render() {
		const toggler = 'toggler'+this.props.account;
		const togglerCol = '#toggler'+this.props.account;

		this.getAccount();

		return (
			<div>
				<Button color="primary" id={toggler} style={{ marginBottom: '1rem' }}>
					More details about { this.account }
				</Button>
				{this.state.data.map((account, i) =>
					<UncontrolledCollapse toggler={togglerCol} key={i} >
						<a> Name: { account.account_name } </a>
						<a>Account ID: { account.account_id } </a>
						<a>Account Key: { account.active_key } </a><br />
						<a>ID: { account.id } </a>
						<a>Referrer ID: { account.referrer } </a><br />
						<a>Member Since: { account.member_since } </a><br />
						<a>Membership Expires: { account.membership_expiration }</a><br />
						<a>Memo Key: { account.memo_key } </a>
						<a>Owner Key: { account.owner_key } </a>
						<a>Fees Paid: { account.lifetime_fees_paid } </a>
					</UncontrolledCollapse>
				)}
				<br />
				<Button color="primary" id={toggler+'trans'} style={{ marginBottom: '1rem' }}>
					Transactions { this.account }
				</Button>
				{this.state.transactions.map((transaction, i) =>
					<UncontrolledCollapse toggler={togglerCol+'trans'} key={i} >
						<a> Name: { transaction.account_name } </a>
						<a>Transacitons ID: { transaction.account_id } </a>
						<a>Account Key: { transaction.active_key } </a>
					</UncontrolledCollapse>
				)}
			</div>
			
		);
	}
}

export default AccountAllDetail;
