import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setOperations } from '../../actions/TransactionActions';
import TransactionApi from '../../api/TransactionApi';
import CustomTable from '../Utility/CustomTable';
//State will be removed once data feed is established
const gridHeight=31;
class TransactionDisplay extends Component {
	constructor() {
		super();
		this.state = {
			transactionData:[], transactionLength: 10
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

	componentDidMount() {
		this.fetchData();
		if (!!this.props.calculateComponentHeight)
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
		console.log('history: ', this.props.history);
		return (
			<div>
				{!!this.props.history ? //display on browse transaction page, hides it onthe transaction widget
					<CustomTable data={transactionData} tableType="transactions" headerLabel="Browse Transactions" headerIcon="fa fa-handshake"
						simpleTable={true}/>
					:
					<CustomTable data={transactionData} tableType="transactions" headerLabel="Browse Transactions" headerIcon="fa fa-handshake"
						widget={true} simpleTable={true}/>
				}
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ setOperations }, dispatch);
};

export default connect(mapDispatchToProps)(TransactionDisplay);