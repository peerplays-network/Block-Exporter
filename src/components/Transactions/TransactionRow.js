import React, { Component } from 'react';
import styles from './styles.css';

class TransactionRow extends Component {

	render() {
		return (
            <div>
                {this.props.account} &nbsp;
                {this.props.action} &nbsp;
                {this.props.memo} &nbsp;
                {this.props.time} &nbsp;
                {this.props.transactionID}
            </div>
		);
	}
}

export default TransactionRow;