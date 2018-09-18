import React, { Component } from 'react';
import { Button } from 'reactstrap';
import Panel from '../Helper/Panel'
import styles from './styles.css';
import {Rnd} from 'react-rnd';

class Welcome extends Component {
	constructor(props) {
		super(props)
	}

	onClosePanel(){
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
					<Panel headerText={'Transition Feed'} width={'400px'} style={{  margin: '24px auto', width: '400px' }} onClose={this.onClosePanel.bind(this)}>
						<div className={`${styles['data-react']}`}>
							<h3>Test</h3>
							<Button>Bootstrap Button</Button>
						</div>
					</Panel>
				</Rnd>
			</div>
		);
	}
}

export default Welcome;
