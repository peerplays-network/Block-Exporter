/*Used in Account*/
import React,  { Component } from 'react';
import { Nav, NavItem, NavLink, Row, Col, TabContent, TabPane, Card, CardBody } from 'reactstrap';
import axios from 'axios';
import classnames from 'classnames';

class AccountAllDetail extends Component {
	constructor(e) {
		super();
		this.state = {
			data: [],
			transactions: [],
			witnesses: [],
			activeTab: '1'
		};
		this.toggle = this.toggle.bind(this);
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
		axios.get('/api/accounts/'+this.account, {
		}).then(response => {
			this.setState({ data: response.data });
			console.log('', response);
		}).catch(error => {console.log('error is fetching account data', error);});
	}

	findTransactions() {
		axios.get('/api/transactions/'+this.account, {
		}).then(response => {
			this.setState({ transactions: response.data });
		}).catch(error => {
			console.log('error is fetching account data', error); 
			this.setState({ transactions: [] });
		});
	}

	findWitnesses(e) {
		const account = this.account;
		this.getAccount();
		//API call to search for Account
		axios.get('/api/witnesses/', {
		}).then(response => {
			const sortedWitnessData = response.data.filter(function(item) {
				return item.account_name === account;
			 });
			this.setState({ witnesses: sortedWitnessData });
		}).catch(error => {console.log('error is fetching account data', error);});
	}

	componentDidMount() {
		this.findData();
		//this.findTransactions();
		this.findWitnesses();
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab
			});
		}
	}

	tabNavBuild( index, type) {
		return (
			<NavItem>
				<NavLink className={classnames({ active: this.state.activeTab === index })} onClick={() => { this.toggle(index); }}>
					{ type } Details ({ this.account })
				</NavLink>
			</NavItem>
		);
	}

	render() {
		this.getAccount();

		return (

			<div>
				<Nav tabs>
					{ this.tabNavBuild(1, 'Account') }
					{ this.tabNavBuild(2, 'Transactions') }
					{ this.tabNavBuild(3, 'Witness') }
					<NavItem>
						<NavLink className={classnames({ active: this.state.activeTab === '3' })} onClick={() => { this.toggle('3'); }}>
							Witness Details ({ this.account })
						</NavLink>
					</NavItem>
				</Nav>
				<Card>
					<CardBody>
						<TabContent activeTab={this.state.activeTab}>
							<TabPane tabId="1">
								<h4>Account Information</h4>
								{this.state.data.map((account, i) =>
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
								{this.state.transactions.map((transaction, i) =>
									<Row key={i}>
										<Col sm="2"> Name: <strong>{ transaction.account_name }</strong></Col>
										<Col sm="2"> Account ID: <strong>{ transaction.account_id }</strong></Col>
										<Col sm="2"> Lifetime fees paid: <strong>{ transaction.lifetime_fees_paid }</strong></Col>
										<Col sm="2"> Registrar: <strong>{ transaction.referrer }</strong></Col>
									</Row>
								)}
							</TabPane>
							<TabPane tabId="3">
								<h4>Witness Information</h4>
								{this.state.witnesses.map((witness, i) =>
									<Row key={i}>
										<Col sm="2"> Name: <strong>{ witness.account_name }</strong></Col>
										<Col sm="2"> Account ID: <strong>{ witness.account_id }</strong></Col>
										<Col sm="2"> Lifetime fees paid: <strong>{ witness.lifetime_fees_paid }</strong></Col>
										<Col sm="2"> Registrar: <strong>{ witness.referrer }</strong></Col>
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
