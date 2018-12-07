import React,  { Component } from 'react';
import { Nav, NavItem, NavLink, Row, Col, TabContent, TabPane, Card, CardBody } from 'reactstrap';
import axios from 'axios';
import classnames from 'classnames';
import styles from './styles.css';

class ContractDetail extends Component {
	constructor(e) {
		super();
		this.state = {
			Contract: [],
			Transactions: [],
			ByteCode: '',
			SourceCode: '',
			activeTab: '1'
		};
		this.toggle = this.toggle.bind(this);
		this.contract = '';
		this.findData = this.findData.bind(this);
		this.findTransactions = this.findTransactions.bind(this);
		this.getContract = this.getContract.bind(this);
		this.tabNavBuild = this.tabNavBuild.bind(this);
	}

	getContract() {
		this.contract = this.props.match.url.substring(16);
	}

	findData(e) {
		this.getContract();
		//API call to search for Contract
		axios.get('/api/contracts/'+this.contract, {
		}).then(response => {
			this.setState({ Contract: response.data });
		}).catch(error => {console.log('error is fetching account data', error);});
	}

	findTransactions() {
		// axios.get('/api/contractHistory/'+this.account, {
		// }).then(response => {
		// 	this.setState({ Transactions: response.data });
		// }).catch(error => {
		// 	console.log('error is fetching account data', error); 
		// 	this.setState({ Transactions: [] });
		// });
	}

	componentDidMount() {
		this.findData();
		//this.findTransactions();
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab
			});
		}
	}

	tabNavBuild( index, type, icon) {
		if(index === '1' && this.state.Contract.length <= 0 ) {
			return null;
		}
		if(index === '2' && this.state.Transactions.length <= 0 ) {
			return null;
		}
		if(index === '3' && this.state.ByteCode.length <= 0 ) {
			return null;
		}
		if(index === '4' && this.state.SourceCode.length <= 0 ) {
			return null;
		}
		return (
			<NavItem>
				<NavLink className={classnames({ active: this.state.activeTab === index })} style={{cursor:'pointer',background:'#3d3d3d',color:'white'}} onClick={() => { this.toggle(index); }}>
				<span className={`fa ${icon}`}>&nbsp;</span> { type } ({ this.contract })
				</NavLink>
			</NavItem>
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
		this.getContract();
		return (
			<div className="container"> 

				<h1 className={`${styles['header-contrast-text']} ${styles['header-background']} display-5 text-center pt-2 pb-3 mt-5`}>
					<span className="fa fa-file-signature">&nbsp;</span>Smart Contract Information</h1>
				<Nav tabs>
					{ this.tabNavBuild('1', 'Contract', 'fas fa-file-signature') }
					{ this.tabNavBuild('2', 'Transactions', 'fas fa-handshake') }
					{ this.tabNavBuild('3', 'Byte Code', '') }
					{ this.tabNavBuild('4', 'Source Code', '') }
				</Nav>
				<Card>
					<CardBody>
						<TabContent activeTab={this.state.activeTab}>
							<TabPane tabId="1">
								<h4>Contract Information</h4>
								{this.state.Contract.map((contract, i) =>{
									const bal = JSON.parse(contract.balances);
									const statistics = JSON.parse(contract.statistics);
									return(
										<div>
											<div> Name: <strong>{ contract.name }</strong></div>
											<div> ID: <strong>{ contract.object_id }</strong></div>
											<div><span>
												Balance: <strong>{bal.map((balance, i)=><span key={i}>{`EXE ${balance.amount}`}</span>)}
												</strong>
											</span></div>
											{statistics.map((stats, i)=>{
												return (
													<div key={i}>
														<div> Owner: <strong>{ stats.owner }</strong></div>
														<div> Most Recent Operation: <strong>{ stats.most_recent_op }</strong></div>
														<div> Total Operations: <strong>{ stats.total_ops }</strong></div>
													</div>
												);
											})}
										</div>);
								})}
							</TabPane>
							<TabPane tabId="2">
								<h4>Transactions</h4>
								{this.state.Transactions.map((transaction, i) =>
									<Row key={i}>
										<Col sm="2"> Name <strong>{ transaction.account_name }</strong></Col>
										<Col sm="2"> Account ID <strong>{ transaction.account_id }</strong></Col>
										<Col sm="2"> Lifetime fees paid <strong>{ transaction.lifetime_fees_paid }</strong></Col>
										<Col sm="2"> Registrar <strong>{ transaction.referrer }</strong></Col>
									</Row>
								)}
							</TabPane>
							<TabPane tabId="3">
								<h4>Byte Code</h4>
								<div>
									{this.state.ByteCode}
								</div>
							</TabPane>
							<TabPane tabId="4">
								<h4>Source Code</h4>
								<div>
									{this.state.SourceCode}
								</div>
							</TabPane>
						</TabContent>
					</CardBody>
				</Card>
			</div>
			
		);
	}
}

export default ContractDetail;
