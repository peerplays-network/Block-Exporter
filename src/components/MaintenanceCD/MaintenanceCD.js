import React, { Component } from 'react';
import Countdown from 'react-countdown-now';
import styles from './styles.css';
import {getMaintenanceTime} from '../../api/GeneralApi';

class MaintenanceCD extends Component {
	constructor() {
		super();
		this.state = {nextMaintenanceTime: Date.now() + 1000000 };
	}
	componentDidMount() {
		const gridHeight=11;
		this.props.calculateComponentHeight(this.props.id, gridHeight);

		getMaintenanceTime().then(response => {
			this.setState({nextMaintenanceTime: response});
		}).catch(error => {console.log('error fetching maintenance data', error);});
	}
	
	render() {
		return (
			<div className={`${styles['display']}`} style={this.props.size}>
				<Countdown date={this.state.nextMaintenanceTime} />
			</div>
		);
	}
}

export default MaintenanceCD;
