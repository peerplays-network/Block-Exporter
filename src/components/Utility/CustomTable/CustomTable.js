import React, { Component } from 'react';
import axios from 'axios';
import AccountDetail from '../../Account/AccountDetail';
import {Table, TableBody, TableHead, TableRow, TableCell, TableSortLabel, TableContainer, TablePagination, InputAdornment, Input} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

class CustomTable extends Component {
  state = {
  	searchText : '',
  	currentPage: 0,
  	rowsPerPage: 5,
  	pagesCount: 0,
  	sortType: 'desc',
  	sortBy: '',
  	filteredData: ''
    
  }

	changePage = (e, index) => {
		e.preventDefault();
		this.setState({ currentPage: index });
	}
  
  searchTable = e => {
  	e.preventDefault();
  	this.setState({ searchText: e.target.value });
  	this.onSearchData(e.target.value, this.props.data);
  }

	onSearchData = (value, data) => {
		if(value.includes('1.2.'))
			this.searchDataById(value, data);
		else
			this.searchDataByName(value, data);
	}

	searchDataByName(name, data) {
		let temp_data = [];
		temp_data = data.filter(obj => {
			return obj.account_name.includes(name);
		  });
		this.setState({ filteredData: temp_data });//This needs to be fixed
	}

	searchDataById = (id, data) =>{
		let temp_data = [];
		temp_data = data.filter(obj => {
			return obj.account_id.includes(id);
		  });
		this.setState({ filteredData: temp_data });//This needs to be fixed
	}
  
	changeRowsPerPage = event => {
		this.setState({rowsPerPage: event.target.value});
		this.changePage(event, 0);
	};

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
			this.onSearchData(this.state.account, response.data);
		}).catch(error => {console.log('error fetching witness data', error);});
	}
  
  generateTableHeaders = () => {
  	const headCells = [
  		{id: 'account_id', label: 'Account Id'},
  		{id: 'account_name', label: 'Account Name'},
  		{id: 'referrer', label: 'Referer'}
  	];

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
	
	generateTableRows = (rowData, i) => {
		const tableType = this.props.tableHeader;
		console.log('generating table rows: ', tableType);
		switch(tableType) {
			case 'Accounts':
				console.log('returning account detail');
				return <AccountDetail detail={rowData} key={i}/>;
			default:
				return;
		}
	}
  
	render() {
  	const {account} = this.props;
		const {currentPage, rowsPerPage, filteredData, searchText} = this.state;
		const data = searchText.length <= 0 ? this.props.data : filteredData;
  	return (
  		<div>
  			<div className="account-header-container">
  				<span className="account-header-text"><span className="fa fa-user-alt">&nbsp;</span> Browse Accounts</span>
  				<Input
  					id="standard-adornment-password"
  					type="search"
  					label="Search"
  					value={account}
  					onChange={this.searchTable}
  					endAdornment={<InputAdornment position="end">
  						<SearchIcon/>
  					</InputAdornment>}
  				/>
  			</div>
  			<TableContainer>
  				<Table stickyHeader className="table" >
  					<TableHead className={''}>
  						{this.generateTableHeaders()}
  					</TableHead>
  					<TableBody>
  						{data && data.slice( currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage).map((rowData, i) =>
  						{return this.generateTableRows(rowData, i);}
  						)}
  					</TableBody>
  				</Table>{data.length===0 && <div> No Search Results </div>}
  			</TableContainer>
  			<TablePagination
  				rowsPerPageOptions={[5, 10, 25]}
  				component="div"
  				count={data.length}
  				rowsPerPage={rowsPerPage}
  				page={currentPage}
  				onChangePage={this.changePage}
  				onChangeRowsPerPage={this.changeRowsPerPage}
  			/>
  		</div>
  	);
	}
}
export default CustomTable;