import React, { Component } from 'react';
import Link from '@material-ui/core/Link';

class WitnessRow extends Component {
	render() {
		const witnessLink = `/accountAllDetail/${this.props.witness}/${this.props.account_id}`;
		return (
			<tr>
				<td className="align-middle">{this.props.rank}</td>
				<td className="align-middle"><Link href={witnessLink}>{this.props.witness}</Link></td>
				<td className="align-middle">{this.props.votes}</td>
				<td className="align-middle">{this.props.misses}</td>
				<td className="align-middle">{this.props.lastBlock}</td>
			</tr>
		);
	}
}

export default WitnessRow;