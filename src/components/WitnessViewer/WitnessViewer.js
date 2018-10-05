import React, { Component, Fragment } from 'react';
import WitnessRow from './WitnessRow';
import axios from 'axios';
import styles from './styles.css';
import PaginationCall from '../Account/PaginationCall';
import { Input, InputGroup} from 'reactstrap';
import { connect } from 'react-redux'; 

class WitnessViewer extends Component {
	constructor(props) {
		super(props);
		this.state = {witnessData: this.props.witnesses, searchData: this.props.witnesses, witness: '', currentPage: 0, pageSize: 3, pagesCount: 0, sortType: 'DESC'};
		this.gridHeight = 40;
	}

	componentDidMount() {
		this.fetchData();
		this.props.calculateComponentHeight(this.props.id, this.gridHeight);
	}

	fetchData() {
		this.refreshPagination(this.props.witnesses);
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

	sortByColumn(colType) {
		this.changeSortType();
		/*sorts depending on the column type. Also does a lookup on the witness data which
		  stores the initial API call made when the component is loaded and witness rank is calculated.
		the witness rank is the appended to the data coming in from the sort API call.*/
		axios.get(`api/witnesses?sort=${colType}&direction=${this.state.sortType}`, {
		}).then(response => {
			let sortedWitnessData = response.data;
			sortedWitnessData = sortedWitnessData.map(object => {
				const rankObject = this.state.witnessData.find(el => el.id === object.id);
				return rankObject;
			});
			this.setState({searchData: sortedWitnessData});
			this.refreshPagination(sortedWitnessData);
		}).catch(error => {console.log('error fetching witness data', error);});
	}

	changeSortType() {
		this.state.sortType === 'DESC' ? this.setState({sortType: 'ASC'}) : this.setState({sortType: 'DESC'});
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
					<thead className={`${styles['clickable']} thead-light`}>
						<tr>
							<th onClick={this.sortByColumn.bind(this, 'total_votes')} scope="col">Rank</th>
							<th onClick={this.sortByColumn.bind(this, 'account_name')} scope="col">Witness</th>
							<th onClick={this.sortByColumn.bind(this, 'total_votes')} scope="col">Votes</th>
							<th onClick={this.sortByColumn.bind(this, 'total_missed')} scope="col">Misses</th>
							<th onClick={this.sortByColumn.bind(this, 'url')} scope="col">URL</th>
						</tr>
					</thead>
					<tbody>
						{searchData.slice( currentPage * pageSize, (currentPage + 1) * pageSize).map((witness) => {
							return <WitnessRow
								key={witness.id}
								rank={witness.rank}
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
		debugger;
		return (
			<Fragment>
				<table className="table">
					<thead className="thead-light">
						<tr>
							<th onClick={this.sortByColumn.bind(this, 'total_votes')} scope="col">Rank</th>
							<th onClick={this.sortByColumn.bind(this, 'account_name')} scope="col">Witness</th>
							<th onClick={this.sortByColumn.bind(this, 'total_votes')} scope="col">Votes</th>
							<th onClick={this.sortByColumn.bind(this, 'total_missed')} scope="col">Misses</th>
							<th onClick={this.sortByColumn.bind(this, 'url')} scope="col">URL</th>
						</tr>
					</thead>
					<tbody>
						{witnessData.slice(0, 5).map((witness) => {
							return <WitnessRow
								key={witness.id}
								rank={witness.rank}
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

const mapStateToProps = (state) => ({
	witnesses: state.witnesses.witnessList
});

export default connect(mapStateToProps)(WitnessViewer);