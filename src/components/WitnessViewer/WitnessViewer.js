import React, { Component } from 'react';
import WitnessRow from './WitnessRow';
import axios from 'axios'; 

class WitnessViewer extends Component {
	constructor() {
		super();
		this.state = {witnessData: []};
	}

	fetchData() {
		//API call to search for Account
		axios.get('api/witnesses/', {
		}).then(response => {
			let sortedWitnessData = response.data.sort((a, b) => (a.total_votes > b.total_votes) ? 1 : ((b.total_votes > a.total_votes) ? -1 : 0));
			sortedWitnessData = sortedWitnessData.slice(0, 5);
			this.setState({ witnessData: sortedWitnessData });
			debugger;
		}).catch(error => {console.log('error fetching account data', error);});
	}

	componentDidMount() {
		this.fetchData();
	}
	
	render() {
		return (
			<div>
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
			</div>
		);
	}
}

export default WitnessViewer;