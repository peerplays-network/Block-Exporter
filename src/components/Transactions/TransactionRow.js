import React, { Component } from 'react';
import styles from './styles.css';

class TransactionRow extends Component {

	render() {
		return (
			<div>
				<div className="col-10" style={{float:'left', textAlign: 'left', margin:'0px', padding:'0px'}}>
					<span className={`${styles['blue']}`}>{this.props.account} &nbsp;</span>
					<span>{this.props.action} &nbsp;</span>
					<span className={`${styles['green']}`}>{this.props.memo} &nbsp;</span>
					<span className={`${styles['lightred']}`}>{this.props.time} &nbsp;</span>
				</div>
				<div className="col-2" style={{float:'right', textAlign: 'right', margin:'0px', padding:'0px'}}>
					<span className={`${styles['grey']}`}>{this.props.transactionID}</span>
				</div>
			</div>
		);
	}
}

export default TransactionRow;