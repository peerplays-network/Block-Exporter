import React, { Component } from 'react';
import styles from './styles.css';

class WitnessRow extends Component {

	render() {
		return (
			<tr>
				<td>{this.props.rank}</td>
				<td>{this.props.witness}</td>
				<td>{this.props.votes}</td>
				<td>{this.props.misses}</td>
				<td>{this.props.lastBlock}</td>
			</tr>
		);
	}
}

export default WitnessRow;