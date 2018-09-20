import React, { Component } from 'react';
import Countdown from 'react-countdown-now';
import styles from './styles.css';

class MaintenanceCD extends Component {
	
	render() {
		return (
			<div>
				<div className={`${styles['center']} card border-dark mb-3`} style={this.props.style}>
					<div className="card-header pr-1">
						<span>
							<h5 className="card-title float-left">{this.props.headerText}</h5>
							<button className={`${styles['closeButton']} link float-right border-0 bg-transparent`} onClick={this.props.onClose}>X</button>
						</span>
					</div>
					<div className={`${styles['box-shadow']} ${styles['centerText']} ${styles['digital']} p-3`}>
                        <Countdown date={Date.now() + 1000000} />
					</div>
				</div>
			</div>
		);
	}
}

export default MaintenanceCD;
