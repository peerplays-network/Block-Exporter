import React, { Component} from 'react';
import { connect } from 'react-redux'; 
import CustomTable from '../Utility/CustomTable';

const gridHeight = 25;
class Committee extends Component {
	state = {
		committeeList: []
	}

	componentDidMount() {
		if(this.props.committee && this.props.accounts) {
			this.mergeCommitteeWithAccounts();
		}

		if(this.props.history === undefined)
			this.props.calculateComponentHeight(this.props.id, gridHeight);
	}

	componentDidUpdate(prevProps) {
		//Need to look up account names for each committee member using the account list
		if((this.props.accounts !== prevProps.accounts || this.props.committee !== prevProps.committee) && this.props.committee && this.props.accounts) {
			this.mergeCommitteeWithAccounts();
		}
	}

	mergeCommitteeWithAccounts() {
		const appendAccountNames = this.props.committee;
		if(appendAccountNames) {
			appendAccountNames.map(el => {
				const account = this.props.accounts.find(account => account.account_id === el.committee_member_account);
				if(account) {
					return el.account_name = account.account_name;
				}

				return el.account_name = 'NOT FOUND';
			});
		}
		this.setState({committeeList: appendAccountNames});
	}

	render() {
		const {committeeList} = this.state;
		return (
			!!this.props.history ?
			//Committee page
				<CustomTable data={committeeList} tableType="committee" headerLabel="Browse Committee" headerIcon="fa fa-crown"/>
				:
			//Committee Widget
				<CustomTable data={committeeList} tableType="committee" headerLabel="Browse Committee" headerIcon="fa fa-crown"
					widget={true}/>
		);
	}
}

const mapStateToProps = (state) => ({
	committee: state.committee.committeeList,
	accounts: state.accounts.accountList
});

export default connect(mapStateToProps)(Committee);