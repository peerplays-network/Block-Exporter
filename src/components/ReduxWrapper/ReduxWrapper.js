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

class ReduxWrapper extends Component {
	componentDidMount() {
		this.props.fetchWitnesses();
		this.props.fetchAccounts();
		this.props.fetchContracts();
	}

	render() {
		console.log('witnesses', this.props.witnesses);
		console.log('accounts', this.props.accounts);
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
	return bindActionCreators({ fetchWitnesses, fetchAccounts, fetchContracts }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxWrapper);
