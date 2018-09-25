/*Used in Account*/
import React,  { Component } from 'react';

class AccountDetail extends Component {
	render() {
		const foundBalances = this.props.detail.balances;
		const balanceList = foundBalances.map(balance =>
			<ul key={balance.owner} >{ balance.balance } { balance.symbol }</ul>
		);

		const foundProposals = this.props.detail.proposals;
		const proposalList = foundProposals.map(proposal =>
			<ul key={proposal.owner}>{ proposal.proposal }</ul>
		);

		const foundVotes = this.props.detail.votes;
		const voteList = foundVotes.map(vote =>
			<ul key={vote.owner}>{ vote.vote } voted</ul>
		);

		return (
			<tr>
				<td>{ this.props.detail.id }</td>
				<td>{ balanceList }</td>
				<td>{ proposalList }</td>
				<td>{ voteList }</td>
				<td>{ this.props.detail.referrer_name }</td>
			</tr>
		);
	}
}

export default AccountDetail;
