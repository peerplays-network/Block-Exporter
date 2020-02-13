import React, { Component } from 'react';
import styles from './styles.css';
import { connect } from 'react-redux';
import TransactionApi from '../../api/TransactionApi';
import CustomTable from '../Utility/CustomTable';
//State will be removed once data feed is established
const gridHeight=31;
class TransactionDisplay extends Component {
	constructor() {
		super();
		this.state = {
			transactionData:[], operations: [], transactionLength: 10
		};
	}

	async fetchData() {
		try{
			const transaction = await TransactionApi.getTransactions();
			const length = await TransactionApi.getTransactionLength();
			this.setState({transactionLength: length.data, transactionData: transaction.data});
		} catch(error) {
			console.warn(error);
		}
	}

	async findOperations(e) {
		try{
			const operations = await TransactionApi.getOperations();
			this.setState({Operations: operations.data});
		} catch(error) {
			console.warn(error);
		}
	}

	componentDidMount() {
		this.fetchData();
		this.findOperations();

		if(!!this.props.calculateComponentHeight)
			this.props.calculateComponentHeight(this.props.id, gridHeight);
	}

	// changePage(e, index) {
	// 	e.preventDefault();
	// 	index > this.state.currentPage ? this.loadNextTransactions(index) : this.loadPreviousTransactions(index);
	// }

	async loadNextTransactions(index) {
		const {transactionData} = this.state;

		try{
			const transaction = await TransactionApi.getTransactionsId(transactionData[transactionData.length - 1].id-1);
			this.setState({transactionData: transaction.data});
		} catch(error) {
			console.warn(error);
		}
	}

	async loadPreviousTransactions(index) {
		const {transactionData} = this.state;

		try{
			const transaction = await TransactionApi.getTransactionsId(transactionData[0].id+11);
			this.setState({transactionData: transaction.data});
		} catch(error) {
			console.warn(error);
		}
	}

	render() {
		const {transactionData} = this.state;

		return (
			<div className="container pt-1 pb-5 mt-4">
				<div className="card-block">

					{/* {!!this.props.history ? //display on browse transaction page, hides it onthe transaction widget
						<h1 className={`${styles['header-contrast-text']} ${styles['header-background']} display-5 text-center pt-3 pb-3 mt-2 mb-2s`}>
							<span className="fa fa-handshake">&nbsp;</span>Browse Transactions</h1>
						: null//display on browse transaction page, hides it on the transaction widget
					} */}
	
					<CustomTable data={transactionData} tableType="transactions" headerLabel="Browse Transactions" headerIcon="fa fa-handshake"/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	accounts: state.accounts.accountList
});

export default connect(mapStateToProps)(TransactionDisplay);