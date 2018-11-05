/*Used in Account*/
import React,  { Component } from 'react';
import { Nav, NavItem, NavLink, Row, Col, TabContent, TabPane, Card, CardBody } from 'reactstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import classnames from 'classnames';
import styles from './styles.css';

class AccountAllDetail extends Component {
	constructor(e) {
		super();
		this.state = {
			Account: [],
			Transactions: [],
			Witnesses: [],
			Committee: [],
			activeTab: '1',
			accountBalance: 0
		};
		this.toggle = this.toggle.bind(this);
		this.account = '';
	}

	getAccount() {
		this.account = this.props.match.params[0].split('/');
	}

	findData(e) {
		this.getAccount();
		//API call to search for Account
		axios.get(`/api/accounts/${this.account[0]}`, {
		}).then(response => {
			this.setState({ Account: response.data });
			return axios.get(`/api/balance/${this.account[0]}`);
		}).then(response => { 
			this.setState({accountBalance: response.data[0].amount});
		}).catch(error => {console.log('error is fetching account data', error);});
	}

	findTransactions() {
		let account_id = '';

		axios.get(`/api/accounts/${this.account[0]}`, {
		}).then(response => {
			account_id = response.data[0].account_id;
			return axios.get(`/api/transactions/${account_id}`);
		}).then(response => {
			this.setState({ Transactions: response.data });
		}).catch(error => {	console.log('error is fetching transaction data', error); this.setState({ Transactions: [] }); });
		console.log('transaction = ', this.state.Transactions);
	}

	findWitnesses(e) {
		const account = this.account[0];
		//API call to search for Account
		axios.get('/api/witnesses/', {
		}).then(response => {
			const sortedWitnessData = response.data.filter(function(item) {
				return item.account_name === account;
			 });
			this.setState({ Witnesses: sortedWitnessData });
		}).catch(error => {console.log('error is fetching witness data', error);});
	}

	findCommittee(e) {
		let account_id = '';
		//API call to search for Account
		axios.get(`/api/accounts/${this.account[0]}`, {
		}).then(response => {
			account_id = response.data[0].account_id;
			return axios.get(`/api/committee/${account_id}`);
		}).then(response => {
			this.setState({ Committee: response.data });
		}).catch(error => {console.log('error is fetching committee data', error);});
	}

	componentDidMount() {
		this.findData();
		this.findTransactions();
		this.findWitnesses();
		this.findCommittee();

		if(!!this.account[1] && this.account[1].includes('1.6'))
			this.setState({activeTab: '3'});
		else if(!!this.account[1] && this.account[1].includes('1.5'))
			this.setState({activeTab: '4'});
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab
			});
		}
	}

	tabNavBuild( index, type) {
		if(index === '1' && this.state.Account.length <= 0 ) {
			return null;
		}
		if(index === '2' && this.state.Transactions.length <= 0 ) {
			return null;
		}
		if(index === '3' && this.state.Witnesses.length <= 0 ) {
			return null;
		}
		if(index === '4' && this.state.Committee.length <= 0 ) {
			return null;
		}
		
		return (
			<NavItem>
				<NavLink className={classnames({ active: this.state.activeTab === index}) } style={{cursor:'pointer',background:'#3d3d3d',color:'white'}} onClick={() => { this.toggle(index); }}>
					{ type } Details ({ this.account[0] })
				</NavLink>
			</NavItem>
		);
	}

	getTimeSince( timeCode ) {
		//return timeCode;
		var today = new Date();
		//split timeCode
		var timeArray = timeCode.split('T');
		//days
		var dateArray = timeArray[0].split('-');
		if (dateArray[0] !== today.getFullYear().toString()) return (<Col><strong>{today.getFullYear()-dateArray[0]}</strong> year(s) ago</Col>);
		if (dateArray[1] !== (today.getMonth()+1).toString()) return (<Col><strong>{(today.getMonth()+1)-dateArray[1]}</strong> month(s) ago</Col>);
		if (dateArray[2] !== today.getDate().toString()) return (<Col><strong>{today.getDate()-dateArray[2]}</strong> day(s) ago</Col>);
		//hours
		var clockArray = timeArray[1].split(':');
		if (clockArray[0] !== today.getHours().toString()) return (<Col><strong>{today.getHours()-clockArray[0]}</strong> hour(s) ago</Col>);
		//minutes
		if (clockArray[1] !== today.getMinutes().toString()) return (<Col><strong>{today.getMinutes()-clockArray[1]}</strong> minute(s) ago</Col>);
		//sec
		var secs = clockArray[2].split('.');
		return (<Col sm="2"><strong>{today.getSeconds()-secs[0]}</strong> minute(s) ago</Col>);
	}

	displayOperation( operation ) {
		const operationID = JSON.parse(operation);
		const OpId = operationID[0];
		console.log('the id', OpId);
		//API call to search for Account
		return ( 
			axios.get(`/api/operations/${ OpId }`, {
			}).then(response => {
				return( response.data.friendly_name );
			}).catch(error => {console.log('error is fetching witness data', error);})
		);
	}

	tabPaneBuild( index, type ) {
		return (
			<TabPane tabId="1">
				<h4>Account Information</h4>
				{this.state.Account.map((account, i) =>
					<Row key={i}>
						<Col sm="2"> Name: <strong>{ account.account_name }</strong></Col>
						<Col sm="2"> Account ID: <strong>{ account.account_id }</strong></Col>
						<Col sm="2"> Lifetime fees paid: <strong>{ account.lifetime_fees_paid }</strong></Col>
						<Col sm="2"> Registrar: <strong>{ account.referrer }</strong></Col>
					</Row>
				)}
			</TabPane>
		);
	}

	returnActive( active ) {
		if(active) {
			return 'Yes';
		}
		else
			return 'No';
	}

	findAccountName(id) {
		const accountName = this.props.accounts.find(el => el.account_id === id);
		return !!accountName ? accountName.account_name : id;
	}

	renderTransaction(transaction, i) {
		const operationType = JSON.parse(transaction.operations)[0];
		const parsedTransaction = JSON.parse(transaction.operations)[1];
		if(operationType === 0) {
			const senderAccount = this.findAccountName(parsedTransaction.from);
			const receiverAccount = this.findAccountName(parsedTransaction.to);
			return (
				<Row key={i}>
					<Col sm="5"><strong>{senderAccount}</strong> transfered {parsedTransaction.amount.amount} to <strong>{receiverAccount}</strong></Col> 
					<Col className="d-inline-flex" sm="4"> Time: <strong>{this.getTimeSince(transaction.expiration)}</strong></Col>
					<Col sm="2"> Id: <strong>{transaction.id}</strong></Col>
				</Row> 
			);
		}
		else if(operationType === 37) {
			return (
				<Row key={i}>
					<Col sm="5">{parsedTransaction.total_claimed.amount} deposited to <strong>{parsedTransaction.deposit_to_account}</strong></Col> 
					<Col className="d-inline-flex" sm="4"> Time: <strong>{this.getTimeSince(transaction.expiration)}</strong></Col>
					<Col sm="2"> Id: <strong>{transaction.id}</strong></Col>
				</Row> 
			);
		}
		else {
			return (
				<Row key={i}>
					<Col sm="5">{parsedTransaction.total_claimed.amount} {this.displayOperation(operationType)} <strong>{parsedTransaction.deposit_to_account}</strong></Col> 
					<Col className="d-inline-flex" sm="4"> Time: <strong>{this.getTimeSince(transaction.expiration)}</strong></Col>
					<Col sm="2"> Id: <strong>{transaction.id}</strong></Col>
				</Row> 
			);
		}
	}

	render() {
		this.getAccount();
		return (
			<div className="container">
				<h1 className={`${styles['header-contrast-text']} ${styles['header-background']} display-5 text-center pt-2 pb-3 mt-5`}>
					<span className="fa fa-address-card">&nbsp;</span>Account Information</h1>
				<Nav tabs>
					{ this.tabNavBuild('1', 'Account') }
					{ this.tabNavBuild('2', 'Transaction') }
					{ this.tabNavBuild('3', 'Witness') }
					{ this.tabNavBuild('4', 'Committee') }
				</Nav>
				<Card>
					<CardBody>
						<TabContent activeTab={this.state.activeTab} key="1" >
							<TabPane tabId="1">
								<h4>Account Information</h4>
								{this.state.Account.map((account, i) =>
									<Row key={i}>
										<Col sm="2"> Name: <strong>{ account.account_name }</strong></Col>
										<Col sm="2"> Account ID: <strong>{ account.account_id }</strong></Col>
										<Col sm="2"> Account Balance: <strong>{ this.state.accountBalance }</strong></Col>
										<Col sm="2"> Lifetime fees paid: <strong>{ !!account.lifetime_fees_paid && account.lifetime_fees_paid.length > 0 ? account.lifetime_fees_paid : 0 }</strong></Col>
										<Col sm="2"> Registrar: <strong>{ account.referrer }</strong></Col>
									</Row>
								)}
							</TabPane>
							<TabPane tabId="2">
								<h4>Transactions</h4>
								{this.state.Transactions.map((transaction, i) =>
									this.renderTransaction(transaction, i)
								)}
							</TabPane>
							<TabPane tabId="3">
								<h4>Witness Information</h4>
								{this.state.Witnesses.map((witness, i) =>
									<Row key={i}>
										<Col sm="2"> Account ID: <strong>{ witness.account_id }</strong></Col>
										<Col sm="2"> Active: <strong>{ this.returnActive(witness.is_active) }</strong></Col>
										<Col sm="2"> Total Votes: <strong>{ witness.total_votes }</strong></Col>
										<Col sm="2"> Missed Blocks: <strong>{ witness.total_missed }</strong></Col>
										<Col sm="2"> Url: <strong>{ witness.url }</strong></Col>
									</Row>	
								)}
							</TabPane>
							<TabPane tabId="4">
								<h4>Committee Information</h4>
								{this.state.Committee.map((committee, i) =>
									<Row key={i}>
										<Col sm="2"> Committee ID: <strong>{ committee.committee_id }</strong></Col>
										<Col sm="2"> Vote ID: <strong>{ committee.vote_id }</strong></Col>
										<Col sm="2"> Total Votes: <strong>{ committee.total_votes }</strong></Col>
										<Col sm="2"> URL: <strong>{ committee.url }</strong></Col>
									</Row>
								)}
							</TabPane>
						</TabContent>
					</CardBody>
				</Card>
			</div>
			
		);
	}
}

const mapStateToProps = (state) => ({
	accounts: state.accounts.accountList
});

export default connect(mapStateToProps)(AccountAllDetail);
