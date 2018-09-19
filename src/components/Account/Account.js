import React, { Component } from 'react';
import { Button, Table } from 'reactstrap';
import styles from './account.css';

import { fetchExchangeRatesBTC } from '../../actions/index';


export default class AccountSearch extends Component {

  constructor(e) {
    super(e);

    this.state = {
        account : '',
        data: []
    };
    this.onAccountEnter = this.onAccountEnter.bind(this)
  }

  onAccountEnter(e) {
    const account = e.target.value;
    this.setState({ account: e.target.value });
  }

  searchAccount(e) {
    if (e) e.preventDefault();
    this.findAccount(this.state.account);//function to get account name
    e.currentTarget.reset();
    this.setState({ account: '' });
  }

  findAccount(accountName) {
    //API call to search for Account
    /*
    .get(`http://<the url or access to the Account>${accountName}`)
    .then(response => {
      this.setState({
        data: response.data.data
      });
    })
    .catch(error => {console.log('error is fetching account data', error);});
    */
    /*
    fetch('https://mywebsite.com/endpoint/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstParam: 'yourValue',
        secondParam: 'yourOtherValue',
      }),
      }).then((response) => response.json())
        .then((responseJson) => {
          return responseJson.movies;
        })
        .catch((error) => {
          console.error(error);
        });
    */
    console.log('account to search is ', accountName);
  }

  render() {
    return(
      <div>
        <div>
          <h3> Search Account </h3>
          <form onSubmit={ this.searchAccount }>
            <input
              type="text"
              value={this.state.account}
              onChange={this.onAccountEnter}
              placeholder="Account"
            />
            <input type="submit" value="Search Account" />
          </form>
        </div>
      </div>
    );
  }

}
