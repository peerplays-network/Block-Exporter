import React, { Component } from 'react';
import axios from 'axios';
import {Card, CardBody, Row, Col, Table} from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink} from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';

class Search extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			searchString: props.match.params[0], 
			accounts: [],
			//witnesses: [],
			//blocks: [],
			//transactions: [],
		};
	}

	getWitnessName(witnessId) {
		return !!this.props.witnesses? this.props.witnesses.find(el => el.account_id === witnessId).account_name : '';
	}

	getAccountName(accountId) {
		return !!this.props.accounts? this.props.accounts.find(el => el.account_id === accountId).account_name : '';
	}

	componentDidMount() {
		console.log('history: ', this.props.history);
		axios.get(`/api/search?input=${this.state.searchString}`, {
		}).then(response => {
			if(response.data.length === 1)
				this.redirectToPage(response.data[0]);
			else
				this.setState({accounts: response.data});
		}).catch(error => {console.log('error fetching search data', error); this.setState({accounts:[]});});
	}

	componentDidUpdate() {
		if(this.state.searchString !== this.props.match.params[0]) {
			this.setState({searchString: this.props.match.params[0]});
		}
		
		axios.get(`/api/search?input=${this.props.match.params[0]}`, {
		}).then(response => {
			if(response.data.length === 1)
				this.redirectToPage(response.data[0]);
			else
				this.setState({accounts: response.data});
		}).catch(error => {console.log('error fetching search data', error); this.setState({accounts:[]});});
	}

	redirectToPage(responseObj) {
		if(!!responseObj.block_number)
			this.props.history.push(`/block-view/${responseObj.block_number}`);
		else if(!!responseObj.account_name) {
			if(this.state.searchString.includes('1.6'))
				this.props.history.push(`/accountAllDetail/${responseObj.account_name}/${responseObj.account_id}`);
			else
				this.props.history.push(`/accountAllDetail/${responseObj.account_name}`);
		}
		else if(!!responseObj.committee_id) {
			const accountName = this.getAccountName(responseObj.committee_member_account);
			this.props.history.push(`/accountAllDetail/${accountName}/${responseObj.committee_id}`);
		}
		else
			console.log('no matches');
	}

	// renderBlocksTable() {
	// 	return (
	// 		<div>
	// 			<Card>
	// 				<CardBody>
	// 					<Row>
	// 						<Col md="12">
	// 							<h1 className="display-5 text-center mt-3"><span className="fa fa-cubes">&nbsp;</span>Blocks</h1>
	// 						</Col>
	// 					</Row>
	// 					<Table responsive>
	// 						<thead className="text-center">
	// 							<tr>
	// 								<th>Height</th>
	// 								<th>Time</th>
	// 								<th>Witness</th>
	// 								<th>Transactions</th>
	// 								<th>Operations</th>
	// 							</tr>
	// 						</thead>
	// 						<tbody className="text-center">
	// 							{this.state.blocks.map((block) => {
	// 								return(
	// 									<tr key={block.id}>
	// 										<td><NavLink tag={RRNavLink} to={`/block-view/${block.block_number}`}>{block.block_number}</NavLink></td>
	// 										<td>{new Date(block.timestamp).toLocaleTimeString()}</td>
	// 										<td>{this.getWitnessName(block.witness)}</td>
	// 										<td>{block.transaction_count}</td>
	// 										<td>{block.operation_count}</td>
	// 									</tr>
	// 								);
	// 							})}
	// 						</tbody>
	// 					</Table>
	// 				</CardBody>
	// 			</Card>
	// 		</div>
	// 	);
	// }

	// renderTransactionsTable() {

	// }

	renderAccountsTable() {
		return (
			<div>
				<Card>
					<CardBody>
						<Row>
							<Col md="12">
								<h1 className="display-5 text-center mt-3"><span className="fa fa-user-alt">&nbsp;</span>Accounts</h1>
							</Col>
						</Row>
						<Table responsive>
							<thead className="text-center">
								<tr>
									<th scope="col">Account Name</th>
									<th scope="col">Account Id</th>
								</tr>
							</thead>
							<tbody className="text-center">
								{this.state.accounts.map((account) => {
									return (
										<tr key={account.account_id}>
											<td><NavLink tag={RRNavLink} to={`/accountAllDetail/${account.account_name}`} >{account.account_name}</NavLink></td>
											<td>{account.account_id}</td>
										</tr>
									);
								})}
							</tbody>
						</Table>
					</CardBody>
				</Card>
			</div>
		);
	}

	// renderWitnessesTable() {
	// 	return (
	// 		<div>
	// 			<Card>
	// 				<CardBody>
	// 					<Row>
	// 						<Col md="12">
	// 							<h1 className="display-5 text-center mt-3"><span className="fa fa-cogs">&nbsp;</span>Witnesses</h1>
	// 						</Col>
	// 					</Row>
	// 					<Table responsive>
	// 						<thead className="text-center">
	// 							<tr>
	// 								<th scope="col">Witness Id</th>
	// 								<th scope="col">Witness Name</th>
	// 							</tr>
	// 						</thead>
	// 						<tbody className="text-center">
	// 							{this.state.witnesses.map((witness) => {
	// 								return (
	// 									<tr key={witness.account_id}>
	// 										<td>{witness.account_name}</td>
	// 										<td>{witness.account_id}</td>
	// 									</tr>
	// 								);
	// 							})}
	// 						</tbody>
	// 					</Table>
	// 				</CardBody>
	// 			</Card>
	// 		</div>
	// 	);
	// }

	render() {
		return (
			<div className="container pt-4 pb-5 mt-5"> 
				{this.state.accounts.length > 0 && <h3> Search Results For "{this.state.searchString}"</h3>}
				{this.state.accounts.length === 0 && <h3> No Results For "{this.state.searchString}"</h3> }
				<br/>
				{
					this.state.accounts.length > 0 && this.renderAccountsTable()
				}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	witnesses: state.witnesses.witnessList,
	accounts: state.accounts.accountList
});

export default connect(mapStateToProps)(Search);