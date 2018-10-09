import React, { Component, Fragment } from 'react';
import axios from 'axios';
import PaginationCall from '../Account/PaginationCall';
import {Input, InputGroup, Table} from 'reactstrap'; 

export default class BlockList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			blocks: []
		};
	}

	componentDidMount() {
		let blocks = [];
		axios.get('api/blocks/last', {
		}).then(response => {
			return axios.get(`api/blocks?start=${response.data.block_number-100}&end=${response.data.block_number}`);//api/blocks?start=450&end=550
			//this.setState({blocks: response.data[0]});
		}).then(response => {
			this.setState({blocks: response.data[0]});
		}).catch(error => console.log('error fetching blocks: ', error));
	}

	render() {
		return (
			<div className="container pt-4 pb-5 mt-5">
				<div className="card mt-3">
					<div className="card-block">
						<h1 className="display-5 text-center mt-3"><span className="fa fa-cubes">&nbsp;</span> Browse Blocks</h1>
						<Table responsive>
							<thead className="text-center">
								<th>Block Number</th>
								<th>Block Number</th>
								<th>Block Number</th>
								<th>Block Number</th>
							</thead>
							<tbody className="text-center">
								<tr>
									<td>test1</td>
									<td>test1</td>
									<td>test1</td>
									<td>test1</td>
								</tr>
							</tbody>
						</Table>
					</div>
				</div>
			</div>
		);
	}
}

