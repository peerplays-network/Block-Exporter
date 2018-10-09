import React, { Component } from 'react';
import axios from 'axios';
import Pagination from 'react-paginate';
import styles from './styles.css';
import {Table} from 'reactstrap'; 

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

	changePage(index) {
		debugger;
		this.setState({currentPage: index.selected+1});
	}

	getPageLength() {
		return !!this.state.blocks && this.state.blocks.length > 0 ? Math.ceil(this.state.blocks[0].block_number/this.state.pageSize) : 1;
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
						{/* <PaginationCall currentPage={currentPage} handleClick={this.changePage.bind(this)} pagesCount={this.getPageLength()} /> */}
						<Pagination
							breakClassName={`${styles['pagination']}`}
							breakLabel={<a className="page-link">...</a>}
							pageClassName={`${styles['pagination']}`}
							previousClassName={`${styles['pagination']}`}
							nextClassName={`${styles['pagination']}`}
							pageLinkClassName="page-link"
							previousLinkClassName="page-link"
							nextLinkClassName="page-link"
							pageCount={this.getPageLength()}
							pageRangeDisplayed={2}
							onPageChange={this.changePage.bind(this)}
          				/>
					</div>
				</div>
			</div>
		);
	}
}

