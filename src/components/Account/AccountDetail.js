/*Used in Account*/
import React,  { Component } from 'react';
import AccountSearch from './Account';

class AccountDetail extends AccountSearch {

  render() {
    const foundBalances = this.props.detail.balances;
    let balanceList = foundBalances.map(balance =>
      <ul key={ balance.owner } >{ balance.balance } { balance.symbol }</ul>
    );

    const foundProposals = this.props.detail.proposals;
    let proposalList = foundProposals.map(proposal =>
      <ul>{ proposal.proposal } { proposal.symbol }</ul>
    );

    const foundVotes = this.props.detail.votes;
    let voteList = foundVotes.map(vote =>
      <ul>{ vote.vote } { vote.symbol }</ul>
    );

    return (
        <tr>
          <th>{ this.props.detail.id }</th>
          <th>{ balanceList }</th>
          <th>{ proposalList }</th>
          <th>{ voteList }</th>
          <th>{ this.props.detail.referrer_name }</th>
        </tr>
    );
  }

}

export default AccountDetail;
