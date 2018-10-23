/* Account page includes pagination */
import React, { Component } from 'react';
import AccountDetail from './AccountDetail';
import PaginationCall from './PaginationCall';
import { Input, InputGroup } from 'reactstrap';
import { connect } from 'react-redux';
import styles from '../WitnessViewer/styles.css';
import axios from 'axios';

class AccountSearch extends Component {
	constructor(e) {
		super(e);
		this.state = {
			data: (this.props.accounts) ? this.props.accounts : [],
			temp_data: (this.props.accounts) ? this.props.accounts : [],
			account : '',
			currentPage: 0,
			pageSize: 3,
			pagesCount: 0,
			sortType: 'DESC',
			sortBy: 'account_name',
		};
		this.gridHeight = 43;
		//pagination set page length
		this.onAccountEnter = this.onAccountEnter.bind(this);
	}

	componentDidMount() {
		this.findData();
		if(this.props.id !== '') {
			this.props.calculateComponentHeight(this.props.id, this.gridHeight);
		}
	}
	
	componentDidUpdate(prevProps) {        
		if(prevProps.accounts !== this.props.accounts)            
			this.setState({data: this.props.accounts, temp_data: this.props.accounts});    
	}

	findData() {
		var info = (this.props.accounts === undefined || this.props.accounts.length === 0) ? [] : this.props.accounts;
		this.refreshPagination(info);
	}

	refreshPagination (data) {
		this.setState({pagesCount: Math.ceil(data.length / this.state.pageSize) });
		this.setState({currentPage: 0});
	}

	onAccountEnter(e) {
		e.preventDefault();
		this.setState({ account: e.target.value });
		this.findAccount(e.target.value, this.state.data);
	}

	findAccount(accountName, data) {
		var temp_data = [];
		temp_data = data.filter(obj => {
			return obj.account_name.includes(accountName);
		  });
		this.setState({ temp_data: temp_data });
		this.refreshPagination(temp_data);
	}

	changePage(e, index) {
		e.preventDefault();
		this.setState({ currentPage: index });
	}

	sortByColumn(colType) {
		let sortType = this.state.sortType;
		if(this.state.sortBy === colType)
		{
			sortType === 'DESC' ? sortType='ASC': sortType='DESC';
		}
		this.setState({sortType:sortType, sortBy:colType});
		/*sorts depending on the column type. Also does a lookup on the witness data which
		  stores the initial API call made when the component is loaded and witness rank is calculated.
		the witness rank is the appended to the data coming in from the sort API call.*/
		axios.get(`/api/accounts?sort=${colType}&direction=${sortType}`, {
		}).then(response => {
			this.findAccount(this.state.account, response.data);
		}).catch(error => {console.log('error fetching witness data', error);});
	}

	render() {
		const { temp_data, account, currentPage, pageSize } = this.state;
		
		return(
			<div className="table-responsive">
				<div className="pagination-wrapper">
					<InputGroup>
						<Input type="text" value={account} onChange={this.onAccountEnter.bind(this)} placeholder="Account" />
					</InputGroup>
					<PaginationCall currentPage={currentPage} handleClick={this.changePage.bind(this)} pagesCount={this.state.pagesCount} />
				</div>
				<table className="table">
					<thead className={`${styles['clickable']} thead-light`}>
						<tr>
							<th onClick={this.sortByColumn.bind(this, 'account_name')} scope="col">Account Name</th>
							<th onClick={this.sortByColumn.bind(this, 'account_id')} scope="col">Account ID</th>
							<th onClick={this.sortByColumn.bind(this, 'referrer')} scope="col">Referrer</th>
						</tr>
					</thead>
					<tbody>
						{temp_data && temp_data.slice( currentPage * pageSize, (currentPage + 1) * pageSize).map((account, i) =>
							<AccountDetail detail={account} key={i}/>
						)}
					</tbody>
				</table>{temp_data.length===0 && <div> No Accounts Found </div>}
			</div>
		);
	}	
}

AccountSearch.defaultProps = {
	id: '',
};

const mapStateToProps = (state) => ({
	accounts: state.accounts.accountList
});

export default connect(mapStateToProps)(AccountSearch);