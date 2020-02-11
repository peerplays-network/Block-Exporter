import React, { Component } from 'react';
import {Link, TableRow, TableCell} from '@material-ui/core';

class CommitteeRow extends Component {
	render() {
		const {detail} = this.props;
		return (
			<TableRow>
				<TableCell>{detail.rank}</TableCell>
				<TableCell><Link href={`/accountAllDetail/${detail.account_name}/${detail.committee}`}>{detail.account_name}</Link></TableCell>
				<TableCell>{detail.total_votes}</TableCell>
				<TableCell>{detail.url}</TableCell>
			</TableRow>
		);
	}
}

export default CommitteeRow;