import React, { Component } from 'react';

import NavBar from '../NavBar';

// import styles from './Root.css';
import '../../assets/css/index.css';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchWitnesses } from '../../actions/WitnessActions';
import { fetchAccounts } from '../../actions/AccountActions';
import { fetchContracts } from '../../actions/ContractActions';
import { fetchCommittee } from '../../actions/CommitteeActions';

class ReduxWrapper extends Component {
	componentDidMount() {
		this.props.fetchWitnesses();
		this.props.fetchAccounts();
		this.props.fetchContracts();
		console.log('calling committee');
		this.props.fetchCommittee();
	}

	render() {
		return (
			<div>
				<NavBar />
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	witnesses: state.witnesses.witnessList,
	accounts: state.accounts.accountList,
	contracts: state.contracts.contractList
});

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ fetchWitnesses, fetchAccounts, fetchContracts, fetchCommittee }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxWrapper);
