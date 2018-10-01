/*Used in Account*/
import React,  { Component } from 'react';
import { Button, UncontrolledCollapse } from 'reactstrap';
import axios from 'axios';

class AccountAllDetail extends Component {
	constructor(e) {
		super();
		this.state = {
			data: [],
			
		};
		this.account = '';
		this.findData = this.findData.bind(this);
		this.getAccount = this.getAccount.bind(this);
	}

	getAccount() {
		this.account = this.props.match.url.substring(18);
	}

	findData(e) {
		this.getAccount();
		//API call to search for Account
		axios.get('http://localhost:5000/api/accounts/'+this.account, {
		}).then(response => {
			this.setState({ data: response.data });
			console.log('', response);
		}).catch(error => {console.log('error is fetching account data', error);});
	}

	componentDidMount() {
		this.findData();
	}

	render() {
		const toggler = 'toggler'+this.props.account;
		const togglerCol = '#toggler'+this.props.account;

		this.getAccount();

		return (
			<div>
				<Button color="primary" id={toggler} style={{ marginBottom: '1rem' }}>
					{ this.account}
				</Button>
				{this.state.data.map((account, i) =>
					<UncontrolledCollapse toggler={togglerCol} key={i} >
						<a> {account.account_name}</a>
						<a> { account.account_id}</a>
						<a> { account.referrer }</a>
						<a> voteList</a>
						<a> all</a>
					</UncontrolledCollapse>
				)}
			</div>
			
		);
	}
}

export default AccountAllDetail;
