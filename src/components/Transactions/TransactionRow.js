import React, { Component } from 'react';
import styles from './styles.css';

class TransactionRow extends Component {

	render() {
		return (
            <div>
                <span className={`${styles['blue']}`}>{this.props.account} &nbsp;</span>
                <span>{this.props.action} &nbsp;</span>
                <span className={`${styles['green']}`}>{this.props.memo} &nbsp;</span>
                <span className={`${styles['lightred']}`}>{this.props.time} &nbsp;</span>
                <span className={`${styles['grey']}`} style={{float:'right'}}>{this.props.transactionID}</span>
            </div>
		);
	}
}

export default TransactionRow;