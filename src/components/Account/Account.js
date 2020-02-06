/* Account page includes pagination */
import React, { Component } from 'react';
import CustomTable from '../Utility/CustomTable';
import { connect } from 'react-redux';
const gridHeight = 24;
class AccountSearch extends Component {
	componentDidUpdate(prevProps) {        
		if(this.props.id !== '' && this.props.visible !== prevProps.visible) {
			this.props.calculateComponentHeight(this.props.id, gridHeight);
		}
	}

	// onAccountEnter = e => {
	// 	e.preventDefault();
	// 	this.setState({ account: e.target.value });
	// 	this.onSearchAccount(e.target.value, this.state.data);
	// }

	// onSearchAccount = (value, data) => {
	// 	if(value.includes('1.2.'))
	// 		this.findAccountById(value, data);
	// 	else
	// 		this.findAccountByName(value, data);
	// }

	// findAccountByName(accountName, data) {
	// 	let temp_data = [];
	// 	temp_data = data.filter(obj => {
	// 		return obj.account_name.includes(accountName);
	// 	  });
	// 	this.setState({ temp_data: temp_data });
	// }

	// findAccountById = (accountId, data) =>{
	// 	let temp_data = [];
	// 	console.log('data', data);
	// 	temp_data = data.filter(obj => {
	// 		console.log('obj', obj);
	// 		return obj.account_id.includes(accountId);
	// 	  });
	// 	this.setState({ temp_data: temp_data });
	// 	this.refreshPagination(temp_data);
	// }

	// changePage = (e, index) => {
	// 	e.preventDefault();
	// 	this.setState({ currentPage: index });
	// }

	// handleChangeRowsPerPage = event => {
	// 	this.setState({rowsPerPage: event.target.value});
	// 	this.changePage(event, 0);
	// };

	// sortByColumn = (colType) => {
	// 	let sortType = this.state.sortType;
	// 	if(this.state.sortBy === colType)
	// 	{
	// 		sortType === 'desc' ? sortType='asc': sortType='desc';
	// 	}

	// 	this.setState({sortType:sortType, sortBy:colType});
	// 	/*sorts depending on the column type. Also does a lookup on the witness data which
	// 	  stores the initial API call made when the component is loaded and witness rank is calculated.
	// 	the witness rank is the appended to the data coming in from the sort API call.*/
	// 	axios.get(`/api/accounts?sort=${colType}&direction=${sortType.toUpperCase()}`, {
	// 	}).then(response => {
	// 		this.onSearchAccount(this.state.account, response.data);
	// 	}).catch(error => {console.log('error fetching witness data', error);});
	// }

	//generates table headers
	// generateTableHeaders = () => {
	// 	const headCells = [
	// 		{id: 'account_id', label: 'Account Id'},
	// 		{id: 'account_name', label: 'Account Name'},
	// 		{id: 'referrer', label: 'Referer'}
	// 	];

	// 	const {sortBy, sortType} = this.state;

	// 	return (
	// 		<TableRow>
	// 			{headCells.map(headCell => (
	// 				<TableCell key={headCell.id} sortDirection={sortType}>
	// 					<TableSortLabel
	// 						active={sortBy === headCell.id}
	// 						direction={sortType}
	// 						onClick={() => this.sortByColumn(headCell.id)}>
	// 						{headCell.label}
	// 					</TableSortLabel>
	// 				</TableCell>
	// 			))}
	// 		</TableRow>
	// 	);
	// }

	render() {
		const accounts = this.props.accounts || [];
		return(
			<div className="">
				
				{//!!this.props.history ? // browse all account page
				
					// <div>
					// 	<div className="account-header-container">
					// 		<span className="account-header-text"><span className="fa fa-user-alt">&nbsp;</span> Browse Accounts</span>
					// 		<Input
					// 			id="standard-adornment-password"
					// 			type="search"
					// 			label="Search Accounts"
					// 			value={account}
					// 			onChange={this.onAccountEnter}
					// 			endAdornment={<InputAdornment position="end">search</InputAdornment>}
					// 		/>
					// 	</div>
					// 	<TableContainer>
					// 		<Table stickyHeader className="table" >
					// 			<TableHead className={''}>
					// 				{this.generateTableHeaders()}
					// 				{/* <TableCell scope="col">Account Name</TableCell>
					// 				<TableSortLabel active={sortBy === 'account_name'} direction={sortType} onClick={createSortHandler(headCell.id)}></TableSortLabel>
					// 				<TableCell active={sortBy === 'account_id'} onClick={this.sortByColumn.bind(this, 'account_id')} scope="col">Account ID</TableCell>
					// 				<TableCell active={sortBy === 'account_id'} onClick={this.sortByColumn.bind(this, 'referrer')} scope="col">Referrer</TableCell> */}
					// 			</TableHead>
					// 			<TableBody>
					<CustomTable data={accounts} tableHeader="Accounts"/>
					 			// </TableBody>
					// 		</Table>{temp_data.length===0 && <div> No Accounts Found </div>}
					// 	</TableContainer>
					// 	<TablePagination
					// 		rowsPerPageOptions={[5, 10, 25]}
					// 		component="div"
					// 		count={temp_data.length}
					// 		rowsPerPage={rowsPerPage}
					// 		page={currentPage}
					// 		onChangePage={this.changePage}
					// 		onChangeRowsPerPage={this.handleChangeRowsPerPage}
					// 	/>
					// </div>

					// : 
					// account feed widget
					// <div>
					// 	<TableContainer>

					// 		<Table stickyHeader className="" >
					// 			<TableHead className={''}>
					// 				<TableRow>
					// 					<TableCell onClick={this.sortByColumn.bind(this, 'account_name')} scope="col">Account Name</TableCell>
					// 					<TableCell onClick={this.sortByColumn.bind(this, 'account_id')} scope="col">Account ID</TableCell>
					// 					<TableCell onClick={this.sortByColumn.bind(this, 'referrer')} scope="col">Referrer</TableCell>
					// 				</TableRow>
					// 			</TableHead>
					// 			<TableBody>
					// 				{temp_data && temp_data.slice( currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage).map((account, i) =>
					// 					<AccountDetail detail={account} key={i}/>
					// 				)}
					// 			</TableBody>
					// 		</Table>{temp_data.length===0 && <div> No Accounts Found </div>}
					// 	</TableContainer>
					// 	<TablePagination
					// 		rowsPerPageOptions={[5, 10, 25]}
					// 		component="div"
					// 		count={temp_data.length}
					// 		rowsPerPage={rowsPerPage}
					// 		page={currentPage}
					// 		onChangePage={this.changePage}
					// 		onChangeRowsPerPage={this.handleChangeRowsPerPage}
					// 	/>

					// </div>

				// end of account feed widget
				}



			</div>
		);
	}	
}

const mapStateToProps = (state) => ({
	accounts: state.accounts.accountList
});

export default connect(mapStateToProps)(AccountSearch);