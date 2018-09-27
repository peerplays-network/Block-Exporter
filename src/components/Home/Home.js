/*current implementation will be refactored to not include a giant state array of fake components :).
* 
*/

import React, { Component } from 'react';
import Panel from '../Panel/Panel';
import MaintenanceCD from '../MaintenanceCD/MaintenanceCD';
import SidePanel from '../SidePanel/SidePanel';
import styles from './styles.css';
import WitnessViewer from '../WitnessViewer/WitnessViewer';
import AccountSearch from '../Account/Account';
import GridLayout, {WidthProvider as widthProvider} from 'react-grid-layout';
const Grid = widthProvider(GridLayout);

class Welcome extends Component {
	constructor() {
		super();

		this.state = {components: [{name: 'Witness Feed', img: 'https://via.placeholder.com/50x50', minSize: 'medium', currentSize: '', visible: false, id: 0},
								   {name: 'Maintenance Countdown', img: 'https://via.placeholder.com/50x50', minSize: 'small', currentSize: '', visible: false, id: 1},
								   {name: 'Account Feed', image: 'https://via.placeholder.com/50x50', minSize:'large', currentSize: '', visible: false, id: 2}
								  ], 
								  layout : [ {i: '0', x: 0, y: 0, w: 3, h: 20}, {i: '1', x: 0, y: 0, w: 3, h: 20}, {i: '2', x: 0, y: 0, w: 3, h: 20}]	
					 };
	}
	//medium width: 3
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
		const stringId = id.toString();
		switch(size) {
			case 'small' :
				stateCopy.layout[id] = {i: stringId, x: 0, y: 0, w: 3, h: 20};
				console.log('small');
				break;
			case 'medium' :
				stateCopy.layout[id] = {i: stringId, x: 0, y: 0, w: 6, h: 20};
				console.log('medium');
				break;
			case 'large' :
				stateCopy.layout[id] = {i: stringId, x: 0, y: 0, w: 9, h: 20};
				console.log('large');
				break;
			default:
				console.log('default');
				return;
		}

		stateCopy.components[id].currentSize = size;
		stateCopy.components[id].visible = true;
		console.log('setting: ', stateCopy.layout);
		this.setState({stateCopy});
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

	updateGrid(id) {

	}

	render() {
		const newLayout = JSON.parse(JSON.stringify(this.state.layout));

		return (
			<div>
				<div>
					<Grid className="layout" layout={newLayout} cols={12} compactType={'none'} 
						rowHeight={0} preventCollision={true} onDragStop={() => {console.log('dragging')}}> 
						 {this.state.components.map(component => { 
							return (
								component.visible ? ( 
									<div key={component.id} style={{borderStyle: 'dashed'}}>
										<Panel headerText={component.name}  
											onClose={() => this.onClosePanel.bind(this, component.id)}>
											<div key={component.id} className={`${styles['data-react']}`}>
												{this.renderComponent(component)}
											</div>
										</Panel>
									</div>
								) : <div key={component.id} data-grid={this.state.layout[component.id]}> </div>
							);
						})
						 }
					</Grid>
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
