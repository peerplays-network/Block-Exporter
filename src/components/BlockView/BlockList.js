import React, { Component, Fragment } from 'react';
import axios from 'axios';
import PaginationCall from '../Account/PaginationCall';
import {Input, InputGroup, Table} from 'reactstrap'; 

export default class BlockList extends Component {
	render() {
		return (
			<div class="container pt-4 pb-5 mt-5">
				<div class="card mt-3">
					<div class="card-block">
						<h1 class="display-5 text-center mt-3"><span className="fa fa-cubes">&nbsp;</span> Browse Blocks</h1>
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

