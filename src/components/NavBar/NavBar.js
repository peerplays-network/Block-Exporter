import React from 'react';
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Button, } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import styles from './NavBar.css';

export default class NavBar extends React.Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			isOpen: false
		};
	}
	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	}

	render() {
		const slideMenu = () => {
			const menu = document.querySelector('.sliding-menu');
			menu.style.right = '0';
		};
		return (
			<div>
				<Navbar color="light" light expand="md">
					<Nav navbar >
						<UncontrolledDropdown nav inNavbar>
							<DropdownToggle nav >
								<i className="fas fa-bars fa-1x"></i>
							</DropdownToggle>
							<DropdownMenu left>
								<DropdownItem>
									Option 1
								</DropdownItem>
								<DropdownItem>
									Option 2
								</DropdownItem>
								<DropdownItem divider />
								<DropdownItem>
									Reset
								</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>
						<NavItem navbar>
							<NavLink>
								<i className={`${styles['cursor']} fas fa-toolbox fa-1x`}></i>
							</NavLink>
						</NavItem>
						
					</Nav>
					<NavbarBrand tag={RRNavLink} to="/">EXE EXPLORER</NavbarBrand>
					<NavbarToggler onClick={this.toggle} />
					<Collapse isOpen={this.state.isOpen} navbar>
						<Nav className="ml-auto" navbar>
							<NavItem>
								<NavLink tag={RRNavLink} to="/test/">Test</NavLink>
							</NavItem>
						</Nav>
					</Collapse>
				</Navbar>
			</div>
		);
	}
}
