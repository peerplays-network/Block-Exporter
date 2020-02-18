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
			transactionData:[]
		};
	}

	async fetchData() {
		try{
			const transaction = await TransactionApi.getTransactions();
			this.setState({transactionData: transaction.data});
		} catch(error) {
			console.warn(error);
		}
	}

	componentDidMount() {
		this.fetchData();
		if (!!this.props.calculateComponentHeight)
			this.props.calculateComponentHeight(this.props.id, gridHeight);
	}

	render() {
		const {transactionData} = this.state;
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