import React, { Component } from 'react';
import posed, {PoseGroup} from 'react-pose';
import { withRouter } from 'react-router';
import * as Constants from '../../constants/constants';
import Block from './Block';
import BlockApi from '../../api/BlockApi';
import styles from './styles.css';

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

	async componentDidMount() {
		let lastBlock = 0;
		try{
			const getLast = await BlockApi.getILastBlock(2);
			lastBlock = getLast.data[0].block_number;
			let bars = [];
			for (let i = lastBlock - Constants.NUMBER_OF_BLOCKS + 1; i <= lastBlock; i++)
			{
				bars = bars.concat([i]);
			}
			this.setState({bars: bars, lastBlock: lastBlock}, ()=>{
				this.startTimer();
			});
		} catch(error) {
			console.warn(error);
		}
	}

	startTimer() {
		setInterval(this.fetchLastBlock.bind(this), 3000);
	}

	async fetchLastBlock() {
		let lastBlock = 0;
		try{
			const getLast = await BlockApi.getILastBlock(2);
			lastBlock = getLast.data[0].block_number;
			if(lastBlock > this.state.lastBlock)
			{
				this.setState({lastBlock: lastBlock}, ()=>{
					this.add();
				});
			}
		} catch(error) {
			console.warn(error);
		}
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
			<div className={`${styles['block-container']}`}>
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