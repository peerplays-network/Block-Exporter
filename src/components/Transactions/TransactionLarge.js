import React, { Component } from 'react';
import { Card, CardBody, Col} from 'reactstrap';
import TransactionDisplay from './TransactionDisplay';

class TransactionLarge extends Component {
	render() {
		return (
			<TransactionDisplay history={this.props.history} />
		);
	}
}

export default TransactionLarge;