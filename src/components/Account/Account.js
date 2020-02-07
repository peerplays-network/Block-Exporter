/* Account page includes pagination */
import React, { Component } from 'react';
import CustomTable from '../Utility/CustomTable';
import { connect } from 'react-redux';
const gridHeight = 24;
class Account extends Component {
	componentDidUpdate(prevProps) {        
		if(this.props.id !== '' && this.props.visible !== prevProps.visible) {
			this.props.calculateComponentHeight(this.props.id, gridHeight);
		}
	}

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
					<CustomTable data={accounts} tableType="accounts" headerLabel="Accounts"/>
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

export default connect(mapStateToProps)(Account);