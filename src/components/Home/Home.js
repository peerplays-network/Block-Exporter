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
import { Responsive, WidthProvider as widthProvider } from 'react-grid-layout';
const ResponsiveReactGridLayout = widthProvider(Responsive);

class Welcome extends Component {
	constructor() {
		super();

		this.state = {components: [{name: 'Witness Feed', img: 'https://via.placeholder.com/50x50', minSize: 'medium', currentSize: '', visible: false, id: 0, layout:{x: 0, y: 0, w: 400, h: 2}},
								   {name: 'Maintenance Countdown', img: 'https://via.placeholder.com/50x50', minSize: 'small', currentSize: '', visible: false, id: 1, layout:{x: 1, y: 0, w: 200, h: 2}},
								   {name: 'Account Feed', image: 'https://via.placeholder.com/50x50', minSize:'large', currentSize: '', visible: false, id:2, layout:{ x: 4, y: 0, w: 600, h: 2}}
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

	dragStop(id, d) {
		const stateCopy = Object.assign({}, this.state);
		stateCopy.components[id].x = d.x;
		stateCopy.components[id].y = d.y;
		console.log(stateCopy);
		this.setState({stateCopy});
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
		const layout = [
			{i: '0', x: 0, y: 0, w: 1, h: 2},
			{i: '1', x: 1, y: 0, w: 3, h: 2},
			{i: '2', x: 4, y: 0, w: 1, h: 2}
		  ];
		  /*
		  	<Panel headerText={"witness viewer"} 
				style={{ margin: '24px auto', width: "400px" }} 
				onClose={() => this.onClosePanel.bind(this, 0)}>
				<div className={`${styles['data-react']}`}>
					<WitnessViewer />
				</div>
			</Panel>
		  */
		return (
			<div>
				<div>
					<ResponsiveReactGridLayout className="layout"
						layout={layout}
						breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
						cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}} autoSize={true}
						compactType={'horizontal'}
						useCSSTransforms={true}>

						{this.state.components.map(component => { 
							return (
								component.visible ? (
									<div key={component.id} data-grid={component.layout}> 
										<Panel headerText={component.name} 
											style={{ margin: '24px auto', width: this.getPanelSize(component.currentSize) }} 
											onClose={() => this.onClosePanel.bind(this, component.id)}>
											<div className={`${styles['data-react']}`}>
												{this.renderComponent(component)}
											</div>
										</Panel>
									</div>
								) : <div key={Math.random()}> </div>
							);
						})
						}
					</ResponsiveReactGridLayout>
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
