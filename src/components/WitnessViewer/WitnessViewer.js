import React, { Component} from 'react';
import { connect } from 'react-redux'; 
import CustomTable from '../Utility/CustomTable';
const gridHeight = 31;
class WitnessViewer extends Component {
	componentDidMount() {
		if(this.props.history === undefined)
			this.props.calculateComponentHeight(this.props.id, gridHeight);
	}
	
	render() {
		const witnesses = this.props.witnesses || [];
		return(
			!!this.props.history ?
			//Witness page
				<CustomTable data={witnesses} tableType="witnesses" headerLabel="Browse Witnesses" headerIcon="fa fa-cogs"/>
				:
			//Witness Widget
				<CustomTable data={witnesses} tableType="witnesses" headerLabel="Browse Witnesses" headerIcon="fa fa-cogs"
					widget={true}/>
		);
	}
}

const mapStateToProps = (state) => ({
	witnesses: state.witnesses.witnessList
});

export default connect(mapStateToProps)(WitnessViewer);