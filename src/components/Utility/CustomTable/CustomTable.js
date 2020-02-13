import React, { Component } from 'react';
import {Table, TableContainer, TablePagination, InputAdornment, Input} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import CustomTableHeader from './CustomTableHeader';
import CustomTableBody from './CustomTableBody';
import {sortWithRank, sort} from '../../../api/GeneralApi';
import styles from './styles.css';

const muiStyle = {
	root: {
		backgroundColor: 'white',
	},
};

class CustomTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchText : '',
			currentPage: 0,
			rowsPerPage: 5,
			sortType: 'desc',
			sortBy: '',
			filteredData: ''
			
		};

		this.containerClass = this.props.widget ? 'table-border-sm' : 'table-border';
		this.tableHeaderClass = this.props.widget ? 'table-header-container-sm' : 'table-header-container';
	}

	changePage = (e, index) => {
		e.preventDefault();
		this.setState({ currentPage: index });
	}
  //processes both table search and table filter
  searchTable = e => {
  	e.preventDefault();
  	this.setState({ searchText: e.target.value });
  	this.onSearchData(e.target.value, this.props.data);
  }

	/* Searches by Id or name. When value = 1.2.xx search accounts by id
	* When value = 1.6.xx search witnesses by id
	* When value = 1.5.xx search committee by id
	*/
	onSearchData = (value, data) => {
		if(value.includes('1.2.') || value.includes('1.6.') || value.includes('1.5.'))
			this.search('id', value, data);
		else
			this.search('name', value, data);
	}

	search(searchType, value, data) {
		let searchData = [];
		if(searchType === 'id') {
			searchData = data.filter(obj => {
				return obj.account_id ? obj.account_id.includes(value) : obj.committee_id.includes(value);
			});
		} else {
			searchData = data.filter(obj => {
				return obj.account_name.includes(value);
			});
		}

		this.setState({ filteredData: searchData, currentPage: 0 });
	} 
  
	changeRowsPerPage = event => {
		this.setState({rowsPerPage: event.target.value});
		this.changePage(event, 0);
	};

	 sortByColumn = (colType) => {
		 const {sortBy, searchText, filteredData} = this.state;
		 let {sortType} = this.state;
		 const {tableType, data} = this.props;
		 const tableData = filteredData || searchText ? filteredData : data;

	 	if (sortBy === colType)
	 	{
	 		sortType === 'desc' ? sortType='asc': sortType='desc';
	 	}
		 this.setState({sortType:sortType, sortBy:colType});
		
	 	//sort with rank for witness table
	 	if (tableType === 'witnesses' || tableType === 'committee') {
	 		sortWithRank(tableData, tableType, colType, sortType).then((sortedData) => {
	 			this.onSearchData(searchText, sortedData);
	 		});
		 } else {//sort without rank for account
	 		sort(tableType, colType, sortType).then((sortedData) => {
	 			this.onSearchData(searchText, sortedData);
	 		});
		 }
	 }
  
	 render() {
	 	const {currentPage, rowsPerPage, filteredData, sortBy, sortType, searchText} = this.state;
	 	const {data, tableType, headerLabel, headerIcon, widget, classes} = this.props;
		 //If the table sort or search is active display filtered data otherwise display pure data
		 const tableData = filteredData || searchText ? filteredData : data;
  	return (
  		<div className={`${styles[this.containerClass]}`}>
  			<TableContainer className={`${styles['table-container']}`}>
					 <div className={`${styles[this.tableHeaderClass]}`}>
					 {widget ? null :
						 <span className={`${styles['table-header-text']}`}><span className={headerIcon}/>{headerLabel}</span>
	 					}
	 					<Input
						 className={`${classes.root} ${styles['table-header-search']}`}
	 						id="standard-adornment-password"
	 						type="search"
	 						label="Search"
	 						value={searchText}
	 						onChange={this.searchTable}
	 						endAdornment={
	 							<InputAdornment position="end">
	 								<SearchIcon/>
	 							</InputAdornment>
	 						}
  					/>
	 				</div>
  				<Table stickyHeader>
  					<CustomTableHeader sortByColumn={this.sortByColumn} sortBy={sortBy} sortType={sortType} tableType={tableType}/>
	 					<CustomTableBody tableData={tableData} currentPage={currentPage} rowsPerPage={rowsPerPage} tableType={tableType}/>
  				</Table>
  			</TableContainer>
  			<TablePagination
  				rowsPerPageOptions={[5, 10, 25]}
  				component="div"
  				count={tableData.length}
  				rowsPerPage={rowsPerPage}
  				page={currentPage}
  				onChangePage={this.changePage}
  				onChangeRowsPerPage={this.changeRowsPerPage}
  			/>
  		</div>
  	);
	 }
}
export default withStyles(muiStyle)(CustomTable);