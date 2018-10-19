/*Used in Account*/
import React,  { Component } from 'react';
import { Nav, NavItem, NavLink, Row, Col, TabContent, TabPane, Card, CardBody } from 'reactstrap';
import axios from 'axios';
import classnames from 'classnames';

class AccountAllDetail extends Component {
	constructor(e) {
		super();
		this.state = {
			Account: [],
			Transactions: [],
			Witnesses: [],
			Committee: [],
			activeTab: '1'
		};
		this.toggle = this.toggle.bind(this);
		this.account = '';
	}

	getAccount() {
		this.account = this.props.match.url.substring(18);
	}

	findData(e) {
		this.getAccount();
		//API call to search for Account
		axios.get(`/api/accounts/${this.account}`, {
		}).then(response => {
			this.setState({ Account: response.data });
		}).catch(error => {console.log('error is fetching account data', error);});
	}

	findTransactions() {
		let account_id = '';

		axios.get(`/api/accounts/${this.account}`, {
		}).then(response => {
			account_id = response.data[0].account_id;
			return axios.get(`/api/transactions/${account_id}`);
		}).then(response => {
			this.setState({ Transactions: response.data });
		}).catch(error => {	console.log('error is fetching transaction data', error); this.setState({ Transactions: [] }); });
		console.log('transaction = ', this.state.Transactions);
	}

	findWitnesses(e) {
		const account = this.account;
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
		axios.get(`/api/accounts/${this.account}`, {
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
				<NavLink className={classnames({ active: this.state.activeTab === index })} onClick={() => { this.toggle(index); }}>
					{ type } Details ({ this.account })
				</NavLink>
			</NavItem>
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

	render() {
		this.getAccount();
		return (
			<div>
				<Nav tabs>
					{ this.tabNavBuild('1', 'Account') }
					{ this.tabNavBuild('2', 'Transactions') }
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
										<Col sm="2"> Lifetime fees paid: <strong>{ account.lifetime_fees_paid }</strong></Col>
										<Col sm="2"> Registrar: <strong>{ account.referrer }</strong></Col>
									</Row>
								)}
							</TabPane>
							<TabPane tabId="2">
								<h4>Transactions</h4>
								{this.state.Transactions.map((transaction, i) =>
									<Row key={i}>
										<Col sm="2"> Name: <strong>{ transaction.account_name }</strong></Col>
										<Col sm="2"> Account ID: <strong>{ transaction.account_id }</strong></Col>
										<Col sm="2"> - <strong>{ transaction.lifetime_fees_paid }</strong> minutes ago</Col>
										<Col sm="2"><strong>{ transaction.id }</strong></Col>
									</Row>
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

export default AccountAllDetail;
