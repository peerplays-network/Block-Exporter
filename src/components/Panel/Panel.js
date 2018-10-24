/* Reusable Panel component to be used for drag and drop layout 
*Props taken in: headerText, width, style, onClose
* All elements put between <Panel> </Panel> will be rendered by this.props.children
* Please add anything that is missing! This is not necessarily a completed component
*/
//max-height: 400px;
//overflow: auto;
import React, { Component } from 'react';
import styles from './styles.css';
import { Button } from 'reactstrap';

class Panel extends Component {
	calculateHeight() {
		switch(this.props.size) {
			case 'small':
				return '400px';
			case 'medium':
				return '500px';
			case 'large':
				return '600px';
			default :
				return '300px';
		}
	}
	
	render() {
		return (
			<div>
				<div className="card border-dark" style={{maxHeight: `${this.calculateHeight()}`}}>
					<div className={`${styles['header-widget-background']} ${styles['header-contrast-text']} card-header pr-1`}>
						<span>
							<h5 className="card-title float-left">{this.props.headerText}</h5>
							<Button type="button" className={`${styles['header-contrast-text']} close`} onClick={this.props.onClose(this.props.componentId)}> <span aria-hidden="true">&times;</span> </Button>
						</span>
					</div>
					<div className={`${styles['box-shadow']} p-1 panel-body`}>
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}
}

export default Panel;
