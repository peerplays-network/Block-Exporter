import React from 'react';
import {
	Navbar,
	Collapse,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Input,
	InputGroup,
	InputGroupAddon,
	Button} from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import styles from './NavBar.css';
import BlockAnimation from '../BlockAnimation/BlockAnimation';

class Navigation extends React.Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			isOpen: false, searchText: ''
		};
	}
	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	}

	search(e) {
		if(this.state.searchText.length > 0)
			this.props.history.push(`/search/${this.state.searchText}`);
	}

	textChanged(e) {
		this.setState({searchText: e.target.value});
	}

	render() {
		const slideMenu = () => {
			const menu = document.querySelector('.sliding-menu');
			menu.style.left === '-100%' ? menu.style.left = '0%' : menu.style.left = '-100%';
		};
		return (
			<div>
				<Navbar className={`${styles['header-background']}`} light expand="md">
					<Nav navbar >
						<UncontrolledDropdown nav inNavbar>
							<DropdownToggle nav >
								<i className={`${styles['header-contrast-text'] } fas fa-bars fa-1x`}></i>
							</DropdownToggle>
							<DropdownMenu >
								<DropdownItem>
									<NavLink tag={RRNavLink} to="/account/">Account</NavLink>
								</DropdownItem>
								<DropdownItem>
									<NavLink tag={RRNavLink} to="/transactions/">Transactions</NavLink>
								</DropdownItem>
								<DropdownItem>
									<NavLink tag={RRNavLink} to="/feeDirectory">Fee Directory</NavLink>
								</DropdownItem>
								<DropdownItem>
									<NavLink tag={RRNavLink} to="/directory">Site Directory</NavLink>
								</DropdownItem>
								<DropdownItem>
									<NavLink tag={RRNavLink} to="/block-list">Blocks</NavLink>
								</DropdownItem>
								<DropdownItem divider />
								<DropdownItem>
									Reset
								</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>
						<NavItem navbar>
							<NavLink>
								<i onClick={slideMenu.bind(this)} className={`${styles['cursor']}  ${styles['header-contrast-text']} fas fa-toolbox fa-1x`}></i>
							</NavLink>
						</NavItem>
						
					</Nav>
					<div className={`${styles['header-contrast-text']}`}><a href="/" className={`${styles['link-no-decor']}`}>EXE EXPLORER</a></div>
					<NavbarToggler onClick={this.toggle} />
					<Collapse isOpen={this.state.isOpen} navbar>
						<Nav className="ml-auto" navbar>
							<NavItem>
								<InputGroup size="sm">
									<Input onChange={this.textChanged.bind(this)} placeholder="Search for Accounts, Blocks, ..."></Input>
									<InputGroupAddon addonType="prepend"><Button onClick={this.search.bind(this)}>Search</Button></InputGroupAddon>
								</InputGroup>
							</NavItem>
							<NavItem>
								<BlockAnimation />
							</NavItem>
						</Nav>
					</Collapse>
				</Navbar>
			</div>
		);
	}
}

export default withRouter(Navigation);
