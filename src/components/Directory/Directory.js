import React,  { Component } from 'react';
import { NavLink, Card, CardBody, CardHeader, Col } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import styles from './styles.css';

class Directory extends Component {
    
	render() {
		return (
			<div className="container">

				<h1 className={`${styles['header-contrast-text']} ${styles['header-background']} display-5 text-center pt-2 pb-3 mt-5`}>
				<span className="fa fa-map-signs">&nbsp;</span>Useful Resources</h1>

			<Col >
				<Card>
					<CardBody>
						<NavLink tag={RRNavLink} to="/account/">Account &nbsp; - A list of current accounts in the database</NavLink>
						<NavLink tag={RRNavLink} to="/feeDirectory">Fee Schedule &nbsp; - A list of current fees applied to accounts</NavLink>
						<NavLink tag={RRNavLink} to="/">Home &nbsp; - Landing age with access to all widgets</NavLink>
						<NavLink tag={RRNavLink} to="/transactions/">Transactions &nbsp; - List of the most recent transactions</NavLink>
						<NavLink tag={RRNavLink} to="test/">Test &nbsp; - A test page</NavLink>
					</CardBody>
				</Card>
			</Col>
			</div>
		);
	}
}

export default Directory;
