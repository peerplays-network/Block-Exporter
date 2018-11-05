import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	Navbar,
	Collapse,
	NavbarToggler,
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
	Button,
	Tooltip} from 'reactstrap';
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
			isOpen: false, searchText: '', tooltipOpen: false
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

	toggleToolTip() {
		this.setState({
			tooltipOpen: !this.state.tooltipOpen
		  });
	}

	search(e) {
		this.setState({searchText: ''});
		if(this.state.searchText.length > 0)
			this.props.history.push(`/search/${this.state.searchText}`);
	}

	onKeyPress(e) {
		if(e.key === 'Enter') {
			this.search(e);
		}
	}

	textChanged(e) {
		this.setState({searchText: e.target.value});
	}

	render() {
		// const menu = document.querySelector('.sliding-menu');
		// menu.style.height = (window.innerHeight - 76).toString() + 'px';

		const slideMenu = () => {
			const menu = document.querySelector('.sliding-menu');
			menu.style.height = (window.innerHeight - 76).toString() + 'px';
			if(menu.style.left === '-250px') {
				this.props.sideBarClicked(true);
				menu.style.left = '0px';
			}
			else {
				this.props.sideBarClicked(false);
				menu.style.left = '-250px';
			}
		};
		return (
			<div>
				<Navbar className={`${styles['header-background']}`} light expand="md">
					<Nav navbar >
						<UncontrolledDropdown nav inNavbar>
							<DropdownToggle nav >
								<i className={`${styles['header-contrast-text'] } ${styles['size25']} fas fa-bars fa-1x`}></i>
							</DropdownToggle>
							<DropdownMenu >
								<DropdownItem href="/account/">Account</DropdownItem>
								<DropdownItem href="/transactions/">Transactions</DropdownItem>
								<DropdownItem href="/witnesses">Witnesses</DropdownItem>
								<DropdownItem href="/committee">Committee</DropdownItem>
								<DropdownItem href="/contracts">Contracts</DropdownItem>
								<DropdownItem href="/feeDirectory">Fee Structure</DropdownItem>
								<DropdownItem href="/directory">Useful Resources</DropdownItem>
								<DropdownItem href="/block-list">Blocks</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>
						{this.props.nav ? 
							<NavItem navbar>
								<NavLink>
									<i onClick={slideMenu.bind(this)} className={`${styles['cursor']} ${styles['header-contrast-text']} ${styles['size25']} fas fa-toolbox fa-1x pl-2`}></i>
								</NavLink>
							</NavItem>
							: null}
						
					</Nav>
					<div className={`${styles['header-contrast-text']} ${styles['header-height']} pt-1`}><a href="/" className={`${styles['link-no-decor']} ${styles['bold']} ${styles['size30']} pl-3`}>EXE EXPLORER</a></div>
					<NavbarToggler onClick={this.toggle} />
					<Collapse isOpen={this.state.isOpen} navbar>
						<Nav className="ml-auto" navbar>
							<NavItem>
								<InputGroup size="sm">
									<Input id="searchBar" maxLength="64" onChange={this.textChanged.bind(this)} onKeyPress={this.onKeyPress.bind(this)} 
										value={this.state.searchText} 
										placeholder="Search for name or id"></Input>
									<InputGroupAddon addonType="prepend"><Button onClick={this.search.bind(this)}>Search</Button></InputGroupAddon>
								</InputGroup>
							</NavItem>
							<Tooltip placement="left" isOpen={this.state.tooltipOpen} autohide={false} target="searchBar"
								toggle={this.toggleToolTip.bind(this)}>
								Search for Accounts, Blocks, or Committee Members by name or id
							</Tooltip>
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

const mapStateToProps = (state) => ({
	nav: state.nav.sideBarHidden
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigation));
