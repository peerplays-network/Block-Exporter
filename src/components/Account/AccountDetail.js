/*Used in Account*/
import React,  { Component } from 'react';
import {Link, TableRow, TableCell} from '@material-ui/core';

class AccountDetail extends Component {
	render() {
		const account = this.props.detail.account_name;
		return (
			<TableRow hover={true}>
				<TableCell>
					<Link href={'/accountAllDetail/'+account}>{ account }</Link>
				</TableCell>
				<TableCell>{ this.props.detail.account_id}</TableCell>
				<TableCell>{ this.props.detail.referrer }</TableCell>
			</TableRow>
		);
	}
}

export default AccountDetail;
