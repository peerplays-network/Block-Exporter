import React, { Component } from 'react';
import {TableRow, TableCell, TableSortLabel, TableHead} from '@material-ui/core';

class CustomTableHeader extends Component {
  generateHeadCells = () => {
  	const headCells = [
  		{id: 'account_name', label: 'Account Name'},
  		{id: 'account_id', label: 'Account Id'},
  		{id: 'referrer', label: 'Referer'}
  	];

  	return headCells;
  }
  
  render() {
  	const {sortBy, sortType} = this.props;
  	return (
  		<TableHead className={''}>
  			<TableRow>
  				{this.generateHeadCells().map(headCell => (
  					<TableCell key={headCell.id} sortDirection={sortType}>
  						<TableSortLabel
  							active={sortBy === headCell.id}
  							direction={sortType}
  							onClick={() => this.props.sortByColumn(headCell.id)}>
  							{headCell.label}
  						</TableSortLabel>
  					</TableCell>
  				))}
  			</TableRow>
  		</TableHead>
  	);
  }
}

export default CustomTableHeader;