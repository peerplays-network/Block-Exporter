import React, { Component } from 'react';
import styles from './styles.css';
import axios from 'axios';
import anime from 'animejs';
import {TransitionGroup, Transition} from 'react-transition-group';
import * as Constants from '../../constants/constants';
import Block from './Block';

class BlockAnimation extends Component
{
	constructor(props) {
		super(props);
		this.state = {bars:[], lastBlock:0};
		this.bars = React.createRef();
	}

	componentDidMount() {
		let lastBlock = 0;
		axios.get('api/blocks/last', {})
			.then(response => {
				lastBlock = response.data[0].block_number;
				let bars = [];
				for (let i = lastBlock - Constants.NUMBER_OF_BLOCKS + 1; i <= lastBlock; i++)
				{
					bars = bars.concat([i]);
				}
				this.setState({bars: bars, lastBlock: lastBlock}, ()=>{
					this.startTimer();
				});
			})
			.catch(error => console.log('error fetching blocks: ', error));
	}

	startTimer() {
		setInterval(this.fetchLastBlock.bind(this), 3000);
	}

	fetchLastBlock()
	{
		let lastBlock = 0;
		axios.get('api/blocks/last', {})
			.then(response => {
				lastBlock = response.data[0].block_number;
				if(lastBlock > this.state.lastBlock)
				{
					this.setState({lastBlock: lastBlock}, ()=>{
						this.add();
					});
				}
			})
			.catch(error => console.log('error fetching blocks: ', error));
	}

	componentDidUpdate() {
		this.animeRef =anime({
			targets: this.bars.current,
			translateX: ['50%', '0%'],
			duration: 250,
		});
	}

	add() {
		let bars = this.state.bars;
		if(this.state.bars.length + 1 > Constants.NUMBER_OF_BLOCKS)
		{
			bars.shift();
		}
		this.setState({bars: bars}, ()=>{
			const lastNum = bars[bars.length - 1];
			bars = bars.concat([lastNum+1]);
			this.setState({bars: bars});
		});
	}

	onClick(num)
	{
		this.props.history.push(`/block-view/${num.num}`);
	}

	render()
	{
		return(
			<div className="container" >
				<TransitionGroup component="div" className="d-flex">
					{
						this.state.bars.map(num=>(
							<Transition key={num} timeout={250} mountOnEnter unmountOnExit>
								<Block onClick={this.onClick} num={num} ref={this.bars}/>
							</Transition>
						))
					}
				</TransitionGroup>
			</div>
		);
	}
}

export default BlockAnimation;