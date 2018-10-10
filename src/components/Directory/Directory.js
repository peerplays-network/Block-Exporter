import React,  { Component } from 'react';
import { NavLink, Card, CardBody, CardHeader, Col } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';

class Directory extends Component {
    
	render() {
		return (
			<Col sm={{ size: '9', offset: 1 }} >
				<Card>
					<CardHeader>
						<span>Directory Links </span>
					</CardHeader>
					<CardBody>
						<NavLink tag={RRNavLink} to="/account/">Account &nbsp; - A list of current accounts in the database</NavLink>
						<NavLink tag={RRNavLink} to="/feeDirectory">Fee Directory &nbsp; - A list of current fees applied to accounts</NavLink>
						<NavLink tag={RRNavLink} to="/">Home &nbsp; - Landing age with access to all widgets</NavLink>
						<NavLink tag={RRNavLink} to="/transactions/">Transactions &nbsp; - List of the most recent transactions</NavLink>
						<NavLink tag={RRNavLink} to="test/">Test &nbsp; - A test page</NavLink>
					</CardBody>
				</Card>
			</Col>
		);
	}
}

export default Directory;
