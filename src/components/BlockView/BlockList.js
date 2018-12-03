import React, { Component } from 'react';
import axios from 'axios';
import Pagination from 'react-paginate';
import styles from './styles.css';
import {Table} from 'reactstrap'; 
import { NavLink } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import { connect } from 'react-redux'; 
import * as Constants from '../../constants/constants';
import BlockApi from '../../api/BlockApi';

class BlockList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			blocks: [], currentPage: 0, blockLength: 0, sortType: 'ASC', sortBy: 'default', bottom: 0, 
		};
	}

	componentDidMount() {
		let lower=0;
		let upper=1;
		axios.get('api/blocks/last', {
		}).then(response => {
			lower=response.data[0].block_number-(Constants.BLOCKS_PER_PAGE-1);
			upper=response.data[0].block_number;
			this.setState({blockLength: response.data[0].block_number});
			return axios.get(`api/blocks?start=${lower}&end=${upper}`);
		}).then(response => {
			this.setState({blocks: response.data.reverse(), lower, upper});
			return axios.get('api/blocks/length');
		}).catch(error => console.log('error fetching blocks: ', error));
	}

	loadNextBlocks(currentPage) {
		const requestedBlockRange = this.state.upper - (Constants.BLOCKS_PER_PAGE*currentPage);
		axios.get(`api/blocks?start=${requestedBlockRange-(Constants.BLOCKS_PER_PAGE-1)}&end=${requestedBlockRange}`, {
		}).then(response => {
			this.setState({blocks: response.data.reverse()});
		}).catch(error => console.log('error fetching blocks'));
	}

	loadNextSortedBlocks(currentPage, sortType) {
		const colType = this.state.sortBy;
		const x = ((this.state.bottom + (Constants.BLOCKS_PER_PAGE*currentPage)) <= this.state.upper ) ? this.state.bottom + (Constants.BLOCKS_PER_PAGE*currentPage) : this.state.upper;
		const y = (Constants.BLOCKS_PER_PAGE-1);

		BlockApi.getSortedBlocks(colType, sortType, x, y, this.state.blockLength).then((response) => {
			this.setState({blocks: response.data});
		}).catch(error => console.log('error fetching blocks'));
	}

	changePage(index) {
		this.setState({currentPage: index.selected});
		if(this.state.sortBy === 'default')
			this.loadNextBlocks(index.selected);
		else
			this.loadNextSortedBlocks(index.selected, this.state.sortType);
	}

	refreshPagination (data) {
		this.setState({pagesCount: Math.ceil(data.length / this.state.pageSize) });
		this.setState({currentPage: 0});
	}

	getWitnessName(witnessId) {
		return this.props.witnesses.find(el => el.account_id === witnessId).account_name;
	}

	async sortByColumn(colType) {
		// Update block length for pagination
		// const updateLength = await axios.get('api/blocks/last');
		// this.setState({blockLength: updateLength.data[0].block_number});

		let sortType = this.state.sortType;
		let requestedBlockRange = 0;
		if(this.state.sortBy === colType)
		{
			sortType === 'DESC' ? sortType='ASC': sortType='DESC';
			requestedBlockRange = (this.state.bottom + (Constants.BLOCKS_PER_PAGE*this.state.currentPage) <= this.state.upper) ? this.state.bottom + (Constants.BLOCKS_PER_PAGE*this.state.currentPage) : this.state.upper ;
		}
		this.setState({sortType:sortType, sortBy:colType});
		/*sorts depending on the column type. Also does a lookup on the witness data which
		  stores the initial API call made when the component is loaded and witness rank is calculated.
		the witness rank is the appended to the data coming in from the sort API call.*/
		BlockApi.getSortedBlocks(colType, sortType, requestedBlockRange, Constants.BLOCKS_PER_PAGE-1, this.state.blockLength).then((response) => {
			this.onSearch(response.data);
		}).catch(error => console.log('error fetching blocks'));
	}

	onSearch(data) {
		var temp_data = [];
		temp_data = data;
		this.setState({ blocks: temp_data });
	}

	render() {
		const {blocks, blockLength} = this.state;
		let nextStyle = `${styles['pagination']} page-item`;
		if (this.state.currentPage === Math.floor(blockLength/Constants.BLOCKS_PER_PAGE)) {
			nextStyle = `${styles['pagination']} page-item disabled`;
		}
		return (
			<div className="container pt-1 pb-5 mt-4">
				
				<div className="card-block">


					<h1 className={`${styles['header-contrast-text']} ${styles['header-background']} display-5 text-center pt-3 pb-3`}>
						<span className="fa fa-cubes">&nbsp;</span> Browse Blocks</h1>
					<Table responsive>
						<thead className={`${styles['header-contrast-text']} ${styles['blocks-header']}  ${styles['text-center']}`}>
							<tr>
								<th onClick={this.sortByColumn.bind(this, 'block_number')}>Height</th>
								<th onClick={this.sortByColumn.bind(this, 'timestamp')}>Time</th>
								<th onClick={this.sortByColumn.bind(this, 'witness')} scope="col">Witness</th>
								<th onClick={this.sortByColumn.bind(this, 'transaction_count')}>Transactions</th>
								<th onClick={this.sortByColumn.bind(this, 'operation_count')}>Operations</th>
							</tr>
						</thead>
						<tbody className="text-center">
							{blocks.map((block) => {
								return(
									<tr key={block.id}>
										<td><NavLink tag={RRNavLink} to={`/block-view/${block.block_number}`}>{block.block_number}</NavLink></td>
										<td>{new Date(block.timestamp).toLocaleTimeString()}</td>
										<td><NavLink tag={RRNavLink} to={`/accountAllDetail/${this.getWitnessName(block.witness)}/${block.witness}`}>{this.getWitnessName(block.witness)}</NavLink></td>
										<td>{block.transaction_count}</td>
										<td>{block.operation_count}</td>
									</tr>
								);
							})}
						</tbody>
					</Table>
					<Pagination
						activeClassName="active"
						disabledClassName="disabled"
						breakClassName={`${styles['pagination']}`}
						breakLabel={<a className="page-link">...</a>}
						pageClassName={`${styles['pagination']} page-item`}
						previousClassName={`${styles['pagination']} page-item`}
						nextClassName={nextStyle}
						pageLinkClassName="page-link"
						previousLinkClassName="page-link"
						nextLinkClassName="page-link"
						pageCount={blockLength/Constants.BLOCKS_PER_PAGE}
						pageRangeDisplayed={2}
						forcePage={this.state.currentPage}
						onPageChange={this.changePage.bind(this)}
						nextLabel="»"
						previousLabel="«"
          				/>
				</div>
				
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	witnesses: state.witnesses.witnessList
});

export default connect(mapStateToProps)(BlockList);