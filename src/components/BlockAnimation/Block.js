import React, { Component } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import styles from './styles.css';

class Block extends Component
{
		state = {tooltipOpen:false};

	open = () => {
		this.setState({
		  	tooltipOpen: true
		});
	}

	close = () => {
		this.setState({
		  	tooltipOpen: false
		});
	}

	render ()
	{
		const {
			state: { tooltipOpen },
			props:{num}
		} = this;
		return (
			<div>
				<div id={`block${num}`} className={`${styles['bar']} d-inline-flex`} onClick={(i)=>this.props.onClick({num})}></div>
				<Tooltip title={`block${num}`} placement="bottom" open={tooltipOpen} onOpen={this.open}
					onClose={this.close}
					enterDelay={250}>
					{`Block: ${num}`}
				</Tooltip>
			</div>
		);
	}
}

export default Block;