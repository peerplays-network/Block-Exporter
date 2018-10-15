/* Account page includes pagination */
import React, { Component } from 'react';
import AccountDetail from './AccountDetail';
import PaginationCall from './PaginationCall';
import { Input, InputGroup } from 'reactstrap';
import { connect } from 'react-redux';

class AccountSearch extends Component {
	constructor(e) {
		super(e);
		this.state = {
			data: (this.props.accounts) ? this.props.accounts : [],
			temp_data: (this.props.accounts) ? this.props.accounts : [],
			account : '',
			currentPage: 0,
			pageSize: 3,
			pagesCount: 0
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
		//if the data.id matches accountName add to data
		for (var account in data) {
			if (data[account].account_name.indexOf(accountName) >= 0 ) 
				temp_data.push(data[account]);
		}
		if (temp_data.length <= 0)
			temp_data = data;
		this.setState({ temp_data: temp_data });
		this.refreshPagination(temp_data);
	}

	changePage(e, index) {
		e.preventDefault();
		this.setState({ currentPage: index });
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
					<thead className="thead-light">
						<tr>
							<th>Account Name</th>
							<th>Account ID</th>
							<th>Referrer</th>
						</tr>
					</thead>
					<tbody>
						{temp_data.slice( currentPage * pageSize, (currentPage + 1) * pageSize).map((account, i) =>
							<AccountDetail detail={account} key={i}/>
						)}
					</tbody>
				</table>
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