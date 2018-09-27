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

		this.state = {components: [{name: 'Witness Feed', img: 'https://via.placeholder.com/50x50', minSize: 'medium', visible: false, id: 0},
								   {name: 'Maintenance Countdown', img: 'https://via.placeholder.com/50x50', minSize: 'small', visible: false, id: 1},
								   {name: 'Account Feed', image: 'https://via.placeholder.com/50x50', minSize:'large', visible: false, id: 2}
								  ], 
								  layout : [ {i: '0', x: 3, y: 0, w: 2.5, h: 20, minW: 3.5}, {i: '1', x: 3, y: 31, w: 3.5, h: 20}, {i: '2', x: 7.5, y: 0, w: 4.5, h: 20, minW: 4.5}]	
					 };
	}

	onClosePanel(id) {
    	const stateCopy = Object.assign({}, this.state);
		stateCopy.components[id].visible = false;
		this.setState({stateCopy});
	}

	changePanelSize(id, size) {
		const stateCopy = Object.assign({}, this.state);
		const stringId = id.toString();
		switch(size) {
			case 'small' :
				stateCopy.layout[id].w = 2.5;
				break;
			case 'medium' :
				stateCopy.layout[id].w = 3.5;
				break;
			case 'large' :
				stateCopy.layout[id].w = 4.5;
				break;
			default:
				return;
		}

		stateCopy.components[id].visible = true;
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

	updateCoordinates(layout, oldItem, newItem, placeholder, e, element) {
		const stateCopy = Object.assign({}, this.state);
		const id = Number(oldItem.i);

		stateCopy.layout[id] = {i: id.toString(), x: newItem.x, y: newItem.y, w: newItem.w, h: (element.offsetHeight/10), minW: oldItem.minW};
		console.log('updated coordinates: ', stateCopy.layout[id]);
		this.setState({stateCopy});
	}

	render() {
		const newLayout = JSON.parse(JSON.stringify(this.state.layout));

		return (
			<div>
				<div>
					<Grid className="layout" layout={newLayout} cols={12} compactType={null}
						rowHeight={1} draggableCancel=".btn"
						onDragStop={(layout, oldItem, newItem, placeholder, e, element)=>this.updateCoordinates(layout, oldItem, newItem, placeholder, e, element)}> 
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
