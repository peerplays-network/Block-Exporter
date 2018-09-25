import React, { Component } from 'react';
import WitnessRow from './WitnessRow';
//State will be removed once data feed is established

class TransactionDisplay extends Component {
	constructor() {
		super();
		this.state = {witnessData: [{rank: 1, name: 'Mark', votes: 23122, misses: 156, lastBlock: 7823786}, 
									{rank: 2, name: 'Paul', votes: 83721, misses: 821, lastBlock: 8767091}
								   ]};
	}
	
	render() {
		return (
			<div>
				<table className="table">
					<thead className="thead-light">
						<tr>
							<th scope="col">Head Block Number</th>
							<th scope="col">Head Block Age</th>
							<th scope="col">Chain Id</th>
							<th scope="col">Misses</th>
							<th scope="col">Last Block</th>
						</tr>
					</thead>
					<tbody>
						{this.state.witnessData.map(witness => {
							return <WitnessRow
								key={witness.rank} 
								rank={witness.rank}
								witness={witness.name}
								votes={witness.votes}
								misses={witness.misses}
								lastBlock={witness.lastBlock}
							/>;
						})}
					</tbody>
				</table>
			</div>
		);
	}
}

export default TransactionDisplay;