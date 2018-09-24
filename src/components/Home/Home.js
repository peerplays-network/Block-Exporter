/*current implementation will be refactored to not include a giant state array of fake components :).
* 
*/

import React, { Component } from 'react';
import { Button } from 'reactstrap';
import Panel from '../Panel/Panel';
import MaintenanceCD from '../Panel/MaintenanceCD';
import SidePanel from '../SidePanel/SidePanel';
import styles from './styles.css';
import {Rnd} from 'react-rnd';
import WitnessViewer from '../WitnessViewer/WitnessViewer';

class Welcome extends Component {
	constructor() {
		super();
		this.state = {components: [{name: 'Transition Feed', image: 'placeholder.img', size: 'medium', visible: false, id: 0},
								   {name: 'Witness Feed', image: 'placeholder.img', size: 'medium', visible: false, id: 1},
								   {name: 'Maintenance Countdown', image: 'placeholder.img', size: 'medium', visible: false, id: 2}
								  ]
					 };
	}

	onClosePanel(id) {
    	const stateCopy = Object.assign({}, this.state);
		stateCopy.components[id].visible = false;
		this.setState({stateCopy});
	}
	
	componentClicked(id) {
		const stateCopy = Object.assign({}, this.state);
		stateCopy.components[id].visible = true;
		this.setState({stateCopy});
	}

	changePanelSize(id, size) {
		const stateCopy = Object.assign({}, this.state);
		stateCopy.components[id].size = size;
		stateCopy.components[id].visible = true;
		this.setState({stateCopy});
		this.componentClicked(id);
	}

	getPanelSize(size) {
		switch(size) {
			case 'small':
				return '200px';
			case 'medium':
				return '400px';
			case 'large':
				return '600px';
			default:
				return;
		}
	}
	
	displayComponent(selected) {
		switch(selected.name) {
			case 'Maintenance Countdown':
				return (
					<MaintenanceCD 
						headerText={selected.name}
						style={{ margin: '12px auto', 
								 width: this.getPanelSize(selected.size) }} 
						onClose={this.onClosePanel.bind(this)}
						size={{'font-size': (selected.size === 'small') ? '2em' : '4em'}}
					/>
				);
			default:
				return (
					<Panel headerText={selected.name} 
						style={{ margin: '24px auto', width: this.getPanelSize(selected.size) }} 
						onClose={() => this.onClosePanel.bind(this, selected.id)}>
						<div className={`${styles['data-react']}`}>
							<h3>Test</h3>
							<Button>Bootstrap Button</Button>
						</div>
					</Panel>
				);
		}
	}

	render() {
		return (
			<div>
				<div>
					{this.state.components.map(component => { 
						return (
							component.visible ? (
								
								<Rnd
									default={{
										x: 400,
										y: 200,
									}}
								> 
									{this.displayComponent(component)}      
								</Rnd>
							) : null
						);
					})}
				</div>
				<div>
					<SidePanel components={this.state.components} 
							   visible={this.componentClicked.bind(this)} 
							   changeSize={this.changePanelSize.bind(this)}/>	
				</div>
			</div>
		);
	}
}

/*
<MaintenanceCD 
	headerText={'Maintenance Countdown'} 
	width={'400px'} 
	style={{ margin: '24px auto', width: '400px' }} 
	onClose={this.onClosePanel.bind(this)} 
/>
*/

export default Welcome;
