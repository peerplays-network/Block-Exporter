/*current implementation will be refactored to not include a giant state array of fake components :).
* 
*/

import React, { Component } from 'react';
import Panel from '../Panel/Panel';
import MaintenanceCD from '../MaintenanceCD/MaintenanceCD';
import SidePanel from '../SidePanel/SidePanel';
import styles from './styles.css';
import {Rnd} from 'react-rnd';
import WitnessViewer from '../WitnessViewer/WitnessViewer';
import AccountSearch from '../Account/Account';

class Welcome extends Component {
	constructor() {
		super();

		this.state = {components: [{name: 'Witness Feed', img: 'https://via.placeholder.com/50x50', minSize: 'medium', currentSize: '', visible: false, id: 0},
								   {name: 'Maintenance Countdown', img: 'https://via.placeholder.com/50x50', minSize: 'small', currentSize: '', visible: false, id: 1},
								   {name: 'Account Feed', image: 'https://via.placeholder.com/50x50', minSize:'large', currentSize: '', visible: false, id:2}
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
		stateCopy.components[id].currentSize = size;
		stateCopy.components[id].visible = true;
		this.setState({stateCopy});
		this.componentClicked(id);
	}

	renderComponent(component) {
		switch(component.id) {
			case 0:
				return <WitnessViewer />;
			case 1:
				return <MaintenanceCD size={{'fontSize': (component.size === 'small') ? '2em' : '4em'}} />;
			case 2:
				return <AccountSearch />;
			default:
				return;
		}
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

	render() {
		return (
			<div>
				<div>
					{this.state.components.map(component => { 
						return (
							component.visible ? (
								
								<Rnd
									key={component.id}
									default={{
										x: 400,
										y: 200,
									}}
								> 
									<Panel headerText={component.name} 
										style={{ margin: '24px auto', width: this.getPanelSize(component.currentSize) }} 
										onClose={() => this.onClosePanel.bind(this, component.id)}>
										<div className={`${styles['data-react']}`}>
											{this.renderComponent(component)}
										</div>
									</Panel>      
								</Rnd>
							) : null
						);
					})}
				</div>
				<div>
					<SidePanel components={this.state.components} 
							   changeSize={this.changePanelSize.bind(this)}/>	
				</div>
			</div>
		);
	}
}

export default Welcome;
