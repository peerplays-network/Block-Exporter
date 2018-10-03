import React, { Component } from 'react';
import Countdown from 'react-countdown-now';
import axios from 'axios';
import styles from './styles.css';

class MaintenanceCD extends Component {
	constructor() {
		super();
		this.state = {nextMaintenanceTime: Date.now() + 1000000 };
	}
	componentDidMount() {
		const gridHeight=20;
		this.props.calculateComponentHeight(this.props.id, gridHeight);

		axios.get('api/variables/', {
		}).then(response => {
			this.setState({nextMaintenanceTime: response.data[0].value});
		}).catch(error => {console.log('error fetching maintenance data', error);});
	}
	
	render() {
		return (
			<div className={`${styles['box-shadow']} ${styles['centerText']} ${styles['digital']} p-3`} style={this.props.size}>
				<Countdown date={this.state.nextMaintenanceTime} />
			</div>
		);
	}
}

export default MaintenanceCD;
