import React, { Component } from 'react';
import { Card, CardBody, Col} from 'reactstrap';
import TransactionDisplay from './TransactionDisplay';

class TransactionLarge extends Component {
	render() {
		return (
			<Col sm={{ size: '9', offset: 1 }} >
				<Card>
					<CardBody>
						<TransactionDisplay />
					</CardBody>
				</Card>
			</Col>
		);
	}
}

export default TransactionLarge;