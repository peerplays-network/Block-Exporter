import React, { Component, Fragment } from 'react';
import WitnessRow from './WitnessRow';
import axios from 'axios';
import { Input, InputGroup, InputGroupAddon, Button } from 'reactstrap'; 

class WitnessViewer extends Component {
	constructor() {
		super();
		this.state = {topFiveWitnessData: [], witnessData: [], searchData: [], witness: ''};
	}

	componentDidMount() {
		this.fetchData();
		const gridHeight=40;
		this.props.calculateComponentHeight(this.props.id, gridHeight);
	}

	fetchData() {
		//API call to search for witness
		axios.get('api/witnesses/', {
		}).then(response => {
			let sortedWitnessData = response.data.sort((a, b) => (a.total_votes > b.total_votes) ? 1 : ((b.total_votes > a.total_votes) ? -1 : 0));
			this.setState({witnessData: sortedWitnessData});
			this.setState({searchData: sortedWitnessData});
			sortedWitnessData = sortedWitnessData.slice(0, 5);
			this.setState({ topFiveWitnessData: sortedWitnessData });
		}).catch(error => {console.log('error fetching witness data', error);});
	}

	onWitnessEnter(e) {
		e.preventDefault();
		this.setState({witness: e.target.value});

	}

	searchWitness(e) {
		if (e) e.preventDefault();
		this.findAccount(this.state.witness, this.state.witnessData);
		e.currentTarget.reset();
	}

	findAccount(witness, data) {
		var temp_data = [];
		//if the data.id matches witness name add to data
		debugger;
		for (var account in data) {
			debugger;
			if (data[account].account_name.indexOf(witness) >= 0 ) 
				temp_data.push(data[account]);
		}
		if (temp_data.length <= 0)
			temp_data = data;
		this.setState({ searchData: temp_data });
		//this.data = temp_data;
		//this.refreshPagination();
	}

	renderTable(data) {
		return (
			<Fragment>
				{this.props.size !== 'small' ? 
					<form onSubmit={this.searchWitness.bind(this)}>
						<InputGroup>
							<Input type="text" value={this.state.witness} onChange={this.onWitnessEnter.bind(this)} placeholder="Account" />
							<InputGroupAddon addonType="append"><Button>Search Account</Button></InputGroupAddon>
						</InputGroup>
					</form> : null}
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
						{data.map((witness, index) => {
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
			</Fragment>
		);
	}
	
	render() {
		console.log('searched data',this.state.searchData);
		return (
			<div>
				{this.props.size === 'small' ? 
					this.renderTable(this.state.topFiveWitnessData)
					:
					this.renderTable(this.state.searchData)
				}
			</div>
		);
	}
}

export default WitnessViewer;