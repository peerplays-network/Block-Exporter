/* 
NOTE: Currently there is a dotted border line around each component. This is to show the boundaries
of the draggable grid item, and help you define a height that is right for your component. 
Unfortunately the grid library has no auto height, so we must define the height for each 
component ourselves. Eventually we will have to write a class that calculates height of 
components ourselves, but for now we are defining the height inside of each component
and feeding it to calculateComponentHeight()
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showSideBarIcon } from '../../actions/NavigationActions';

import Panel from '../Panel/Panel';
import MaintenanceCD from '../MaintenanceCD/MaintenanceCD';
import SidePanel from '../SidePanel/SidePanel';
import styles from './styles.css';
import TransactionDisplay from '../Transactions/TransactionDisplay';
import WitnessViewer from '../WitnessViewer/WitnessViewer';
import FeeDirectory from '../FeeDirectory/FeeDirectory';
import AccountSearch from '../Account/Account';
import GridLayout, {WidthProvider as widthProvider} from 'react-grid-layout';
import Contract from '../Contracts/Contract';
import Committee from '../Committee/Committee';

const Grid = widthProvider(GridLayout);

class Welcome extends Component {
	constructor() {
		super();

		this.startingX = (12 * 1920/window.innerWidth)+1;

		this.state = {components: this.initializePanels(),
	   	layout : this.initializeLayout(),
		};
		this.elementOverlap = null;
	}

	componentDidMount() {
		this.props.showSideBarIcon(true);
	}

	initializePanels() {
		return [{name: 'Witness Feed', img: 'fas fa-cogs fa-2x', minSize: 'small', size: 'large', visible: true, id: 0, gridPlacement: {i: '0', x: this.startingX, y: 5, w: 24, h: 25}},
			{name: 'Maintenance Countdown', img: 'fas fa-clock fa-2x', minSize: 'small', size: 'large', visible: true, id: 1, gridPlacement: {i: '1', x: this.startingX, y: 54, w: 24, h: 11}},
			{name: 'Account Feed', img: 'fas fa-user-alt fa-2x', minSize:'large', size: '', visible: false, id: 2, gridPlacement: {i: '2', x: this.startingX, y: 0, w: 24, h: 24}},
			{name: 'Transaction Feed', img: 'fas fa-handshake fa-2x', minSize:'large', size: 'large', visible: true, id:3, gridPlacement: {i: '3', x: 42, y: 5, w: 24, h: 31}},
			{name: 'Fee Schedule', img: 'fas fa-file-invoice-dollar fa-2x', minSize:'medium', size: '', visible: false, id:4, gridPlacement: {i: '4', x: this.startingX, y: 0, w: 24, h: 23}},
			{name: 'Contract Feed', img: 'fas fa-file-signature fa-2x', minSize:'large', size: '', visible: false, id: 5, gridPlacement: {i: '5', x: this.startingX, y: 0, w: 24, h: 31}},
			{name: 'Committee Feed', img: 'fas fa-crown fa-2x', minSize:'small', size: '', visible: false, id: 6, gridPlacement: {i: '6', x: this.startingX, y: 0, w: 24, h: 25}}];
	}

	initializeLayout() {
		return [{i: '-1', x: 0, y: -0.5, w: 12, h: 0, static: true}, {i: '0', x: this.startingX, y: 5, w: 24, h: 25}, {i: '1', x: this.startingX, y: 54, w: 24, h: 11}, {i: '3', x: 42, y: 5, w: 24, h: 31}];
	}

	componentDidUpdate(prevProps) {
		if(prevProps.sideBarOpen !== this.props.sideBarOpen) {
			const stateCopy = Object.assign({}, this.state);
			if(this.props.sideBarOpen) {
				this.resetLayout();
				stateCopy.layout[0].w = 12 * 1920/window.innerWidth;
			}
			else
				stateCopy.layout[0].w = 0;
			this.setState({layout: stateCopy.layout});
		}
	}

	resetLayout() {
		const stateCopy = Object.assign({}, this.state);
		const initialPanelLayout = this.initializePanels();
		stateCopy.components.forEach(el => {
			if(el.visible) {
				const index = stateCopy.layout.findIndex(x => x.i===el.id.toString()); 
				stateCopy.layout[index] = initialPanelLayout[el.id].gridPlacement;
			}
		});
		this.setState({layout: stateCopy.layout, components: stateCopy.components});
	}

	onClosePanel(id) {
		//finds the entry in layout and deletes it
		const stateCopy = Object.assign({}, this.state);
		const index = stateCopy.layout.findIndex(x => x.i===id.toString()); 
		stateCopy.layout.splice(Number(index), 1);
		stateCopy.components[id].visible = false;
		this.setState({layout: stateCopy.layout, components: stateCopy.components});
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
		if(index === -1) 
			stateCopy.layout.push(stateCopy.components[id].gridPlacement); 
		else {
			//stateCopy.layout[index].gridPlacement.w = stateCopy.components[id].gridPlacement.w;
			stateCopy.layout[index] = stateCopy.components[id].gridPlacement;
			if(stateCopy.components[id].gridPlacement.x < this.startingX)
				stateCopy.layout[index].x = this.startingX;
		}
		stateCopy.components[id].visible = true;
		this.setState({layout: stateCopy.layout, components: stateCopy.components});
	}

	renderComponent(component) {
		switch(component.id) {
			case 0:
				return <WitnessViewer id={component.id} calculateComponentHeight={this.calculateComponentHeight.bind(this)} size={component.size} visible={component.visible} />;
			case 1:
				return <MaintenanceCD id={component.id} calculateComponentHeight={this.calculateComponentHeight.bind(this)} size={{'fontSize': (component.size === 'small') ? '2em' : '4em'}} visible={component.visible}/>;
			case 2:
				return <AccountSearch id={component.id} calculateComponentHeight={this.calculateComponentHeight.bind(this)} size={component.size} visible={component.visible}/>;
			case 3:
				return <TransactionDisplay id={component.id} calculateComponentHeight={this.calculateComponentHeight.bind(this)} size={component.size} visible={component.visible}/>;
			case 4:
				return <FeeDirectory id={component.id} calculateComponentHeight={this.calculateComponentHeight.bind(this)} size={component.size} visible={component.visible}/>;
			case 5:
				return <Contract id={component.id} calculateComponentHeight={this.calculateComponentHeight.bind(this)} size={component.size} visible={component.visible}/>;
			case 6:
				return <Committee id={component.id} calculateComponentHeight={this.calculateComponentHeight.bind(this)} size={component.size} visible={component.visible}/>;
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

		this.setState({layout: stateCopy.layout, components: stateCopy.components});

		this.onDragStop(layout, oldItem, newItem, placeholder, e, element);
	}

	onDragStop(layout, oldItem, newItem, placeholder, e, element) {
		//checks to see if the widget has gone out of bounds, and re-aligns it to be in the viewport
		const translateValues = window.getComputedStyle(element).transform.split(',');
		const translateX = parseInt(translateValues[translateValues.length - 2], 0);
		const translateY = parseInt(translateValues[translateValues.length - 1].slice(0, -1), 0);
		
		if(translateX <= 287) {
			this.elementOverlap = {id: oldItem.i, el: element, x: 290, y: translateY };
		}
	}
	
	calculateComponentHeight(id, height) {
		//since the grid layout does not have an auto height, each component sets their own height, and calls this function once mounted
		const stateCopy = Object.assign({}, this.state);
		const layoutIndex = stateCopy.layout.findIndex(x => x.i===id.toString());
		stateCopy.layout[layoutIndex].h = height;

		this.setState({layout: stateCopy.layout});
	}

	onLayoutChange(layout) {
		if(typeof this.elementOverlap === 'object' && this.elementOverlap !== null) {
			this.elementOverlap.el.style.transform = `translate(${this.elementOverlap.x}px, ${this.elementOverlap.y}px)`;

			const stateCopy = Object.assign({}, this.state);
			const id = Number(this.elementOverlap.id);
			const layoutIndex = stateCopy.layout.findIndex(x => x.i===id.toString());
	
			stateCopy.components[id].gridPlacement.x = this.startingX;
			stateCopy.layout[layoutIndex].x = this.startingX;

			this.elementOverlap = null;
			this.setState({layout: stateCopy.layout, components: stateCopy.components});
		}
	}

	render() {
		/*had to add this as a workaround in order for the layout to update itself, as the Grid component only updates when a new grid object
		is passed to it.
		*/
		const newLayout = JSON.parse(JSON.stringify(this.state.layout));
		return (
			<div>
				<div>
					<Grid className={`${styles['react-grid-layout']} layout`} layout={newLayout} cols={80} compactType={'vertical'} 
						rowHeight={10} draggableCancel=".panel-body,.close" autoSize={false} isResizable={false} 
						margin={[10, 10]} containerPadding={[0, 10]} onLayoutChange={(newLayout) => this.onLayoutChange(newLayout)}
						onDragStop={(newLayout, oldItem, newItem, placeholder, e, element)=>this.updateCoordinates(newLayout, oldItem, newItem, placeholder, e, element)}> 
						 <div className={`${styles['react-grid-item']}`} key={'-1'}>
							<SidePanel  calculateComponentHeight={this.calculateComponentHeight.bind(this)} components={this.state.components} 
							   changeSize={this.changePanelSize.bind(this)}/>	
						</div>
						{this.state.components.map(component => { 
							return (
								component.visible ? ( 
									<div className={`${styles['react-grid-item']}`} key={component.id}>
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
			</div>
		);
	}
	componentWillUnmount() {
		this.props.showSideBarIcon(false);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ showSideBarIcon }, dispatch);
}

const mapStateToProps = (state) => ({
	sideBarOpen: state.grid.sideBarOpen,
});

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);

