import React, { Component } from 'react';
import { Button } from 'reactstrap';
import Panel from '../Helper/Panel';
import styles from './styles.css';
import {Rnd} from 'react-rnd';
import WitnessViewer from '../WitnessViewer';

class Welcome extends Component {
	onClosePanel() {
    	console.log('Close Clicked');
  	}

	render() {
		return (
			<div>
				<Rnd
				  default={{
				    x: 200,
				    y: 200,
				    width: 320,
				    height: 200,
				  }}
				  >
					<Panel headerText={'Witnesses'} style={{  margin: '24px auto', width: '600px' }} onClose={this.onClosePanel.bind(this)}>
						<div className={`${styles['data-react']}`}>
							<WitnessViewer />
						</div>
					</Panel>
				</Rnd>
			</div>
		);
	}
}

export default Welcome;
