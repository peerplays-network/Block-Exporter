import React, { Component } from 'react';
import TransactionDisplay from './TransactionDisplay';

class TransactionLarge extends Component {
	render() {
		return (
			<TransactionDisplay history={this.props.history} />
		);
	}
}

export default TransactionLarge;