import React, { Component } from 'react';
import axios from 'axios';

export default class Search extends Component {
	constructor(props) {
		super(props);
		this.state = { searchString: props.match.params[0]};
	}
	render() {
		return (
			<h3> You Searched {this.state.searchString}</h3>
		);
	}
}