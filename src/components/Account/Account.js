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
			!!this.props.history ?
			//Accounts page
				<CustomTable data={accounts} tableType="accounts" headerLabel="Accounts" headerIcon="fa fa-user-alt"/>
				:
			//Accounts Widget
				<CustomTable data={accounts} tableType="accounts" headerLabel="Accounts" headerIcon="fa fa-user-alt"
					widget={true}/>
		);
	}	
}

const mapStateToProps = (state) => ({
	accounts: state.accounts.accountList
});

export default connect(mapStateToProps)(Account);