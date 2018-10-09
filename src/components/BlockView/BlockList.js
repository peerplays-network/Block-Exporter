import React, { Component, Fragment } from 'react';
import axios from 'axios';
import PaginationCall from '../Account/PaginationCall';
import {Input, Button, InputGroup, InputGroupAddon, Table} from 'reactstrap'; 

export default class BlockList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			blocks: [], lower: 0, upper: 1, currentPage: 1, pageSize: 20
		};
	}

	componentDidMount() {
		let lower=0;
		let upper=1;
		axios.get('api/blocks/last', {
		}).then(response => {
			lower=response.data[0].block_number-100;
			upper=response.data[0].block_number;
			return axios.get(`api/blocks?start=${lower}&end=${upper}`);//api/blocks?start=450&end=550
		}).then(response => {
			this.setState({blocks: response.data.reverse(), lower, upper});
		}).catch(error => console.log('error fetching blocks: ', error));
	}

	changePage(e, index) {
		e.preventDefault();
		this.setState({currentPage: index});
	}

	getPageLength() {
		if(!!this.state.blocks && this.state.blocks.length > 0) {
			console.log('blocks? ', Math.ceil(this.state.blocks[0].block_number/this.state.pageSize));
			return 100;
		}
		else
			return 1;
	}

	render() {
		console.log('data: ', this.state);
		const {blocks, currentPage, pageSize} = this.state;
		console.log('page #', blocks.length/pageSize);
		return (
			<div className="container pt-4 pb-5 mt-5">
				<div className="card mt-3">
					<div className="card-block">
						<h1 className="display-5 text-center mt-3"><span className="fa fa-cubes">&nbsp;</span> Browse Blocks</h1>
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
								{blocks.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((block) => {
									return(
										<tr key={block.id}>
											<td>{block.block_number}</td>
											<td>{new Date(block.timestamp).toLocaleTimeString()}</td>
											<td>{block.witness}</td>
											<td>{block.transaction_count}</td>
											<td>{block.operation_count}</td>
										</tr>
									);
								})}
							</tbody>
						</Table>
						<PaginationCall currentPage={currentPage} handleClick={this.changePage.bind(this)} pagesCount={this.getPageLength()} />
					</div>
				</div>
			</div>
		);
	}
}

