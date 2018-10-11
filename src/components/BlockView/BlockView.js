//pass in currentBlocks as props if you would like to use this component as a child
import React, { Component } from 'react';
import axios from 'axios';
import BlockItem from './BlockItem';
import { connect } from 'react-redux'; 

const BLOCK_RANGE = 50;
class BlockView extends Component {
	constructor(props) {
		super(props);
		this.state = {blocks: [], currentBlock: !!this.props.match.params[0]? this.props.match.params[0] : 500, prevDisabled: false, nextDisabled: false};
		this.lowerBound = 0;
		this.upperBound = 0;
	}

	componentDidMount() {
		this.lowerBound = Number(this.state.currentBlock)-BLOCK_RANGE;
		this.upperBound = Number(this.state.currentBlock)+BLOCK_RANGE-1;

		axios.get(`http://localhost:5000/api/blocks?start=${this.lowerBound}&end=${this.upperBound}`, {
		}).then(response => {
			this.setState({blocks: response.data});
		}).catch(error => {
			console.log(error.response);
		});
	}

	 loadNextBlocks(currentBlock) {
		this.upperBound = this.upperBound+BLOCK_RANGE;
		axios.get(`http://localhost:5000/api/blocks?start=${this.state.currentBlock+1}&end=${this.upperBound}`, {
		}).then(response => {
			this.setState({ blocks: [...this.state.blocks, ...response.data] });
		}).catch(error => {
			console.log(error.response);
		});
	 }

	 loadPreviousBlocks(currentBlock) {
		this.lowerBound = this.lowerBound-BLOCK_RANGE;
		axios.get(`http://localhost:5000/api/blocks?start=${this.lowerBound}&end=${this.state.currentBlock-1}`, {
		}).then(response => {
			this.setState({ blocks: [...this.state.blocks, ...response.data] });
		}).catch(error => {
			console.log(error.response)
		});
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
		const {witnesses} = this.props;
		
		const index = !!blocks && blocks.length > 0 ? blocks.findIndex(el => el.block_number === Number(currentBlock)) : 0;
		// console.log(this.props);
		// console.log(this.state);
		// console.log(index);
		const witnessName = !!witnesses && witnesses.length>0? witnesses.find(el => el.account_id === blocks[index].witness).account_name : '';
		return (
			<BlockItem prevBlockClicked={this.prevBlockClicked.bind(this)} 
				nextBlockClicked={this.nextBlockClicked.bind(this)}
				witnessName={witnessName}
				currentBlock={blocks[index]}
				nextDisabled={nextDisabled}
				prevDisabled={prevDisabled}/>
		);
	}
}

const mapStateToProps = (state) => ({
	witnesses: state.witnesses
});

export default connect(mapStateToProps)(BlockView);