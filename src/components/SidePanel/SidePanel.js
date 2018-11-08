import React, { Component } from 'react';
import SidePanelItem from './SidePanelItem';
import styles from './styles.css';

class SidePanel extends Component {

	componentDidMount() {
		const gridHeight = 40;
		this.props.calculateComponentHeight(-1, gridHeight);
	}

	render() {
		return (
		  <div className={`sliding-menu ${styles['sliding-menu']}`}>
				<div className="container ">
					<div className={`${styles['widget-header']} row justify-content-center`}>
						<p><h4 className={`${styles['sidepanel-contrast-text']} pt-3`}>Widgets</h4></p>
					</div>
				</div>
				<table className="table">
					<tbody>
						{this.props.components.map(item => {
							return <SidePanelItem
								name={item.name} 
								img={item.img}
								changeSize={this.props.changeSize}
								id={item.id}
								key={item.id}
								minSize={item.minSize}
							/>;
						})}
					</tbody>
				</table>
		  </div>
		);
	  }
}

export default SidePanel; 