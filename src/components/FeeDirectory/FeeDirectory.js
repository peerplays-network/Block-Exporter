import React, { Component } from 'react';
import FeeSection from './FeeSection';
import axios from 'axios'; 

class FeeDirectory extends Component {
	constructor(props) {
		super(props);
    
		const openSections = {};
    
		this.state = { openSections, feeData: [] };
	}

	fetchData() {
		//API call to search for Account
		axios.get('api/operations', {
		}).then(response => {
			this.setState({ feeData: response.data });
		}).catch(error => {console.log('error fetching account data', error);});
	}
	
	componentDidMount() {
		this.fetchData();
		const gridHeight=40;
		this.props.calculateComponentHeight(this.props.id, gridHeight);
	}

	onClick(label) {
		const {
			state: { openSections }
		} = this;
    
		const isOpen = !!openSections[label];
    
		this.setState({
			openSections: {
				[label]: !isOpen
			}
		});
	}
    
	render() 
	{
		const {
			onClick,
          	state: { openSections },
		} = this;
    
		return (
          	<div>
            	{this.state.feeData.map(child => (
              		<FeeSection
						isOpen={!!openSections[child.friendly_name]}
						label={child.friendly_name}
						onClick={onClick.bind(this)}
						fee={child}
              		/>
            	))}
          	</div>
		);
	}
}

export default FeeDirectory;