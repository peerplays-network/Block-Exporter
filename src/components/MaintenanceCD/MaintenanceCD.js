import React, { Component } from 'react';
import Countdown from 'react-countdown-now';
import styles from './styles.css';

class MaintenanceCD extends Component {
	render() {
		return (
			<div className={`${styles['box-shadow']} ${styles['centerText']} ${styles['digital']} p-3`}style={this.props.size}>
				<Countdown date={Date.now() + 1000000} />
			</div>
		);
	}
}

export default MaintenanceCD;
