import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Column, Table } from 'react-virtualized'
import styles from './account.css';
import ListAccounts from './subcomponents/ListAccounts';

export default class AccountSearch extends Component {

  constructor(e) {
    super(e);

    this.state = {
        account : '',
        data: [
          {id: 'bts-conradrei1', votes: [], proposals: [], referrer_name: 'committee-account', balances: [{
            "asset_type": "1.3.0",
            "symbol": "PPY",
            "owner": "1.2.6752",
            "balance": 21000026121,
            "id": "2.5.6444"
          }]},
          {id: 'gold-blocks', votes: [], proposals: [], referrer_name: 'peerplays-faucet', balances: [{
            "asset_type": "1.3.0",
            "symbol": "PPY",
            "owner": "1.2.9833",
            "balance": 11683915631,
            "id": "2.5.8735"
          }]}
        ],
        temp_data: [],
    };
    this.onAccountEnter = this.onAccountEnter.bind(this)
    this.searchAccount = this.searchAccount.bind(this);
    this.findAccount = this.findAccount.bind(this);
  }

  onAccountEnter(e) {
    const account = e.target.value;
    this.setState({ account: e.target.value });
  }

  searchAccount(e) {
    if (e) e.preventDefault();
    this.findAccount(this.state.account, this.state.data);//function to get account name
    e.currentTarget.reset();
    //this.setState({ account: '' });
  }

  findAccount(accountName, data) {
    //API call to search for Account
    /*
    fetch('https://mywebsite.com/endpoint/', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      }).then(response => {
        this.setState({
          data: response.data.data
        });
      })
      .catch(error => {console.log('error is fetching account data', error);});
    */
    console.log('account to search is', accountName);
    //if the data.id matches accountName add to data
    for (var account in data) {
      if (data[account].id == accountName)
        console.log('account is ', data[account]);
      else
        data.splice(account, 1);
    }
    this.setState({ temp_data: data });
  }

  render() {
    return(
      <div>
        <div>
          <form onSubmit={ this.searchAccount }>
            <input
              type="text"
              value={this.state.account}
              onChange={this.onAccountEnter}
              placeholder="Account"
            />
            <input type="submit" value="Search Account" />
          </form>
          <ListAccounts name={ this.state.account } data={ this.state.temp_data }/>
        </div>
      </div>
    );
  }

}
