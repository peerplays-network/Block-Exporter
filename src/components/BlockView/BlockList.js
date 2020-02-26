import React, { Component } from 'react';
import styles from './styles.css';
import { Link, Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel, TablePagination, Card} from '@material-ui/core';
import { connect } from 'react-redux';
import * as Constants from '../../constants/constants';
import BlockApi from '../../api/BlockApi';

class BlockList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			blocks: [], currentPage: 0, rowsPerPage: 10, blockLength: 0, sortType: 'ASC', sortBy: 'default'
		};
	}

	async componentDidMount() {
		let lower=0;
		let upper=1;
		try {
			const last = await BlockApi.getLastBlock();
			lower = last.data[0].block_number-(Constants.BLOCKS_PER_PAGE-1);
			upper = last.data[0].block_number;
	
			const blocks = await BlockApi.getBlocks(lower, upper);
			this.setState({blockLength: upper, blocks: blocks.data.reverse(), lower, upper});
		  } catch(error) {
			console.warn(error);
		  }
	}

	loadNextBlocks(currentPage) {
		const requestedBlockRange = this.state.upper - (Constants.BLOCKS_PER_PAGE*currentPage);
		console.log('(', requestedBlockRange-(Constants.BLOCKS_PER_PAGE-1), ',', requestedBlockRange, ')');
		BlockApi.getBlocks(requestedBlockRange-(Constants.BLOCKS_PER_PAGE-1), requestedBlockRange).then(response => {
			console.log('loading next blocks: ', response.data.reverse());
			this.setState({blocks: response.data.reverse()});
		}).catch(error => console.log('error fetching blocks'));
	}

	loadNextSortedBlocks(currentPage, sortType) {
		const colType = this.state.sortBy;
		const x = ((this.state.bottom + (Constants.BLOCKS_PER_PAGE*currentPage)) <= this.state.upper ) ? this.state.bottom + (Constants.BLOCKS_PER_PAGE*currentPage) : this.state.upper;
		const y = (Constants.BLOCKS_PER_PAGE-1);

		BlockApi.getBlocksLimited(colType, sortType, x, y, this.state.blockLength).then((response) => {
			this.setState({blocks: response.data});
		}).catch(error => console.log('error fetching blocks'));
	}

	changePage = (e, index) => {
		e.preventDefault();
		this.setState({currentPage: index});
		if (this.state.sortBy === 'default') {
			console.log('deafult');
			this.loadNextBlocks(index);
		}
		else {
			console.log('not default');
			this.loadNextSortedBlocks(index, this.state.sortType);
		}
	}

	getWitnessName(witnessId) {
		if (this.props.witnesses) {
			return this.props.witnesses.find(el => el.account_id === witnessId).account_name;
		}
	}

	sortByColumn(colType) {
		// Update block length for pagination
		// const updateLength = await axios.get('api/blocks/last');
		// this.setState({blockLength: updateLength.data[0].block_number});

		let sortType = this.state.sortType;
		if(this.state.sortBy === colType)
		{
			sortType === 'DESC' ? sortType='ASC': sortType='DESC';
		}
		this.setState({sortType:sortType, sortBy:colType, currentPage: 0});
		/*sorts depending on the column type. Also does a lookup on the witness data which
		  stores the initial API call made when the component is loaded and witness rank is calculated.
		the witness rank is the appended to the data coming in from the sort API call.*/
		BlockApi.getBlocksLimited(colType, sortType, 0, Constants.BLOCKS_PER_PAGE-1, this.state.blockLength).then((response) => {
			this.onSearch(response.data);
		}).catch(error => console.log('error fetching blocks'));
	}

	onSearch(data) {
		let temp_data = [];
		temp_data = data;
		this.setState({ blocks: temp_data });
	}

	changeRowsPerPage = event => {
		this.setState({rowsPerPage: event.target.value});
		this.changePage(0);
	};

	render() {
		const {blocks, blockLength, sortBy, currentPage, rowsPerPage} = this.state;
		console.log('blocks: ', blocks);
		return (
			<div className="container pt-1 pb-5 mt-4">
				<Card>
					<h1 className={`${styles['header-contrast-text']} ${styles['header-background']} display-5 text-center pt-3 pb-3`}>
						<span className="fa fa-cubes">&nbsp;</span> Browse Blocks</h1>
					<Table stickyHeader>
						<TableHead className={`${styles['header-contrast-text']} ${styles['blocks-header']}  ${styles['text-center']}`}>
							<TableRow>
								<TableCell>
									<TableSortLabel
										active={sortBy === 'block_number'}
										direction={sortBy}
										onClick={() => this.props.sortByColumn('block_number')}>
										Height
  								</TableSortLabel>
								</TableCell>
								<TableCell>
									<TableSortLabel
										active={sortBy === 'timestamp'}
										direction={sortBy}
										onClick={() => this.props.sortByColumn('timestamp')}>
										Time
  								</TableSortLabel>
								</TableCell>
								<TableCell>
									<TableSortLabel
										active={sortBy === 'witness'}
										direction={sortBy}
										onClick={() => this.props.sortByColumn('witness')}>
										Witness
  								</TableSortLabel>
								</TableCell>
								<TableCell>
									<TableSortLabel
										active={sortBy === 'transaction_count'}
										direction={sortBy}
										onClick={() => this.props.sortByColumn('transaction_count')}>
										Transactions
  								</TableSortLabel>
								</TableCell>
								<TableCell>
									<TableSortLabel
										active={sortBy === 'operations_count'}
										direction={sortBy}
										onClick={() => this.props.sortByColumn('operations_count')}>
										Operations
  								</TableSortLabel>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody className="text-center">
							{blocks.map((block) => {
								return(
									<TableRow hover key={block.id}>
										<TableCell><Link href={`/block-view/${block.block_number}`}>{block.block_number}</Link></TableCell>
										<TableCell>{new Date(block.timestamp).toLocaleTimeString()}</TableCell>
										<TableCell><Link href={`/accountAllDetail/${this.getWitnessName(block.witness)}/${block.witness}`}>{this.getWitnessName(block.witness)}</Link></TableCell>
										<TableCell>{block.transaction_count}</TableCell>
										<TableCell>{block.operation_count}</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
					<TablePagination
						rowsPerPageOptions={[5, 10, 20]}
						component="div"
						count={blockLength}
						rowsPerPage={rowsPerPage}
						page={currentPage}
						onChangePage={this.changePage}
						onChangeRowsPerPage={this.changeRowsPerPage}
					/>
					{/* <Pagination
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
          				/> */}
				</Card>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	witnesses: state.witnesses.witnessList
});

export default connect(mapStateToProps)(BlockList);