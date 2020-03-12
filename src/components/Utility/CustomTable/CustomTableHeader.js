import React, { Component } from 'react';
import {TableRow, TableCell, TableSortLabel, TableHead} from '@material-ui/core';

class CustomTableHeader extends Component {
  generateHeadCells = (tableType) => {
  	switch(tableType) {
  		case 'accounts':
  			return [
  				{id: 'account_name', label: 'Account Name'},
  				{id: 'account_id', label: 'Account Id'},
  				{id: 'referrer', label: 'Referer'}
  			];
  		case 'witnesses':
  			return [
  				{id: 'rank', label: 'Rank'},
  				{id: 'account_name', label: 'Witness Name'},
  				{id: 'total_votes', label: 'Votes'},
  				{id: 'total_missed', label: 'Misses'},
  				{id: 'url', label: 'URL'}
  			];
  		case 'committee':
  			return [
  				{id: 'rank', label: 'Rank'},
  				{id: 'committee_id', label: 'Committee Member'},
  				{id: 'total_votes', label: 'Votes'},
  				{id: 'url', label: 'URL'}
  			];
  		default:
  			return [];
  	}
  }
  
  render() {
  	const {sortBy, sortType, tableType} = this.props;
  	return (
  		<TableHead className={''}>
  			<TableRow>
  				{this.generateHeadCells(tableType).map(headCell => (
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