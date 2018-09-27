/*Used in Account*/
import React,  { Component } from 'react';
import { NavLink } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';

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
				<td><NavLink tag={RRNavLink} to="/accountAllDetail/" account={this.props.detail.id} >{ this.props.detail.id }</NavLink></td>
				<td>{ balanceList }</td>
				<td>{ proposalList }</td>
				<td>{ voteList }</td>
				<td>{ this.props.detail.referrer_name }</td>
			</tr>
		);
	}
}

export default AccountDetail;
