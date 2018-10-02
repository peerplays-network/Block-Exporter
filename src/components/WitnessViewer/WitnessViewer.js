import React, { Component, Fragment } from 'react';
import WitnessRow from './WitnessRow';
import axios from 'axios';
import PaginationCall from '../Account/PaginationCall';
import { Input, InputGroup} from 'reactstrap'; 

class WitnessViewer extends Component {
	constructor(props) {
		super(props);
		this.state = {witnessData: [], searchData: [], witness: '', currentPage: 0, pageSize: 3, pagesCount: 0};
		this.gridHeight = this.props.size === 'small' ? 30 : 40;
	}

	componentDidMount() {
		this.fetchData();
		this.props.calculateComponentHeight(this.props.id, this.gridHeight);
	}

	fetchData() {
		//API call to search for witness
		axios.get('api/witnesses/', {
		}).then(response => {
			const sortedWitnessData = response.data.sort((a, b) => (a.total_votes > b.total_votes) ? 1 : ((b.total_votes > a.total_votes) ? -1 : 0));
			sortedWitnessData.map( (el, index) => {return el.index = index+1;});

			this.setState({witnessData: sortedWitnessData});
			this.setState({searchData: sortedWitnessData});
			this.refreshPagination(sortedWitnessData);
		}).catch(error => {console.log('error fetching witness data', error);});
	}

	refreshPagination (data) {
		this.setState({pagesCount: Math.ceil(data.length / this.state.pageSize) });
		this.setState({currentPage: 0});
	}

	onWitnessEnter(e) {
		e.preventDefault();
		this.setState({witness: e.target.value});
		this.findAccount(e.target.value, this.state.witnessData);
	}

	findAccount(witness, data) {
		var temp_data = [];
		//if the data.id matches witness name add to data
		for (var account in data) {
			if (data[account].account_name.indexOf(witness) >= 0 ) 
				temp_data.push(data[account]);
		}
		if (temp_data.length <= 0)
			temp_data = data;
		this.setState({ searchData: temp_data });
		//this.data = temp_data;
		this.refreshPagination(temp_data);
	}

	changePage(e, index) {
		e.preventDefault();
		this.setState({ currentPage: index  });
	}

	renderBigTable() {
		const { currentPage, witness, searchData, pageSize } = this.state;

		return (
			<Fragment>
				<div className="pagination-wrapper"> 
					<InputGroup>
						<Input type="text" value={witness} onChange={this.onWitnessEnter.bind(this)} placeholder="Account" />
					</InputGroup>
					<PaginationCall currentPage={currentPage} handleClick={this.changePage.bind(this)} pagesCount={this.state.pagesCount} />
				</div>
				<table className="table">
					<thead className="thead-light">
						<tr>
							<th scope="col">Rank</th>
							<th scope="col">Witness</th>
							<th scope="col">Votes</th>
							<th scope="col">Misses</th>
							<th scope="col">URL</th>
						</tr>
					</thead>
					<tbody>
						{searchData.slice( currentPage * pageSize, (currentPage + 1) * pageSize).map((witness) => {
							return <WitnessRow
								key={witness.id}
								rank={witness.index}
								witness={witness.account_name}
								votes={witness.total_votes}
								misses={witness.total_missed}
								lastBlock={witness.url}
							/>;
						})}
					</tbody>
				</table>
			</Fragment>
		);
	}

	renderSmallTable() {
		const {witnessData} = this.state;

		return (
			<Fragment>
				<table className="table">
					<thead className="thead-light">
						<tr>
							<th scope="col">Rank</th>
							<th scope="col">Witness</th>
							<th scope="col">Votes</th>
							<th scope="col">Misses</th>
							<th scope="col">URL</th>
						</tr>
					</thead>
					<tbody>
						{witnessData.slice(0, 5).map((witness, index) => {
							return <WitnessRow
								key={witness.id}
								rank={witness.index}
								witness={witness.account_name}
								votes={witness.total_votes}
								misses={witness.total_missed}
								lastBlock={witness.url}
							/>;
						})}
					</tbody>
				</table>
			</Fragment>
		);
	}
	
	render() {
		return (
			<div>
				{this.props.size === 'small' ? 
					this.renderSmallTable()
					:
					this.renderBigTable()
				}
			</div>
		);
	}
}

export default WitnessViewer;