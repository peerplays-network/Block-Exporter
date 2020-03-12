import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchExchangeRatesBTC } from '../../actions/index';

class Test extends Component {
	constructor(props) {
		super(props);

		this.onButtonPress = this.onButtonPress.bind(this);
		this.logRates = this.logRates.bind(this);
	}

	onButtonPress(event) {
		event.preventDefault();

		// Initiate action:
		this.props.fetchExchangeRatesBTC();
	}

	logRates(event) {
		event.preventDefault();
		console.log(this.props.rates);
	}

	render() {
		return (
			<div>

				<div>
					<button type="submit" className="btn btn-secondary" onClick={this.onButtonPress}>Get BTC Exchange Rates</button>
				</div>
				<div>
					<button type="submit" className="btn btn-secondary" onClick={this.logRates}>Log Rates to Console</button>
				</div>
			</div>

		);
	}
}

const mapStateToProps = (state) => ({
	rates: state.testPage.rates
});

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ fetchExchangeRatesBTC }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Test);
