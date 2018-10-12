/* 
NOTE: Currently there is a dotted border line around each component. This is to show the boundaries
of the draggable grid item, and help you define a height that is right for your component. 
Unfortunately the grid library has no auto height, so we must define the height for each 
component ourselves. Eventually we will have to write a class that calculates height of 
components ourselves, but for now we are defining the height inside of each component
and feeding it to calculateComponentHeight()
*/

import React, { Component } from 'react';
import Panel from '../Panel/Panel';
import MaintenanceCD from '../MaintenanceCD/MaintenanceCD';
import SidePanel from '../SidePanel/SidePanel';
import styles from './styles.css';
import TransactionDisplay from '../Transactions/TransactionDisplay';
import WitnessViewer from '../WitnessViewer/WitnessViewer';
import FeeDirectory from '../FeeDirectory/FeeDirectory';
import AccountSearch from '../Account/Account';
import GridLayout, {WidthProvider as widthProvider} from 'react-grid-layout';

const Grid = widthProvider(GridLayout);

class Welcome extends Component {
	constructor() {
		super();

		this.state = {components: [{name: 'Witness Feed', img: 'https://via.placeholder.com/50x50', minSize: 'small', size: '', visible: false, id: 0, gridPlacement: {i: '0', x: 3, y: 0, w: 2.5, h: 20}},
								   {name: 'Maintenance Countdown', img: 'https://via.placeholder.com/50x50', minSize: 'small', size: '', visible: false, id: 1, gridPlacement: {i: '1', x: 3, y: 31, w: 3.5, h: 20}},
								   {name: 'Account Feed', image: 'https://via.placeholder.com/50x50', minSize:'large', size: '', visible: false, id: 2, gridPlacement: {i: '2', x: 7.5, y: 0, w: 4.5, h: 20}},
								   {name: 'Current Transactions', image: 'https://via.placeholder.com/50x50', minSize:'large', size: '', visible: false, id:3, gridPlacement: {i: '3', x: 7.5, y: 0, w: 4.5, h: 20}},
								   {name: 'Fee Directory', image: 'https://via.placeholder.com/50x50', minSize:'small', size: '', visible: false, id:4, gridPlacement: {i: '4', x: 3, y: 0, w: 4.5, h: 20}}
								  ], 
								  layout : [],
					 };
	}

	onClosePanel(id) {
		//finds the entry in layout and deletes it
		const stateCopy = Object.assign({}, this.state);
		const index = stateCopy.layout.findIndex(x => x.i===id.toString()); 
		stateCopy.layout.splice(Number(index), 1);
		stateCopy.components[id].visible = false;
		this.setState({stateCopy});
	}

	changePanelSize(id, size) {
		/*changes the width dependent upon which button is clicked. If the entry already exists in layout (e.g. the size is changed)
		* then the layout entry is overwritten by the new state object, otherwise it is pushed into the layout array
		*/
		const stateCopy = Object.assign({}, this.state);

		switch(size) {
			case 'small' :
				stateCopy.components[id].gridPlacement.w = 18;
				stateCopy.components[id].size = 'small';
				break;
			case 'medium' :
				stateCopy.components[id].gridPlacement.w = 21;
				stateCopy.components[id].size = 'medium';
				break;
			case 'large' :
				stateCopy.components[id].gridPlacement.w = 24;
				stateCopy.components[id].size = 'large';
				break;
			default:
				return;
		}

		const index = stateCopy.layout.findIndex(x => x.i===id.toString());
		index === -1 ? stateCopy.layout.push(stateCopy.components[id].gridPlacement) : stateCopy.layout[index] = stateCopy.components[id].gridPlacement;
		stateCopy.components[id].visible = true;
		this.setState({stateCopy});
	}

	renderComponent(component) {
		switch(component.id) {
			case 0:
				return <WitnessViewer id={component.id} calculateComponentHeight={this.calculateComponentHeight.bind(this)} size={component.size}/>;
			case 1:
				return <MaintenanceCD id={component.id} calculateComponentHeight={this.calculateComponentHeight.bind(this)} size={{'fontSize': (component.currentSize === 'small') ? '2em' : '4em'}} />;
			case 2:
				return <AccountSearch id={component.id} calculateComponentHeight={this.calculateComponentHeight.bind(this)} size={component.size}/>;
			case 3:
				return <TransactionDisplay id={component.id} calculateComponentHeight={this.calculateComponentHeight.bind(this)} size={component.size}/>;
			case 4:
				return <FeeDirectory id={component.id} calculateComponentHeight={this.calculateComponentHeight.bind(this)} size={component.size}/>;
 			default:
				return;
		}
	}

	updateCoordinates(layout, oldItem, newItem, placeholder, e, element) {
		/*this is called when an element is dragged. the components gridLayout is first updated to the new coordinates 
		*(this is vital for resizing as the widget is destroyed and re-created), and then the layout receives the components new coordinates 
		*/
		const stateCopy = Object.assign({}, this.state);
		const id = Number(oldItem.i);
		const layoutIndex = stateCopy.layout.findIndex(x => x.i===id.toString());
		stateCopy.components[id].gridPlacement = {i: id.toString(), x: newItem.x, y: newItem.y, w: newItem.w, h: newItem.h};
		stateCopy.layout[layoutIndex] = stateCopy.components[id].gridPlacement;

		this.setState({stateCopy});
	}

	calculateComponentHeight(id, height) {
		//since the grid layout does not have an auto height, each component sets their own height, and calls this function once mounted
		const stateCopy = Object.assign({}, this.state);
		const layoutIndex = stateCopy.layout.findIndex(x => x.i===id.toString());
		stateCopy.layout[layoutIndex].h = height;
		this.setState({stateCopy});
	}

	render() {
		/*had to add this as a workaround in order for the layout to update itself, as the Grid component only updates when a new grid object
		is passed to it.
		*/
		const newLayout = JSON.parse(JSON.stringify(this.state.layout));

		return (
			<div>
				<div>
					<Grid className={`${styles['react-grid-layout']} layout`} layout={newLayout} cols={80} compactType={null} 
						rowHeight={10} draggableCancel=".panel-body" autoSize={false} isResizable={false} 
						preventCollision={true} margin={[0, 0]} containerPadding={[0, 0]} onDragStop={(layout, oldItem, newItem, placeholder, e, element)=>this.updateCoordinates(layout, oldItem, newItem, placeholder, e, element)}> 
						 {this.state.components.map(component => { 
							return (
								component.visible ? ( 
									<div className={`${styles['react-grid-item']}`} key={component.id} style={{borderStyle: 'dotted'}}>
										<Panel headerText={component.name} size={component.size} 
											onClose={() => this.onClosePanel.bind(this, component.id)}>
											<div style={{overflow: 'auto'}}>
												{this.renderComponent(component)}
											</div>
										</Panel>
									</div>
								) : <div key={component.id}> </div>
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
