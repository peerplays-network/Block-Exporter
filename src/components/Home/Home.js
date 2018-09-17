import React, { Component } from 'react';
import { Button } from 'reactstrap';
import styles from './styles.css';

class Welcome extends Component {
	render() {
		return (
			<div>
				<div className={`${styles['welcome-text']} ${styles['data-react']}`}>
					<h3>Test</h3>
					<Button>Bootstrap Button</Button>
				</div>
			</div>
		);
	}
}

export default Welcome;
