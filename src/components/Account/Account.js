/* Account page includes pagination */
import React, { Component } from 'react';
import axios from 'axios'; //remove comment when API is completed
import AccountDetail from './AccountDetail';
import PaginationCall from './PaginationCall';
import { Input, InputGroup, InputGroupAddon, Button } from 'reactstrap';

export default class AccountSearch extends Component {
	constructor(e) {
		super(e);
		this.data=[];
		this.state = {
			data: [],
			account : '',
			temp_data: this.data,
			currentPage: 0
		};
		//pagination set page length
		this.pageSize = 3;
		this.pagesCount = Math.ceil(this.data.length / this.pageSize);
		this.onAccountEnter = this.onAccountEnter.bind(this);
		this.searchAccount = this.searchAccount.bind(this);
		this.findAccount = this.findAccount.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.findData = this.findData.bind(this);
		this.refreshPagination = this.refreshPagination.bind(this);
	}

	refreshPagination () {this.pagesCount = Math.ceil(this.data.length / this.pageSize);}

	findData(e) {
		//API call to search for Account
		axios.get('http://localhost:5000/api/accounts/', {
		}).then(response => {
			this.setState({ data: response.data });
			this.data = response.data;
			this.findAccount(this.state.account, this.state.data);
		}).catch(error => {console.log('error is fetching account data', error);});
	}

	componentDidMount() {
		this.findData();
	  }

	handleClick(e, index) {
		e.preventDefault();
		this.setState({ currentPage: index  });
	}

	onAccountEnter(e) {
		this.setState({ account: e.target.value });
	}

	searchAccount(e) {
		if (e) e.preventDefault();
		this.findAccount(this.state.account, this.state.data);
		e.currentTarget.reset();
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
		this.data = temp_data;
		this.refreshPagination();
	}

	render() {
		const { currentPage } = this.state;

		return(
			<div className="table-responsive">
				<div className="pagination-wrapper">
					<form onSubmit={this.searchAccount}>
						<InputGroup>
							<Input type="text" value={this.state.account} onChange={this.onAccountEnter} placeholder="Account" />
							<InputGroupAddon addonType="append"><Button>Search Account</Button></InputGroupAddon>
						</InputGroup>
					</form>
					<PaginationCall currentPage={currentPage} handleClick={this.handleClick} pagesCount={this.pagesCount} />
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
						{this.state.temp_data.slice( currentPage * this.pageSize, (currentPage + 1) * this.pageSize).map((account, i) =>
							<AccountDetail detail={account} key={i}/>
						)}
					</tbody>
				</table>
			</div>
		);
	}	
}
