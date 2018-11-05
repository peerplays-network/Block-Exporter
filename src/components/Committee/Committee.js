import React, { Component, Fragment } from 'react';
import CommitteeRow from './CommitteeRow';
import axios from 'axios';
import styles from './styles.css';
import PaginationCall from '../Account/PaginationCall';
import { Input, InputGroup} from 'reactstrap';
import { connect } from 'react-redux'; 

class Committee extends Component {
	constructor(props) {
		super(props);
		this.state = {committeeData: [], searchData: [], committee: '', currentPage: 0, pageSize: 3, pagesCount: 0, sortType: 'ASC', sortBy: 'rank'};
		this.gridHeight = 40;
	}

	componentDidMount() {
		axios.get('/api/committee', {
		}).then(response => {
			this.setState({committeeData: response.data});
			const newState = response.data;
			newState.map( (el, index) => {return el.rank = index+1;});
			newState.map(el => {return el.account_name = this.props.accounts.find(account => account.account_id === el.committee_member_account).account_name;});

			this.setState({searchData: newState});
			this.refreshPagination(response.data);
		}).catch(error => {
			console.log('error', error);
		});

		if(this.props.history ===undefined)
			this.props.calculateComponentHeight(this.props.id, this.gridHeight);
	}

	componentDidUpdate(prevProps, prevState) {
		if(this.state.committee !== prevState.committee && this.state.committee.length < 1) {
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
		var temp_data = [];
		temp_data = data.filter(obj => {
			return obj.account_name.includes(committee);
		  });
		this.setState({ searchData: temp_data });
		this.refreshPagination(temp_data);
	}

	findAccountById(committee, data) {
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

	sortSearch(committee, data) {
		if(committee.includes('1.5.'))
			this.findAccountById(committee, data);
		else
			this.findAccountByName(committee, data);
	}

	sortByColumn(colType) {
		let sortType = this.state.sortType;

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
			//this.setState({searchData: sortedcommitteeData});
			this.sortSearch(this.state.committee, sortedcommitteeData);
			//this.refreshPagination(sortedcommitteeData);
		}).catch(error => {console.log('error fetching committee data', error);});
	}

	getAccountName(accountId) {
		return !!this.props.accounts? this.props.accounts.find(el => el.account_id === accountId).account_name : '';
	}

	sortByRank() {
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
			<div>
				{!!this.props.history ? // browse all account page
					<div className="container pt-0 pb-5 mt-5">
						<Fragment>
							<div className="pagination-wrapper"> 
								<InputGroup>
									<Input type="text" value={committee} onChange={this.onCommitteeEnter.bind(this)} placeholder="Committee Name or Id" />
								</InputGroup>
								<PaginationCall currentPage={currentPage} handleClick={this.changePage.bind(this)} pagesCount={this.state.pagesCount} />
							</div>
							<h1 className={`${styles['header-contrast-text']} ${styles['header-background']} display-5 text-center pt-2 pb-3 mt-0`}>
								<span className="fa fa-address-card">&nbsp;</span>Browse Committee Members</h1>
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
											committee_name = {committee.account_name}
											committee={committee.committee_id}
											votes={committee.total_votes}
											url={committee.url}
											account_id={committee.committee_member_account}
										/>;
									})}
								</tbody>}
							</table>{searchData.length===0 && <div> No Committee Members Found </div>}
						</Fragment>
					</div>

					:// committee widget

					<div className="container pt-0 pb-5 mt-0">
						<Fragment>
							<div className="pagination-wrapper"> 
								<InputGroup>
									<Input type="text" value={committee} onChange={this.onCommitteeEnter.bind(this)} placeholder="Committee Name or Id" />
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
											committee_name = {committee.account_name}
											committee={committee.committee_id}
											votes={committee.total_votes}
											url={committee.url}
											account_id={committee.committee_member_account}
										/>;
									})}
								</tbody>}
							</table>{searchData.length===0 && <div> No Committee Members Found </div>}
						</Fragment>
					</div>
				}
			</div>
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
								committee_name = {this.getAccountName(committee.committee_member_account)}
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

const mapStateToProps = (state) => ({
	accounts: state.accounts.accountList
});

export default connect(mapStateToProps)(Committee);