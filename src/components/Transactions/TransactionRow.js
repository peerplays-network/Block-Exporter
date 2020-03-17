import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link, TableRow, TableCell} from '@material-ui/core';
import styles from './styles.css';
class TransactionRow extends Component {
	findAccountName(id) {
		const accountName = this.props.accounts ? this.props.accounts.find(el => el.account_id === id) : '';
		return accountName ? <span><Link className="d-inline p-0" href={`/accountAllDetail/${accountName.account_name}`}>{accountName.account_name}</Link></span>  : <span>Account Id: {id}</span>;
	}
	
	// linkAccountName(accountName) {
	// 	return accountName ? <span><Link className="d-inline p-0" href={`/accountAllDetail/${accountName}`}>{accountName}</Link></span> : accountName;
	// }
  
	// renderOther(operationType, parsedTransaction, i) {
	// 	if(parsedTransaction.fee) {
	// 		return (
	// 			<TableCell sm="5"> <strong> {parsedTransaction.fee.amount}</strong> {this.displayOperation(operationType)} <strong> {this.findAccountName(parsedTransaction.account)}</strong></TableCell>
	// 		);
	// 	}
	// }
  
	displayOperation( operation ) {
		if(this.props.operations[operation]) {
			return this.props.operations[operation].friendly_name;
		} else {}

		return;
	}

	getAccountName(transaction) {
		let accountName = '';
		const operationType = JSON.parse(transaction.operations)[0];
		const parsedTransaction = JSON.parse(transaction.operations)[1];
		switch(operationType) {
			case 0:
				accountName = parsedTransaction.from;
				break;
			case 5:
				accountName = parsedTransaction.registrar;
				break;
			case 6:
				accountName = parsedTransaction.account;
				break;
			case 8:
				accountName = parsedTransaction.account_to_upgrade;
				break;
			case 20:
				accountName = parsedTransaction.witness_account;
				break;
			case 29:
				accountName = parsedTransaction.committee_member_account;
				break;
			case 37:
				accountName = parsedTransaction.deposit_to_account;
				break;
			case 47:
				accountName = parsedTransaction.registrar;
				break;
			case 62:
				accountName = parsedTransaction.bettor_id;
				break;
			default:
				break;
		}

		return accountName;
	}

	getOperation = (transaction) => {
		const opCode = JSON.parse(transaction.operations)[0];
		const operationType = this.props.operations.find(opCode);
		return operationType;
	}
  
	render() {
		const {detail, key} = this.props;
		return (
			<TableRow hover={true} key={key}>
				<TableCell className={`${styles['text-center']}`}>{detail.parent_block}</TableCell>
				<TableCell>{this.getAccountName(detail)}</TableCell>
				<TableCell className={`${styles['text-center']}`}>{this.getOperation(detail)}</TableCell>
				<TableCell className={`${styles['text-center']}`}>{detail.fee.amount}</TableCell>
				<TableCell className={`${styles['text-center']}`}>{detail.expiration}</TableCell>
			</TableRow>
		);
	}
}

const mapStateToProps = (state) => ({
	accounts: state.accounts.accountList,
	operations: state.transactions.operations
});

export default connect(mapStateToProps)(TransactionRow);