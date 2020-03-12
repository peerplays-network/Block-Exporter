import React, { Component } from 'react';

import ReduxWrapper from '../ReduxWrapper/ReduxWrapper';

// import styles from './Root.css';
import '../../assets/css/index.css';

export default class Root extends Component {
	render() {
		return (
			<div>
				<ReduxWrapper />
			</div>
		);
	}
}
