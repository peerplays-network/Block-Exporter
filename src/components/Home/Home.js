/*current implementation will be refactored to not include a giant state array of fake components :).
* 
*/

import React, { Component } from 'react';
import Panel from '../Panel/Panel';
import SidePanel from '../SidePanel/SidePanel';
import styles from './styles.css';
import {Rnd} from 'react-rnd';
import WitnessViewer from '../WitnessViewer/WitnessViewer';

class Welcome extends Component {
	constructor() {
		super();
		this.state = {components: [{name: 'Transition Feed', img: 'https://via.placeholder.com/50x50', size: 'medium', visible: false, id: 0},
			{name: 'Witness Feed', img: 'https://via.placeholder.com/50x50', size: 'medium', visible: false, id: 1}]};
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

	renderComponent(id) {
		switch(id) {
			case 0:
				return (<div><h3>hey</h3></div>);
			case 1:
				return <WitnessViewer />;
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
					{
						this.state.components.map(component => { 
							return (
								component.visible ? (
									<Rnd
										default={{
											x: 400,
											y: 200,
										}}
									> 
										{
											<Panel headerText={component.name} style={{  margin: '24px auto', width: this.getPanelSize(component.size) }} onClose={() => this.onClosePanel.bind(this, component.id)}>
												<div className={`${styles['data-react']}`}>
													{this.renderComponent(component.id)}
												</div>
											</Panel> 
										}		      
									</Rnd>) : null
							);
						})
					}
				</div>
				<div>
					<SidePanel components={this.state.components} changeSize={this.changePanelSize.bind(this)}/>	
				</div>
			</div>
		);
	}
}

export default Welcome;
