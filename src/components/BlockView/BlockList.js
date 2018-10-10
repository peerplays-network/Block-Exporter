import React, { Component } from 'react';
import axios from 'axios';
import Pagination from 'react-paginate';
import styles from './styles.css';
import {Table} from 'reactstrap'; 

export default class BlockList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			blocks: [], lower: 0, upper: 1, currentPage: 1, blockLength: 0
		};
		this.blocksPerPage= 20;
	}

	componentDidMount() {
		let lower=0;
		let upper=1;
		axios.get('api/blocks/last', {
		}).then(response => {
			lower=response.data[0].block_number-100;
			upper=response.data[0].block_number;
			return axios.get(`api/blocks?start=${lower}&end=${upper}`);
		}).then(response => {
			this.setState({blocks: response.data.reverse(), lower, upper, blockLength: Math.ceil(upper/this.blocksPerPage)});
		}).catch(error => console.log('error fetching blocks: ', error));
	}

	loadNextBlocks(currentPage) {
		const requestedBlockRange = (this.state.upper-this.blocksPerPage)- (this.blocksPerPage*currentPage);
		const block = this.state.blocks.findIndex(el => el.block_number === requestedBlockRange);
		if(block > 0) //block will be > 0 if it exists or -1 if it does not
		{
			//make an API call to get the missing data
		}
		//if(block)
		console.log('requested block range: ', requestedBlockRange);
		//HOW DO I LOAD THE DATA BASED ON PAGE NUMBER
		//blocks at a time = 100
		//pages = 11,251
		//page size = 20
		//currentPage * pageSize, (currentPage + 1) * pageSize?
		//if(this.state.blocks[])//request for blocks has exceeded what is in the array


		/*
		axios.get(`api/blocks?start=${this.state.currentBlock+1}&end=${this.upperBound}`, {
		}).then(response => {
			this.setState({ blocks: [...this.state.blocks, ...response.data] });
		}).catch(error => console.log('error fetching blocks'));*/
	 }

	changePage(index) {
		this.setState({currentPage: index.selected+1});
		this.loadNextBlocks(index.selected+1);
	}

	// getPageLength() {
	// 	const test = !!this.state.blocks && this.state.blocks.length > 0 ? Math.ceil(this.state.blocks[0].block_number/this.blocksPerPage) : 1;
	// 	debugger;
	// 	return test;
	// }

	render() {
		const {blocks, currentPage, blockLength} = this.state;
		console.log('blocks: ',blocks);
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
								{blocks.slice(currentPage * this.blocksPerPage, (currentPage + 1) * this.blocksPerPage).map((block) => {
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
							pageCount={blockLength}
							pageRangeDisplayed={2}
							onPageChange={this.changePage.bind(this)}
          				/>
					</div>
				</div>
			</div>
		);
	}
}

