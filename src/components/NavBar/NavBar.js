import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import {
	AppBar,
	Toolbar,
	IconButton,
	Menu,
	MenuItem,
	Input,
	InputAdornment
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import {Menu as MenuIcon, Build as BuildIcon, MenuOpen as MenuOpenIcon, Search as SearchIcon} from '@material-ui/icons';
import styles from './NavBar.css';
import BlockAnimation from '../BlockAnimation/BlockAnimation';
import { sideBarClicked } from '../../actions/GridActions';
import peerplaysIcon from '../../assets/images/PeerplaysLogo.png';

class Navigation extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isOpen: false, searchText: '', tooltipOpen: false, menuAnchor: ''
		};
	}

	componentDidMount() {
		this.props.sideBarClicked(true);
	}

	closeMenu = () => {
		this.setState({
			isOpen: false
		});
	}

	toggleMenu = (e) => {
		this.setState({
			isOpen: !this.state.isOpen,
			menuAnchor: e.currentTarget
		});
	}

	toggleToolTip = () => {
		this.setState({
			tooltipOpen: !this.state.tooltipOpen
		  });
	}

	search = () => {
		this.setState({searchText: ''});
		if(this.state.searchText.length > 0)
			this.props.history.push(`/search/${this.state.searchText}`);
	}

	textChanged(e) {
		this.setState({searchText: e.target.value});
	}

	render() {
		const {isOpen, menuAnchor} = this.state;

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
				<AppBar position="sticky">
					<Toolbar className={`${styles['header-background']}`}>
						<IconButton edge="start" color="inherit" aria-label="menu" aria-controls="simple-menu"
							aria-haspopup="true" onClick={this.toggleMenu}>
							{isOpen ? <MenuOpenIcon/> : <MenuIcon />}
						</IconButton>
						<Menu
							keepMounted
							id="simple-menu"
							anchorEl={menuAnchor}
							getContentAnchorEl={null}
							open={isOpen}
							onClose={this.closeMenu}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'center',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'center',
							}}
						>
							<MenuItem component={Link} to="/account/" onClick={this.closeMenu}>Account</MenuItem>
							<MenuItem component={Link} to="/transactions/" onClick={this.closeMenu}>Transactions</MenuItem>
							<MenuItem component={Link} to="/witnesses" onClick={this.closeMenu}>Witnesses</MenuItem>
							<MenuItem component={Link} to="/committee" onClick={this.closeMenu}>Committee</MenuItem>
							<MenuItem component={Link} to="/feeDirectory" onClick={this.closeMenu}>Fee Schedule</MenuItem>
							<MenuItem component={Link} to="/directory" onClick={this.closeMenu}>Useful Resources</MenuItem>
							<MenuItem component={Link} to="/block-list" onClick={this.closeMenu}>Blocks</MenuItem>
						</Menu>
						{this.props.nav ? 
							<IconButton onClick={slideMenu.bind(this)} edge="start" color="inherit" aria-label="menu">
								<BuildIcon />
							</IconButton>
							: null }
						<div className={`${styles['nav-item-container']}`}>
							<div className={`${styles['logo-container']}`}>
								<Link to="/">
									<img className={`${styles['peerplays-logo']}`} src={peerplaysIcon} alt=""/>
								</Link>
								<span className={`${styles['nav-divider']}`}/>
								<span className={`${styles['nav-header-text']}`} color="inherit">Exporter</span>
							</div>
							<div className={`${styles['block-search-container']}`}>
								<Input classes={{root: `${styles['search-input']}`}} onChange={this.textChanged.bind(this)}
									endAdornment={
										<InputAdornment position="end">
											<SearchIcon className={`${styles['cursor']}`} onClick={this.search}/>
										</InputAdornment>
									}/>
								<BlockAnimation />
							</div>
						</div>
					</Toolbar>
				</AppBar>
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



/* <Navbar className={`${styles['header-background']}`} light expand="md">
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
								<DropdownItem href="/feeDirectory">Fee Schedule</DropdownItem>
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
						<NavItem navbar>
							<NavLink href="/">
								<i className={`${styles['header-contrast-text'] } ${styles['size25']} fas fa-home fa-1x pl-2`}></i>
							</NavLink>
						</NavItem>
						
					</Nav>
					<div className={`${styles['header-contrast-text']} ${styles['header-height']} pt-1`}><a href="/" className={`${styles['link-no-decor']} ${styles['bold']} ${styles['size30']} pl-3`}>Exporter</a></div>
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
								Search for Accounts, Witnesses, Blocks, or Committee Members by name or id
							</Tooltip>
							<NavItem>
								<BlockAnimation />
							</NavItem>
						</Nav>
					</Collapse>
				</Navbar> */