import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
import { sideBarClicked } from '../../actions/GridActions';

class Navigation extends React.Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			isOpen: false, searchText: ''
		};
	}

	componentDidMount() {
		this.props.sideBarClicked(true);
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
			if(menu.style.left === '-200px') {
				this.props.sideBarClicked(true);
				menu.style.left = '0px';
			}
			else {
				this.props.sideBarClicked(false);
				menu.style.left = '-200px';
			}
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
								<DropdownItem href="/account/">Account</DropdownItem>
								<DropdownItem href="/transactions/">Transactions</DropdownItem>
								<DropdownItem href="/feeDirectory">Fee Directory</DropdownItem>
								<DropdownItem href="/directory">Site Directory</DropdownItem>
								<DropdownItem href="/block-list">Blocks</DropdownItem>
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

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ sideBarClicked }, dispatch);
}

export default withRouter(connect(null, mapDispatchToProps)(Navigation));
