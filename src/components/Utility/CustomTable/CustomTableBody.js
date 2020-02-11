import React, { Component } from 'react';
import {TableBody} from '@material-ui/core';
import AccountDetail from '../../Account/AccountDetail';
import WitnessRow from '../../WitnessViewer/WitnessRow';
import CommitteeRow from '../../Committee/CommitteeRow';

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
  		default:
  			return;
  	}
  }

  render() {
  	const {currentPage, rowsPerPage, tableData} = this.props;
  	return (
  		<TableBody>
  			{tableData && tableData.slice( currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage).map((rowData, i) =>
  			{return this.generateTableRows(rowData, i);}
  			)}
  			{tableData.length===0 && <div> No Search Results </div>}
  		</TableBody>
  	);
  }
}

export default CustomTableBody;