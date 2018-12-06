import React, { Component } from 'react';
import axios from 'axios';
import posed, {PoseGroup} from 'react-pose';
import { withRouter } from 'react-router';
import * as Constants from '../../constants/constants';
import Block from './Block';

const Item = posed.div({
	enter: {opacity: 1},
	exit: {opacity: 0}
});
class BlockAnimation extends Component
{
	constructor(props) {
		super(props);
		this.state = {bars:[], lastBlock:0};
	}

	componentDidMount() {
		let lastBlock = 0;
		axios.get('/api/blocks/last', {})
			.then(response => {
				lastBlock = response.data[0].block_number;
				let bars = [];
				for (let i = lastBlock - Constants.NUMBER_OF_BLOCKS; i < lastBlock; i++)
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
		axios.get('/api/blocks/last', {})
			.then(response => {
				lastBlock = response.data[0].block_number;
				if(lastBlock > this.state.lastBlock)
				{
					this.setState({lastBlock: lastBlock}, ()=>{
						this.add();
					});
				}
			})
			.catch(error => {console.log('error fetching blocks: ', error)});
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
			<div className="container d-flex" >
				<PoseGroup>
					{this.state.bars.map(num=>(
						<Item key={num}>
							<Block onClick={this.onClick.bind(this)} num={num}/>
						</Item>
					))}
				</PoseGroup>
			</div>
		);
	}
}

export default withRouter(BlockAnimation);