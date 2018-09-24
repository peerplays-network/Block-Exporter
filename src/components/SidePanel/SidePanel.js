import React, { Component } from 'react';
import SidePanelItem from './SidePanelItem';
import styles from './styles.css';

class SidePanel extends Component {
	render() {
		return (
		  <div className={`sliding-menu ${styles['sliding-menu']}`}>
				<div className="container">
					<div className="row justify-content-center">
						<p>Widgets</p>
					</div>
				</div>
				<table className="table">
					<tbody>
						{this.props.components.map(item => {
							return <SidePanelItem
								name={item.name} 
								img={item.img}
								changeSize={this.props.changeSize}
								visible={this.props.visible}
								id={item.id}
								key={item.id}
							/>;
						})}
					</tbody>
				</table>
		  </div>
		);
	  }
}

export default SidePanel; 