import React,  { Component } from 'react';
import { NavLink, Row } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';

class ContractRow extends Component {
	render() {
		const balance = JSON.parse(this.props.detail.balances);
		return (
			<tr>
				<td className="align-middle"><NavLink tag={RRNavLink} to={'/contractDetail/'+this.props.detail.name} >{ this.props.detail.object_id }</NavLink></td>
				<td className="align-middle">{ this.props.detail.name}</td>
				<td className="align-middle"> 
					{ balance && balance.map((bal, i) =>{
						const str = 'EXE ' + bal.amount;
						return (
							<Row key={i}>
								<div>{str}</div>
							</Row>
						);
					})}
				</td>
			</tr>
		);
	}
}

export default ContractRow;