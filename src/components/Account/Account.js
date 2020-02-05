/* Account page includes pagination */
import React, { Component } from 'react';
import AccountDetail from './AccountDetail';
import PaginationCall from './PaginationCall';
import { Input, InputGroup } from 'reactstrap';
import {Table, TableBody, TableHead, TableRow, TableCell, TableSortLabel} from '@material-ui/core';
import { connect } from 'react-redux';
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
			sortType: 'desc',
			sortBy: 'account_name',
		};

		this.gridHeight = 24;
		//pagination set page length
		this.onAccountEnter = this.onAccountEnter.bind(this);
	}

	componentDidMount() {
		this.findData();
	}
	
	componentDidUpdate(prevProps) {        
		if(prevProps.accounts !== this.props.accounts) {           
			this.setState({data: this.props.accounts, temp_data: this.props.accounts});
			// this.refreshPagination(this.props.accounts);    
		}

		if(this.props.id !== '' && this.props.visible !== prevProps.visible) {
			this.props.calculateComponentHeight(this.props.id, this.gridHeight);
		}
	}

	findData() {
		let info = (this.props.accounts === undefined || this.props.accounts.length === 0) ? [] : this.props.accounts;
		this.sortByColumn('account_name');
		// this.refreshPagination(info);
	}

	refreshPagination(data) {
		this.setState({pagesCount: Math.ceil(data.length / this.state.pageSize) });
		this.setState({currentPage: 0});
	}

	onAccountEnter(e) {
		e.preventDefault();
		this.setState({ account: e.target.value });
		this.onSearchAccount(e.target.value, this.state.data);
	}

	onSearchAccount(value, data) {
		if(value.includes('1.2.'))
			this.findAccountById(value, data);
		else
			this.findAccountByName(value, data);
	}

	findAccountByName(accountName, data) {
		let temp_data = [];
		temp_data = data.filter(obj => {
			return obj.account_name.includes(accountName);
		  });
		this.setState({ temp_data: temp_data });
		this.refreshPagination(temp_data);
	}

	findAccountById = (accountId, data) =>{
		let temp_data = [];
		console.log('data', data);
		temp_data = data.filter(obj => {
			console.log('obj', obj);
			return obj.account_id.includes(accountId);
		  });
		this.setState({ temp_data: temp_data });
		this.refreshPagination(temp_data);
	}

	changePage = (e, index) => {
		e.preventDefault();
		this.setState({ currentPage: index });
	}

	sortByColumn = (colType) => {
		let sortType = this.state.sortType;
		if(this.state.sortBy === colType)
		{
			sortType === 'desc' ? sortType='asc': sortType='desc';
		}

		this.setState({sortType:sortType, sortBy:colType});
		/*sorts depending on the column type. Also does a lookup on the witness data which
		  stores the initial API call made when the component is loaded and witness rank is calculated.
		the witness rank is the appended to the data coming in from the sort API call.*/
		axios.get(`/api/accounts?sort=${colType}&direction=${sortType.toUpperCase()}`, {
		}).then(response => {
			this.onSearchAccount(this.state.account, response.data);
		}).catch(error => {console.log('error fetching witness data', error);});
	}

	//generates table headers
	generateTableHeaders = () => {
		const headCells = [
			{id: 'account_id', label: 'Account Id'},
			{id: 'account_name', label: 'Account Name'},
			{id: 'referrer', label: 'Referer'}
		]

		const {sortBy, sortType} = this.state;

		return (
			<TableRow>
				{headCells.map(headCell => (
					<TableCell key={headCell.id} sortDirection={sortType}>
						<TableSortLabel
							active={sortBy === headCell.id}
							direction={sortType}
							onClick={() => this.sortByColumn(headCell.id)}>
							{headCell.label}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		);
	}

	render() {
		const { temp_data, account, currentPage, pageSize, sortType, sortBy } = this.state;
		
		return(
			<div className="">
				
				{!!this.props.history ? // browse all account page
					<div className="">
						<div className="">
							<InputGroup>
								<Input type="text" value={account} onChange={this.onAccountEnter.bind(this)} placeholder="Account" />
							</InputGroup>
							<PaginationCall currentPage={currentPage} handleClick={this.changePage.bind(this)} pagesCount={this.state.pagesCount} />
						</div>

					
						<h1 className="">
							<span className="fa fa-user-alt">&nbsp;</span> Browse Accounts</h1>
					
						
						<Table className="table" >
							<TableHead className={''}>
									{this.generateTableHeaders()}
									{/* <TableCell scope="col">Account Name</TableCell>
									<TableSortLabel active={sortBy === 'account_name'} direction={sortType} onClick={createSortHandler(headCell.id)}></TableSortLabel>
									<TableCell active={sortBy === 'account_id'} onClick={this.sortByColumn.bind(this, 'account_id')} scope="col">Account ID</TableCell>
									<TableCell active={sortBy === 'account_id'} onClick={this.sortByColumn.bind(this, 'referrer')} scope="col">Referrer</TableCell> */}
							</TableHead>
							<TableBody>
								{temp_data && temp_data.slice( currentPage * pageSize, (currentPage + 1) * pageSize).map((account, i) =>
								<AccountDetail detail={account} key={i}/>
								)}
							</TableBody>
						</Table>{temp_data.length===0 && <div> No Accounts Found </div>}

					</div>

					: 
					// account feed widget
					<div className="container">
						<div className="pagination-wrapper">
							<InputGroup>
								<Input type="text" value={account} onChange={this.onAccountEnter.bind(this)} placeholder="Account" />
							</InputGroup>
							<PaginationCall currentPage={currentPage} handleClick={this.changePage.bind(this)} pagesCount={this.state.pagesCount} />
						</div>

						<Table className="" >
							<TableHead className={''}>
								<TableRow>
									<TableCell onClick={this.sortByColumn.bind(this, 'account_name')} scope="col">Account Name</TableCell>
									<TableCell onClick={this.sortByColumn.bind(this, 'account_id')} scope="col">Account ID</TableCell>
									<TableCell onClick={this.sortByColumn.bind(this, 'referrer')} scope="col">Referrer</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{temp_data && temp_data.slice( currentPage * pageSize, (currentPage + 1) * pageSize).map((account, i) =>
									<AccountDetail detail={account} key={i}/>
								)}
							</TableBody>
						</Table>{temp_data.length===0 && <div> No Accounts Found </div>}

					</div>

				// end of account feed widget
				}



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