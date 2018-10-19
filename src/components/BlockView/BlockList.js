import React, { Component } from 'react';
import axios from 'axios';
import Pagination from 'react-paginate';
import styles from './styles.css';
import {Table} from 'reactstrap'; 
import { NavLink } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import { connect } from 'react-redux'; 
import * as Constants from '../../constants/constants'; 

class BlockList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			blocks: [], currentPage: 0, blockLength: 0
		};
	}

	componentDidMount() {
		let lower=0;
		let upper=1;
		axios.get('api/blocks/last', {
		}).then(response => {
			lower=response.data[0].block_number-(Constants.BLOCKS_PER_PAGE-1);
			upper=response.data[0].block_number;
			return axios.get(`api/blocks?start=${lower}&end=${upper}`);
		}).then(response => {
			this.setState({blocks: response.data.reverse(), lower, upper});
			return axios.get('api/blocks/length');
		}).then(response => {
			this.setState({blockLength: response.data});
		}).catch(error => console.log('error fetching blocks: ', error));
	}

	loadNextBlocks(currentPage) {
		const requestedBlockRange = this.state.upper - (Constants.BLOCKS_PER_PAGE*currentPage);
		axios.get(`api/blocks?start=${requestedBlockRange-(Constants.BLOCKS_PER_PAGE-1)}&end=${requestedBlockRange}`, {
		}).then(response => {
			this.setState({ blocks: response.data.reverse() });
		}).catch(error => console.log('error fetching blocks'));
	 }

	changePage(index) {
		this.setState({currentPage: index.selected});
		this.loadNextBlocks(index.selected);
	}

	getWitnessName(witnessId) {
		return this.props.witnesses.find(el => el.account_id === witnessId).account_name;
	}

	render() {
		console.log('history', this.props.history);
		const {blocks, blockLength} = this.state;
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
								{blocks.map((block) => {
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
						<Pagination
							breakClassName={`${styles['pagination']}`}
							breakLabel={<a className="page-link">...</a>}
							pageClassName={`${styles['pagination']}`}
							previousClassName={`${styles['pagination']}`}
							nextClassName={`${styles['pagination']}`}
							pageLinkClassName="page-link"
							previousLinkClassName="page-link"
							nextLinkClassName="page-link"
							pageCount={blockLength/Constants.BLOCKS_PER_PAGE}
							pageRangeDisplayed={2}
							onPageChange={this.changePage.bind(this)}
          				/>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	witnesses: state.witnesses.witnessList
});

export default connect(mapStateToProps)(BlockList);
