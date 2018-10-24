import React, { Component } from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import {NavLink} from 'reactstrap';

class WitnessRow extends Component {

	render() {
		return (
			<tr>
				<td className="align-middle">{this.props.rank}</td>
				<td className="align-middle"><NavLink tag={RRNavLink} to={`/accountAllDetail/${this.props.witness}/${this.props.account_id}`}>{this.props.witness}</NavLink></td>
				<td className="align-middle">{this.props.votes}</td>
				<td className="align-middle">{this.props.misses}</td>
				<td className="align-middle">{this.props.lastBlock}</td>
			</tr>
		);
	}
}

export default WitnessRow;