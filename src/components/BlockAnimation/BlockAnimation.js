import React, { Component } from 'react';
import styles from './styles.css';
import axios from 'axios';
import anime from 'animejs';
import {TransitionGroup, Transition} from 'react-transition-group';

class BlockAnimation extends Component
{
	constructor(props) {
		super(props);
		this.state = {numOfBars:0, bars:[], lastBlock:0};
		this.myInput = React.createRef();
		this.bars = React.createRef();
	}

	componentDidMount() {
		const num = Math.floor(this.myInput.current.offsetWidth/43);
		this.setState({numOfBars: num});
		let lastBlock = 0;
		axios.get('api/blocks/last', {})
			.then(response => {
				lastBlock = response.data[0].block_number;
				let bars = [];
				for (let i = lastBlock - num + 1; i <= lastBlock; i++)
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
		if(this.state.bars.length + 1 > this.state.numOfBars)
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
			<div className="container" ref={this.myInput}>
				<TransitionGroup component="div" className={`${styles['bar-back']} d-flex`}>
					{
						this.state.bars.map(num=>(
							<Transition key={num} timeout={250} mountOnEnter unmountOnExit>
								<div className={`${styles['bar']} d-inline-flex`} ref={this.bars} onClick={(i)=>this.onClick({num})}>{num}</div>
							</Transition>
						))
					}
				</TransitionGroup>
			</div>
		);
	}
}

export default BlockAnimation;