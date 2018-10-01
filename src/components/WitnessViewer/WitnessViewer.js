import React, { Component } from 'react';
import WitnessRow from './WitnessRow';
import axios from 'axios'; 

class WitnessViewer extends Component {
	constructor() {
		super();
		this.state = {topFiveWitnessData: [], witnessData: []};
	}

	fetchData() {
		//API call to search for witness
		axios.get('api/witnesses/', {
		}).then(response => {
			let sortedWitnessData = response.data.sort((a, b) => (a.total_votes > b.total_votes) ? 1 : ((b.total_votes > a.total_votes) ? -1 : 0));
			this.setState({witnessData: sortedWitnessData});
			sortedWitnessData = sortedWitnessData.slice(0, 5);
			this.setState({ topFiveWitnessData: sortedWitnessData });
		}).catch(error => {console.log('error fetching witness data', error);});
	}

	componentDidMount() {
		this.fetchData();
		const gridHeight=40;
		this.props.calculateComponentHeight(this.props.id, gridHeight);
	}

	renderSmallTable() {
		return (
			<table className="table">
				<thead className="thead-light">
					<tr>
						<th scope="col">Rank</th>
						<th scope="col">Witness</th>
						<th scope="col">Votes</th>
						<th scope="col">Misses</th>
						<th scope="col">URL</th>
					</tr>
				</thead>
				<tbody>
					{this.state.topFiveWitnessData.map((witness, index) => {
						return <WitnessRow
							key={witness.id}
							rank={index+1}
							witness={witness.account_name}
							votes={witness.total_votes}
							misses={witness.total_missed}
							lastBlock={witness.url}
						/>;
					})}
				</tbody>
			</table>
		);
	}

	renderBigTable() {
		return (
			<table className="table">
				<thead className="thead-light">
					<tr>
						<th scope="col">Rank</th>
						<th scope="col">Witness</th>
						<th scope="col">Votes</th>
						<th scope="col">Misses</th>
						<th scope="col">URL</th>
					</tr>
				</thead>
				<tbody>
					{this.state.witnessData.map((witness, index) => {
						return <WitnessRow
							key={witness.id}
							rank={index+1}
							witness={witness.account_name}
							votes={witness.total_votes}
							misses={witness.total_missed}
							lastBlock={witness.url}
						/>;
					})}
				</tbody>
			</table>
		);
	}
	
	render() {
		console.log('witness data: ', this.state.witnessData);
		console.log('witness data: ', this.props.size);
		return (
			<div>
				{this.props.size === 'small' ? 
					this.renderSmallTable()
					:
					this.renderBigTable()
				}
			</div>
		);
	}
}

export default WitnessViewer;