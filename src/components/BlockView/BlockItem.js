import React, { Component } from 'react';
import {Card, CardBody, Row, Col, Button, Table} from 'reactstrap';

export default class BlockItem extends Component {
	renderBlockTable() {
		const {currentBlock, witnessName} = this.props;
		const time = new Date(currentBlock.timestamp).toLocaleDateString() + ' ' + new Date(currentBlock.timestamp).toLocaleTimeString();
		return (
			<div className="container pt-4 pb-5 mt-5"> 
				<Card>
					<CardBody>
						<Row>
							<Col md="12">
								<h1 className="display-5 text-center mt-3"><span className="fa fa-cubes">&nbsp;</span>Block {currentBlock.block_number}</h1>
							</Col>
						</Row>
						<Row className="mb-3">
							<Col md="12">
								<Button color="secondary" disabled={this.props.prevDisabled} onClick={this.props.prevBlockClicked}>Previous</Button>
								<Button className="float-right" color="secondary" disabled={this.props.nextDisabled} onClick={this.props.nextBlockClicked}>Next</Button>
							</Col>
						</Row>
						<Table responsive>
							<tbody>
								<tr>
									<th>Time: </th>
									<td>{time.toString()}</td>
								</tr>
								<tr>
									<th>Witness Name: </th>
									<td>{witnessName}</td>
								</tr>
								<tr>
									<th>Witness Id: </th>
									<td>{currentBlock.id}</td>
								</tr>
								<tr>
									<th>Transaction Count: </th>
									<td>{currentBlock.transaction_count}</td>
								</tr>
								<tr>
									<th>Operation Count: </th>
									<td>{currentBlock.operation_count}</td>
								</tr>
								<tr>
									<th>Previous Block Hash: </th>
									<td>{currentBlock.previous_block_hash}</td>
								</tr>
							</tbody>
						</Table>
					</CardBody>
				</Card>
			</div>
		);
	}

	renderErrorOrLoading() {
		if(this.props.error)
			return <h1 className="text-center">Unable to load block, please try again</h1>;
		else {
			return (
				<div> </div>
			);
		}
	}

	render() {
		return (
			!!this.props.currentBlock ? this.renderBlockTable() : this.renderErrorOrLoading()
		);
	}
}