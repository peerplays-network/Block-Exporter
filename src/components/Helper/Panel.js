import React, { Component } from 'react';
import { Button } from 'reactstrap';
import styles from './styles.css';

class Panel extends Component {
	constructor(props) {
		super(props)
	}
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
					<div className={`${styles['box-shadow']} p-3`}>
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}
}

export default Panel;
