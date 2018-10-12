import React, { Component } from 'react';
import {Tooltip} from 'reactstrap';
import styles from './styles.css';

class Block extends Component
{
	constructor(props) {
		super(props);
		this.state = {tooltipOpen:false};
		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		this.setState({
		  	tooltipOpen: !this.state.tooltipOpen
		});
	}

	render()
	{
		const {
			toggle,
			state: { tooltipOpen },
			props:{num}
		} = this;
		return(
			<div>
				<div id={`block${num}`} className={`${styles['bar']} d-inline-flex`} onClick={(i)=>this.props.onClick({num})}></div>
				<Tooltip target={`block${num}`} placement="bottom" isOpen={tooltipOpen} toggle={toggle} 
					delay={{show:250, hide:0}}>
					{`Block: ${num}`}
				</Tooltip>
			</div>
		);
	}
}

export default Block;