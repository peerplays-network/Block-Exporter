import React, { Component } from 'react';
import {TableBody} from '@material-ui/core';
import AccountDetail from '../../Account/AccountDetail';
import WitnessRow from '../../WitnessViewer/WitnessRow';
import CommitteeRow from '../../Committee/CommitteeRow';
import TransactionRow from '../../Transactions/TransactionRow';

class CustomTableBody extends Component {
  generateTableRows = (rowData, i) => {
  	const tableType = this.props.tableType;
  	switch(tableType) {
  		case 'accounts':
  			return <AccountDetail detail={rowData} key={i}/>;
  		case 'witnesses':
  			return <WitnessRow detail={rowData} key={i} />;
  		case 'committee':
  			return <CommitteeRow detail={rowData} key={i} />;
  		case 'transactions':
  			return <TransactionRow detail={rowData} key={i} />;
  		default:
  			return;
  	}
  }

  render() {
  	const {currentPage, rowsPerPage, tableData} = this.props;
  	console.log('data: ', tableData);
  	return (
  		<TableBody>
  			{tableData && tableData.slice( currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage).map((rowData, i) =>
  					{return this.generateTableRows(rowData, i);}
  				)
  			}
  		</TableBody>
  	);
  }
}

export default CustomTableBody;