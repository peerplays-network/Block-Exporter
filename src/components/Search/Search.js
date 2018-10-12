import React, { Component } from 'react';
//import axios from 'axios';
import {Card, CardBody, Row, Col, Table} from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink} from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';

class Search extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			searchString: props.match.params[0], 
			accounts: [{account_name: 'init4', account_id: '923821'}], 
			witnesses: [{account_name: 'init8', account_id: '923821'}],
			blocks: [{
				block_id: '0001d19af9fc800da16c93dde767cfeba0b97cba',
				block_number: 119194,
				id: 251084,
				merkle_root: '0000000000000000000000000000000000000000',
				operation_count: 0,
				previous_block_hash: '0001d1995e2612805b219d255391ae019d556a83',
				signature: '1f21bd37fbfac6ed2d7a7690271dd07eec02e745cc64cb8b6b6c72b783bc905a3e6e35fe2ebf849bd9ebfb3e4eb963485b7638038a0cce77170c45d3dcabfd5f9a',
				timestamp: '2018-10-11T16:40:35.000Z',
				transaction_count: 0,
				witness: '1.6.10'}], 

			transactions: []
		};
	}

	getWitnessName(witnessId) {
		return !!this.props.witnesses? this.props.witnesses.find(el => el.account_id === witnessId).account_name : '';
	}

	renderBlocksTable() {
		return (
			<div>
				<Card>
					<CardBody>
						<Row>
							<Col md="12">
								<h1 className="display-5 text-center mt-3"><span className="fa fa-cubes">&nbsp;</span>Blocks</h1>
							</Col>
						</Row>
						<Table responsive>
							<thead className="text-center">
								<tr>
									<th>Height</th>
									<th>Time</th>
									<th>Witness</th>
									<th>Transactions</th>
									<th>Operations</th>
								</tr>
							</thead>
							<tbody className="text-center">
								{this.state.blocks.map((block) => {
									return(
										<tr key={block.id}>
											<td><NavLink tag={RRNavLink} to={`/block-view/${block.block_number}`}>{block.block_number}</NavLink></td>
											<td>{new Date(block.timestamp).toLocaleTimeString()}</td>
											<td>{this.getWitnessName(block.witness)}</td>
											<td>{block.transaction_count}</td>
											<td>{block.operation_count}</td>
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

	renderTransactionsTable() {

	}

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
									<th scope="col">Account Id</th>
									<th scope="col">Account Name</th>
								</tr>
							</thead>
							<tbody className="text-center">
								{this.state.accounts.map((witness) => {
									return (
										<tr key={witness.account_id}>
											<td>{witness.account_name}</td>
											<td>{witness.account_id}</td>
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

	renderWitnessesTable() {
		return (
			<div>
				<Card>
					<CardBody>
						<Row>
							<Col md="12">
								<h1 className="display-5 text-center mt-3"><span className="fa fa-cogs">&nbsp;</span>Witnesses</h1>
							</Col>
						</Row>
						<Table responsive>
							<thead className="text-center">
								<tr>
									<th scope="col">Witness Id</th>
									<th scope="col">Witness Name</th>
								</tr>
							</thead>
							<tbody className="text-center">
								{this.state.witnesses.map((witness) => {
									return (
										<tr key={witness.account_id}>
											<td>{witness.account_name}</td>
											<td>{witness.account_id}</td>
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

	render() {
		debugger;
		return (
			<div className="container pt-4 pb-5 mt-5"> 
				<h3> Search Results For "{this.state.searchString}"</h3>
				{
					this.state.blocks.length > 0 ? this.renderBlocksTable() : null
				}
				<br/>
				{
					this.state.witnesses.length > 0 ? this.renderWitnessesTable() : null
				}
				<br/>
				{
					this.state.accounts.length > 0 ? this.renderAccountsTable() : null
				}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	witnesses: state.witnesses.witnessList
});

export default connect(mapStateToProps)(Search);