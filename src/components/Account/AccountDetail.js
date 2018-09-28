/*Used in Account*/
import React,  { Component } from 'react';
import { NavLink } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';

class AccountDetail extends Component {
	render() {
		return (
			<tr>
				<td><NavLink tag={RRNavLink} to={'/accountAllDetail/'+this.props.detail.account_name} >{ this.props.detail.account_name }</NavLink></td>
				<td>{ this.props.detail.account_id}</td>
				<td>{ this.props.detail.active_key }</td>
				<td>{ this.props.detail.owner_key }</td>
				<td>{ this.props.detail.referrer }</td>
			</tr>
		);
	}
}

export default AccountDetail;
