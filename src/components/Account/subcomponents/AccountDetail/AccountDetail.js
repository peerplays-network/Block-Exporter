import React,  { Component } from 'react';

const AccountDetail = props => {

  const foundBalances = props.detail.balances;
  let balanceList = foundBalances.map(balance =>
    <ul key={ balance.owner } >{ balance.balance } { balance.symbol }</ul>
  );

  const foundProposals = props.detail.proposals;
  let proposalList = foundProposals.map(proposal =>
    <ul>{ proposal.proposal } { proposal.symbol }</ul>
  );

  const foundVotes = props.detail.votes;
  let voteList = foundVotes.map(vote =>
    <ul>{ vote.vote } { vote.symbol }</ul>
  );

  return(
          <tr>
            <th>{ props.detail.id }</th>
            <th>{ balanceList }</th>
            <th>{ proposalList }</th>
            <th>{ voteList }</th>
            <th>{ props.detail.referrer_name }</th>
          </tr>
  );
}

export default AccountDetail;
