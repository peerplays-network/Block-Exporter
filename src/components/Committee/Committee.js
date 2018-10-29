import React, { Component, Fragment } from 'react';
import CommitteeRow from './CommitteeRow';
import axios from 'axios';
import styles from './styles.css';
import PaginationCall from '../Account/PaginationCall';
import { Input, InputGroup} from 'reactstrap';

class Committee extends Component {
	constructor(props) {
		super(props);
		this.state = {committeeData: [], searchData: [], committee: '', currentPage: 0, pageSize: 3, pagesCount: 0, sortType: 'ASC', sortBy: 'rank'};
		this.gridHeight = 40;
	}

	componentDidMount() {
		debugger;
		axios.get('/api/committee', {
		}).then(response => {
			this.setState({committeeData: response.data});
			const newState = response.data;
			response.data.map( (el, index) => {return el.rank = index+1;});
			// newState = response.data.sort((a, b) => (a.rank > b.rank) ? 1 : ((b.rank > a.rank) ? -1 : 0)).reverse();
			// if(this.state.sortType === 'ASC')
			// {
			// 	newState = newState.reverse();
			// }

			this.setState({searchData: newState});
			this.refreshPagination(response.data);
		}).catch(error => {
			console.log('error', error);
		});

		this.props.calculateComponentHeight(this.props.id, this.gridHeight);
	}

	componentDidUpdate(prevProps, prevState) {
		debugger;
		if(this.state.committee !== prevState.committee && this.state.committee.length < 1) {
			debugger;
			this.setState({searchData: this.state.committeeData});
			this.refreshPagination(this.state.committeeData);
		}
	}

	refreshPagination(data) {
		this.setState({pagesCount: Math.ceil(data.length / this.state.pageSize) });
		this.setState({currentPage: 0});
	}

	onCommitteeEnter(e) {
		e.preventDefault();
		this.setState({committee: e.target.value});
		if(e.target.value.includes('1.5.'))
			this.findAccountById(e.target.value, this.state.committeeData);
		else
			this.findAccountByName(e.target.value, this.state.committeeData);
	}

	findAccountByName(committee, data) {
		// var temp_data = [];
		// temp_data = data.filter(obj => {
		// 	return obj.account_name.includes(committee);
		//   });
		// this.setState({ searchData: temp_data });
		// this.refreshPagination(temp_data);
	}

	findAccountById(committee, data) {
		debugger;
		var temp_data = [];
		temp_data = data.filter(obj => {
			return obj.committee_id === (committee);
		  });
		this.setState({ searchData: temp_data });
		this.refreshPagination(temp_data);
	}

	changePage(e, index) {
		e.preventDefault();
		this.setState({ currentPage: index  });
	}

	sortByColumn(colType) {
		let sortType = this.state.sortType;

		debugger;
		if(this.state.sortBy === colType)
		{
			sortType === 'DESC' ? sortType='ASC': sortType='DESC';
		}
		this.setState({sortType:sortType, sortBy:colType});
		/*sorts depending on the column type. Also does a lookup on the committee data which
		  stores the initial API call made when the component is loaded and committee rank is calculated.
		the committee rank is the appended to the data coming in from the sort API call.*/
		axios.get(`api/committee?sort=${colType}&direction=${sortType}`, {
		}).then(response => {
			let sortedcommitteeData = response.data;
			sortedcommitteeData = sortedcommitteeData.map(object => {
				const rankObject = this.state.committeeData.find(el => el.id === object.id);
				return rankObject;
			});
			this.setState({searchData: sortedcommitteeData});
			this.refreshPagination(sortedcommitteeData);
		}).catch(error => {console.log('error fetching committee data', error);});
	}

	sortByRank() {
		debugger;
		let sortType = this.state.sortType;
		if(this.state.sortBy === 'rank')
		{
			sortType === 'DESC' ? sortType='ASC': sortType='DESC';
		}
		let newState = this.state.searchData.sort((a, b) => (a.rank > b.rank) ? 1 : ((b.rank > a.rank) ? -1 : 0)).reverse();
		
		if(this.state.sortType === 'ASC')
		{
			newState = newState.reverse();
		}
		this.setState({searchData: newState, sortType:sortType, sortBy:'rank'});
	}

	renderBigTable() {
		const { currentPage, committee, searchData, pageSize } = this.state;

		return (
			<Fragment>
				<div className="pagination-wrapper"> 
					<InputGroup>
						<Input type="text" value={committee} onChange={this.onCommitteeEnter.bind(this)} placeholder="Committee Id" />
					</InputGroup>
					<PaginationCall currentPage={currentPage} handleClick={this.changePage.bind(this)} pagesCount={this.state.pagesCount} />
				</div>
				<table className="table">
					<thead className={`${styles['clickable']} ${styles['header-contrast-text']} ${styles['header-contrast-text']} ${styles['witness-header']}`}>
						<tr>
							<th onClick={this.sortByRank.bind(this)} scope="col">Rank</th>
							<th onClick={this.sortByColumn.bind(this, 'committee_id')} scope="col">Committee Member</th>
							<th onClick={this.sortByColumn.bind(this, 'total_votes')} scope="col">Votes</th>
							<th onClick={this.sortByColumn.bind(this, 'url')} scope="col">URL</th>
						</tr>
					</thead>
					{searchData && <tbody>
						{searchData.slice( currentPage * pageSize, (currentPage + 1) * pageSize).map((committee) => {
							return <CommitteeRow
								key={committee.id}
								rank={committee.rank}
								committee={committee.committee_id}
								votes={committee.total_votes}
								url={committee.url}
								account_id={committee.committee_member_account}
							/>;
						})}
					</tbody>}
				</table>{searchData.length===0 && <div> No Committee Members Found </div>}
			</Fragment>
		);
	}

	renderSmallTable() {
		const {committeeData} = this.state;
		return (
			<Fragment>
				<table className="table">
					<thead className={`${styles['clickable']} thead-light`}>
						<tr>
							<th onClick={this.sortByRank.bind(this)} scope="col">Rank</th>
							<th onClick={this.sortByColumn.bind(this, 'committee_id')} scope="col">Committee Member</th>
							<th onClick={this.sortByColumn.bind(this, 'total_votes')} scope="col">Votes</th>
							<th onClick={this.sortByColumn.bind(this, 'url')} scope="col">URL</th>
						</tr>
					</thead>
					<tbody>
						{committeeData.slice(0, 5).map((committee) => {
							return <CommitteeRow
								key={committee.id}
								rank={committee.rank}
								committee={committee.committee_id}
								votes={committee.total_votes}
								url={committee.url}
								account_id={committee.committee_member_account}
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

export default Committee;