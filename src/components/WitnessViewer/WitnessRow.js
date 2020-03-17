import React, { Component } from 'react';
import {Link, TableRow, TableCell} from '@material-ui/core';

class WitnessRow extends Component {
	render() {
		const {detail} = this.props;
		const detailLink = `/accountAllDetail/${detail.account_name}/${detail.account_id}`;
		return (
			<TableRow hover={true}>
				<TableCell>{detail.rank}</TableCell>
				<TableCell>
					<Link href={detailLink}>{detail.account_name}</Link>
				</TableCell>
				<TableCell>{detail.total_votes}</TableCell>
				<TableCell>{detail.total_missed}</TableCell>
				<TableCell>{detail.url}</TableCell>
			</TableRow>
		);
	}
}

export default WitnessRow;