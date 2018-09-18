import React, { Component } from 'react';
import { Button, Table } from 'reactstrap';
import styles from './account.css';

import { fetchExchangeRatesBTC } from '../../actions/index';


export default class AccountSearch extends Component {

  constructor(e) {
    super(e);

    this.state = {
        account : ''
    };
    this.onAccountEnter = this.onAccountEnter.bind(this)
  }

  onAccountEnter(e) {
    const account = e.target.value;
    console.log('account entered is ', account);
    this.setState({ account: e.target.value });
  }

  searchPlayer(e) {
    if (e) e.preventDefault();
    this.findAccount(this.state.account);//function to get account name
    e.currentTarget.reset();
    this.setState({ account: '' });
  }

  render() {
    return(
      <div>
        <div>
          <h3> Search Account </h3>
          <form onSubmit={ this.searchPlayer }>
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
