/*
    {
        "id": 143904,
        "block_id": null,
        "block_number": 100,
        "transaction_count": 0,
        "operation_count": 0,
        "witness": "1.6.2",
        "signature": "2012dc5855b6695d088f69821fcd2786965801f9ebef7d4e213fafd0cc514cfc0e0787b389b7bdbd2760e3fcd6fdeb1042e44b574d02689f272fe3ca7389bdfbfb",
        "previous_block_hash": "000000630353a9624dd5826089da9c3640b9a63e",
        "merkle_root": "0000000000000000000000000000000000000000",
        "timestamp": "2018-09-26T16:05:50.000Z"
    },
*/

import React, { Component } from 'react';
import axios from 'axios';

export default class BlockView extends Component {
	constructor() {
		super();
		this.state = {blocks: []};
	}

	componentDidMount() {
		/*
		axios.get('api/witnesses/', {
		}).then(response => {
			const sortedWitnessData = response.data.sort((a, b) => (a.total_votes > b.total_votes) ? 1 : ((b.total_votes > a.total_votes) ? -1 : 0));
			sortedWitnessData.map( (el, index) => {return el.index = index+1;});

			this.setState({witnessData: sortedWitnessData});
			this.setState({searchData: sortedWitnessData});
			this.refreshPagination(sortedWitnessData);
		}).catch(error => {console.log('error fetching witness data', error);});
		*/
		axios.get('api/blocks?start=100&end=101', {

		}).then(response => {
			console.log('blocks,', response.data);
			this.setState({blocks: response.data});
		}).catch(error => console.log('error fetching blocks'));
	}

	render() {
		console.log('current block', this.state.blocks);
		return (
			<div className="container pt-4 pb-5 mt-5"> 
				<div className="card border-dark">
					<div className="card-body">
						<div className="row">
							<div className="col-md-12">
								<h1 className="display-5 text-center mt-3">block_number </h1>
							</div>
						</div>
						<div class="row mb-3">
							<div class="col-md-12">
								<a class="btn btn-primary" href="/block/6447203">Previous</a>
								<a class="btn btn-primary float-right" href="/block/6447205">Next</a>
							</div>
						</div>
						<div className="table-responsive">
							<table className="table"> 
								<tbody>
									<tr>
										<th>Hash: </th>
										<td>0xff400d9df7a3af37fd0ddd55c18a184fc04d674c8442be003544694b8b4f00db</td>
									</tr>
								</tbody>
							</table> 
						</div>
					</div>
				</div>
			</div>
		);
	}
}