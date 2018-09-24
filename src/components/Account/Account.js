import React, { Component } from 'react';
import { Pagination, PaginationItem, PaginationLink, button, Table } from 'reactstrap';
import axios from 'axios';
import styles from './Account.css';
import AccountDetail from './subcomponents/AccountDetail';

export default class AccountSearch extends Component {

  constructor(e) {
    super(e);
    this.data = [
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
        }]},
        {id: 'gold-blohcks', votes: [], proposals: [], referrer_name: 'peerplays-faucet', balances: [{
          "asset_type": "1.3.0",
          "symbol": "PPY",
          "owner": "1.2.9833",
          "balance": 11683915631,
          "id": "2.5.8735"
        }]},
        {id: 'gold-bljghkocks', votes: [], proposals: [], referrer_name: 'peerplays-faucet', balances: [{
          "asset_type": "1.3.0",
          "symbol": "PPY",
          "owner": "1.2.9833",
          "balance": 11683915631,
          "id": "2.5.8735"
        }]},
        {id: 'gold-bklocks', votes: [], proposals: [], referrer_name: 'peerplays-faucet', balances: [{
          "asset_type": "1.3.0",
          "symbol": "PPY",
          "owner": "1.2.9833",
          "balance": 11683915631,
          "id": "2.5.8735"
        }]},
        {id: 'golhd-blocks', votes: [], proposals: [], referrer_name: 'peerplays-faucet', balances: [{
          "asset_type": "1.3.0",
          "symbol": "PPY",
          "owner": "1.2.9833",
          "balance": 11683365631,
          "id": "2.5.8735"
        }]}
      ];

    this.state = {
        data: [],
        account : '',
        temp_data: this.data,
        currentPage: 0
    };
    //pagination info
    this.pageSize = 5;
    this.pagesCount = Math.ceil(this.data.length / this.pageSize);



    this.onAccountEnter = this.onAccountEnter.bind(this)
    this.searchAccount = this.searchAccount.bind(this);
    this.findAccount = this.findAccount.bind(this);
  }

  handleClick(e, index) {
    e.preventDefault();
    this.setState({ currentPage: index  });
  }

  onAccountEnter(e) {
    const account = e.target.value;
    this.setState({ account: e.target.value });
  }

  searchAccount(e) {
    if (e) e.preventDefault();
    this.findAccount(this.state.account, this.data);
    e.currentTarget.reset();
  }

  findAccount(accountName, data) {
    //API call to search for Account
    /*
    axios.get('/account',{
      params:{
        //none since it is all account
      }
    })
    .then(response => {
        this.setState({
          data: response.data.data
        });
      })
      .catch(error => {console.log('error is fetching account data', error);});
    */
    var temp_data = [];
      //if the data.id matches accountName add to data
      for (var account in data) {
        if (data[account].id == accountName)
          temp_data.push(data[account]);

      }
      if (temp_data.length <= 0)
        temp_data = data;
    this.setState({ temp_data: temp_data });
  }

  render() {
    const { currentPage } = this.state;

    return(
        <div>
        <div className="pagination-wrapper">
          <form onSubmit={ this.searchAccount }>
              <input
                type="text"
                value={this.state.account}
                onChange={this.onAccountEnter}
                placeholder="Account"
              />
              <input type="submit" value="Search Account" />
            </form>
            <Pagination aria-label="Page navigation example">
                <PaginationItem disabled={currentPage <= 0}>
                  <PaginationLink
                    onClick={e => this.handleClick(e, currentPage - 1)}
                    previous href="#"
                  />
                </PaginationItem>
                    {[...Array(this.pagesCount)].map((page, i) =>
                      <PaginationItem active={i === currentPage} key={i}>
                        <PaginationLink onClick={e => this.handleClick(e, i)} href="#">
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                <PaginationItem disabled={currentPage >= this.pagesCount - 1}>
                  <PaginationLink
                    onClick={e => this.handleClick(e, currentPage + 1)}
                    next href="#"
                  />
                </PaginationItem>
            </Pagination>
        </div>

          <Table>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Balances</th>
                    <th>Proposals</th>
                    <th>Votes</th>
                    <th>Referrer</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.temp_data
                    .slice(
                      currentPage * this.pageSize,
                      (currentPage + 1) * this.pageSize
                    ).map((account, i) =>
                      <AccountDetail detail={ account } key={i}/>
                  )}
                </tbody>
          </Table>

        </div>
    );
  }

}
