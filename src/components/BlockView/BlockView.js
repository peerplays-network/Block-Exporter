//pass in currentBlocks as props if you would like to use this component as a child
import React, { Component } from 'react';
import axios from 'axios';
import BlockItem from './BlockItem';

const BLOCK_RANGE = 100;
export default class BlockView extends Component {
	constructor(props) {
		super(props);
		this.state = {blocks: [{}], currentBlock: !!this.props.currentBlock? this.props.currentBlock : 500, prevDisabled: false, nextDisabled: false};
		this.lowerBound = 0;
		this.upperBound = 1;
	}

	componentDidMount() {
		this.lowerBound = this.state.currentBlock-BLOCK_RANGE;
		this.upperBound = this.state.currentBlock+BLOCK_RANGE;
		axios.get(`api/blocks?start=${this.lowerBound}&end=${this.upperBound}`, {
		}).then(response => {
			this.setState({blocks: response.data});
		}).catch(error => console.log('error fetching blocks'));
	}

	 loadNextBlocks(currentBlock) {
		this.upperBound = this.upperBound+BLOCK_RANGE;
		axios.get(`api/blocks?start=${this.state.currentBlock+1}&end=${this.upperBound}`, {
		}).then(response => {
			this.setState({ blocks: [...this.state.blocks, ...response.data] });
		}).catch(error => console.log('error fetching blocks'));
	 }

	 loadPreviousBlocks(currentBlock) {
		this.lowerBound = this.lowerBound-BLOCK_RANGE;
		axios.get(`api/blocks?start=${this.lowerBound}&end=${this.state.currentBlock-1}`, {
		}).then(response => {
			this.setState({ blocks: [...this.state.blocks, ...response.data] });
		}).catch(error => console.log('error fetching blocks'));
	 }

	prevBlockClicked() {
		this.setState({currentBlock: this.state.currentBlock-1});
		if(this.state.currentBlock === this.lowerBound)
			this.loadPreviousBlocks(this.state.currentBlock);

		if(this.state.currentBlock === 2)
			this.setState({prevDisabled: true});
	}

	nextBlockClicked() {
		this.setState({currentBlock: this.state.currentBlock+1,
			prevDisabled: false});
		if(this.state.currentBlock === this.upperBound) {
			this.loadNextBlocks(this.state.currentBlock);
		}
	}
	
	render() {
		const {blocks, currentBlock, nextDisabled, prevDisabled} = this.state;

		const index = !!blocks ? blocks.findIndex(el => el.block_number === currentBlock) : 0;
		return (
			<BlockItem prevBlockClicked={this.prevBlockClicked.bind(this)} 
				nextBlockClicked={this.nextBlockClicked.bind(this)} 
				currentBlock={blocks[index]}
				nextDisabled={nextDisabled}
				prevDisabled={prevDisabled}/>
		);
	}
}