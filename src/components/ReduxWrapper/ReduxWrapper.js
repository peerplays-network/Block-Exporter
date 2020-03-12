import React, { Component } from 'react';

import NavBar from '../NavBar';

// import styles from './Root.css';
import '../../assets/css/index.css';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchWitnesses } from '../../actions/WitnessActions';
import { fetchAccounts } from '../../actions/AccountActions';
import { fetchCommittee } from '../../actions/CommitteeActions';
import { fetchOperations } from '../../actions/TransactionActions';

class ReduxWrapper extends Component {
	componentDidMount() {
		this.props.fetchWitnesses();
		this.props.fetchAccounts();
		this.props.fetchCommittee();
		this.props.fetchOperations();
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
});

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ fetchWitnesses, fetchAccounts, fetchCommittee, fetchOperations }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxWrapper);
