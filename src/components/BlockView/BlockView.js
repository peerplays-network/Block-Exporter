//pass in currentBlocks as props if you would like to use this component as a child
import React, { Component } from 'react';
import axios from 'axios';
import BlockItem from './BlockItem';
import { connect } from 'react-redux';
import * as Constants from '../../constants/constants'; 

class BlockView extends Component {
	constructor(props) {
		super(props);
		this.state = {blocks: [], currentBlock: !!this.props.match.params[0]? Number(this.props.match.params[0]) : 500, prevDisabled: false, nextDisabled: false, error: false};
		this.lowerBound = 0;
		this.upperBound = 0;
	}

	componentDidMount() {
		this.lowerBound = Number(this.state.currentBlock)-Constants.BLOCK_RANGE;
		this.upperBound = Number(this.state.currentBlock)+Constants.BLOCK_RANGE-1;

		axios.get(`/api/blocks?start=${this.lowerBound}&end=${this.upperBound}`, {
		}).then(response => {
			this.setState({blocks: response.data, loading: false});
		}).catch(error => {
			this.setState({error: true});
			console.log(error.response);
		});
	}

	 loadNextBlocks(currentBlock) {
		this.upperBound = this.upperBound+Constants.BLOCK_RANGE;
		axios.get(`/api/blocks?start=${this.state.currentBlock+1}&end=${this.upperBound}`, {
		}).then(response => {
			this.setState({ blocks: [...this.state.blocks, ...response.data] });
		}).catch(error => {
			this.setState({error: true});
			console.log(error.response);
		});
	 }

	 loadPreviousBlocks(currentBlock) {
		this.lowerBound = this.lowerBound-Constants.BLOCK_RANGE;
		axios.get(`/api/blocks?start=${this.lowerBound}&end=${this.state.currentBlock-1}`, {
		}).then(response => {
			this.setState({ blocks: [...this.state.blocks, ...response.data] });
		}).catch(error => {
			this.setState({error: true});
			console.log(error.response);
		});
	 }

	prevBlockClicked() {
		this.props.history.push(`/block-view/${this.state.currentBlock-1}`);
		this.setState({currentBlock: this.state.currentBlock-1});
		if(this.state.currentBlock === this.lowerBound)
			this.loadPreviousBlocks(this.state.currentBlock);

		if(this.state.currentBlock === 2)
			this.setState({prevDisabled: true});
	}

	nextBlockClicked() {
		this.props.history.push(`/block-view/${this.state.currentBlock+1}`);
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
		const witnessName = !!witnesses && witnesses.length>0 && blocks.length>0 ? witnesses.find(el => el.account_id === blocks[index].witness).account_name : '';
		debugger;
		return (
			<BlockItem prevBlockClicked={this.prevBlockClicked.bind(this)} 
				nextBlockClicked={this.nextBlockClicked.bind(this)}
				witnessName={witnessName}
				currentBlock={blocks[index]}
				nextDisabled={nextDisabled}
				prevDisabled={prevDisabled}
				error={this.state.error}/>
		);
	}
}

const mapStateToProps = (state) => ({
	witnesses: state.witnesses.witnessList
});

export default connect(mapStateToProps)(BlockView);