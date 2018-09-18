/* Reusable Panel component to be used for drag and drop layout 
*Props taken in: headerText, width, style, onClose
* All elements put between <Panel> </Panel> will be rendered by this.props.children
* Please add anything that is missing! This is not necessarily a completed component
*/

import React, { Component } from 'react';
import styles from './styles.css';

class Panel extends Component {
	
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
