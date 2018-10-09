import React, { Component } from 'react';

import NavBar from '../NavBar';

// import styles from './Root.css';
import '../../assets/css/index.css';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchWitnesses } from '../../actions/WitnessActions';

class ReduxWrapper extends Component {
	componentDidMount() {
		this.props.fetchWitnesses();
	}

	render() {
		console.log('witnesses', this.props.witnesses);
		return (
			<div>
				<NavBar />
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	witnesses: state.witnesses.witnessList
});

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ fetchWitnesses }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxWrapper);
